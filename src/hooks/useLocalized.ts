import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { pickLang, type Localized } from '@/lib/pickLang';

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
  const isUk = i18n.language === 'uk';
  return useCallback(
    <K extends string>(item: Localized<K>, baseKey: K): string =>
      pickLang(item, baseKey, isUk),
    [isUk]
  );
}
