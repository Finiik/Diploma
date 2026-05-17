/* ============================================
   assistant — responder-chain contract types.

   These are NOT shared domain: only the assistant feature (its responder
   chain, engine and chat UI) depends on them, so they live with the feature
   rather than in src/shared/types.
   ============================================ */

import type { Lang } from '@/shared/lib/pickLang';

/** Navigation link chip surfaced under an assistant answer. */
export interface NavLink {
  type: 'formula' | 'theory' | 'problems' | 'subject';
  id: string;
  label: string;
}

/**
 * What a responder returns: only `text` is required; finalizeResponse()
 * fills the rest. `null` means "not mine, try the next responder".
 */
export interface ResponderResult {
  text: string;
  links?: NavLink[];
  suggestions?: string[];
}

/** The normalized, fully-populated assistant response contract. */
export interface AssistantResponse {
  text: string;
  links: NavLink[];
  suggestions: string[];
}

/** One fallible link in the chain-of-responsibility. */
export interface Responder {
  id: string;
  run: (
    query: string,
    lang: Lang
  ) => ResponderResult | null | Promise<ResponderResult | null>;
}

/**
 * The chain's terminal link. Unlike a `Responder` it is **total**: it
 * always produces a result (Gemini → rich offline fallback → hard
 * last-resort line), so `run` is non-nullable. This makes the "the chain
 * never falls through" guarantee a *type*, not a comment — a future edit
 * that returns `null` here is a compile error, not a silent gap.
 */
export interface TerminalResponder {
  id: string;
  run: (query: string, lang: Lang) => Promise<ResponderResult>;
}

/** Ordered fallible responders followed by exactly one total terminal. */
export interface ResponderChain {
  responders: Responder[];
  terminal: TerminalResponder;
}
