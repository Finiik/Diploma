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
import type { Formula, Subject, SubjectData } from '@/shared/types/domain';

/**
 * A formula guaranteed to carry its `subject`. The per-subject data modules
 * always tag formulas (`{ ...formula, subject: 'physics' }`), so the optional
 * `Formula.subject` is in fact always present once aggregated here.
 */
export type SubjectFormula = Formula & { subject: Subject };

/** Every formula across all subjects (each tagged with its `subject`). */
export function getAllFormulas(): SubjectFormula[] {
  return [
    ...getPhysFormulas(),
    ...getChemFormulas(),
    ...getBioFormulas()
  ] as SubjectFormula[];
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

/** First formula matching `id` across all subjects, or undefined. */
export function findFormulaById(id: string): SubjectFormula | undefined {
  return getAllFormulas().find((f) => f.id === id);
}

/**
 * Resolve a list of ids to formulas, preserving order and dropping ids that
 * don't resolve to a known formula.
 */
export function findFormulasByIds(ids: string[]): SubjectFormula[] {
  const all = getAllFormulas();
  return ids
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is SubjectFormula => f !== undefined);
}
