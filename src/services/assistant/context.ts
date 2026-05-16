/* ============================================
   Retrieval context + navigation links

   Builds the platform context/RAG block fed to Gemini, and the navigation
   link chips shared by the Gemini path and the local fallback.
   ============================================ */

import { theoryData } from '@/data/theory';
import { problemsData } from '@/data/problems';
import { getAllFormulasFlat, localizedName } from './subjects';
import { buildCourseGraph, matchConcept, resolveRelated } from './courseGraph';
import { smartSearch } from './text';
import type { Concept, GraphItem, NavLink } from '@/types/domain';

// Build a compact context summary for Gemini
export function buildPlatformContext(isUk: boolean) {
  const allFormulas = getAllFormulasFlat();

  const formulaList = allFormulas
    .map((f) => {
      const name = isUk ? f.name : f.nameEn;
      const desc = isUk ? (f.description || '').slice(0, 80) : (f.descriptionEn || '').slice(0, 80);
      return `- ${name} (id: ${f.id}, LaTeX: ${f.latex}): ${desc}`;
    })
    .join('\n');

  const theoryList = theoryData
    .map((t) => {
      const name = isUk ? t.name : t.nameEn;
      const content = isUk ? (t.content || '').slice(0, 120) : (t.contentEn || '').slice(0, 120);
      return `- ${name} (${t.subject}, difficulty: ${t.difficulty}): ${content}`;
    })
    .join('\n');

  const problemList = problemsData
    .map((p) => {
      const name = isUk ? p.name : p.nameEn;
      const desc = isUk ? (p.description || '').slice(0, 80) : (p.descriptionEn || '').slice(0, 80);
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
          const subs = t.subtopics.map((x) => (isUk ? x.name : x.nameEn)).filter(Boolean);
          return subs.length ? `  • ${tn}: ${subs.join(', ')}` : `  • ${tn}`;
        })
        .join('\n');
      return `${subj}:\n${topics}`;
    })
    .join('\n');

  return { formulaList, theoryList, problemList, topicOutline, totalFormulas: allFormulas.length };
}

// Serialize one platform item into the Gemini prompt context.
export function formatItemContext(item: GraphItem, isUk: boolean): string {
  const name = localizedName(item, isUk);
  if (item.type === 'formula') {
    const desc = isUk ? item.description : item.descriptionEn;
    const vars = item.variables
      ? item.variables.map((v) => `${v.symbol} (${isUk ? v.name : v.nameEn}, ${v.unit})`).join(', ')
      : '';
    return `\nFORMULA: ${name}\nLaTeX: ${item.latex}\nDescription: ${desc}\nVariables: ${vars}\nID: ${item.id}\nSubject: ${item.subject}\n`;
  }
  if (item.type === 'theory') {
    const content = isUk ? item.content : item.contentEn;
    return `\nTHEORY: ${name}\nContent: ${content}\nRelated formulas: ${(item.relatedFormulas || []).join(', ')}\n`;
  }
  if (item.type === 'problem') {
    const desc = isUk ? item.description : item.descriptionEn;
    const steps = item.steps
      ? item.steps.map((s, i) => `Step ${i + 1}: ${isUk ? s.text : s.textEn}`).join('\n')
      : '';
    const answer = isUk ? item.answer : item.answerEn;
    return `\nPROBLEM: ${name}\nDescription: ${desc}\n${steps}\nAnswer: ${answer}\nRelated formula: ${item.relatedFormula || 'none'}\n`;
  }
  return '';
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
    .filter((r) => r.score == null || r.score <= 0.4)
    .slice(0, 3);
  if (results.length === 0) return '';

  let context =
    '\n\n--- POSSIBLY RELATED PLATFORM ITEMS (reference these ONLY if they directly help answer the question; ignore them otherwise) ---\n';
  results.forEach((item) => {
    context += formatItemContext(item, isUk);
  });
  return context;
}

// Shared mapping from a platform item to a navigation link chip. The Gemini
// path prefixes the label with a type emoji; the concept-graph path doesn't.
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
function itemToLink(item: GraphItem, isUk: boolean, withEmoji = false): NavLink | null {
  const type = LINK_TYPE[item.type];
  if (!type) return null;
  const name = localizedName(item, isUk);
  return { type, id: item.id, label: withEmoji ? `${LINK_EMOJI[item.type]} ${name}` : name };
}

// Build navigation links from search results
export function extractLinks(query: string, isUk: boolean): NavLink[] {
  return smartSearch(query)
    .slice(0, 4)
    .map((item) => itemToLink(item, isUk, true))
    .filter((l): l is NavLink => l !== null);
}

// Concept-graph navigation links (any subject), reused by the fallback and
// the Gemini path so the topic still surfaces its connected materials.
export function buildConceptLinks(concept: Concept | null, isUk: boolean): NavLink[] {
  return resolveRelated(concept)
    .slice(0, 4)
    .map((item) => itemToLink(item, isUk))
    .filter((l): l is NavLink => l !== null);
}

export function mergeLinks<T extends { type: string; id: string }>(
  primary: T[],
  extra: T[],
  cap = 5
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
