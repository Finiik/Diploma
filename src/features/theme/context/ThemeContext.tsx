import { createContext, useContext, useState, useEffect } from 'react';
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

  const toggleTheme = () => {
    setTheme((prev) => nextTheme(prev));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
