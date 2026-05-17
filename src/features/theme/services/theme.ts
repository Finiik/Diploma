/* ============================================
   Theme Service — manages light/dark theme
   ============================================ */

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

export function getTheme(): Theme {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

/** The single source of truth for the light↔dark transition rule. */
export function nextTheme(theme: Theme): Theme {
  return theme === 'light' ? 'dark' : 'light';
}

export function toggleTheme(): Theme {
  const next = nextTheme(getTheme());
  setTheme(next);
  return next;
}

export function initTheme(): Theme {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}
