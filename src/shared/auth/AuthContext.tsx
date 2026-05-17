import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useFirebaseAuthState, type AppUser } from './useFirebaseAuthState';

type AuthContextValue = { user: AppUser | null; loading: boolean };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useFirebaseAuthState();
  const value = useMemo<AuthContextValue>(
    () => ({ user, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
