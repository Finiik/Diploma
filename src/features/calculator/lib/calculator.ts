/* ============================================
   Pure calculator domain logic (no React, no i18n)
   ============================================ */

import type { ComputableFormula, FormulaVariable } from '@/shared/types/domain';

/** Field values: numeric defaults or raw `<input>` strings. */
export type CalcValues = Record<string, string | number>;

/** `compute` returns either one number or several labelled results. */
export type CalcResult = number | Record<string, number>;

/** Discriminated outcome so the UI layer owns all messaging/i18n. */
export type CalcOutcome =
  | { ok: true; result: CalcResult }
  | { ok: false; reason: 'invalid'; variable: FormulaVariable }
  | { ok: false; reason: 'compute_error' };

/**
 * Parse + validate the input fields and run `formula.compute`. Returns which
 * variable failed (not a message) so the component can localize it.
 */
export function runCalculation(
  formula: ComputableFormula,
  values: CalcValues
): CalcOutcome {
  const inputVars = formula.variables.filter((v) => v.type === 'input');
  const numValues: Record<string, number> = {};

  for (const v of inputVars) {
    const n = parseFloat(String(values[v.symbol]));
    if (Number.isNaN(n)) return { ok: false, reason: 'invalid', variable: v };
    numValues[v.symbol] = n;
  }

  try {
    return { ok: true, result: formula.compute(numValues) };
  } catch {
    return { ok: false, reason: 'compute_error' };
  }
}

/** Trim trailing zeros; integers stay integers. */
export function formatResult(val: number): string {
  return Number.isInteger(val)
    ? val.toString()
    : val.toFixed(4).replace(/\.?0+$/, '');
}
