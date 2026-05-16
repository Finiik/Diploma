/* ============================================
   Subject helpers — formula catalogs, labels, localization
   ============================================ */

import { physicsData, getAllFormulas } from '../../data/physics';
import { chemistryData, getAllFormulas as getAllChemFormulas } from '../../data/chemistry';
import { biologyData, getAllFormulas as getAllBioFormulas } from '../../data/biology';

export {
  physicsData, chemistryData, biologyData,
  getAllFormulas, getAllChemFormulas, getAllBioFormulas
};

export function getAllFormulasFlat() {
  return [
    ...getAllFormulas(),
    ...getAllChemFormulas(),
    ...getAllBioFormulas()
  ];
}

// Single source for the "subject → its formula list" lookup that used to be
// inlined as an object literal in four places.
export function formulasBySubject(subject) {
  return {
    physics: getAllFormulas(),
    chemistry: getAllChemFormulas(),
    biology: getAllBioFormulas()
  }[subject] || [];
}

export function getSubjectEmoji(subject) {
  return { physics: '⚛️', chemistry: '🧪', biology: '🧬' }[subject] || '📚';
}

export function getSubjectLabel(subject, isUk) {
  return {
    physics: isUk ? 'Фізика' : 'Physics',
    chemistry: isUk ? 'Хімія' : 'Chemistry',
    biology: isUk ? 'Біологія' : 'Biology'
  }[subject] || subject;
}

// The repeated `isUk ? x.name : (x.nameEn || x.name)` pick, in one place.
export function localizedName(item, isUk) {
  return isUk ? item.name : (item.nameEn || item.name);
}
