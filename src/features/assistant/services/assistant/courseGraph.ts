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
  getAllFormulas,
  getAllChemFormulas,
  getAllBioFormulas
} from './subjects';
import { normalizeConcept, conceptCore, similarity } from './text';
import type {
  Concept,
  CourseGraph,
  GraphItem,
  Subject,
  SubjectData
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

let _graph: CourseGraph | null = null;
export function buildCourseGraph(): CourseGraph {
  if (_graph) return _graph;

  const subjects: { key: Subject; data: SubjectData; list: GraphItem[] }[] = [
    {
      key: 'physics',
      data: physicsData,
      list: getAllFormulas().map((f) => ({
        ...f,
        type: 'formula' as const,
        subject: 'physics' as const
      }))
    },
    {
      key: 'chemistry',
      data: chemistryData,
      list: getAllChemFormulas().map((f) => ({
        ...f,
        type: 'formula' as const,
        subject: 'chemistry' as const
      }))
    },
    {
      key: 'biology',
      data: biologyData,
      list: getAllBioFormulas().map((f) => ({
        ...f,
        type: 'formula' as const,
        subject: 'biology' as const
      }))
    }
  ];

  // 1. Flat index of every platform item by id.
  const byId: Record<string, GraphItem> = {};
  subjects.forEach(({ list }) =>
    list.forEach((f) => {
      byId[f.id] = f;
    })
  );
  theoryData.forEach((t) => {
    byId[t.id] = { ...t, type: 'theory' as const };
  });
  problemsData.forEach((p) => {
    byId[p.id] = { ...p, type: 'problem' as const };
  });

  // 2. Undirected relationship edges from the data's own cross-links.
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

  // 3. Concept index: every topic and subtopic name (uk + en) is a concept
  //    that owns the items living under it. Theory/problems attach to the
  //    concept whose label matches their declared topic.
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
  subjects.forEach(({ key, data }) => {
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
  [...theoryData, ...problemsData].forEach((item) => {
    const c = conceptByLabel[normalizeConcept(item.topic || '')];
    if (c) c.itemIds.add(item.id);
  });
  const finalConcepts: Concept[] = concepts.map((c) => ({
    label: c.label,
    labelEn: c.labelEn,
    subject: c.subject,
    keys: [c.label, c.labelEn].filter(Boolean).map(normalizeConcept),
    itemIds: [...c.itemIds]
  }));

  // 4. Per-subject topic → subtopic outline for the model prompt.
  const outline = subjects.map(({ key, data }) => ({
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

  _graph = { byId, edges, concepts: finalConcepts, outline };
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
  if (core.split(' ').filter(Boolean).length > 4) return null;

  let best: { c: Concept; s: number } | null = null;
  for (const c of concepts) {
    for (const k of c.keys) {
      const s = Math.max(similarity(core, k), similarity(raw, k));
      if (s >= 0.84 && (!best || s > best.s)) best = { c, s };
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
    .slice(0, 6);
}
