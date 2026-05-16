/* Characterization tests — cross-subject formula access.
   The one place that merges physics + chemistry + biology catalogs. */
import { describe, it, expect } from 'vitest';
import {
  getAllFormulas,
  findFormulaById,
  findFormulasByIds
} from '@/lib/formulas';

describe('getAllFormulas', () => {
  it('returns a non-empty catalog', () => {
    expect(getAllFormulas().length).toBeGreaterThan(0);
  });

  it('tags every formula with a non-empty subject', () => {
    for (const f of getAllFormulas()) {
      expect(typeof f.subject).toBe('string');
      expect((f.subject as string).length).toBeGreaterThan(0);
    }
  });

  it('spans more than one subject', () => {
    const subjects = new Set(getAllFormulas().map((f) => f.subject));
    expect(subjects.size).toBeGreaterThan(1);
  });

  it('every entry has an id, latex and a compute function', () => {
    for (const f of getAllFormulas()) {
      expect(typeof f.id).toBe('string');
      expect(f.id.length).toBeGreaterThan(0);
      expect(typeof f.latex).toBe('string');
      expect(typeof f.compute).toBe('function');
    }
  });

  it('has globally unique ids across subjects', () => {
    const ids = getAllFormulas().map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns a fresh array each call (no shared mutable state)', () => {
    const a = getAllFormulas();
    const b = getAllFormulas();
    expect(a).not.toBe(b);
    expect(a.length).toBe(b.length);
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

  it('returns undefined for an empty id', () => {
    expect(findFormulaById('')).toBeUndefined();
  });
});

describe('findFormulasByIds', () => {
  it('resolves ids in order and drops misses', () => {
    const all = getAllFormulas();
    const [a, b] = [all[0].id, all[1].id];
    expect(findFormulasByIds([b, '__nope__', a]).map((f) => f.id)).toEqual([
      b,
      a
    ]);
  });

  it('keeps duplicates', () => {
    const id = getAllFormulas()[0].id;
    expect(findFormulasByIds([id, id]).map((f) => f.id)).toEqual([id, id]);
  });

  it('returns [] for an empty list', () => {
    expect(findFormulasByIds([])).toEqual([]);
  });

  it('returns [] when nothing resolves', () => {
    expect(findFormulasByIds(['__a__', '__b__'])).toEqual([]);
  });
});
