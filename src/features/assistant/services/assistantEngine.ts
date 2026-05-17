/* ============================================
   AI Assistant Engine — Powered by Google Gemini

   Thin orchestrator: validate input, then run the query through the ordered
   responder chain (strategy / chain-of-responsibility). The first responder
   that owns the query produces the answer; the terminal AI responder always
   answers, so the loop never falls through. The pieces live in ./assistant/*:
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
import {
  defaultGeminiTransport,
  type GeminiTransport
} from '@/features/assistant/services/assistant/geminiClient';
import type { AssistantResponse } from '@/features/assistant/types';
import { pick, type Lang } from '@/shared/lib/pickLang';

// ============================================
// Main entry point — async
// ============================================
export async function processMessage(
  query: string,
  lang: Lang = 'uk',
  transport: GeminiTransport = defaultGeminiTransport
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

  for (const responder of createResponders(transport)) {
    const response = await responder.run(trimmed, lang);
    if (response) return finalizeResponse(response);
  }

  // Unreachable: the terminal 'ai' responder always returns a response.
  return finalizeResponse({
    text: pick(
      lang,
      'Вибачте, не вдалося обробити запит.',
      'Sorry, could not process the request.'
    )
  });
}
