import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { pickLang, type Localized } from '@/shared/lib/pickLang';
import { resolveLang } from '@/shared/i18n/lang';

/**
 * Reactive localized-content selector.
 *
 * `useTranslation()` subscribes the component to i18next, so it re-renders
 * when the language toggles. The returned picker is pre-bound to the current
 * language — call sites just do `tr(item, 'name')` instead of threading
 * `isUk` through every component. The pure `pickLang` underneath stays
 * unit-testable without React.
 */
export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = resolveLang(i18n.language);
  return useCallback(
    <K extends string>(item: Localized<K>, baseKey: K): string =>
      pickLang(item, baseKey, lang),
    [lang]
  );
}
