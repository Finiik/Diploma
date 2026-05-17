/* ============================================
   Bookmarks Service — offline-first, syncs to Firebase
   when a user is signed in and Firebase is configured.
   This module owns only the offline-first-then-sync
   policy; storage adapters live in localBookmarkStore /
   remoteBookmarkStore.

   The two adapters are intentionally asymmetric, not
   interchangeable: local = synchronous whole-list cache
   (always read), remote = async per-user sync target
   (best-effort). Each has its own typed interface.
   ============================================ */

import { localBookmarkStore } from './localBookmarkStore';
import { resolveRemoteBookmarkStore } from './remoteBookmarkStore';

export async function getBookmarks(userId?: string): Promise<string[]> {
  const remote = await resolveRemoteBookmarkStore(userId);
  if (remote) {
    try {
      const ids = await remote.store.get(remote.userId);
      localBookmarkStore.set(ids);
      return ids;
    } catch {
      return localBookmarkStore.get();
    }
  }
  return localBookmarkStore.get();
}

export async function addBookmark(
  userId: string | undefined,
  formulaId: string
): Promise<string[]> {
  const bookmarks = localBookmarkStore.get();
  if (!bookmarks.includes(formulaId)) {
    bookmarks.push(formulaId);
    localBookmarkStore.set(bookmarks);
  }
  const remote = await resolveRemoteBookmarkStore(userId);
  if (remote) {
    try {
      await remote.store.add(remote.userId, formulaId);
    } catch (e) {
      console.warn('Failed to sync bookmark to Firebase:', e);
    }
  }
  return bookmarks;
}

export async function removeBookmark(
  userId: string | undefined,
  formulaId: string
): Promise<string[]> {
  const bookmarks = localBookmarkStore.get().filter((id) => id !== formulaId);
  localBookmarkStore.set(bookmarks);
  const remote = await resolveRemoteBookmarkStore(userId);
  if (remote) {
    try {
      await remote.store.remove(remote.userId, formulaId);
    } catch (e) {
      console.warn('Failed to sync bookmark removal to Firebase:', e);
    }
  }
  return bookmarks;
}
