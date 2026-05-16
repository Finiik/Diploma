/* Characterization tests — content-item → route resolution. */
import { describe, it, expect } from 'vitest';
import { resolveNavPath, type Routable } from '@/lib/navigation';

describe('resolveNavPath', () => {
  it('routes formula and subject with their id', () => {
    expect(resolveNavPath({ type: 'formula', id: 'phys_x' })).toBe(
      '/formula/phys_x'
    );
    expect(resolveNavPath({ type: 'subject', id: 'physics' })).toBe(
      '/subject/physics'
    );
  });

  it('routes theory and both problem spellings to fixed paths', () => {
    expect(resolveNavPath({ type: 'theory', id: 'ignored' })).toBe('/theory');
    expect(resolveNavPath({ type: 'problem', id: 'ignored' })).toBe(
      '/problems'
    );
    expect(resolveNavPath({ type: 'problems', id: 'ignored' })).toBe(
      '/problems'
    );
  });

  it('returns null for an unrecognised type (defensive default)', () => {
    // The union forbids this at compile time; the cast deliberately
    // exercises the runtime fall-through that guards malformed data.
    const bad = { type: 'video', id: 'x' } as unknown as Routable;
    expect(resolveNavPath(bad)).toBeNull();
  });
});
