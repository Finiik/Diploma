import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ComputableFormula } from '@/shared/types/domain';
import { useLocalized } from '@/shared/hooks/useLocalized';
import {
  runCalculation,
  type CalcValues,
  type CalcResult
} from '@/features/calculator/lib/calculator';

/**
 * Owns the calculator's field/result/error state and bridges the pure
 * `runCalculation` to localized error messages. The component stays
 * presentational.
 */
export function useCalculator(formula: ComputableFormula) {
  const { t } = useTranslation();
  const tr = useLocalized();

  const inputVars = formula.variables.filter((v) => v.type === 'input');
  const resultVar = formula.variables.find((v) => v.type === 'result');

  const [values, setValues] = useState<CalcValues>(() => {
    const init: CalcValues = {};
    for (const v of inputVars) {
      init[v.symbol] = v.defaultValue !== undefined ? v.defaultValue : '';
    }
    return init;
  });
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState('');

  const setField = useCallback((symbol: string, value: string) => {
    setValues((prev) => ({ ...prev, [symbol]: value }));
    setError('');
  }, []);

  const calculate = useCallback(() => {
    const outcome = runCalculation(formula, values);
    if (outcome.ok) {
      setResult(outcome.result);
      setError('');
    } else if (outcome.reason === 'invalid') {
      setError(
        t('formula.invalid_value', { name: tr(outcome.variable, 'name') })
      );
    } else {
      setError(t('formula.calc_error'));
    }
  }, [formula, values, t, tr]);

  return { values, result, error, setField, calculate, inputVars, resultVar };
}
