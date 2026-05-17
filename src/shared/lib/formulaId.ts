/** The subject prefixes formula ids carry (`phys_`, `chem_`, `bio_`). */
const FORMULA_ID_PREFIX = /^(phys_|chem_|bio_)/;

/** Strips the subject prefix from a formula id for display. Names the
    id-naming convention instead of burying the regex in JSX. */
export function stripFormulaIdPrefix(id: string): string {
  return id.replace(FORMULA_ID_PREFIX, '');
}
