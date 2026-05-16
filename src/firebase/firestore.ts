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
import type { Interaction, InteractionsByUser } from '../types/domain';

/** Counters stored per-formula. Non-optional here (Firestore writes all 3). */
type InteractionCounters = Required<Interaction>;
type InteractionType = 'view' | 'calculation' | 'bookmark';

/* ============================================
   User Interactions — for collaborative filtering
   ============================================ */

export async function logInteraction(
  userId: string | undefined,
  formulaId: string,
  type: InteractionType = 'view'
): Promise<void> {
  if (!userId) return;
  const ref = doc(db, 'userInteractions', userId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    const interactions: Record<string, InteractionCounters> = data.interactions || {};
    const current: InteractionCounters =
      interactions[formulaId] || { views: 0, calculations: 0, bookmarks: 0 };

    if (type === 'view') current.views += 1;
    if (type === 'calculation') current.calculations += 1;
    if (type === 'bookmark') current.bookmarks += 1;

    interactions[formulaId] = current;
    await updateDoc(ref, { interactions, updatedAt: serverTimestamp() });
  } else {
    const interactions: Record<string, InteractionCounters> = {};
    interactions[formulaId] = {
      views: type === 'view' ? 1 : 0,
      calculations: type === 'calculation' ? 1 : 0,
      bookmarks: type === 'bookmark' ? 1 : 0
    };
    await setDoc(ref, { interactions, userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export async function getUserInteractions(
  userId: string | undefined
): Promise<Record<string, Interaction>> {
  if (!userId) return {};
  const ref = doc(db, 'userInteractions', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().interactions || {} : {};
}

export async function getAllInteractions(): Promise<InteractionsByUser> {
  const snapshot = await getDocs(collection(db, 'userInteractions'));
  const all: InteractionsByUser = {};
  snapshot.forEach((docSnap) => {
    all[docSnap.id] = docSnap.data().interactions || {};
  });
  return all;
}

/* ============================================
   Bookmarks — per-user
   ============================================ */

export async function addBookmarkFirebase(
  userId: string | undefined,
  formulaId: string
): Promise<void> {
  if (!userId) return;
  const ref = doc(db, 'bookmarks', userId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, { formulaIds: arrayUnion(formulaId), updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { formulaIds: [formulaId], userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export async function removeBookmarkFirebase(
  userId: string | undefined,
  formulaId: string
): Promise<void> {
  if (!userId) return;
  const ref = doc(db, 'bookmarks', userId);
  await updateDoc(ref, { formulaIds: arrayRemove(formulaId), updatedAt: serverTimestamp() });
}

export async function getBookmarksFirebase(
  userId: string | undefined
): Promise<string[]> {
  if (!userId) return [];
  const ref = doc(db, 'bookmarks', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().formulaIds || [] : [];
}
