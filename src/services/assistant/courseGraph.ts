/* ============================================
   Auto-derived course knowledge graph

   There is NO hardcoded concept dictionary. The platform's own topics and
   subtopics ARE the concepts; the data's own cross-links
   (derivedFormulas / relatedFormulas / relatedFormula) ARE the edges. The AI
   then explains a concept by synthesizing the materials these edges connect.
   Adding/curating a concept = editing the course data, nothing here.
   ============================================ */

import { theoryData } from '../../data/theory';
import { problemsData } from '../../data/problems';
import {
  physicsData, chemistryData, biologyData,
  getAllFormulas, getAllChemFormulas, getAllBioFormulas
} from './subjects';
import { normalizeConcept, conceptCore, similarity } from './text';
import type { Concept } from '../../types/domain';

let _graph = null;
export function buildCourseGraph() {
  if (_graph) return _graph;

  const subjects = [
    { key: 'physics', data: physicsData, list: getAllFormulas() },
    { key: 'chemistry', data: chemistryData, list: getAllChemFormulas() },
    { key: 'biology', data: biologyData, list: getAllBioFormulas() }
  ];

  // 1. Flat index of every platform item by id.
  // TODO(Phase 4): tighten to Record<string, GraphItem> once the data layer
  // is typed (the union's per-variant cross-link fields need the data's
  // `subject` literals widened to the Subject type first).
  const byId: Record<string, any> = {};
  subjects.forEach(({ key, list }) =>
    list.forEach(f => { byId[f.id] = { ...f, type: 'formula', subject: f.subject || key }; })
  );
  theoryData.forEach(t => { byId[t.id] = { ...t, type: 'theory' }; });
  problemsData.forEach(p => { byId[p.id] = { ...p, type: 'problem' }; });

  // 2. Undirected relationship edges from the data's own cross-links.
  const edges: Record<string, Set<string>> = {};
  const link = (a, b) => {
    if (!a || !b || a === b || !byId[a] || !byId[b]) return;
    (edges[a] = edges[a] || new Set()).add(b);
    (edges[b] = edges[b] || new Set()).add(a);
  };
  Object.values(byId).forEach(item => {
    (item.derivedFormulas || []).forEach(id => link(item.id, id));
    (item.relatedFormulas || []).forEach(id => link(item.id, id));
    if (item.relatedFormula) link(item.id, item.relatedFormula);
  });

  // 3. Concept index: every topic and subtopic name (uk + en) is a concept
  //    that owns the items living under it. Theory/problems attach to the
  //    concept whose label matches their declared topic.
  const concepts = [];
  const addConcept = (label, labelEn, subject) => {
    const c = { label, labelEn: labelEn || label, subject, itemIds: new Set() };
    concepts.push(c);
    return c;
  };
  subjects.forEach(({ key, data }) => {
    (data.topics || []).forEach(topic => {
      const tc = addConcept(topic.name, topic.nameEn, key);
      (topic.subtopics || []).forEach(sub => {
        const sc = addConcept(sub.name, sub.nameEn, key);
        (sub.formulas || []).forEach(f => { tc.itemIds.add(f.id); sc.itemIds.add(f.id); });
      });
    });
  });
  const conceptByLabel = {};
  concepts.forEach(c => { conceptByLabel[normalizeConcept(c.label)] = c; });
  [...theoryData, ...problemsData].forEach(item => {
    const c = conceptByLabel[normalizeConcept(item.topic || '')];
    if (c) c.itemIds.add(item.id);
  });
  concepts.forEach(c => {
    c.keys = [c.label, c.labelEn].filter(Boolean).map(normalizeConcept);
    c.itemIds = [...c.itemIds];
  });

  // 4. Per-subject topic → subtopic outline for the model prompt.
  const outline = subjects.map(({ key, data }) => ({
    subject: key,
    label: data.name,
    labelEn: data.nameEn,
    topics: (data.topics || []).map(t => ({
      name: t.name,
      nameEn: t.nameEn,
      subtopics: (t.subtopics || []).map(s => ({ name: s.name, nameEn: s.nameEn }))
    }))
  }));

  _graph = { byId, edges, concepts, outline };
  return _graph;
}

// Resolve a query to a course concept (a topic/subtopic auto-extracted from
// the data). Exact normalized-key match wins; otherwise a WHOLE-string fuzzy
// match (short queries only) tolerates typos/inflections. Whole-string — not
// substring — so a specific lookup like "сила тяжіння" isn't swallowed by a
// broad topic concept.
export function matchConcept(query) {
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

  let best = null;
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
export function resolveRelated(concept: Concept | null) {
  if (!concept?.itemIds?.length) return [];
  const { byId, edges } = buildCourseGraph();
  const ids = new Set(concept.itemIds);
  concept.itemIds.forEach(id => {
    const ns = edges[id];
    if (ns) ns.forEach(n => ids.add(n));
  });
  const order = { theory: 0, formula: 1, problem: 2 };
  return [...ids]
    .map(id => byId[id])
    .filter(Boolean)
    .sort((a, b) => (order[a.type] ?? 3) - (order[b.type] ?? 3))
    .slice(0, 6);
}
