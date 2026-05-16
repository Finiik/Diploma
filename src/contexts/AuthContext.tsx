import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth } from '@/firebase/config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '@/lib/env';

/**
 * Either a real Firebase user or the synthetic offline user the app falls
 * back to when Firebase is unconfigured / auth fails. Consumers only ever
 * read `uid`, so that's the only field guaranteed across both shapes.
 */
type OfflineUser = { uid: string; isAnonymous: boolean; offline: true };
type AppUser = User | OfflineUser;

type AuthContextValue = { user: AppUser | null; loading: boolean };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not configured, skip auth entirely
    if (!isFirebaseConfigured()) {
      console.info('Firebase not configured — running in offline mode');
      setUser({ uid: 'local_user', isAnonymous: true, offline: true });
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
    }, 3000);

    signInAnonymously(auth)
      .then(() => clearTimeout(authTimeout))
      .catch((error) => {
        clearTimeout(authTimeout);
        console.warn('Anonymous auth failed, app will work in offline mode:', error);
        setUser({ uid: 'local_user', isAnonymous: true, offline: true });
        setLoading(false);
      });

    return () => {
      unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
