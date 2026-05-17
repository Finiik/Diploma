/**
 * Localized-content field selection.
 *
 * Course content is stored bilingually as paired fields (`name`/`nameEn`,
 * `description`/`descriptionEn`, ...). This is the single place that resolves
 * which side to show, so no component hand-writes `isUk ? x.name : x.nameEn`
 * ternaries. UI chrome strings still go through i18next keys — this is only
 * for data content that lives in the catalog, not the translation bundles.
 *
 * English falls back to the base (Ukrainian) value when the `*En` field is
 * missing or empty, so a partially-translated record never renders blank.
 */

/**
 * The active UI language. A named type rather than a raw `isUk: boolean`
 * threaded through the assistant/RAG layer — a third locale is then a new
 * member + new `pick`/string arm, not a boolean that every signature and
 * every `isUk ? a : b` ternary has to reinterpret (Open/Closed).
 */
export type Lang = 'uk' | 'en';

/**
 * Choose the value for the active language. The one place the
 * locale→value decision is made, so call sites read as data
 * (`pick(lang, uk, en)`) instead of re-deriving a boolean each time.
 */
export function pick<T>(lang: Lang, uk: T, en: T): T {
  return lang === 'uk' ? uk : en;
}

export type Localized<K extends string> = { [P in K]: string } & Partial<
  Record<`${K}En`, string>
>;

export function pickLang<K extends string>(
  item: Localized<K>,
  baseKey: K,
  lang: Lang
): string {
  const base = (item[baseKey] ?? '') as string;
  if (lang === 'uk') return base;
  const en = (item as Record<string, unknown>)[`${baseKey}En`];
  return typeof en === 'string' && en.length > 0 ? en : base;
}
