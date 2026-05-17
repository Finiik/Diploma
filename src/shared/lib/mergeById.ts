/**
 * Merge two lists of `{ type, id }` items: keep `primary` (in order), then
 * append items from `extra` whose `type:id` wasn't already seen, capped at
 * `cap`. Generic and domain-agnostic — not specific to nav links.
 */
export function mergeById<T extends { type: string; id: string }>(
  primary: T[],
  extra: T[],
  cap: number
): T[] {
  const seen = new Set(primary.map((l) => `${l.type}:${l.id}`));
  const out = [...primary];
  for (const l of extra) {
    const key = `${l.type}:${l.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
    if (out.length >= cap) break;
  }
  return out.slice(0, cap);
}
