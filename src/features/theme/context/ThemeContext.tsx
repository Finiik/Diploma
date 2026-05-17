import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import type { ReactNode } from 'react';
import {
  initTheme,
  nextTheme,
  setTheme as setThemeService
} from '@/features/theme/services/theme';
import type { Theme } from '@/features/theme/services/theme';

type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => initTheme());

  useEffect(() => {
    setThemeService(theme);
  }, [theme]);

  // Stable across renders (functional update needs no deps) so the context
  // value is referentially stable — same thin-boundary discipline as
  // AuthContext/BookmarkContext (ARCHITECTURE §6.5).
  const toggleTheme = useCallback(() => {
    setTheme((prev) => nextTheme(prev));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
