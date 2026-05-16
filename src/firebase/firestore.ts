import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from './config';

/* ============================================
   User Interactions — for collaborative filtering
   ============================================ */

export async function logInteraction(userId, formulaId, type = 'view') {
  if (!userId) return;
  const ref = doc(db, 'userInteractions', userId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    const interactions = data.interactions || {};
    const current = interactions[formulaId] || { views: 0, calculations: 0, bookmarks: 0 };

    if (type === 'view') current.views += 1;
    if (type === 'calculation') current.calculations += 1;
    if (type === 'bookmark') current.bookmarks += 1;

    interactions[formulaId] = current;
    await updateDoc(ref, { interactions, updatedAt: serverTimestamp() });
  } else {
    const interactions = {};
    interactions[formulaId] = {
      views: type === 'view' ? 1 : 0,
      calculations: type === 'calculation' ? 1 : 0,
      bookmarks: type === 'bookmark' ? 1 : 0
    };
    await setDoc(ref, { interactions, userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export async function getUserInteractions(userId) {
  if (!userId) return {};
  const ref = doc(db, 'userInteractions', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().interactions || {} : {};
}

export async function getAllInteractions() {
  const snapshot = await getDocs(collection(db, 'userInteractions'));
  const all = {};
  snapshot.forEach((docSnap) => {
    all[docSnap.id] = docSnap.data().interactions || {};
  });
  return all;
}

/* ============================================
   Bookmarks — per-user
   ============================================ */

export async function addBookmarkFirebase(userId, formulaId) {
  if (!userId) return;
  const ref = doc(db, 'bookmarks', userId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, { formulaIds: arrayUnion(formulaId), updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { formulaIds: [formulaId], userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export async function removeBookmarkFirebase(userId, formulaId) {
  if (!userId) return;
  const ref = doc(db, 'bookmarks', userId);
  await updateDoc(ref, { formulaIds: arrayRemove(formulaId), updatedAt: serverTimestamp() });
}

export async function getBookmarksFirebase(userId) {
  if (!userId) return [];
  const ref = doc(db, 'bookmarks', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().formulaIds || [] : [];
}
