/* ============================================
   Search corpus sources — where the search index's documents come from.

   Each source is independently swappable; the index in search.ts depends
   only on the composed result, so adding a new searchable content type
   means registering a source here, not editing the index builder.
   (Mirrors the InteractionsSource pattern in recommendations.)
   ============================================ */

import { getAllFormulas } from '@/features/formulas';
import { theoryData } from '@/features/theory';
import { problemsData } from '@/features/problems';
import type { GraphItem } from '@/shared/types/domain';

export interface SearchCorpusSource {
  load(): GraphItem[];
}

export const formulaCorpusSource: SearchCorpusSource = {
  load: () => getAllFormulas().map((f) => ({ ...f, type: 'formula' as const }))
};

export const theoryCorpusSource: SearchCorpusSource = {
  load: () => theoryData.map((t) => ({ ...t, type: 'theory' as const }))
};

export const problemCorpusSource: SearchCorpusSource = {
  load: () => problemsData.map((p) => ({ ...p, type: 'problem' as const }))
};

export const DEFAULT_CORPUS_SOURCES: SearchCorpusSource[] = [
  formulaCorpusSource,
  theoryCorpusSource,
  problemCorpusSource
];

/** Flatten the given sources into one document list, in source order.
    Sources are required: the default set is injected explicitly at the
    one wiring point (search.ts), never defaulted-in here, so the factory's
    inversion isn't silently re-coupled. */
export function composeCorpus(sources: SearchCorpusSource[]): GraphItem[] {
  return sources.flatMap((source) => source.load());
}
