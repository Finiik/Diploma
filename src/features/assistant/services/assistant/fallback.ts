/* ============================================
   Rich Local Fallback — detailed, helpful responses

   Used only when Gemini is unavailable. The help/list/thanks/subject intents
   are already handled in processMessage *before* this runs, so this module
   intentionally does NOT re-handle them (those branches were dead code).
   ============================================ */

import { smartSearch } from './text';
import { matchConcept, resolveRelated, buildCourseGraph } from './courseGraph';
import { getSubjectEmoji, localizedName } from './subjects';
import {
  FALLBACK_THEORY_CHARS,
  THEORY_PREVIEW_CHARS,
  THEORY_PREVIEW_PARAGRAPHS,
  PROBLEM_STEPS_PREVIEW,
  FALLBACK_FORMULA_SUMMARY_LIMIT,
  FALLBACK_RELATED_FORMULAS,
  FALLBACK_RELATED_RESULTS,
  SUGGESTIONS_LIMIT,
  WEAK_MATCH_MAX_SCORE
} from './constants';
import type { GraphItem, SearchHit } from '@/shared/types/domain';
import type { ResponderResult } from '@/features/assistant/types';
import { pick, type Lang } from '@/shared/lib/pickLang';

// Offline concept answer, fully SYNTHESIZED from the course data — no
// hardcoded prose. A matched concept (topic/subtopic) leads with its
// connected theory article (already prose in the data); if none, it stitches
// a summary from the connected formulas. Follow-up chips are sibling topics
// in the same subject. When Gemini is up this path is unused.
export function detectConceptualAnswer(
  query: string,
  lang: Lang
): ResponderResult | null {
  const c = matchConcept(query);
  if (!c) return null;
  const related = resolveRelated(c);
  if (related.length === 0) return null;

  const title = pick(lang, c.label, c.labelEn);
  const emoji = getSubjectEmoji(c.subject);

  const theory = related.find((r) => r.type === 'theory');
  let body;
  if (theory) {
    const content = pick(lang, theory.content, theory.contentEn) || '';
    body =
      content.length > FALLBACK_THEORY_CHARS
        ? `${content.slice(0, FALLBACK_THEORY_CHARS).trimEnd()}…`
        : content;
  } else {
    body = related
      .filter((r) => r.type === 'formula')
      .slice(0, FALLBACK_FORMULA_SUMMARY_LIMIT)
      .map((f) => {
        const n = localizedName(f, lang);
        const d = pick(lang, f.description, f.descriptionEn || f.description);
        return `• **${n}** — $${f.latex}$${d ? ` — ${d}` : ''}`;
      })
      .join('\n');
  }
  if (!body) return null;

  let text = `${emoji} **${title}**\n\n${body}`;
  const names = related.map((r) => localizedName(r, lang));
  text += `\n\n${pick(lang, '🔗 На платформі це пов’язано з', '🔗 On the platform this connects to')}: ${names.join(', ')}.`;

  const { concepts } = buildCourseGraph();
  const suggestions = concepts
    .filter(
      (o) => o.subject === c.subject && o.label !== c.label && o.itemIds.length
    )
    .slice(0, SUGGESTIONS_LIMIT)
    .map((o) => pick(lang, o.label, o.labelEn));

  return { text, suggestions };
}

// --- Result classification + per-type renderers -----------------------------

function classifyTopResult(results: SearchHit[]): 'none' | 'weak' | 'strong' {
  if (results.length === 0) return 'none';
  const top = results[0];
  // A weak fuzzy match shouldn't masquerade as a confident answer card.
  if (top.score != null && top.score > WEAK_MATCH_MAX_SCORE) return 'weak';
  return 'strong';
}

function noResultsCard(query: string, lang: Lang): ResponderResult {
  return {
    text: pick(
      lang,
      `🤔 На жаль, не знайшов точної відповіді на **"${query}"**.\n\nСпробуйте:\n• Використати ключові слова (напр. "закон Ома", "pH", "ДНК")\n• Написати назву формули або теми\n• Запитати "допомога" для списку можливостей`,
      `🤔 Sorry, I couldn't find a precise answer for **"${query}"**.\n\nTry:\n• Using key terms (e.g., "Ohm's law", "pH", "DNA")\n• Typing a formula or topic name\n• Asking "help" for available capabilities`
    ),
    suggestions: pick(
      lang,
      ['Які є формули?', 'Допомога', 'Закон Ньютона'],
      ['Available formulas?', 'Help', "Newton's law"]
    )
  };
}

function weakMatchCard(
  query: string,
  results: SearchHit[],
  lang: Lang
): ResponderResult {
  // Offer the weak match as a suggestion instead of asserting it as THE
  // answer.
  return {
    text: pick(
      lang,
      `🤔 Точної відповіді на **"${query}"** не знайшов. Можливо, ви мали на увазі щось із наведеного нижче — або уточніть питання.`,
      `🤔 I couldn't find an exact answer for **"${query}"**. You might mean one of the items below — or try rephrasing the question.`
    ),
    suggestions: results
      .slice(0, SUGGESTIONS_LIMIT)
      .map((r) => localizedName(r, lang))
  };
}

// Per-type answer cards. An exhaustive map over GraphItem's discriminant:
// adding a new item variant is a compile error here instead of silently
// falling through to a generic card.
type FallbackRenderer<T extends GraphItem['type']> = (
  top: Extract<GraphItem, { type: T }>,
  others: GraphItem[],
  lang: Lang
) => ResponderResult;

const FALLBACK_RENDERERS: { [T in GraphItem['type']]: FallbackRenderer<T> } = {
  // Formula response — rich with variables
  formula: (top, others, lang) => {
    const name = localizedName(top, lang);
    const desc = pick(lang, top.description, top.descriptionEn);
    const vars = top.variables
      ? top.variables
          .map((v) => {
            const vName = pick(lang, v.name, v.nameEn);
            return `  • **${v.symbol}** — ${vName} (${v.unit})`;
          })
          .join('\n')
      : '';
    const subjEmoji = getSubjectEmoji(top.subject);

    let text = `${subjEmoji} **${name}**\n\n$$${top.latex}$$\n\n${desc}`;
    if (vars) {
      text += `\n\n**${pick(lang, 'Змінні', 'Variables')}:**\n${vars}`;
    }
    text += `\n\n${pick(lang, '💡 Натисніть кнопку нижче, щоб перейти до формули з калькулятором.', '💡 Click the button below to open the formula with calculator.')}`;

    // Add related formulas
    if (others.length > 0) {
      const related = others
        .filter((o) => o.type === 'formula')
        .slice(0, FALLBACK_RELATED_FORMULAS)
        .map((o) => pick(lang, o.name, o.nameEn));
      if (related.length > 0) {
        text += `\n\n${pick(lang, '🔗 Також дивіться', '🔗 Also see')}: ${related.join(', ')}`;
      }
    }

    return { text, suggestions: [] };
  },

  // Theory response — preview with content
  theory: (top, _others, lang) => {
    const name = localizedName(top, lang);
    const desc = pick(lang, top.description, top.descriptionEn);
    const content = pick(lang, top.content, top.contentEn) || '';
    const preview = content
      .split('\n\n')
      .slice(0, THEORY_PREVIEW_PARAGRAPHS)
      .join('\n\n');
    const diffLabels: Record<number, string> = { 1: '🟢', 2: '🟡', 3: '🔴' };

    let text = `📖 **${name}** ${diffLabels[top.difficulty] || ''}\n\n${desc}\n\n${preview.slice(0, THEORY_PREVIEW_CHARS)}${content.length > THEORY_PREVIEW_CHARS ? '...' : ''}`;

    if (top.relatedFormulas && top.relatedFormulas.length > 0) {
      text += `\n\n${pick(lang, "📐 Пов'язані формули", '📐 Related formulas')}: ${top.relatedFormulas.join(', ')}`;
    }

    return { text, suggestions: [] };
  },

  // Problem response — with steps preview
  problem: (top, _others, lang) => {
    const name = localizedName(top, lang);
    const desc = pick(lang, top.description, top.descriptionEn);
    const stepsPreview = top.steps
      ? top.steps
          .slice(0, PROBLEM_STEPS_PREVIEW)
          .map((s, i) => {
            const stepText = pick(lang, s.text, s.textEn);
            return `  ${i + 1}. ${stepText}`;
          })
          .join('\n')
      : '';
    const answer = pick(lang, top.answer, top.answerEn);

    let text = `📝 **${name}** ${'⭐'.repeat(top.difficulty || 1)}\n\n${desc}\n\n**${pick(lang, "Розв'язок", 'Solution')}:**\n${stepsPreview}`;
    if (top.steps && top.steps.length > PROBLEM_STEPS_PREVIEW) {
      text += `\n  ... ${pick(lang, 'ще', 'more')} ${top.steps.length - PROBLEM_STEPS_PREVIEW} ${pick(lang, 'кроків', 'steps')}`;
    }
    text += `\n\n**${pick(lang, 'Відповідь', 'Answer')}:** ${answer}`;

    return { text, suggestions: [] };
  }
};

export function localFallback(query: string, lang: Lang): ResponderResult {
  // Broad conceptual question (e.g. "що таке фізика?") — answer the concept
  // generally instead of forcing the nearest specific formula.
  const concept = detectConceptualAnswer(query, lang);
  if (concept) return concept;

  // Search-based response
  const results = smartSearch(query);
  const classification = classifyTopResult(results);
  if (classification === 'none') return noResultsCard(query, lang);
  if (classification === 'weak') return weakMatchCard(query, results, lang);

  const top = results[0];
  const others = results.slice(1, 1 + FALLBACK_RELATED_RESULTS);

  // Single typed dispatch boundary; exhaustiveness is enforced by the
  // mapped-type declaration of FALLBACK_RENDERERS above.
  const render = FALLBACK_RENDERERS[top.type] as (
    t: GraphItem,
    o: GraphItem[],
    l: Lang
  ) => ResponderResult;
  return render(top, others, lang);
}
