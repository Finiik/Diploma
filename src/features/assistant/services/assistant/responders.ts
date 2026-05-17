/* ============================================
   Responder chain (strategy / chain-of-responsibility)

   processMessage is just "run the query through an ordered list of
   responders; first one that owns it wins". Each responder is
   (query, isUk) => partial response | null:
     - return null  → "not mine", try the next responder
     - return {...} → this is the answer; the loop stops here

   Only `text` is required on a response; finalizeResponse() fills in the
   `links`/`suggestions` shape so handlers declare only what's non-default.
   Order matters: cheapest / most specific first, AI catch-all last. The
   instant intents live in ./instantResponders; adding one = write a
   function there and slot it into RESPONDERS here.
   ============================================ */

import { matchConcept } from './courseGraph';
import { extractLinks, buildConceptLinks } from './navLinks';
import { mergeById } from '@/shared/lib/mergeById';
import { MERGED_LINKS_CAP } from './constants';
import { callGemini, geminiConfigured } from './gemini';
import { localFallback } from './fallback';
import {
  greeting,
  help,
  thanks,
  list,
  pureSubject
} from './instantResponders';
import type {
  AssistantResponse,
  Responder,
  ResponderResult
} from '@/features/assistant/types';

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
  isUk: boolean
): Promise<ResponderResult> {
  // Navigation links: search hits first, then curated concept-graph links so
  // a topic like "стала Авогадро" still surfaces its connected materials
  // (mole, molarity, ideal-gas law) even with no direct search hit.
  const conceptMatch = matchConcept(query);
  let links = extractLinks(query, isUk);
  if (conceptMatch) {
    links = mergeById(
      links,
      buildConceptLinks(conceptMatch, isUk),
      MERGED_LINKS_CAP
    );
  }

  if (geminiConfigured()) {
    try {
      const text = await callGemini(query, isUk);
      return { text, links };
    } catch (err) {
      console.warn(
        'Gemini API failed, using local fallback:',
        err instanceof Error ? err.message : err
      );
    }
  }

  const fallback = localFallback(query, isUk);
  return {
    text: fallback.text,
    links,
    suggestions: fallback.suggestions || []
  };
}

// Ordered chain. First responder to return non-null answers the query.
export const RESPONDERS: Responder[] = [
  { id: 'greeting', run: greeting },
  { id: 'help', run: help },
  { id: 'thanks', run: thanks },
  { id: 'list', run: list },
  { id: 'pure-subject', run: pureSubject },
  { id: 'ai', run: aiOrFallback } // terminal — never returns null
];
