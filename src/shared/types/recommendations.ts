/* ============================================
   Recommendations — the interaction tallies and recommended-item shape used
   by the collaborative filter.
   ============================================ */

import type { Formula, Subject } from './content';

/** A user→item interaction tally used by the collaborative filter. */
export interface Interaction {
  views?: number;
  calculations?: number;
  bookmarks?: number;
}

/** userId → (formulaId → interaction). */
export type InteractionsByUser = Record<string, Record<string, Interaction>>;

/** A recommended formula (carries its stamped subject). */
export type Recommendation = Formula & { subject: Subject };
