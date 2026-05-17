/* ============================================
   Retrieval (graph/keyword RAG) — selects the platform items relevant to a
   query and serializes them into the Gemini prompt context. The static
   full-catalog summary is a separate concern (see promptContext.ts).
   ============================================ */

import { localizedName } from './subjects';
import { matchConcept, resolveRelated } from './courseGraph';
import { smartSearch } from './text';
import { STRONG_MATCH_MAX_SCORE, RAG_RESULTS_LIMIT } from './constants';
import type { GraphItem } from '@/shared/types/domain';
import { pick, type Lang } from '@/shared/lib/pickLang';

// Per-type serialization of one platform item into the Gemini prompt
// context. An exhaustive map over GraphItem's discriminant: adding a new
// item variant is a compile error here instead of a silent empty string.
type ItemFormatter<T extends GraphItem['type']> = (
  item: Extract<GraphItem, { type: T }>,
  lang: Lang
) => string;

const ITEM_FORMATTERS: { [T in GraphItem['type']]: ItemFormatter<T> } = {
  formula: (item, lang) => {
    const name = localizedName(item, lang);
    const desc = pick(lang, item.description, item.descriptionEn);
    const vars = item.variables
      ? item.variables
          .map(
            (v) => `${v.symbol} (${pick(lang, v.name, v.nameEn)}, ${v.unit})`
          )
          .join(', ')
      : '';
    return `\nFORMULA: ${name}\nLaTeX: ${item.latex}\nDescription: ${desc}\nVariables: ${vars}\nID: ${item.id}\nSubject: ${item.subject}\n`;
  },
  theory: (item, lang) => {
    const name = localizedName(item, lang);
    const content = pick(lang, item.content, item.contentEn);
    return `\nTHEORY: ${name}\nContent: ${content}\nRelated formulas: ${(item.relatedFormulas || []).join(', ')}\n`;
  },
  problem: (item, lang) => {
    const name = localizedName(item, lang);
    const desc = pick(lang, item.description, item.descriptionEn);
    const steps = item.steps
      ? item.steps
          .map((s, i) => `Step ${i + 1}: ${pick(lang, s.text, s.textEn)}`)
          .join('\n')
      : '';
    const answer = pick(lang, item.answer, item.answerEn);
    return `\nPROBLEM: ${name}\nDescription: ${desc}\n${steps}\nAnswer: ${answer}\nRelated formula: ${item.relatedFormula || 'none'}\n`;
  }
};

export function formatItemContext(item: GraphItem, lang: Lang): string {
  // Single typed dispatch boundary; exhaustiveness is enforced by the
  // mapped-type declaration of ITEM_FORMATTERS above.
  const format = ITEM_FORMATTERS[item.type] as (
    i: GraphItem,
    l: Lang
  ) => string;
  return format(item, lang);
}

// Build the retrieval context for the Gemini prompt (graph/keyword RAG). A
// matched concept pulls in the platform materials its topic/subtopic owns,
// expanded along the data's own edges, so the model explains by synthesizing
// what the course actually teaches instead of answering in isolation.
// Everything else falls back to fuzzy search, keeping only strong matches.
export function findRelevantContent(query: string, lang: Lang): string {
  const related = resolveRelated(matchConcept(query));
  if (related.length > 0) {
    let context =
      '\n\n--- CONNECTED PLATFORM MATERIALS (this question is about a concept the platform covers across the items below — build the explanation by SYNTHESIZING these materials and explicitly connecting them; ground every claim in what is shown here and do NOT pad with facts the platform does not cover; tell the student they can open each one) ---\n';
    related.forEach((item) => {
      context += formatItemContext(item, lang);
    });
    return context;
  }

  const results = smartSearch(query)
    .filter((r) => r.score == null || r.score <= STRONG_MATCH_MAX_SCORE)
    .slice(0, RAG_RESULTS_LIMIT);
  if (results.length === 0) return '';

  let context =
    '\n\n--- POSSIBLY RELATED PLATFORM ITEMS (reference these ONLY if they directly help answer the question; ignore them otherwise) ---\n';
  results.forEach((item) => {
    context += formatItemContext(item, lang);
  });
  return context;
}
