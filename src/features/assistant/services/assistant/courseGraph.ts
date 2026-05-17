/* ============================================
   Auto-derived course knowledge graph

   There is NO hardcoded concept dictionary. The platform's own topics and
   subtopics ARE the concepts; the data's own cross-links
   (derivedFormulas / relatedFormulas / relatedFormula) ARE the edges. The AI
   then explains a concept by synthesizing the materials these edges connect.
   Adding/curating a concept = editing the course data, nothing here.
   ============================================ */

import { theoryData } from '@/features/theory';
import { problemsData } from '@/features/problems';
import {
  physicsData,
  chemistryData,
  biologyData,
  getAllPhysicsFormulas as getAllFormulas,
  getAllChemistryFormulas as getAllChemFormulas,
  getAllBiologyFormulas as getAllBioFormulas
} from '@/features/formulas';
import { normalizeConcept, conceptCore, similarity } from './text';
import {
  FUZZY_MATCH_MAX_WORDS,
  CONCEPT_MATCH_MIN_SIMILARITY,
  RELATED_ITEMS_LIMIT
} from './constants';
import type {
  Concept,
  CourseGraph,
  GraphItem,
  ProblemItem,
  Subject,
  SubjectData,
  TheoryItem
} from '@/shared/types/domain';

// Concept under construction: itemIds is a Set while we accumulate, then
// frozen to the array `Concept` declares once the graph is finalized.
interface ConceptBuilder {
  label: string;
  labelEn: string;
  subject: Subject;
  keys?: string[];
  itemIds: Set<string>;
}

/**
 * The raw inputs the graph is assembled from, decoupled from where they
 * come from. `buildCourseGraph()` wires the real `@/features/*` datasets;
 * a test can pass a small fixture (Dependency Inversion — `assembleGraph`
 * is pure and no longer hard-bound to the whole course corpus).
 */
export interface GraphSubjectSource {
  key: Subject;
  data: SubjectData;
  /** This subject's formulas, already tagged `type:'formula'` + subject. */
  formulas: GraphItem[];
}
export interface GraphSource {
  subjects: GraphSubjectSource[];
  theory: TheoryItem[];
  problems: ProblemItem[];
}

// 1. Flat index of every platform item by id (formulas, then theory, then
//    problems — insertion order preserved; ids are disjoint).
function indexById(source: GraphSource): Record<string, GraphItem> {
  const byId: Record<string, GraphItem> = {};
  source.subjects.forEach(({ formulas }) =>
    formulas.forEach((f) => {
      byId[f.id] = f;
    })
  );
  source.theory.forEach((t) => {
    byId[t.id] = { ...t, type: 'theory' as const };
  });
  source.problems.forEach((p) => {
    byId[p.id] = { ...p, type: 'problem' as const };
  });
  return byId;
}

// 2. Undirected relationship edges from the data's own cross-links.
function deriveEdges(
  byId: Record<string, GraphItem>
): Record<string, Set<string>> {
  const edges: Record<string, Set<string>> = {};
  const link = (a: string | undefined, b: string | undefined) => {
    if (!a || !b || a === b || !byId[a] || !byId[b]) return;
    (edges[a] = edges[a] || new Set()).add(b);
    (edges[b] = edges[b] || new Set()).add(a);
  };
  Object.values(byId).forEach((item) => {
    const derived = item.type === 'formula' ? item.derivedFormulas : undefined;
    const related = item.type !== 'problem' ? item.relatedFormulas : undefined;
    const relatedOne =
      item.type === 'problem' ? item.relatedFormula : undefined;
    (derived || []).forEach((id) => link(item.id, id));
    (related || []).forEach((id) => link(item.id, id));
    if (relatedOne) link(item.id, relatedOne);
  });
  return edges;
}

// 3. Concept index: every topic and subtopic name (uk + en) is a concept
//    that owns the items living under it. Theory/problems attach to the
//    concept whose label matches their declared topic.
function buildConcepts(source: GraphSource): Concept[] {
  const concepts: ConceptBuilder[] = [];
  const addConcept = (
    label: string,
    labelEn: string | undefined,
    subject: Subject
  ): ConceptBuilder => {
    const c: ConceptBuilder = {
      label,
      labelEn: labelEn || label,
      subject,
      itemIds: new Set()
    };
    concepts.push(c);
    return c;
  };
  source.subjects.forEach(({ key, data }) => {
    (data.topics || []).forEach((topic) => {
      const tc = addConcept(topic.name, topic.nameEn, key);
      (topic.subtopics || []).forEach((sub) => {
        const sc = addConcept(sub.name, sub.nameEn, key);
        (sub.formulas || []).forEach((f) => {
          tc.itemIds.add(f.id);
          sc.itemIds.add(f.id);
        });
      });
    });
  });
  const conceptByLabel: Record<string, ConceptBuilder> = {};
  concepts.forEach((c) => {
    conceptByLabel[normalizeConcept(c.label)] = c;
  });
  [...source.theory, ...source.problems].forEach((item) => {
    const c = conceptByLabel[normalizeConcept(item.topic || '')];
    if (c) c.itemIds.add(item.id);
  });
  return concepts.map((c) => ({
    label: c.label,
    labelEn: c.labelEn,
    subject: c.subject,
    keys: [c.label, c.labelEn].filter(Boolean).map(normalizeConcept),
    itemIds: [...c.itemIds]
  }));
}

// 4. Per-subject topic → subtopic outline for the model prompt.
function projectOutline(source: GraphSource): CourseGraph['outline'] {
  return source.subjects.map(({ key, data }) => ({
    subject: key,
    label: data.name,
    labelEn: data.nameEn,
    topics: (data.topics || []).map((t) => ({
      name: t.name,
      nameEn: t.nameEn,
      subtopics: (t.subtopics || []).map((s) => ({
        name: s.name,
        nameEn: s.nameEn
      }))
    }))
  }));
}

/**
 * Pure: build the whole graph from an injected source. No module-level
 * data, no memoization — unit-testable on a fixture in isolation.
 */
export function assembleGraph(source: GraphSource): CourseGraph {
  const byId = indexById(source);
  return {
    byId,
    edges: deriveEdges(byId),
    concepts: buildConcepts(source),
    outline: projectOutline(source)
  };
}

/** Adapter: the real course datasets shaped into a {@link GraphSource}. */
function realGraphSource(): GraphSource {
  const subject = (
    key: Subject,
    data: SubjectData,
    list: GraphItem[]
  ): GraphSubjectSource => ({ key, data, formulas: list });
  return {
    subjects: [
      subject(
        'physics',
        physicsData,
        getAllFormulas().map((f) => ({
          ...f,
          type: 'formula' as const,
          subject: 'physics' as const
        }))
      ),
      subject(
        'chemistry',
        chemistryData,
        getAllChemFormulas().map((f) => ({
          ...f,
          type: 'formula' as const,
          subject: 'chemistry' as const
        }))
      ),
      subject(
        'biology',
        biologyData,
        getAllBioFormulas().map((f) => ({
          ...f,
          type: 'formula' as const,
          subject: 'biology' as const
        }))
      )
    ],
    theory: theoryData,
    problems: problemsData
  };
}

// Thin memoizing wirer: assemble once from the real datasets, then cache.
let _graph: CourseGraph | null = null;
export function buildCourseGraph(): CourseGraph {
  if (_graph) return _graph;
  _graph = assembleGraph(realGraphSource());
  return _graph;
}

// Resolve a query to a course concept (a topic/subtopic auto-extracted from
// the data). Exact normalized-key match wins; otherwise a WHOLE-string fuzzy
// match (short queries only) tolerates typos/inflections. Whole-string — not
// substring — so a specific lookup like "сила тяжіння" isn't swallowed by a
// broad topic concept.
export function matchConcept(query: string): Concept | null {
  const raw = normalizeConcept(query.replace(/[?!.]+$/, ''));
  const core = conceptCore(query);
  const { concepts } = buildCourseGraph();

  for (const c of concepts) {
    for (const k of c.keys) {
      if (core === k || raw === k) return c;
    }
  }

  // Fuzzy whole-string match, short queries only, to avoid hijacking longer
  // specific questions.
  if (core.split(' ').filter(Boolean).length > FUZZY_MATCH_MAX_WORDS)
    return null;

  let best: { c: Concept; s: number } | null = null;
  for (const c of concepts) {
    for (const k of c.keys) {
      const s = Math.max(similarity(core, k), similarity(raw, k));
      if (s >= CONCEPT_MATCH_MIN_SIMILARITY && (!best || s > best.s))
        best = { c, s };
    }
  }
  return best ? best.c : null;
}

// Resolve a matched concept to its connected platform materials: the items
// that live under that topic/subtopic, expanded one hop along the data's own
// relationship edges. Capped and ordered theory → formula → problem so the
// AI gets an explainer article first when one exists.
export function resolveRelated(concept: Concept | null): GraphItem[] {
  if (!concept?.itemIds?.length) return [];
  const { byId, edges } = buildCourseGraph();
  const ids = new Set(concept.itemIds);
  concept.itemIds.forEach((id) => {
    const ns = edges[id];
    if (ns) ns.forEach((n) => ids.add(n));
  });
  const order: Record<GraphItem['type'], number> = {
    theory: 0,
    formula: 1,
    problem: 2
  };
  return [...ids]
    .map((id) => byId[id])
    .filter((item): item is GraphItem => Boolean(item))
    .sort((a, b) => (order[a.type] ?? 3) - (order[b.type] ?? 3))
    .slice(0, RELATED_ITEMS_LIMIT);
}
