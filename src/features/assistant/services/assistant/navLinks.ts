/* ============================================
   Navigation link chips — mapping platform items to the link chips
   surfaced under an answer (shared by the Gemini path and the local
   fallback).
   ============================================ */

import { localizedName } from './subjects';
import { resolveRelated } from './courseGraph';
import { smartSearch } from './text';
import { NAV_LINKS_LIMIT } from './constants';
import type { Concept, GraphItem } from '@/shared/types/domain';
import type { NavLink } from '@/features/assistant/types';
import type { Lang } from '@/shared/lib/pickLang';

const LINK_TYPE: Record<GraphItem['type'], NavLink['type']> = {
  formula: 'formula',
  theory: 'theory',
  problem: 'problems'
};
const LINK_EMOJI: Record<GraphItem['type'], string> = {
  formula: '📐',
  theory: '📖',
  problem: '📝'
};

function itemToLink(
  item: GraphItem,
  lang: Lang,
  withEmoji = false
): NavLink | null {
  const type = LINK_TYPE[item.type];
  if (!type) return null;
  const name = localizedName(item, lang);
  return {
    type,
    id: item.id,
    label: withEmoji ? `${LINK_EMOJI[item.type]} ${name}` : name
  };
}

// Build navigation links from search results
export function extractLinks(query: string, lang: Lang): NavLink[] {
  return smartSearch(query)
    .slice(0, NAV_LINKS_LIMIT)
    .map((item) => itemToLink(item, lang, true))
    .filter((l): l is NavLink => l !== null);
}

// Concept-graph navigation links (any subject), reused by the fallback and
// the Gemini path so the topic still surfaces its connected materials.
export function buildConceptLinks(
  concept: Concept | null,
  lang: Lang
): NavLink[] {
  return resolveRelated(concept)
    .slice(0, NAV_LINKS_LIMIT)
    .map((item) => itemToLink(item, lang))
    .filter((l): l is NavLink => l !== null);
}
