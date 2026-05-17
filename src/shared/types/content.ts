/* ============================================
   Course content — the data shapes for the material the platform teaches:
   subjects, formulas, theory articles and worked problems.

   Derived from the actual course data files under features. The
   discriminated `type` field used by the knowledge graph lives in graph.ts;
   this module is content-only and depends on nothing else.
   ============================================ */

/** The three natural-science subjects the platform teaches. */
export type Subject = 'physics' | 'chemistry' | 'biology';

/** Content kinds inside the knowledge graph (discriminator). */
export type ContentType = 'formula' | 'theory' | 'problem';

/** One variable of a formula (input or computed result). */
export interface FormulaVariable {
  symbol: string;
  name: string;
  nameEn: string;
  unit: string;
  type: 'input' | 'result';
  defaultValue?: number;
}

/**
 * The pure, serializable shape of a formula: identity, presentation and
 * cross-links. This is all a *display* consumer (search, the knowledge
 * graph, recommendations, the formula card) ever needs — it deliberately
 * carries no executable member, so those modules do not depend on the
 * calculator contract (Interface Segregation).
 */
export interface FormulaMeta {
  id: string;
  name: string;
  nameEn: string;
  latex: string;
  description: string;
  descriptionEn: string;
  variables: FormulaVariable[];
  topic: string;
  subtopic: string;
  /** Cross-links that become knowledge-graph edges. */
  derivedFormulas?: string[];
  relatedFormulas?: string[];
  /** Stamped on by getAllFormulas()/the graph builder. */
  subject?: Subject;
}

/**
 * A formula plus its interactive calculator contract. Only the calculator
 * feature (and the catalog datasets that define `compute`) depend on this
 * fatter shape; every other consumer narrows to {@link FormulaMeta}.
 */
export interface ComputableFormula extends FormulaMeta {
  /**
   * Pure calculator function. Most formulas return a single number; a few
   * (e.g. Hardy-Weinberg, dihybrid cross) return several labelled results.
   */
  compute: (values: Record<string, number>) => number | Record<string, number>;
  resultVar: string;
  /** True when `compute` returns several labelled results instead of one. */
  multiResult?: boolean;
}

/**
 * @deprecated Use {@link FormulaMeta} for display or {@link ComputableFormula}
 * where the calculator contract is required. Retained as a non-breaking alias
 * so the catalog datasets and legacy imports keep compiling (same
 * compat-shim approach as the `domain.ts` barrel).
 */
export type Formula = ComputableFormula;

export interface Subtopic {
  id: string;
  name: string;
  nameEn: string;
  formulas: ComputableFormula[];
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
