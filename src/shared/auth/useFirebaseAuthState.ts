/* ============================================
   Firebase auth state machine — the side-effectful half of auth, isolated
   from the context boundary so AuthProvider stays a thin wrapper (mirrors
   how useMobileMenu / useInteractionLog isolate their effects).
   ============================================ */

import { useState, useEffect } from 'react';
import { auth } from '@/shared/firebase/config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '@/shared/lib/env';
import { OFFLINE_USER_ID, AUTH_FALLBACK_TIMEOUT_MS } from './constants';

/**
 * Either a real Firebase user or the synthetic offline user the app falls
 * back to when Firebase is unconfigured / auth fails. Consumers only ever
 * read `uid`, so that's the only field guaranteed across both shapes.
 */
export type OfflineUser = { uid: string; isAnonymous: boolean; offline: true };
export type AppUser = User | OfflineUser;

const OFFLINE: OfflineUser = {
  uid: OFFLINE_USER_ID,
  isAnonymous: true,
  offline: true
};

/** Resolves `{ user, loading }`, falling back to the offline user. */
export function useFirebaseAuthState(): {
  user: AppUser | null;
  loading: boolean;
} {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not configured, skip auth entirely
    if (!isFirebaseConfigured()) {
      console.info('Firebase not configured — running in offline mode');
      setUser(OFFLINE);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Auto sign-in anonymously with a timeout
    const authTimeout = setTimeout(() => {
      setLoading(false);
      console.warn('Auth timed out — running without authentication');
    }, AUTH_FALLBACK_TIMEOUT_MS);

    signInAnonymously(auth)
      .then(() => clearTimeout(authTimeout))
      .catch((error) => {
        clearTimeout(authTimeout);
        console.warn(
          'Anonymous auth failed, app will work in offline mode:',
          error
        );
        setUser(OFFLINE);
        setLoading(false);
      });

    return () => {
      unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  return { user, loading };
}
