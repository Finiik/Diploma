/* ============================================
   AI Assistant Engine — Powered by Google Gemini

   Thin orchestrator: validate input, then run the query through the ordered
   responder chain (strategy / chain-of-responsibility). The first responder
   that owns the query produces the answer; otherwise the **total** terminal
   answers. Totality is type-enforced (TerminalResponder.run is
   non-nullable), so there is no fall-through case to handle. The pieces
   live in ./assistant/*:
     text        — intent stripping, fuzzy/concept matching primitives
     subjects    — formula catalogs, labels, localization
     courseGraph — auto-derived concept knowledge graph (graph/keyword RAG)
     context     — Gemini context block + navigation link chips
     gemini      — Gemini API client
     intents     — instant intent detectors
     fallback    — detailed offline responses
     responders  — the ordered chain wired from all of the above
   ============================================ */

import {
  createResponders,
  finalizeResponse
} from '@/features/assistant/services/assistant/responders';
import type { GeminiTransport } from '@/features/assistant/services/assistant/geminiClient';
import type { AssistantResponse } from '@/features/assistant/types';
import { pick, type Lang } from '@/shared/lib/pickLang';

// ============================================
// Main entry point — async
//
// `transport` is required: the orchestrator depends only on the
// GeminiTransport port, never on a concrete default. The app boundary
// (useChatSession) is the single composition point that supplies the real
// adapter; tests supply a fake.
// ============================================
export async function processMessage(
  query: string,
  lang: Lang,
  transport: GeminiTransport
): Promise<AssistantResponse> {
  if (!query || query.trim().length === 0) {
    return finalizeResponse({
      text: pick(
        lang,
        'Будь ласка, напишіть ваше питання.',
        'Please type your question.'
      )
    });
  }

  const trimmed = query.trim();
  const { responders, terminal } = createResponders(transport);

  for (const responder of responders) {
    const response = await responder.run(trimmed, lang);
    if (response) return finalizeResponse(response);
  }

  // The terminal is total (type-enforced) — it always returns a result, so
  // this is the single, guaranteed exit; no post-loop fallback needed.
  return finalizeResponse(await terminal.run(trimmed, lang));
}
