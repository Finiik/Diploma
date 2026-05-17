/* Characterization tests — auto-derived course knowledge graph (graph RAG).
   The graph is built from the static course data, so it is fully
   deterministic. We pin structural invariants + concept resolution. */
import { describe, it, expect } from 'vitest';
import {
  buildCourseGraph,
  assembleGraph,
  matchConcept,
  resolveRelated,
  type GraphSource
} from '@/features/assistant/services/assistant/courseGraph';
import type {
  ComputableFormula,
  GraphItem,
  ProblemItem,
  SubjectData,
  TheoryItem
} from '@/shared/types/domain';

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
    expect(g.outline.map((s) => s.subject)).toEqual([
      'physics',
      'chemistry',
      'biology'
    ]);
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

describe('assembleGraph — pure, fixture-injected (no real dataset)', () => {
  // A tiny hand-built GraphSource: this is the seam the SOLID pass added —
  // the graph algorithm is now testable in isolation, not only against the
  // entire course corpus.
  const cf: ComputableFormula = {
    id: 'f1',
    name: 'Закон A',
    nameEn: 'Law A',
    latex: 'a=b',
    description: '',
    descriptionEn: '',
    variables: [],
    topic: 'TopicA',
    subtopic: 'SubA',
    relatedFormulas: ['t1'],
    compute: () => 0,
    resultVar: 'a'
  };
  const data: SubjectData = {
    id: 'physics',
    name: 'Фізика',
    nameEn: 'Physics',
    icon: '⚛️',
    color: 'c',
    topics: [
      {
        id: 'topicA',
        name: 'TopicA',
        nameEn: 'Topic A',
        subtopics: [
          { id: 'subA', name: 'SubA', nameEn: 'Sub A', formulas: [cf] }
        ]
      }
    ]
  };
  const formulaItem: GraphItem = {
    ...cf,
    type: 'formula',
    subject: 'physics'
  };
  const t1: TheoryItem = {
    id: 't1',
    name: 'Стаття',
    nameEn: 'Article',
    subject: 'physics',
    difficulty: 1,
    topic: 'TopicA',
    description: '',
    descriptionEn: '',
    content: '',
    contentEn: ''
  };
  const p1: ProblemItem = {
    id: 'p1',
    name: 'Задача',
    nameEn: 'Problem',
    subject: 'physics',
    topic: 'SubA',
    difficulty: 1,
    description: '',
    descriptionEn: '',
    steps: [],
    answer: '',
    answerEn: '',
    relatedFormula: 'f1'
  };
  const source: GraphSource = {
    subjects: [{ key: 'physics', data, formulas: [formulaItem] }],
    theory: [t1],
    problems: [p1]
  };
  const g = assembleGraph(source);

  it('indexes exactly the injected items by id', () => {
    expect(Object.keys(g.byId).sort()).toEqual(['f1', 'p1', 't1']);
  });

  it('derives undirected edges from the data cross-links only', () => {
    expect([...g.edges.f1].sort()).toEqual(['p1', 't1']); // relatedFormulas + problem.relatedFormula
    expect([...g.edges.t1]).toEqual(['f1']);
    expect([...g.edges.p1]).toEqual(['f1']);
  });

  it('makes topic + subtopic names concepts that own their items', () => {
    const topic = g.concepts.find((c) => c.label === 'TopicA');
    const sub = g.concepts.find((c) => c.label === 'SubA');
    expect(topic?.itemIds.sort()).toEqual(['f1', 't1']); // subtopic formula + theory topic-attach
    expect(sub?.itemIds.sort()).toEqual(['f1', 'p1']); // subtopic formula + problem topic-attach
  });

  it('projects the per-subject outline', () => {
    expect(g.outline).toEqual([
      {
        subject: 'physics',
        label: 'Фізика',
        labelEn: 'Physics',
        topics: [
          {
            name: 'TopicA',
            nameEn: 'Topic A',
            subtopics: [{ name: 'SubA', nameEn: 'Sub A' }]
          }
        ]
      }
    ]);
  });

  it('is pure — a fresh call yields an equivalent but distinct graph', () => {
    const g2 = assembleGraph(source);
    expect(g2).not.toBe(g);
    expect(Object.keys(g2.byId).sort()).toEqual(['f1', 'p1', 't1']);
  });
});

describe('matchConcept', () => {
  it('resolves an exact topic name to its concept', () => {
    const c = matchConcept('Механіка');
    expect(c).toBeTruthy();
    expect(c!.label).toBe('Механіка');
    expect(c!.subject).toBe('physics');
    expect(c!.itemIds.length).toBeGreaterThan(0);
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
    const ranks = related.map((r) => rank[r.type] ?? 3);
    expect(ranks).toEqual([...ranks].sort((x, y) => x - y));
  });

  it('returns [] for a null/empty concept', () => {
    expect(resolveRelated(null)).toEqual([]);
    expect(
      resolveRelated({
        label: '',
        labelEn: '',
        subject: 'physics',
        keys: [],
        itemIds: []
      })
    ).toEqual([]);
  });
});
