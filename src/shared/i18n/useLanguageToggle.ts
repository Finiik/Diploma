import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from './constants';

/**
 * Toggles the UI language between the supported locales and persists the
 * choice. Keeps the locale codes and the storage key out of components,
 * matching the project's i18n-centralization rule.
 */
export function useLanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang =
      i18n.language === SUPPORTED_LANGUAGES.uk
        ? SUPPORTED_LANGUAGES.en
        : SUPPORTED_LANGUAGES.uk;
    i18n.changeLanguage(newLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
  };

  return { language: i18n.language, toggleLanguage };
}
