/* ============================================
   Recommendation engine — tuning constants
   Single source of truth for every numeric knob the collaborative
   filter exposes. Each value carries the rationale that was previously
   implicit in a bare literal.
   ============================================ */

/**
 * How many formulas the Home feed shows. Sized to fill the 3-column
 * `formulas-grid` with two full rows on desktop. The skeleton placeholder
 * count is derived from this so the loading and loaded states match.
 */
export const DEFAULT_RECOMMENDATION_COUNT = 6;

/**
 * Relative importance of each interaction type when scoring a formula.
 * A bookmark is the strongest intent signal (deliberate save), a
 * calculation is medium (active use), a view is the weakest (passive).
 */
export const INTERACTION_WEIGHTS = {
  view: 1,
  calculation: 3,
  bookmark: 5
} as const;

/**
 * Neighbourhood size for collaborative filtering: only the N most
 * similar users contribute to a recommendation. Keeps suggestions
 * driven by close matches instead of being diluted by the long tail.
 */
export const SIMILAR_USERS_NEIGHBOURHOOD = 5;

/**
 * Hard deadline for the Firestore interaction read. The demo dataset is
 * always available instantly, so we never let a slow network block the
 * feed for longer than this before falling back to demo data.
 */
export const FIREBASE_READ_TIMEOUT_MS = 2000;

/** localStorage key holding the offline user's per-formula interaction map. */
export const LOCAL_INTERACTIONS_STORAGE_KEY = 'userInteractions';
