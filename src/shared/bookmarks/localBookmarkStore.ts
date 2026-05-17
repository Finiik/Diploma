/* ============================================
   Local bookmark store — the localStorage adapter.

   The synchronous offline cache: it owns the full id list and is always
   the source of truth the UI reads. (The remote store is the async sync
   target with a different, per-user shape — see remoteBookmarkStore.ts;
   the two are deliberately NOT substitutable.)
   ============================================ */

const BOOKMARKS_KEY = 'bookmarks';

/** Synchronous whole-list cache contract. */
export interface LocalBookmarkStore {
  get(): string[];
  set(bookmarks: string[]): void;
}

export const localBookmarkStore: LocalBookmarkStore = {
  get(): string[] {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? 'null') || [];
    } catch {
      return [];
    }
  },
  set(bookmarks: string[]): void {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
};
