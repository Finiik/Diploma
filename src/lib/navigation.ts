/**
 * Single source of truth for "content item → route".
 *
 * Two callers feed this: assistant `NavLink`s (`type` includes `'problems'`
 * and `'subject'`) and search `SearchHit`s (`ContentType`, uses `'problem'`).
 * The union below covers both; an unrecognised type yields `null` (no nav),
 * matching the previous if/else fall-through behaviour.
 */
export interface Routable {
  type: 'formula' | 'subject' | 'theory' | 'problem' | 'problems';
  id: string;
}

export function resolveNavPath({ type, id }: Routable): string | null {
  switch (type) {
    case 'formula':
      return `/formula/${id}`;
    case 'subject':
      return `/subject/${id}`;
    case 'theory':
      return '/theory';
    case 'problem':
    case 'problems':
      return '/problems';
    default:
      return null;
  }
}
