/* ============================================
   Bookmarks Service — localStorage + Firebase sync
   Only syncs to Firebase when it's configured
   ============================================ */

import { isFirebaseConfigured } from '@/lib/env';

const BOOKMARKS_KEY = 'bookmarks';

function getLocalBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? 'null') || [];
  } catch {
    return [];
  }
}

function setLocalBookmarks(bookmarks: string[]): void {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export async function getBookmarks(userId?: string): Promise<string[]> {
  if (userId && isFirebaseConfigured()) {
    try {
      const { getBookmarksFirebase } = await import('@/firebase/firestore');
      const firebaseBookmarks = await getBookmarksFirebase(userId);
      setLocalBookmarks(firebaseBookmarks);
      return firebaseBookmarks;
    } catch {
      return getLocalBookmarks();
    }
  }
  return getLocalBookmarks();
}

export async function addBookmark(userId: string | undefined, formulaId: string): Promise<string[]> {
  const bookmarks = getLocalBookmarks();
  if (!bookmarks.includes(formulaId)) {
    bookmarks.push(formulaId);
    setLocalBookmarks(bookmarks);
  }
  if (userId && isFirebaseConfigured()) {
    try {
      const { addBookmarkFirebase } = await import('@/firebase/firestore');
      await addBookmarkFirebase(userId, formulaId);
    } catch (e) {
      console.warn('Failed to sync bookmark to Firebase:', e);
    }
  }
  return bookmarks;
}

export async function removeBookmark(userId: string | undefined, formulaId: string): Promise<string[]> {
  let bookmarks = getLocalBookmarks().filter(id => id !== formulaId);
  setLocalBookmarks(bookmarks);
  if (userId && isFirebaseConfigured()) {
    try {
      const { removeBookmarkFirebase } = await import('@/firebase/firestore');
      await removeBookmarkFirebase(userId, formulaId);
    } catch (e) {
      console.warn('Failed to sync bookmark removal to Firebase:', e);
    }
  }
  return bookmarks;
}

export function isBookmarked(formulaId: string): boolean {
  return getLocalBookmarks().includes(formulaId);
}
