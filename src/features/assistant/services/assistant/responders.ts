/* ============================================
   Responder chain (strategy / chain-of-responsibility)

   processMessage is just "run the query through an ordered list of
   responders; first one that owns it wins". Each responder is
   (query, lang) => partial response | null:
     - return null  → "not mine", try the next responder
     - return {...} → this is the answer; the loop stops here

   Only `text` is required on a response; finalizeResponse() fills in the
   `links`/`suggestions` shape so handlers declare only what's non-default.
   Order matters: cheapest / most specific first, AI catch-all last. The
   instant intents live in ./instantResponders; adding one = write a
   function there and slot it into createResponders() here.

   The Gemini transport is injected into the terminal responder via the
   createResponders(transport) factory (Dependency Inversion): the chain
   depends on the GeminiTransport port, not on global fetch/env, so the
   whole engine is unit-testable offline by passing a fake (see
   assistantEngine.test.ts). The instant responders are transport-free, so
   the chain abstraction stays segregated.
   ============================================ */

import { matchConcept } from './courseGraph';
import { extractLinks, buildConceptLinks } from './navLinks';
import { mergeById } from '@/shared/lib/mergeById';
import { MERGED_LINKS_CAP } from './constants';
import { callGemini, geminiConfigured } from './gemini';
import { defaultGeminiTransport, type GeminiTransport } from './geminiClient';
import { localFallback } from './fallback';
import { greeting, help, thanks, list, pureSubject } from './instantResponders';
import type {
  AssistantResponse,
  Responder,
  ResponderResult
} from '@/features/assistant/types';
import type { Lang } from '@/shared/lib/pickLang';

// Normalize any responder's partial result into the full response contract.
export function finalizeResponse(partial: ResponderResult): AssistantResponse {
  return {
    text: partial.text,
    links: partial.links ?? [],
    suggestions: partial.suggestions ?? []
  };
}

// --- Terminal responder: Gemini, then rich local fallback -------------------
// Always returns a response, so the chain never falls through.

async function aiOrFallback(
  query: string,
  lang: Lang,
  transport: GeminiTransport
): Promise<ResponderResult> {
  // Navigation links: search hits first, then curated concept-graph links so
  // a topic like "стала Авогадро" still surfaces its connected materials
  // (mole, molarity, ideal-gas law) even with no direct search hit.
  const conceptMatch = matchConcept(query);
  let links = extractLinks(query, lang);
  if (conceptMatch) {
    links = mergeById(
      links,
      buildConceptLinks(conceptMatch, lang),
      MERGED_LINKS_CAP
    );
  }

  if (geminiConfigured(transport)) {
    try {
      const text = await callGemini(query, lang, transport);
      return { text, links };
    } catch (err) {
      console.warn(
        'Gemini API failed, using local fallback:',
        err instanceof Error ? err.message : err
      );
    }
  }

  const fallback = localFallback(query, lang);
  return {
    text: fallback.text,
    links,
    suggestions: fallback.suggestions || []
  };
}

/**
 * Build the ordered chain. First responder to return non-null answers the
 * query. The terminal AI responder closes over the injected `transport`
 * (default = the real Gemini HTTP transport); tests pass a fake to exercise
 * the chain offline without stubbing global fetch.
 */
export function createResponders(
  transport: GeminiTransport = defaultGeminiTransport
): Responder[] {
  return [
    { id: 'greeting', run: greeting },
    { id: 'help', run: help },
    { id: 'thanks', run: thanks },
    { id: 'list', run: list },
    { id: 'pure-subject', run: pureSubject },
    // terminal — never returns null
    { id: 'ai', run: (q, lang) => aiOrFallback(q, lang, transport) }
  ];
}
