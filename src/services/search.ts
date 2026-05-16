/* ============================================
   Search Service — Fuse.js based fuzzy search
   ============================================ */

import Fuse from 'fuse.js';
import { getAllFormulas } from '../data/physics';
import { getAllFormulas as getAllChemFormulas } from '../data/chemistry';
import { getAllFormulas as getAllBioFormulas } from '../data/biology';
import { theoryData } from '../data/theory';
import { problemsData } from '../data/problems';

let fuseInstance = null;

function buildSearchIndex() {
  const formulas = [
    ...getAllFormulas().map(f => ({ ...f, type: 'formula', subject: 'physics' })),
    ...getAllChemFormulas().map(f => ({ ...f, type: 'formula', subject: 'chemistry' })),
    ...getAllBioFormulas().map(f => ({ ...f, type: 'formula', subject: 'biology' }))
  ];

  const theories = theoryData.map(t => ({
    ...t,
    type: 'theory'
  }));

  const problems = problemsData.map(p => ({
    ...p,
    type: 'problem'
  }));

  const allItems = [...formulas, ...theories, ...problems];

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

export function search(queryStr) {
  if (!queryStr || queryStr.trim().length < 2) return [];
  if (!fuseInstance) buildSearchIndex();
  return fuseInstance.search(queryStr).map(result => ({
    ...result.item,
    score: result.score,
    matches: result.matches
  }));
}

export function rebuildIndex() {
  fuseInstance = null;
  buildSearchIndex();
}
