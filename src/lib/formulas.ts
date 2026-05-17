/* ============================================
   Cross-subject formula access
   The one place that merges physics + chemistry + biology catalogs.
   ============================================ */

import { getAllFormulas as getPhysFormulas } from '@/data/physics';
import { getAllFormulas as getChemFormulas } from '@/data/chemistry';
import { getAllFormulas as getBioFormulas } from '@/data/biology';
import type { Formula, Subject } from '@/shared/types/domain';

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
