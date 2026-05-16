import { createContext, useContext, useState, useEffect } from 'react';
import { initTheme, toggleTheme as toggleThemeService, setTheme as setThemeService } from '../services/theme';

type ThemeContextValue = { theme: string; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => initTheme());

  useEffect(() => {
    setThemeService(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
