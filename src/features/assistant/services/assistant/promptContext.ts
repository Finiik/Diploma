/* ============================================
   Retrieval context — the platform context/RAG block fed to Gemini.
   ============================================ */

import { theoryData } from '@/features/theory';
import { problemsData } from '@/features/problems';
import { getAllFormulasFlat, localizedName } from './subjects';
import { buildCourseGraph, matchConcept, resolveRelated } from './courseGraph';
import { smartSearch } from './text';
import {
  CONTEXT_DESCRIPTION_CHARS,
  CONTEXT_THEORY_CHARS,
  STRONG_MATCH_MAX_SCORE,
  RAG_RESULTS_LIMIT
} from './constants';
import type { GraphItem } from '@/shared/types/domain';

// Build a compact context summary for Gemini
export function buildPlatformContext(isUk: boolean) {
  const allFormulas = getAllFormulasFlat();

  const formulaList = allFormulas
    .map((f) => {
      const name = isUk ? f.name : f.nameEn;
      const desc = isUk
        ? (f.description || '').slice(0, CONTEXT_DESCRIPTION_CHARS)
        : (f.descriptionEn || '').slice(0, CONTEXT_DESCRIPTION_CHARS);
      return `- ${name} (id: ${f.id}, LaTeX: ${f.latex}): ${desc}`;
    })
    .join('\n');

  const theoryList = theoryData
    .map((t) => {
      const name = isUk ? t.name : t.nameEn;
      const content = isUk
        ? (t.content || '').slice(0, CONTEXT_THEORY_CHARS)
        : (t.contentEn || '').slice(0, CONTEXT_THEORY_CHARS);
      return `- ${name} (${t.subject}, difficulty: ${t.difficulty}): ${content}`;
    })
    .join('\n');

  const problemList = problemsData
    .map((p) => {
      const name = isUk ? p.name : p.nameEn;
      const desc = isUk
        ? (p.description || '').slice(0, CONTEXT_DESCRIPTION_CHARS)
        : (p.descriptionEn || '').slice(0, CONTEXT_DESCRIPTION_CHARS);
      return `- ${name} (${p.subject}, difficulty: ${p.difficulty}⭐): ${desc}`;
    })
    .join('\n');

  // The course's own topic → subtopic map, auto-derived from the data so the
  // model understands the scope of what the platform actually teaches and can
  // explain concepts within that scope instead of inventing its own.
  const { outline } = buildCourseGraph();
  const topicOutline = outline
    .map((s) => {
      const subj = isUk ? s.label : s.labelEn;
      const topics = s.topics
        .map((t) => {
          const tn = isUk ? t.name : t.nameEn;
          const subs = t.subtopics
            .map((x) => (isUk ? x.name : x.nameEn))
            .filter(Boolean);
          return subs.length ? `  • ${tn}: ${subs.join(', ')}` : `  • ${tn}`;
        })
        .join('\n');
      return `${subj}:\n${topics}`;
    })
    .join('\n');

  return {
    formulaList,
    theoryList,
    problemList,
    topicOutline,
    totalFormulas: allFormulas.length
  };
}

// Per-type serialization of one platform item into the Gemini prompt
// context. An exhaustive map over GraphItem's discriminant: adding a new
// item variant is a compile error here instead of a silent empty string.
type ItemFormatter<T extends GraphItem['type']> = (
  item: Extract<GraphItem, { type: T }>,
  isUk: boolean
) => string;

const ITEM_FORMATTERS: { [T in GraphItem['type']]: ItemFormatter<T> } = {
  formula: (item, isUk) => {
    const name = localizedName(item, isUk);
    const desc = isUk ? item.description : item.descriptionEn;
    const vars = item.variables
      ? item.variables
          .map((v) => `${v.symbol} (${isUk ? v.name : v.nameEn}, ${v.unit})`)
          .join(', ')
      : '';
    return `\nFORMULA: ${name}\nLaTeX: ${item.latex}\nDescription: ${desc}\nVariables: ${vars}\nID: ${item.id}\nSubject: ${item.subject}\n`;
  },
  theory: (item, isUk) => {
    const name = localizedName(item, isUk);
    const content = isUk ? item.content : item.contentEn;
    return `\nTHEORY: ${name}\nContent: ${content}\nRelated formulas: ${(item.relatedFormulas || []).join(', ')}\n`;
  },
  problem: (item, isUk) => {
    const name = localizedName(item, isUk);
    const desc = isUk ? item.description : item.descriptionEn;
    const steps = item.steps
      ? item.steps
          .map((s, i) => `Step ${i + 1}: ${isUk ? s.text : s.textEn}`)
          .join('\n')
      : '';
    const answer = isUk ? item.answer : item.answerEn;
    return `\nPROBLEM: ${name}\nDescription: ${desc}\n${steps}\nAnswer: ${answer}\nRelated formula: ${item.relatedFormula || 'none'}\n`;
  }
};

export function formatItemContext(item: GraphItem, isUk: boolean): string {
  // Single typed dispatch boundary; exhaustiveness is enforced by the
  // mapped-type declaration of ITEM_FORMATTERS above.
  const format = ITEM_FORMATTERS[item.type] as (
    i: GraphItem,
    uk: boolean
  ) => string;
  return format(item, isUk);
}

// Build the retrieval context for the Gemini prompt (graph/keyword RAG). A
// matched concept pulls in the platform materials its topic/subtopic owns,
// expanded along the data's own edges, so the model explains by synthesizing
// what the course actually teaches instead of answering in isolation.
// Everything else falls back to fuzzy search, keeping only strong matches.
export function findRelevantContent(query: string, isUk: boolean): string {
  const related = resolveRelated(matchConcept(query));
  if (related.length > 0) {
    let context =
      '\n\n--- CONNECTED PLATFORM MATERIALS (this question is about a concept the platform covers across the items below — build the explanation by SYNTHESIZING these materials and explicitly connecting them; ground every claim in what is shown here and do NOT pad with facts the platform does not cover; tell the student they can open each one) ---\n';
    related.forEach((item) => {
      context += formatItemContext(item, isUk);
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
    context += formatItemContext(item, isUk);
  });
  return context;
}
