/* ============================================
   Search — the result shape produced by the Fuse.js index over graph items.
   ============================================ */

import type { GraphItem } from './graph';

/** A Fuse.js hit: a graph item plus the relevance score/match metadata. */
export type SearchHit = GraphItem & {
  /** Fuse score (0 = perfect). Undefined when scoring is unavailable. */
  score?: number;
  matches?: readonly unknown[];
};
