/* ============================================
   Search Service — Fuse.js based fuzzy search.

   Owns only the index lifecycle and hit-shaping. The document corpus comes
   from swappable sources (./searchCorpus); a SearchIndex encapsulates its
   own Fuse instance so there is no shared module-level mutable state and
   tests can spin up an isolated index. The module-level `search`/
   `rebuildIndex` keep the original public API for app callers.
   ============================================ */

import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js';
import type { GraphItem, SearchHit } from '@/shared/types/domain';
import { composeCorpus, type SearchCorpusSource } from './searchCorpus';

const FUSE_OPTIONS: IFuseOptions<GraphItem> = {
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
};

function toSearchHit(result: FuseResult<GraphItem>): SearchHit {
  return {
    ...result.item,
    score: result.score,
    matches: result.matches
  };
}

export interface SearchIndex {
  /** Empty for blank/too-short queries; otherwise scored hits. */
  query(queryStr: string): SearchHit[];
  /** Rebuild from the corpus (e.g. after content changes). */
  rebuild(): void;
}

/**
 * Build an isolated search index over the given corpus sources. The Fuse
 * instance is created lazily on first query and lives in this closure.
 */
export function createSearchIndex(
  sources?: SearchCorpusSource[]
): SearchIndex {
  let fuse: Fuse<GraphItem> | null = null;
  const build = () => new Fuse(composeCorpus(sources), FUSE_OPTIONS);

  return {
    query(queryStr: string): SearchHit[] {
      if (!queryStr || queryStr.trim().length < 2) return [];
      fuse ??= build();
      return fuse.search(queryStr).map(toSearchHit);
    },
    rebuild(): void {
      fuse = build();
    }
  };
}

/** Process-wide default index used by the app. */
const defaultIndex = createSearchIndex();

export function search(queryStr: string): SearchHit[] {
  return defaultIndex.query(queryStr);
}

export function rebuildIndex(): void {
  defaultIndex.rebuild();
}
