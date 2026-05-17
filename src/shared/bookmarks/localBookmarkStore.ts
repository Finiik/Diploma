/* ============================================
   Local bookmark store — the localStorage adapter
   ============================================ */

const BOOKMARKS_KEY = 'bookmarks';

export const localBookmarkStore = {
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
