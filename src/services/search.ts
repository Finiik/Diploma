/* ============================================
   Search Service — Fuse.js based fuzzy search
   ============================================ */

import Fuse from 'fuse.js';
import { getAllFormulas } from '@/lib/formulas';
import { theoryData } from '@/data/theory';
import { problemsData } from '@/data/problems';
import type { GraphItem, SearchHit } from '@/types/domain';

let fuseInstance: Fuse<GraphItem> | null = null;

function buildSearchIndex(): Fuse<GraphItem> {
  const formulas: GraphItem[] = getAllFormulas().map((f) => ({
    ...f,
    type: 'formula' as const
  }));

  const theories: GraphItem[] = theoryData.map((t) => ({
    ...t,
    type: 'theory' as const
  }));

  const problems: GraphItem[] = problemsData.map((p) => ({
    ...p,
    type: 'problem' as const
  }));

  const allItems: GraphItem[] = [...formulas, ...theories, ...problems];

  fuseInstance = new Fuse(allItems, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'nameEn', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'descriptionEn', weight: 0.15 },
      { name: 'topic', weight: 0.1 },
      { name: 'subtopic', weight: 0.1 },
      { name: 'latex', weight: 0.05 }
    ],
    threshold: 0.35,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2
  });

  return fuseInstance;
}

export function search(queryStr: string): SearchHit[] {
  if (!queryStr || queryStr.trim().length < 2) return [];
  const fuse = fuseInstance ?? buildSearchIndex();
  return fuse.search(queryStr).map((result) => ({
    ...result.item,
    score: result.score,
    matches: result.matches
  }));
}

export function rebuildIndex(): void {
  fuseInstance = null;
  buildSearchIndex();
}
