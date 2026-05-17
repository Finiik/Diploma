/* Characterization tests — content-item → route resolution.
   resolveNavPath handles two unions in one place (assistant NavLink uses
   'problems'/'subject'; search ContentType uses 'problem'). */
import { describe, it, expect } from 'vitest';
import { resolveNavPath, type Routable } from '@/shared/lib/navigation';

describe('resolveNavPath — id-bearing routes', () => {
  it('routes formula with its id', () => {
    expect(resolveNavPath({ type: 'formula', id: 'phys_newton2' })).toBe(
      '/formula/phys_newton2'
    );
  });

  it('routes subject with its id', () => {
    expect(resolveNavPath({ type: 'subject', id: 'physics' })).toBe(
      '/subject/physics'
    );
  });

  it('interpolates the id verbatim (no encoding)', () => {
    expect(resolveNavPath({ type: 'formula', id: 'a/b c' })).toBe(
      '/formula/a/b c'
    );
  });

  it('still builds a path for an empty id', () => {
    expect(resolveNavPath({ type: 'formula', id: '' })).toBe('/formula/');
    expect(resolveNavPath({ type: 'subject', id: '' })).toBe('/subject/');
  });
});

describe('resolveNavPath — fixed routes ignore the id', () => {
  it('theory always → /theory', () => {
    expect(resolveNavPath({ type: 'theory', id: 'x' })).toBe('/theory');
    expect(resolveNavPath({ type: 'theory', id: 'y' })).toBe('/theory');
  });

  it('both problem spellings → /problems', () => {
    expect(resolveNavPath({ type: 'problem', id: 'p1' })).toBe('/problems');
    expect(resolveNavPath({ type: 'problems', id: 'p1' })).toBe('/problems');
  });
});

describe('resolveNavPath — defensive default', () => {
  it('returns null for an unrecognised type', () => {
    // The union forbids this at compile time; the cast deliberately
    // exercises the runtime fall-through that guards malformed data.
    const bad = { type: 'video', id: 'x' } as unknown as Routable;
    expect(resolveNavPath(bad)).toBeNull();
  });
});
