/* ============================================
   Core domain model — the single source of truth for the data shapes the
   platform manipulates: course content, the auto-derived knowledge graph,
   the assistant responder chain, search, and recommendations.

   These types are derived from the actual course data files and the
   services that consume them. They are intentionally precise about the
   discriminated `type` field on graph items, since the assistant and
   fallback branch on it.
   ============================================ */

/** The three natural-science subjects the platform teaches. */
export type Subject = 'physics' | 'chemistry' | 'biology';

/** Content kinds inside the knowledge graph (discriminator). */
export type ContentType = 'formula' | 'theory' | 'problem';

// --- Course content -------------------------------------------------------

/** One variable of a formula (input or computed result). */
export interface FormulaVariable {
  symbol: string;
  name: string;
  nameEn: string;
  unit: string;
  type: 'input' | 'result';
  defaultValue?: number;
}

/** A single formula with its interactive calculator metadata. */
export interface Formula {
  id: string;
  name: string;
  nameEn: string;
  latex: string;
  description: string;
  descriptionEn: string;
  variables: FormulaVariable[];
  /** Pure calculator function: input symbol→value map → result value. */
  compute: (values: Record<string, number>) => number;
  resultVar: string;
  topic: string;
  subtopic: string;
  /** Cross-links that become knowledge-graph edges. */
  derivedFormulas?: string[];
  relatedFormulas?: string[];
  /** Stamped on by getAllFormulas()/the graph builder. */
  subject?: Subject;
}

export interface Subtopic {
  id: string;
  name: string;
  nameEn: string;
  formulas: Formula[];
}

export interface Topic {
  id: string;
  name: string;
  nameEn: string;
  subtopics: Subtopic[];
}

/** A whole subject catalog (physicsData / chemistryData / biologyData). */
export interface SubjectData {
  id: Subject;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  topics: Topic[];
}

/** A theory article. */
export interface TheoryItem {
  id: string;
  name: string;
  nameEn: string;
  subject: Subject;
  difficulty: number;
  topic: string;
  description: string;
  descriptionEn: string;
  content: string;
  contentEn: string;
  relatedFormulas?: string[];
}

export interface ProblemStep {
  text: string;
  textEn: string;
}

/** A worked problem with step-by-step solution. */
export interface ProblemItem {
  id: string;
  name: string;
  nameEn: string;
  subject: Subject;
  topic: string;
  difficulty: number;
  description: string;
  descriptionEn: string;
  steps: ProblemStep[];
  answer: string;
  answerEn: string;
  relatedFormula?: string;
}

// --- Knowledge graph (auto-derived, graph/keyword RAG) --------------------

/** A content item indexed in the graph, tagged with its discriminant. */
export type GraphItem =
  | (Formula & { type: 'formula'; subject: Subject })
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

// --- Search ---------------------------------------------------------------

/** A Fuse.js hit: a graph item plus the relevance score/match metadata. */
export type SearchHit = GraphItem & {
  /** Fuse score (0 = perfect). Undefined when scoring is unavailable. */
  score?: number;
  matches?: readonly unknown[];
};

// --- Assistant responder chain -------------------------------------------

/** Navigation link chip surfaced under an assistant answer. */
export interface NavLink {
  type: 'formula' | 'theory' | 'problems' | 'subject';
  id: string;
  label: string;
}

/**
 * What a responder returns: only `text` is required; finalizeResponse()
 * fills the rest. `null` means "not mine, try the next responder".
 */
export interface ResponderResult {
  text: string;
  links?: NavLink[];
  suggestions?: string[];
}

/** The normalized, fully-populated assistant response contract. */
export interface AssistantResponse {
  text: string;
  links: NavLink[];
  suggestions: string[];
}

/** One link in the chain-of-responsibility. */
export interface Responder {
  id: string;
  run: (
    query: string,
    isUk: boolean
  ) => ResponderResult | null | Promise<ResponderResult | null>;
}

// --- Recommendations ------------------------------------------------------

/** A user→item interaction tally used by the collaborative filter. */
export interface Interaction {
  views?: number;
  calculations?: number;
  bookmarks?: number;
}

/** userId → (formulaId → interaction). */
export type InteractionsByUser = Record<string, Record<string, Interaction>>;

/** A recommended formula (carries its stamped subject). */
export type Recommendation = Formula & { subject: Subject };
