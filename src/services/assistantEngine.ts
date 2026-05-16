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

import { RESPONDERS, finalizeResponse } from './assistant/responders';

// ============================================
// Main entry point — async
// ============================================
export async function processMessage(query, isUk = true) {
  if (!query || query.trim().length === 0) {
    return finalizeResponse({
      text: isUk ? 'Будь ласка, напишіть ваше питання.' : 'Please type your question.'
    });
  }

  const trimmed = query.trim();

  for (const responder of RESPONDERS) {
    const response = await responder.run(trimmed, isUk);
    if (response) return finalizeResponse(response);
  }

  // Unreachable: the terminal 'ai' responder always returns a response.
  return finalizeResponse({
    text: isUk ? 'Вибачте, не вдалося обробити запит.' : 'Sorry, could not process the request.'
  });
}
