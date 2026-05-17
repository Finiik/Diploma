/* ============================================
   Subject helpers — formula catalogs, labels, localization
   ============================================ */

import {
  physicsData,
  chemistryData,
  biologyData,
  getAllPhysicsFormulas as getAllFormulas,
  getAllChemistryFormulas as getAllChemFormulas,
  getAllBiologyFormulas as getAllBioFormulas
} from '@/features/formulas';
import { theoryData } from '@/features/theory';
import { problemsData } from '@/features/problems';
import type { Formula, Subject } from '@/shared/types/domain';

/** Platform-wide content tallies. */
export interface PlatformStats {
  /** Total formulas across all subjects. */
  formulas: number;
  theory: number;
  problems: number;
  /** Per-subject formula counts (`Record<Subject,…>` — exhaustive). */
  byKind: Record<Subject, number>;
}

/**
 * The single source of truth for "how much content the platform has".
 * `greeting`/`help`/`list` each recomputed these counts a *different* way
 * (flat concat vs. three separate getters); now they all read this, so
 * the total can't diverge from the per-subject breakdown.
 */
export function platformStats(): PlatformStats {
  const byKind: Record<Subject, number> = {
    physics: getAllFormulas().length,
    chemistry: getAllChemFormulas().length,
    biology: getAllBioFormulas().length
  };
  return {
    formulas: byKind.physics + byKind.chemistry + byKind.biology,
    theory: theoryData.length,
    problems: problemsData.length,
    byKind
  };
}

export function getAllFormulasFlat(): Formula[] {
  return [...getAllFormulas(), ...getAllChemFormulas(), ...getAllBioFormulas()];
}

// Single source for the "subject → its formula list" lookup that used to be
// inlined as an object literal in four places.
export function formulasBySubject(subject: Subject): Formula[] {
  return (
    {
      physics: getAllFormulas(),
      chemistry: getAllChemFormulas(),
      biology: getAllBioFormulas()
    }[subject] || []
  );
}

export { subjectIcon as getSubjectEmoji } from '@/shared/lib/subjectIcon';

export function getSubjectLabel(subject: Subject, isUk: boolean): string {
  return (
    {
      physics: isUk ? 'Фізика' : 'Physics',
      chemistry: isUk ? 'Хімія' : 'Chemistry',
      biology: isUk ? 'Біологія' : 'Biology'
    }[subject] || subject
  );
}

// The repeated `isUk ? x.name : (x.nameEn || x.name)` pick, in one place.
export function localizedName(
  item: { name: string; nameEn?: string },
  isUk: boolean
): string {
  return isUk ? item.name : item.nameEn || item.name;
}
