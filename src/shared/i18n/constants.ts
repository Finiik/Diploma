/* ============================================
   i18n — language constants
   The set of supported locales, the persistence key and the default /
   fallback choices. Keeps locale codes out of component logic, matching
   the project's i18n-centralization rule.
   ============================================ */

/** localStorage key under which the chosen UI language is persisted. */
export const LANGUAGE_STORAGE_KEY = 'language';

/** Locale codes the UI ships translations for (see locales/*.json). */
export const SUPPORTED_LANGUAGES = {
  uk: 'uk',
  en: 'en'
} as const;

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];

/** Initial language for first-time visitors (project's primary audience). */
export const DEFAULT_LANGUAGE: SupportedLanguage = SUPPORTED_LANGUAGES.uk;

/** Used by i18next when a key is missing in the active language. */
export const FALLBACK_LANGUAGE: SupportedLanguage = SUPPORTED_LANGUAGES.en;
