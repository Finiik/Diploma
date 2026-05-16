/* Characterization tests — auto-derived course knowledge graph (graph RAG).
   The graph is built from the static course data, so it is fully
   deterministic. We pin structural invariants + concept resolution. */
import { describe, it, expect } from 'vitest';
import {
  buildCourseGraph,
  matchConcept,
  resolveRelated
} from '../services/assistant/courseGraph';

describe('buildCourseGraph', () => {
  const g = buildCourseGraph();

  it('indexes every formula, theory article and problem by id', () => {
    // 78 formulas + 15 theory + 25 problems
    expect(Object.keys(g.byId).length).toBe(78 + 15 + 25);
  });

  it('returns the same memoized instance on repeated calls', () => {
    expect(buildCourseGraph()).toBe(g);
  });

  it('derives concepts and a 3-subject outline from the data', () => {
    expect(g.concepts.length).toBeGreaterThan(0);
    expect(g.outline.map(s => s.subject)).toEqual(['physics', 'chemistry', 'biology']);
    for (const c of g.concepts) {
      expect(Array.isArray(c.keys)).toBe(true);
      expect(Array.isArray(c.itemIds)).toBe(true);
    }
  });

  it('builds undirected edges (a→b implies b→a)', () => {
    const a = Object.keys(g.edges)[0];
    const b = [...g.edges[a]][0];
    expect([...g.edges[b]]).toContain(a);
  });
});

describe('matchConcept', () => {
  it('resolves an exact topic name to its concept', () => {
    const c = matchConcept('Механіка');
    expect(c).toBeTruthy();
    expect(c.label).toBe('Механіка');
    expect(c.subject).toBe('physics');
    expect(c.itemIds.length).toBeGreaterThan(0);
  });

  it('resolves the English topic label too', () => {
    expect(matchConcept('Mechanics')?.label).toBe('Механіка');
  });

  it('tolerates a small typo on a short query (fuzzy whole-string)', () => {
    expect(matchConcept('Механика')?.label).toBe('Механіка');
  });

  it('returns null for an unrelated query', () => {
    expect(matchConcept('qwerty zxcvbn asdf')).toBeNull();
  });
});

describe('resolveRelated', () => {
  it('returns connected materials, capped at 6, theory→formula→problem ordered', () => {
    const related = resolveRelated(matchConcept('Механіка'));
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(6);
    const rank = { theory: 0, formula: 1, problem: 2 };
    const ranks = related.map(r => rank[r.type] ?? 3);
    expect(ranks).toEqual([...ranks].sort((x, y) => x - y));
  });

  it('returns [] for a null/empty concept', () => {
    expect(resolveRelated(null)).toEqual([]);
    expect(resolveRelated({ itemIds: [] })).toEqual([]);
  });
});
