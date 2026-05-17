/* ============================================
   Firebase auth state machine — the side-effectful half of auth, isolated
   from the context boundary so AuthProvider stays a thin wrapper (mirrors
   how useMobileMenu / useInteractionLog isolate their effects).

   It depends only on the AuthGateway port (./authGateway), never on
   firebase/auth or the Firebase app directly — that SDK coupling now lives
   behind the gateway, the same way bookmarks/interactions are behind their
   sources (Dependency Inversion).
   ============================================ */

import { useState, useEffect } from 'react';
import { resolveAuthGateway, OFFLINE_USER, type AppUser } from './authGateway';
import { AUTH_FALLBACK_TIMEOUT_MS } from './constants';

// Re-exported so existing `import { type AppUser } from './useFirebaseAuthState'`
// consumers keep working (the types moved to the gateway with the SDK).
export type { AppUser, OfflineUser } from './authGateway';

/** Resolves `{ user, loading }`, falling back to the offline user. */
export function useFirebaseAuthState(): {
  user: AppUser | null;
  loading: boolean;
} {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gateway = resolveAuthGateway();

    const unsubscribe = gateway.subscribe((u) => {
      setUser(u);
      setLoading(false);
    });

    // Auto sign-in with a timeout; on failure fall back to the offline user.
    const authTimeout = setTimeout(() => {
      setLoading(false);
      console.warn('Auth timed out — running without authentication');
    }, AUTH_FALLBACK_TIMEOUT_MS);

    gateway
      .signIn()
      .then(() => clearTimeout(authTimeout))
      .catch((error) => {
        clearTimeout(authTimeout);
        console.warn(
          'Anonymous auth failed, app will work in offline mode:',
          error
        );
        setUser(OFFLINE_USER);
        setLoading(false);
      });

    return () => {
      unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  return { user, loading };
}
