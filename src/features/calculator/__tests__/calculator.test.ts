/* Characterization tests — pure calculator domain logic.
   Pins runCalculation's discriminated outcome and formatResult's numeric
   formatting (including its rounding/trim quirks). */
import { describe, it, expect } from 'vitest';
import {
  runCalculation,
  formatResult
} from '@/features/calculator/lib/calculator';
import type { Formula, FormulaVariable } from '@/shared/types/domain';

const v = (symbol: string, type: 'input' | 'result'): FormulaVariable => ({
  symbol,
  name: symbol,
  nameEn: symbol,
  unit: 'u',
  type
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

describe('runCalculation — happy path', () => {
  it('computes from string inputs', () => {
    const f = makeFormula(
      (x) => x.a + x.b,
      [v('a', 'input'), v('b', 'input'), v('r', 'result')]
    );
    expect(runCalculation(f, { a: '2', b: '3' })).toEqual({
      ok: true,
      result: 5
    });
  });

  it('accepts numeric (non-string) field values', () => {
    const f = makeFormula((x) => x.a * 2, [v('a', 'input')]);
    expect(runCalculation(f, { a: 5 })).toEqual({ ok: true, result: 10 });
  });

  it('tolerates surrounding whitespace', () => {
    const f = makeFormula((x) => x.a, [v('a', 'input')]);
    expect(runCalculation(f, { a: '  4  ' })).toEqual({
      ok: true,
      result: 4
    });
  });

  it('returns a 0 result faithfully (not treated as failure)', () => {
    const f = makeFormula(() => 0, [v('a', 'input')]);
    expect(runCalculation(f, { a: '1' })).toEqual({ ok: true, result: 0 });
  });

  it('passes multi-result objects through unchanged', () => {
    const f = makeFormula(() => ({ x: 1, y: 2 }), [v('a', 'input')], true);
    expect(runCalculation(f, { a: '1' })).toEqual({
      ok: true,
      result: { x: 1, y: 2 }
    });
  });

  it('computes when there are no input variables', () => {
    const f = makeFormula(() => 42, [v('r', 'result')]);
    expect(runCalculation(f, {})).toEqual({ ok: true, result: 42 });
  });
});

describe('runCalculation — validation', () => {
  it('parses leniently like parseFloat ("3abc" → 3)', () => {
    // Characterization of parseFloat semantics, not necessarily desirable.
    const f = makeFormula((x) => x.a, [v('a', 'input')]);
    expect(runCalculation(f, { a: '3abc' })).toEqual({ ok: true, result: 3 });
  });

  it('rejects a non-numeric input', () => {
    const f = makeFormula((x) => x.a, [v('a', 'input')]);
    const out = runCalculation(f, { a: 'abc' });
    expect(out).toEqual({
      ok: false,
      reason: 'invalid',
      variable: expect.objectContaining({ symbol: 'a' })
    });
  });

  it('rejects an empty field', () => {
    const f = makeFormula((x) => x.a, [v('a', 'input')]);
    const out = runCalculation(f, { a: '' });
    expect(out.ok).toBe(false);
  });

  it('flags the FIRST invalid input in variable order', () => {
    const f = makeFormula((x) => x.a, [v('a', 'input'), v('b', 'input')]);
    const out = runCalculation(f, { a: 'x', b: 'y' });
    if (out.ok || out.reason !== 'invalid') {
      throw new Error('expected invalid');
    }
    expect(out.variable.symbol).toBe('a');
  });

  it('only validates input-type variables (result vars ignored)', () => {
    const f = makeFormula(() => 1, [v('a', 'input'), v('r', 'result')]);
    expect(runCalculation(f, { a: '1', r: 'garbage' })).toEqual({
      ok: true,
      result: 1
    });
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
});

describe('formatResult', () => {
  it('keeps integers as-is, including negatives and zero', () => {
    expect(formatResult(4)).toBe('4');
    expect(formatResult(0)).toBe('0');
    expect(formatResult(-0)).toBe('0');
    expect(formatResult(-7)).toBe('-7');
    expect(formatResult(100)).toBe('100');
  });

  it('trims trailing zeros on decimals', () => {
    expect(formatResult(4.5)).toBe('4.5');
    expect(formatResult(0.1)).toBe('0.1');
    expect(formatResult(0.125)).toBe('0.125');
    expect(formatResult(-2.25)).toBe('-2.25');
    expect(formatResult(123.456)).toBe('123.456');
  });

  it('rounds to 4 decimal places', () => {
    expect(formatResult(1 / 3)).toBe('0.3333');
    expect(formatResult(2 / 3)).toBe('0.6667');
  });

  it('collapses values that round to an integer at 4dp', () => {
    // 1.00001 → "1.0000" → trim → "1" (characterization).
    expect(formatResult(1.00001)).toBe('1');
  });

  it('rounds sub-1e-4 magnitudes down to "0" (4dp precision limit)', () => {
    // 0.00001 → toFixed(4) "0.0000" → trim → "0". Lossy but not "".
    expect(formatResult(0.00001)).toBe('0');
    expect(formatResult(0.000001)).toBe('0');
  });
});
