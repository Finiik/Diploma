/* ============================================
   Gemini HTTP transport — the network concern, behind an injectable
   boundary so the orchestrator (and tests) don't touch global fetch.
   ============================================ */

// Minimal shape of the Gemini generateContent JSON we actually read.
interface GeminiPart {
  text?: string;
  thought?: boolean;
}
interface GeminiCandidate {
  content?: { parts?: GeminiPart[] };
  finishReason?: string;
}
export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: { blockReason?: string };
}

export interface GeminiRequestBody {
  contents: { role: string; parts: { text: string }[] }[];
  generationConfig: {
    maxOutputTokens: number;
    thinkingConfig: { thinkingLevel: string };
  };
}

export interface GeminiTransport {
  /** Whether a usable API key is configured (vs. missing/placeholder). */
  isConfigured(): boolean;
  generate(body: GeminiRequestBody): Promise<GeminiResponse>;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Model is env-overridable (VITE_GEMINI_MODEL) so swapping models is config,
// not a code change. Default: Gemini 3.1 Flash-Lite — low-latency, low-cost.
const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.1-flash-lite';

// Built per call (not at module load) so an env/model override is honored
// without a reload.
function geminiUrl(): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
}

export const defaultGeminiTransport: GeminiTransport = {
  isConfigured() {
    return (
      Boolean(GEMINI_API_KEY) && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'
    );
  },
  async generate(body) {
    const response = await fetch(geminiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    return (await response.json()) as GeminiResponse;
  }
};

// Gemini 3 responses can carry multiple parts, including internal "thought"
// parts (part.thought === true) that are NOT the answer. Concatenate only the
// visible text parts; if there are none, surface WHY (prompt blocked, or the
// thinking budget ate the output) instead of a generic empty-response error.
export function extractText(data: GeminiResponse): string {
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (Array.isArray(parts)) {
    const text = parts
      .filter((p) => p && typeof p.text === 'string' && p.thought !== true)
      .map((p) => p.text)
      .join('')
      .trim();
    if (text) return text;
  }

  const blocked = data?.promptFeedback?.blockReason;
  if (blocked) throw new Error(`Gemini blocked the prompt: ${blocked}`);

  const finish = candidate?.finishReason;
  if (finish && finish !== 'STOP') {
    // e.g. MAX_TOKENS — thinking consumed the budget before any answer.
    throw new Error(`Gemini returned no text (finishReason: ${finish})`);
  }
  throw new Error('Empty response from Gemini');
}
