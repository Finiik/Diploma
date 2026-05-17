/* ============================================
   Auth gateway — the injectable port behind which all firebase/auth + the
   Firebase app construction live. Mirrors resolveRemoteBookmarkStore: the
   high-level auth state machine (useFirebaseAuthState) depends on this
   abstraction, not on the SDK/env, so it is the one stateful boundary that
   now has a seam like bookmarks/interactions already did (Dependency
   Inversion). resolveAuthGateway() picks the impl by configuration.
   ============================================ */

import {
  signInAnonymously,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { getFirebaseAuth } from '@/shared/firebase/config';
import { isFirebaseConfigured } from '@/shared/lib/env';
import { OFFLINE_USER_ID } from './constants';

/**
 * Either a real Firebase user or the synthetic offline user the app falls
 * back to when Firebase is unconfigured / auth fails. Consumers only ever
 * read `uid`, so that's the only field guaranteed across both shapes.
 */
export type OfflineUser = { uid: string; isAnonymous: boolean; offline: true };
export type AppUser = User | OfflineUser;

export const OFFLINE_USER: OfflineUser = {
  uid: OFFLINE_USER_ID,
  isAnonymous: true,
  offline: true
};

/** The port: subscribe to user changes + trigger (anonymous) sign-in. */
export interface AuthGateway {
  /** Subscribe to user changes. Returns an unsubscribe function. */
  subscribe(onUser: (user: AppUser | null) => void): () => void;
  /** Begin sign-in. Rejects if it fails (caller decides the fallback). */
  signIn(): Promise<void>;
}

/** No Firebase: immediately yield the offline user; nothing to sign in. */
const offlineAuthGateway: AuthGateway = {
  subscribe(onUser) {
    console.info('Firebase not configured — running in offline mode');
    onUser(OFFLINE_USER);
    return () => {};
  },
  signIn() {
    return Promise.resolve();
  }
};

/** Real Firebase. The only module that touches firebase/auth + the app. */
const firebaseAuthGateway: AuthGateway = {
  subscribe(onUser) {
    return onAuthStateChanged(getFirebaseAuth(), (u) => onUser(u));
  },
  signIn() {
    return signInAnonymously(getFirebaseAuth()).then(() => undefined);
  }
};

/** Pick the gateway by configuration (same shape as bookmark-store resolve). */
export function resolveAuthGateway(): AuthGateway {
  return isFirebaseConfigured() ? firebaseAuthGateway : offlineAuthGateway;
}
