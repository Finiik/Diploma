/* ============================================
   Knowledge graph — the auto-derived graph/keyword RAG structure built from
   course content. Concepts are course topics/subtopics extracted from the
   data; items are content tagged with a discriminant.
   ============================================ */

import type { FormulaMeta, ProblemItem, Subject, TheoryItem } from './content';

/**
 * A content item indexed in the graph, tagged with its discriminant. The
 * formula arm is {@link FormulaMeta}, not the computable shape: the graph /
 * RAG / search path only ever displays formulas, never runs `compute`, so
 * `GraphItem` (and thus `SearchHit`, `CourseGraph.byId`) stays serializable.
 */
export type GraphItem =
  | (FormulaMeta & { type: 'formula'; subject: Subject })
  | (TheoryItem & { type: 'theory' })
  | (ProblemItem & { type: 'problem' });

/**
 * A concept = a course topic/subtopic auto-extracted from the data. It owns
 * the items that live under it; `keys` are its normalized uk+en labels.
 */
export interface Concept {
  label: string;
  labelEn: string;
  subject: Subject;
  /** Normalized match keys; populated by buildCourseGraph(). */
  keys: string[];
  /** Ids of items that live under this concept. */
  itemIds: string[];
}

export interface OutlineSubtopic {
  name: string;
  nameEn: string;
}

export interface OutlineTopic {
  name: string;
  nameEn: string;
  subtopics: OutlineSubtopic[];
}

/** Per-subject topic→subtopic outline fed to the model prompt. */
export interface SubjectOutline {
  subject: Subject;
  label: string;
  labelEn: string;
  topics: OutlineTopic[];
}

/** The memoized course knowledge graph. */
export interface CourseGraph {
  byId: Record<string, GraphItem>;
  edges: Record<string, Set<string>>;
  concepts: Concept[];
  outline: SubjectOutline[];
}
