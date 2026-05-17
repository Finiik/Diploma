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
import { getDb } from './config';
import { FIRESTORE_COLLECTIONS } from './collections';
import type { Interaction, InteractionsByUser } from '@/shared/types/domain';

// This module is only ever reached via dynamic import() behind an
// isFirebaseConfigured() guard, so resolving the (lazily-initialized)
// Firestore handle here touches the SDK exactly when Firebase is in use.
const db = getDb();

/** Counters stored per-formula. Non-optional here (Firestore writes all 3). */
type InteractionCounters = Required<Interaction>;
type InteractionType = 'view' | 'calculation' | 'bookmark';

/**
 * Interaction type → the counter it bumps. `Record<InteractionType,…>`, so
 * a new interaction type is one entry and a *compile error* if missed —
 * replacing the `if (type === …)` ladder that was duplicated across both
 * write branches (Open/Closed + Single Responsibility).
 */
const COUNTER_FIELD: Record<InteractionType, keyof InteractionCounters> = {
  view: 'views',
  calculation: 'calculations',
  bookmark: 'bookmarks'
};

/** A zeroed counter set with one field pre-incremented (first write). */
function freshCounters(field: keyof InteractionCounters): InteractionCounters {
  return { views: 0, calculations: 0, bookmarks: 0, [field]: 1 };
}

/* ============================================
   User Interactions — for collaborative filtering
   ============================================ */

export async function logInteraction(
  userId: string | undefined,
  formulaId: string,
  type: InteractionType = 'view'
): Promise<void> {
  if (!userId) return;
  const ref = doc(db, FIRESTORE_COLLECTIONS.userInteractions, userId);
  const field = COUNTER_FIELD[type];
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // Atomic field increment (server-side): concurrent interactions no
    // longer race on a read-modify-write of the whole interactions map.
    await updateDoc(ref, {
      [`interactions.${formulaId}.${field}`]: increment(1),
      updatedAt: serverTimestamp()
    });
  } else {
    await setDoc(ref, {
      interactions: { [formulaId]: freshCounters(field) },
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

export async function getUserInteractions(
  userId: string | undefined
): Promise<Record<string, Interaction>> {
  if (!userId) return {};
  const ref = doc(db, FIRESTORE_COLLECTIONS.userInteractions, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().interactions || {} : {};
}

export async function getAllInteractions(): Promise<InteractionsByUser> {
  const snapshot = await getDocs(
    collection(db, FIRESTORE_COLLECTIONS.userInteractions)
  );
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
  const ref = doc(db, FIRESTORE_COLLECTIONS.bookmarks, userId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      formulaIds: arrayUnion(formulaId),
      updatedAt: serverTimestamp()
    });
  } else {
    await setDoc(ref, {
      formulaIds: [formulaId],
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

export async function removeBookmarkFirebase(
  userId: string | undefined,
  formulaId: string
): Promise<void> {
  if (!userId) return;
  const ref = doc(db, FIRESTORE_COLLECTIONS.bookmarks, userId);
  await updateDoc(ref, {
    formulaIds: arrayRemove(formulaId),
    updatedAt: serverTimestamp()
  });
}

export async function getBookmarksFirebase(
  userId: string | undefined
): Promise<string[]> {
  if (!userId) return [];
  const ref = doc(db, FIRESTORE_COLLECTIONS.bookmarks, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().formulaIds || [] : [];
}
