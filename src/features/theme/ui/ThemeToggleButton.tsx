import { useTranslation } from 'react-i18next';
import { useTheme } from '@/features/theme/context/ThemeContext';
import type { Theme } from '@/features/theme/services/theme';

const THEME_TITLE_KEY: Record<Theme, string> = {
  light: 'theme.dark',
  dark: 'theme.light'
};

const THEME_ICON: Record<Theme, string> = {
  light: '🌙',
  dark: '☀️'
};

/** The theme switch — owns the icon/title mapping so consumers never
    branch on the theme's string representation. */
export function ThemeToggleButton() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="action-btn theme-toggle"
      onClick={toggleTheme}
      title={t(THEME_TITLE_KEY[theme])}
      id="theme-toggle"
    >
      {THEME_ICON[theme]}
    </button>
  );
}
