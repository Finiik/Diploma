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
   depends on the GeminiTransport port — never on global fetch/env and
   never on a concrete default — so the whole engine is unit-testable
   offline by passing a fake (see assistantEngine.test.ts). The single
   composition point that picks the real adapter is the app boundary
   (useChatSession), not this module. The instant responders are
   transport-free, so the chain abstraction stays segregated.
   ============================================ */

import { matchConcept } from './courseGraph';
import { extractLinks, buildConceptLinks } from './navLinks';
import { mergeById } from '@/shared/lib/mergeById';
import { MERGED_LINKS_CAP } from './constants';
import { callGemini, geminiConfigured } from './gemini';
import type { GeminiTransport } from './geminiClient';
import { localFallback } from './fallback';
import { greeting, help, thanks, list, pureSubject } from './instantResponders';
import type {
  AssistantResponse,
  NavLink,
  ResponderChain,
  ResponderResult
} from '@/features/assistant/types';
import { pick, type Lang } from '@/shared/lib/pickLang';

// Normalize any responder's partial result into the full response contract.
export function finalizeResponse(partial: ResponderResult): AssistantResponse {
  return {
    text: partial.text,
    links: partial.links ?? [],
    suggestions: partial.suggestions ?? []
  };
}

// --- Terminal responder: Gemini, then rich local fallback -------------------
// TOTAL by construction: every branch (and every failure of a branch)
// returns a ResponderResult, so `TerminalResponder.run` is non-nullable and
// the chain provably never falls through.

async function aiOrFallback(
  query: string,
  lang: Lang,
  transport: GeminiTransport
): Promise<ResponderResult> {
  // Navigation links: search hits first, then curated concept-graph links so
  // a topic like "стала Авогадро" still surfaces its connected materials
  // (mole, molarity, ideal-gas law) even with no direct search hit. Links
  // are best-effort — a content/search edge case must not break totality.
  let links: NavLink[] = [];
  try {
    links = extractLinks(query, lang);
    const conceptMatch = matchConcept(query);
    if (conceptMatch) {
      links = mergeById(
        links,
        buildConceptLinks(conceptMatch, lang),
        MERGED_LINKS_CAP
      );
    }
  } catch (err) {
    console.warn(
      'link assembly failed, answering without links:',
      err instanceof Error ? err.message : err
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

  try {
    const fallback = localFallback(query, lang);
    return {
      text: fallback.text,
      links,
      suggestions: fallback.suggestions || []
    };
  } catch (err) {
    // Last resort: localFallback itself failed. Still answer, never throw —
    // this is the slot where a fall-through would be catastrophic.
    console.warn(
      'local fallback failed, using last-resort line:',
      err instanceof Error ? err.message : err
    );
    return {
      text: pick(
        lang,
        'Вибачте, не вдалося обробити запит.',
        'Sorry, could not process the request.'
      ),
      links
    };
  }
}

/**
 * Build the chain: ordered fallible responders + one **total** terminal
 * that closes over the injected `transport`. There is no concrete default —
 * the caller (ultimately the app boundary) must supply the port, so the
 * orchestrator never names the Gemini concretion. Tests pass a fake.
 */
export function createResponders(transport: GeminiTransport): ResponderChain {
  return {
    responders: [
      { id: 'greeting', run: greeting },
      { id: 'help', run: help },
      { id: 'thanks', run: thanks },
      { id: 'list', run: list },
      { id: 'pure-subject', run: pureSubject }
    ],
    terminal: {
      id: 'ai',
      run: (q, lang) => aiOrFallback(q, lang, transport)
    }
  };
}
