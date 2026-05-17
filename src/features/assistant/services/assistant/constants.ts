/* ============================================
   Assistant engine — tuning constants

   Every numeric knob the retrieval / fallback / responder pipeline used
   to express as a bare literal. Centralizing them also exposes where the
   same concept previously used inconsistent values (truncation lengths,
   fuzzy-score thresholds) so they can be reasoned about together.
   ============================================ */

/* --- Gemini RAG context: how much of each item to inline in the prompt.
   Long enough to disambiguate an item, short enough to keep the context
   block compact. Theory is denser prose so it gets more room. --- */
export const CONTEXT_DESCRIPTION_CHARS = 80;
export const CONTEXT_THEORY_CHARS = 120;

/* --- Fuzzy-search relevance. Fuse.js scores run 0 (perfect match) → 1
   (no match), so these are *upper* bounds: lower is stronger. --- */
/** Keep only strong matches when building the RAG context. */
export const STRONG_MATCH_MAX_SCORE = 0.4;
/** Above this the offline answer must hedge instead of asserting THE answer. */
export const WEAK_MATCH_MAX_SCORE = 0.55;
/** Max fuzzy items injected into the Gemini context. */
export const RAG_RESULTS_LIMIT = 3;

/* --- Navigation link chips --- */
/** Per-source cap (fuzzy search results / concept-graph results). */
export const NAV_LINKS_LIMIT = 4;
/** Total kept after merging primary + extra link lists. */
export const MERGED_LINKS_CAP = 5;

/* --- Concept matching against the auto-derived course graph --- */
/** Only short queries get a fuzzy concept match (longer = a real question). */
export const FUZZY_MATCH_MAX_WORDS = 4;
/** Minimum string similarity to accept a fuzzy concept match (typo-tolerant). */
export const CONCEPT_MATCH_MIN_SIMILARITY = 0.84;
/** Connected platform materials pulled in for a matched concept. */
export const RELATED_ITEMS_LIMIT = 6;

/* --- Offline fallback rendering --- */
/** Leading theory article in a synthesized concept answer. */
export const FALLBACK_THEORY_CHARS = 700;
/** Theory result-card body preview. */
export const THEORY_PREVIEW_CHARS = 300;
/** Paragraphs kept before the character trim on a theory preview. */
export const THEORY_PREVIEW_PARAGRAPHS = 2;
/** First N solution steps shown for a problem result. */
export const PROBLEM_STEPS_PREVIEW = 2;
/** Formulas stitched into a summary when a concept has no theory article. */
export const FALLBACK_FORMULA_SUMMARY_LIMIT = 4;
/** "Also see" related formulas listed under a formula result. */
export const FALLBACK_RELATED_FORMULAS = 2;
/** Other results considered (after the top hit) for "also see". */
export const FALLBACK_RELATED_RESULTS = 3;
/** Follow-up suggestion chips offered with a fallback answer. */
export const SUGGESTIONS_LIMIT = 3;

/* --- Text search --- */
/** Ignore words shorter than this in the per-word search fallback. */
export const MIN_SEARCH_WORD_LENGTH = 3;

/* --- List / subject responders --- */
/** Formulas listed for a subject before collapsing into "and N more". */
export const SUBJECT_FORMULA_LIST_LIMIT = 10;
/** A query longer than this is a real question, not just a subject name. */
export const MAX_PURE_SUBJECT_QUERY_LENGTH = 15;

/* --- Gemini generation --- */
/** Output budget; covers thinking + answer, so kept with headroom. */
export const GEMINI_MAX_OUTPUT_TOKENS = 2048;
