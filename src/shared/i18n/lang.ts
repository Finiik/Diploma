/* ============================================
   i18n — the i18next language code → app `Lang` resolver.

   One place maps the active locale string to the `Lang` union, so the
   two origins (useLocalized for content fields, useChatSession for the
   assistant chain) don't each re-derive it from `SUPPORTED_LANGUAGES`.
   ============================================ */

import { SUPPORTED_LANGUAGES } from '@/shared/i18n/constants';
import type { Lang } from '@/shared/lib/pickLang';

/** Map the active i18next language code to the app `Lang` type. */
export function resolveLang(language: string): Lang {
  return language === SUPPORTED_LANGUAGES.uk ? 'uk' : 'en';
}
