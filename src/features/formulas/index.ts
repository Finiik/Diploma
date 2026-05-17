/* ============================================
   formulas — public API

   Cross-feature consumers import from '@/features/formulas'.
   Intra-feature code keeps concrete '@/features/formulas/...' paths.
   ============================================ */

// Aggregated, subject-tagged catalog API.
export {
  getAllFormulas,
  findFormulaById,
  findFormulasByIds,
  getSubjectData,
  type SubjectFormula
} from './lib/formulas';

// Raw per-subject datasets (consumed by search & the assistant).
export {
  physicsData,
  getAllFormulas as getAllPhysicsFormulas,
  getFormulaById as getPhysicsFormulaById
} from './data/physics';
export {
  chemistryData,
  getAllFormulas as getAllChemistryFormulas,
  getFormulaById as getChemistryFormulaById
} from './data/chemistry';
export {
  biologyData,
  getAllFormulas as getAllBiologyFormulas,
  getFormulaById as getBiologyFormulaById
} from './data/biology';

export { default as FormulaCard } from './components/FormulaCard/FormulaCard';

// Routed pages.
export { default as Subject } from './pages/Subject/Subject';
export { default as FormulaDetail } from './pages/FormulaDetail/FormulaDetail';
