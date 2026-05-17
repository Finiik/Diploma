/* ============================================
   Remote bookmark store — the Firebase sync adapter
   ============================================ */

import { isFirebaseConfigured } from '@/shared/lib/env';

export interface RemoteBookmarkStore {
  get(userId: string): Promise<string[]>;
  add(userId: string, formulaId: string): Promise<void>;
  remove(userId: string, formulaId: string): Promise<void>;
}

/**
 * Resolves the Firebase-backed remote store, or `null` when there is no
 * signed-in user or Firebase is not configured. Centralizes the
 * `userId && isFirebaseConfigured()` guard and the dynamic firestore
 * import that were previously duplicated across every bookmark operation.
 */
export async function resolveRemoteBookmarkStore(
  userId: string | undefined
): Promise<{ store: RemoteBookmarkStore; userId: string } | null> {
  if (!userId || !isFirebaseConfigured()) return null;
  const fs = await import('@/shared/firebase/firestore');
  const store: RemoteBookmarkStore = {
    get: (uid) => fs.getBookmarksFirebase(uid),
    add: (uid, id) => fs.addBookmarkFirebase(uid, id),
    remove: (uid, id) => fs.removeBookmarkFirebase(uid, id)
  };
  return { store, userId };
}
