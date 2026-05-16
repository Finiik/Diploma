/* ============================================
   Rich Local Fallback — detailed, helpful responses

   Used only when Gemini is unavailable. The help/list/thanks/subject intents
   are already handled in processMessage *before* this runs, so this module
   intentionally does NOT re-handle them (those branches were dead code).
   ============================================ */

import { smartSearch } from './text';
import { matchConcept, resolveRelated, buildCourseGraph } from './courseGraph';
import { getSubjectEmoji, localizedName } from './subjects';
import type { ResponderResult } from '@/types/domain';

// Offline concept answer, fully SYNTHESIZED from the course data — no
// hardcoded prose. A matched concept (topic/subtopic) leads with its
// connected theory article (already prose in the data); if none, it stitches
// a summary from the connected formulas. Follow-up chips are sibling topics
// in the same subject. When Gemini is up this path is unused.
export function detectConceptualAnswer(query: string, isUk: boolean): ResponderResult | null {
  const c = matchConcept(query);
  if (!c) return null;
  const related = resolveRelated(c);
  if (related.length === 0) return null;

  const title = isUk ? c.label : c.labelEn;
  const emoji = getSubjectEmoji(c.subject);

  const theory = related.find(r => r.type === 'theory');
  let body;
  if (theory) {
    const content = (isUk ? theory.content : theory.contentEn) || '';
    body = content.length > 700 ? `${content.slice(0, 700).trimEnd()}…` : content;
  } else {
    body = related
      .filter(r => r.type === 'formula')
      .slice(0, 4)
      .map(f => {
        const n = localizedName(f, isUk);
        const d = isUk ? f.description : (f.descriptionEn || f.description);
        return `• **${n}** — $${f.latex}$${d ? ` — ${d}` : ''}`;
      })
      .join('\n');
  }
  if (!body) return null;

  let text = `${emoji} **${title}**\n\n${body}`;
  const names = related.map(r => localizedName(r, isUk));
  text += `\n\n${isUk ? '🔗 На платформі це пов’язано з' : '🔗 On the platform this connects to'}: ${names.join(', ')}.`;

  const { concepts } = buildCourseGraph();
  const suggestions = concepts
    .filter(o => o.subject === c.subject && o.label !== c.label && o.itemIds.length)
    .slice(0, 3)
    .map(o => (isUk ? o.label : o.labelEn));

  return { text, suggestions };
}

export function localFallback(query: string, isUk: boolean): ResponderResult {
  // Broad conceptual question (e.g. "що таке фізика?") — answer the concept
  // generally instead of forcing the nearest specific formula.
  const concept = detectConceptualAnswer(query, isUk);
  if (concept) return concept;

  // Search-based response
  const results = smartSearch(query);

  if (results.length === 0) {
    return {
      text: isUk
        ? `🤔 На жаль, не знайшов точної відповіді на **"${query}"**.\n\nСпробуйте:\n• Використати ключові слова (напр. "закон Ома", "pH", "ДНК")\n• Написати назву формули або теми\n• Запитати "допомога" для списку можливостей`
        : `🤔 Sorry, I couldn't find a precise answer for **"${query}"**.\n\nTry:\n• Using key terms (e.g., "Ohm's law", "pH", "DNA")\n• Typing a formula or topic name\n• Asking "help" for available capabilities`,
      suggestions: isUk
        ? ['Які є формули?', 'Допомога', 'Закон Ньютона']
        : ['Available formulas?', 'Help', "Newton's law"]
    };
  }

  const top = results[0];

  // A weak fuzzy match shouldn't masquerade as a confident answer card.
  // Offer it as a suggestion instead of asserting it as THE answer.
  if (top.score != null && top.score > 0.55) {
    return {
      text: isUk
        ? `🤔 Точної відповіді на **"${query}"** не знайшов. Можливо, ви мали на увазі щось із наведеного нижче — або уточніть питання.`
        : `🤔 I couldn't find an exact answer for **"${query}"**. You might mean one of the items below — or try rephrasing the question.`,
      suggestions: results.slice(0, 3).map(r => localizedName(r, isUk))
    };
  }

  const others = results.slice(1, 4);
  const name = localizedName(top, isUk);
  // The type guards below exhaust GraphItem's discriminant, so the trailing
  // "generic result" branch is unreachable; keep an un-narrowed handle to
  // read the shared description fields there without a `never` access.
  const topItem = top;

  // Formula response — rich with variables
  if (top.type === 'formula') {
    const desc = isUk ? top.description : top.descriptionEn;
    const vars = top.variables
      ? top.variables.map(v => {
          const vName = isUk ? v.name : v.nameEn;
          return `  • **${v.symbol}** — ${vName} (${v.unit})`;
        }).join('\n')
      : '';
    const subjEmoji = getSubjectEmoji(top.subject);

    let text = `${subjEmoji} **${name}**\n\n$$${top.latex}$$\n\n${desc}`;
    if (vars) {
      text += `\n\n**${isUk ? 'Змінні' : 'Variables'}:**\n${vars}`;
    }
    text += `\n\n${isUk ? '💡 Натисніть кнопку нижче, щоб перейти до формули з калькулятором.' : '💡 Click the button below to open the formula with calculator.'}`;

    // Add related formulas
    if (others.length > 0) {
      const related = others
        .filter(o => o.type === 'formula')
        .slice(0, 2)
        .map(o => isUk ? o.name : o.nameEn);
      if (related.length > 0) {
        text += `\n\n${isUk ? '🔗 Також дивіться' : '🔗 Also see'}: ${related.join(', ')}`;
      }
    }

    return { text, suggestions: [] };
  }

  // Theory response — preview with content
  if (top.type === 'theory') {
    const desc = isUk ? top.description : top.descriptionEn;
    const content = (isUk ? top.content : top.contentEn) || '';
    const preview = content.split('\n\n').slice(0, 2).join('\n\n');
    const diffLabels: Record<number, string> = { 1: '🟢', 2: '🟡', 3: '🔴' };

    let text = `📖 **${name}** ${diffLabels[top.difficulty] || ''}\n\n${desc}\n\n${preview.slice(0, 300)}${content.length > 300 ? '...' : ''}`;

    if (top.relatedFormulas && top.relatedFormulas.length > 0) {
      text += `\n\n${isUk ? '📐 Пов\'язані формули' : '📐 Related formulas'}: ${top.relatedFormulas.join(', ')}`;
    }

    return { text, suggestions: [] };
  }

  // Problem response — with steps preview
  if (top.type === 'problem') {
    const desc = isUk ? top.description : top.descriptionEn;
    const stepsPreview = top.steps
      ? top.steps.slice(0, 2).map((s, i) => {
          const stepText = isUk ? s.text : s.textEn;
          return `  ${i + 1}. ${stepText}`;
        }).join('\n')
      : '';
    const answer = isUk ? top.answer : top.answerEn;

    let text = `📝 **${name}** ${'⭐'.repeat(top.difficulty || 1)}\n\n${desc}\n\n**${isUk ? 'Розв\'язок' : 'Solution'}:**\n${stepsPreview}`;
    if (top.steps && top.steps.length > 2) {
      text += `\n  ... ${isUk ? 'ще' : 'more'} ${top.steps.length - 2} ${isUk ? 'кроків' : 'steps'}`;
    }
    text += `\n\n**${isUk ? 'Відповідь' : 'Answer'}:** ${answer}`;

    return { text, suggestions: [] };
  }

  // Generic result (unreachable: the guards above cover every GraphItem
  // variant; kept as a defensive default identical to the original).
  return {
    text: `🔍 **${name}**\n\n${isUk ? topItem.description : (topItem.descriptionEn || topItem.description)}`,
    suggestions: []
  };
}
