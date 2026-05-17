/* ============================================
   Cross-subject formula access
   The one place that merges physics + chemistry + biology catalogs.
   ============================================ */

import {
  physicsData,
  getAllFormulas as getPhysFormulas
} from '@/features/formulas/data/physics';
import {
  chemistryData,
  getAllFormulas as getChemFormulas
} from '@/features/formulas/data/chemistry';
import {
  biologyData,
  getAllFormulas as getBioFormulas
} from '@/features/formulas/data/biology';
import { SUBJECTS } from '@/shared/lib/subjects';
import type {
  ComputableFormula,
  Subject,
  SubjectData,
  Subtopic,
  Topic
} from '@/shared/types/domain';

/**
 * A formula guaranteed to carry its `subject`. The per-subject data modules
 * always tag formulas (`{ ...formula, subject: 'physics' }`), so the optional
 * `FormulaMeta.subject` is in fact always present once aggregated here. It
 * stays {@link ComputableFormula} because the catalog feeds the calculator
 * (FormulaDetail → Calculator) downstream of these accessors.
 */
export type SubjectFormula = ComputableFormula & { subject: Subject };

/**
 * Subject → its per-dataset formula accessor. `Record<Subject,…>`, so an
 * added subject without an entry is a compile error (Open/Closed).
 */
const SUBJECT_FORMULAS: Record<Subject, () => ComputableFormula[]> = {
  physics: getPhysFormulas,
  chemistry: getChemFormulas,
  biology: getBioFormulas
};

/*
 * The catalog is static for the app's lifetime, so it is derived once and
 * cached. Previously every call re-spread ~78 formulas; the recommender
 * alone hits getAllFormulas()/findFormulasByIds several times per Home
 * render, so this was pure repeated allocation on a hot path. The cache is
 * treated as immutable (no consumer mutates a formula); getAllFormulas()
 * still hands out a fresh shallow copy so the "fresh array" contract holds.
 */
let catalogCache: SubjectFormula[] | null = null;
let byIdCache: Map<string, SubjectFormula> | null = null;

/**
 * The cached tagged catalog in canonical `SUBJECTS` order. The spread
 * *constructs* the tagged shape, so this needs no `as SubjectFormula[]`
 * cast — the invariant is proven by the type, not asserted.
 */
function catalog(): SubjectFormula[] {
  return (catalogCache ??= SUBJECTS.flatMap((s) =>
    SUBJECT_FORMULAS[s]().map((f) => ({ ...f, subject: s }))
  ));
}

/** id → formula, built once from {@link catalog} for O(1)/O(ids) lookup. */
function catalogById(): Map<string, SubjectFormula> {
  return (byIdCache ??= new Map(catalog().map((f) => [f.id, f])));
}

/**
 * Every formula across all subjects, each tagged with its `subject`. A
 * fresh shallow copy of the cached catalog (callers must not mutate the
 * shared one; `no shared mutable state` is pinned by formulas.test.ts).
 */
export function getAllFormulas(): SubjectFormula[] {
  return catalog().slice();
}

/** Single source of the subject → full dataset mapping. */
const SUBJECT_DATA: Record<Subject, SubjectData> = {
  physics: physicsData,
  chemistry: chemistryData,
  biology: biologyData
};

/**
 * The full dataset (topics/subtopics) for a subject, or `undefined` for an
 * unknown subject id. Replaces the subject→SubjectData maps that were
 * previously duplicated across the Subject and FormulaDetail pages.
 */
export function getSubjectData(
  subject: string | undefined
): SubjectData | undefined {
  if (!subject) return undefined;
  return SUBJECT_DATA[subject as Subject];
}

/** A subtopic whose formulas are guaranteed subject-tagged. */
export interface SubjectSubtopic extends Omit<Subtopic, 'formulas'> {
  formulas: SubjectFormula[];
}
/** A topic whose formulas are guaranteed subject-tagged. */
export interface SubjectTopic extends Omit<Topic, 'subtopics'> {
  subtopics: SubjectSubtopic[];
}

/**
 * A subject's topic tree with every formula already tagged with its
 * `subject`. This is the one place that owns subject-tagging, so pages
 * (e.g. Subject) no longer spread `{ ...formula, subject }` themselves.
 *
 * Memoized per subject: the tree is static, but the `Subject` page calls
 * this every render. Caching also returns a *stable reference*, so any
 * downstream `React.memo` on the tree actually holds.
 */
const subjectTopicsCache = new Map<Subject, SubjectTopic[]>();

export function getSubjectTopics(
  subject: string | undefined
): SubjectTopic[] | undefined {
  const data = getSubjectData(subject);
  if (!data) return undefined;
  const cached = subjectTopicsCache.get(data.id);
  if (cached) return cached;
  const built: SubjectTopic[] = data.topics.map((topic) => ({
    ...topic,
    subtopics: topic.subtopics.map((subtopic) => ({
      ...subtopic,
      formulas: subtopic.formulas.map((formula) => ({
        ...formula,
        subject: data.id
      }))
    }))
  }));
  subjectTopicsCache.set(data.id, built);
  return built;
}

/** Formula matching `id` across all subjects, or undefined. O(1). */
export function findFormulaById(id: string): SubjectFormula | undefined {
  return catalogById().get(id);
}

/**
 * Resolve a list of ids to formulas, preserving order (and duplicates) and
 * dropping ids that don't resolve to a known formula. O(ids), not O(ids·n).
 */
export function findFormulasByIds(ids: string[]): SubjectFormula[] {
  const byId = catalogById();
  return ids
    .map((id) => byId.get(id))
    .filter((f): f is SubjectFormula => f !== undefined);
}
