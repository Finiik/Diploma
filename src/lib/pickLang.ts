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
export type Localized<K extends string> = { [P in K]: string } & Partial<
  Record<`${K}En`, string>
>;

export function pickLang<K extends string>(
  item: Localized<K>,
  baseKey: K,
  isUk: boolean
): string {
  const base = (item[baseKey] ?? '') as string;
  if (isUk) return base;
  const en = (item as Record<string, unknown>)[`${baseKey}En`];
  return typeof en === 'string' && en.length > 0 ? en : base;
}
