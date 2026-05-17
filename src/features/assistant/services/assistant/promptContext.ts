/* ============================================
   Platform context — the compact, static full-catalog summary fed to
   Gemini (what the platform teaches at a glance). Per-query retrieval/RAG
   is a separate concern (see ragContext.ts).
   ============================================ */

import { theoryData } from '@/features/theory';
import { problemsData } from '@/features/problems';
import { getAllFormulasFlat } from './subjects';
import { buildCourseGraph } from './courseGraph';
import { CONTEXT_DESCRIPTION_CHARS, CONTEXT_THEORY_CHARS } from './constants';
import { pick, type Lang } from '@/shared/lib/pickLang';

// Build a compact context summary for Gemini
export function buildPlatformContext(lang: Lang) {
  const allFormulas = getAllFormulasFlat();

  const formulaList = allFormulas
    .map((f) => {
      const name = pick(lang, f.name, f.nameEn);
      const desc = pick(
        lang,
        (f.description || '').slice(0, CONTEXT_DESCRIPTION_CHARS),
        (f.descriptionEn || '').slice(0, CONTEXT_DESCRIPTION_CHARS)
      );
      return `- ${name} (id: ${f.id}, LaTeX: ${f.latex}): ${desc}`;
    })
    .join('\n');

  const theoryList = theoryData
    .map((t) => {
      const name = pick(lang, t.name, t.nameEn);
      const content = pick(
        lang,
        (t.content || '').slice(0, CONTEXT_THEORY_CHARS),
        (t.contentEn || '').slice(0, CONTEXT_THEORY_CHARS)
      );
      return `- ${name} (${t.subject}, difficulty: ${t.difficulty}): ${content}`;
    })
    .join('\n');

  const problemList = problemsData
    .map((p) => {
      const name = pick(lang, p.name, p.nameEn);
      const desc = pick(
        lang,
        (p.description || '').slice(0, CONTEXT_DESCRIPTION_CHARS),
        (p.descriptionEn || '').slice(0, CONTEXT_DESCRIPTION_CHARS)
      );
      return `- ${name} (${p.subject}, difficulty: ${p.difficulty}⭐): ${desc}`;
    })
    .join('\n');

  // The course's own topic → subtopic map, auto-derived from the data so the
  // model understands the scope of what the platform actually teaches and can
  // explain concepts within that scope instead of inventing its own.
  const { outline } = buildCourseGraph();
  const topicOutline = outline
    .map((s) => {
      const subj = pick(lang, s.label, s.labelEn);
      const topics = s.topics
        .map((t) => {
          const tn = pick(lang, t.name, t.nameEn);
          const subs = t.subtopics
            .map((x) => pick(lang, x.name, x.nameEn))
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
