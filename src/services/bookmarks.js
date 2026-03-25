/* ============================================
   Bookmarks Service — localStorage + Firebase sync
   Only syncs to Firebase when it's configured
   ============================================ */

const BOOKMARKS_KEY = 'bookmarks';

function isFirebaseConfigured() {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return key && key !== 'YOUR_API_KEY' && !key.startsWith('YOUR_');
}

function getLocalBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
  } catch {
    return [];
  }
}

function setLocalBookmarks(bookmarks) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export async function getBookmarks(userId) {
  if (userId && isFirebaseConfigured()) {
    try {
      const { getBookmarksFirebase } = await import('../firebase/firestore');
      const firebaseBookmarks = await getBookmarksFirebase(userId);
      setLocalBookmarks(firebaseBookmarks);
      return firebaseBookmarks;
    } catch {
      return getLocalBookmarks();
    }
  }
  return getLocalBookmarks();
}

export async function addBookmark(userId, formulaId) {
  const bookmarks = getLocalBookmarks();
  if (!bookmarks.includes(formulaId)) {
    bookmarks.push(formulaId);
    setLocalBookmarks(bookmarks);
  }
  if (userId && isFirebaseConfigured()) {
    try {
      const { addBookmarkFirebase } = await import('../firebase/firestore');
      await addBookmarkFirebase(userId, formulaId);
    } catch (e) {
      console.warn('Failed to sync bookmark to Firebase:', e);
    }
  }
  return bookmarks;
}

export async function removeBookmark(userId, formulaId) {
  let bookmarks = getLocalBookmarks().filter(id => id !== formulaId);
  setLocalBookmarks(bookmarks);
  if (userId && isFirebaseConfigured()) {
    try {
      const { removeBookmarkFirebase } = await import('../firebase/firestore');
      await removeBookmarkFirebase(userId, formulaId);
    } catch (e) {
      console.warn('Failed to sync bookmark removal to Firebase:', e);
    }
  }
  return bookmarks;
}

export function isBookmarked(formulaId) {
  return getLocalBookmarks().includes(formulaId);
}
