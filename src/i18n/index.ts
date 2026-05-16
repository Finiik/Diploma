import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from '@/i18n/locales/uk.json';
import en from '@/i18n/locales/en.json';

const savedLang = localStorage.getItem('language') || 'uk';

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en }
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
