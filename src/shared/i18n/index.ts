import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from '@/shared/i18n/locales/uk.json';
import en from '@/shared/i18n/locales/en.json';
import {
  LANGUAGE_STORAGE_KEY,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE
} from '@/shared/i18n/constants';

const savedLang =
  localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en }
  },
  lng: savedLang,
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
