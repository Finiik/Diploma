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
import type { Formula, Subject } from '@/shared/types/domain';

export {
  physicsData,
  chemistryData,
  biologyData,
  getAllFormulas,
  getAllChemFormulas,
  getAllBioFormulas
};

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
