/* Characterization tests — pure calculator domain logic.
   Pins runCalculation's outcome contract and formatResult's number
   formatting so the component decomposition can't silently change them. */
import { describe, it, expect } from 'vitest';
import { runCalculation, formatResult } from '@/lib/calculator';
import type { Formula, FormulaVariable } from '@/types/domain';

const v = (
  symbol: string,
  type: 'input' | 'result',
  extra: Partial<FormulaVariable> = {}
): FormulaVariable => ({
  symbol,
  name: symbol,
  nameEn: symbol,
  unit: 'u',
  type,
  ...extra
});

const makeFormula = (
  compute: Formula['compute'],
  variables: FormulaVariable[],
  multiResult = false
): Formula => ({
  id: 'f',
  name: 'F',
  nameEn: 'F',
  latex: 'x',
  description: '',
  descriptionEn: '',
  variables,
  compute,
  resultVar: 'r',
  multiResult,
  topic: 't',
  subtopic: 's'
});

describe('runCalculation', () => {
  it('returns ok with the computed number for valid inputs', () => {
    const f = makeFormula(
      (vals) => vals.a + vals.b,
      [v('a', 'input'), v('b', 'input'), v('r', 'result')]
    );
    expect(runCalculation(f, { a: '2', b: '3' })).toEqual({
      ok: true,
      result: 5
    });
  });

  it('flags the first non-numeric input variable', () => {
    const f = makeFormula((vals) => vals.a, [v('a', 'input'), v('b', 'input')]);
    const out = runCalculation(f, { a: '', b: '4' });
    expect(out.ok).toBe(false);
    if (out.ok || out.reason !== 'invalid') {
      throw new Error('expected an invalid outcome');
    }
    expect(out.variable.symbol).toBe('a');
  });

  it('ignores result-type variables during validation', () => {
    const f = makeFormula(() => 1, [v('a', 'input'), v('r', 'result')]);
    expect(runCalculation(f, { a: '1' })).toEqual({ ok: true, result: 1 });
  });

  it('reports compute_error when compute throws', () => {
    const f = makeFormula(() => {
      throw new Error('boom');
    }, [v('a', 'input')]);
    expect(runCalculation(f, { a: '1' })).toEqual({
      ok: false,
      reason: 'compute_error'
    });
  });

  it('passes multi-result objects through unchanged', () => {
    const f = makeFormula(() => ({ x: 1, y: 2 }), [v('a', 'input')], true);
    expect(runCalculation(f, { a: '1' })).toEqual({
      ok: true,
      result: { x: 1, y: 2 }
    });
  });
});

describe('formatResult', () => {
  it('keeps integers as-is', () => {
    expect(formatResult(4)).toBe('4');
    expect(formatResult(0)).toBe('0');
    expect(formatResult(-7)).toBe('-7');
  });

  it('trims trailing zeros on decimals', () => {
    expect(formatResult(4.5)).toBe('4.5');
    expect(formatResult(0.125)).toBe('0.125');
    expect(formatResult(-2.25)).toBe('-2.25');
  });

  it('rounds to 4 decimal places', () => {
    expect(formatResult(1 / 3)).toBe('0.3333');
  });
});
