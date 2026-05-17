/* ============================================
   Firestore — collection names
   Single source of truth for top-level collection ids so a rename can
   never drift between the read, write and query paths.
   ============================================ */

export const FIRESTORE_COLLECTIONS = {
  /** Per-user formula interaction counters (collaborative-filtering source). */
  userInteractions: 'userInteractions',
  /** Per-user saved formula ids. */
  bookmarks: 'bookmarks'
} as const;
