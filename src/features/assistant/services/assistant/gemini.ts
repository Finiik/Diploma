/* ============================================
   Gemini client — orchestrates prompt construction (geminiPrompt) and
   the HTTP transport (geminiClient). One reason to change each collaborator.
   ============================================ */

import { GEMINI_MAX_OUTPUT_TOKENS } from './constants';
import { buildSystemPrompt } from './geminiPrompt';
import {
  defaultGeminiTransport,
  extractText,
  type GeminiTransport
} from './geminiClient';

// Gemini 3 thinking allowance: "minimal" | "low" | "medium" | "high".
// "low" keeps the tutor fast/cheap while leaving enough reasoning for the
// SYNTHESIZE-the-materials task. Env-overridable like the model.
const GEMINI_THINKING = import.meta.env.VITE_GEMINI_THINKING || 'low';

// Configuration is the transport's concern; delegate so the orchestrator
// never reads env and stays test-injectable.
export function geminiConfigured(
  transport: GeminiTransport = defaultGeminiTransport
): boolean {
  return transport.isConfigured();
}

// Call Gemini: build the prompt, shape the request, delegate the network
// call to the (injectable) transport, then extract the visible text.
export async function callGemini(
  userMessage: string,
  isUk: boolean,
  transport: GeminiTransport = defaultGeminiTransport
): Promise<string> {
  const systemPrompt = buildSystemPrompt(userMessage, isUk);

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\nUser question: ' + userMessage }]
      }
    ],
    generationConfig: {
      // Gemini 3: Google strongly recommends leaving temperature at its
      // default (1.0) — lowering it can cause looping / degraded reasoning.
      // So no temperature/topP overrides here on purpose.
      // Budget covers thinking + answer (thinking levels are relative
      // allowances, not strict guarantees), so keep generous headroom.
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
      thinkingConfig: { thinkingLevel: GEMINI_THINKING }
    }
  };

  const data = await transport.generate(body);
  return extractText(data);
}
