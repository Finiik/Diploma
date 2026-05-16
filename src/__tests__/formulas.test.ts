/* Characterization tests — cross-subject formula access. */
import { describe, it, expect } from 'vitest';
import {
  getAllFormulas,
  findFormulaById,
  findFormulasByIds
} from '@/lib/formulas';

describe('getAllFormulas', () => {
  const all = getAllFormulas();

  it('returns a non-empty catalog', () => {
    expect(all.length).toBeGreaterThan(0);
  });

  it('tags every formula with a non-empty subject', () => {
    expect(
      all.every((f) => typeof f.subject === 'string' && f.subject.length > 0)
    ).toBe(true);
  });

  it('has unique ids', () => {
    const ids = all.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('findFormulaById', () => {
  it('finds an existing formula', () => {
    const first = getAllFormulas()[0];
    expect(findFormulaById(first.id)?.id).toBe(first.id);
  });

  it('returns undefined for an unknown id', () => {
    expect(findFormulaById('__does_not_exist__')).toBeUndefined();
  });
});

describe('findFormulasByIds', () => {
  it('resolves ids in order and drops misses', () => {
    const all = getAllFormulas();
    const a = all[0].id;
    const b = all[1].id;
    const out = findFormulasByIds([b, '__nope__', a]);
    expect(out.map((f) => f.id)).toEqual([b, a]);
  });

  it('returns an empty array for an empty list', () => {
    expect(findFormulasByIds([])).toEqual([]);
  });
});
