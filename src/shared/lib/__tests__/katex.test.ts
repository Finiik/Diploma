/* Characterization tests — the single KaTeX render boundary.
   throwOnError:false, so malformed input renders an error node rather than
   throwing; the catch-fallback is therefore not reachable from here. */
import { describe, it, expect } from 'vitest';
import { renderLatex } from '@/shared/lib/katex';

describe('renderLatex', () => {
  it('produces KaTeX markup', () => {
    expect(renderLatex('a+b')).toContain('katex');
  });

  it('uses display mode only when requested', () => {
    expect(renderLatex('a', true)).toContain('katex-display');
    expect(renderLatex('a', false)).not.toContain('katex-display');
  });

  it('defaults to inline (no display) when the flag is omitted', () => {
    expect(renderLatex('a')).not.toContain('katex-display');
  });

  it('is deterministic for the same input', () => {
    expect(renderLatex('x^2')).toBe(renderLatex('x^2'));
  });

  it('trims surrounding whitespace before rendering', () => {
    expect(renderLatex('  x  ')).toBe(renderLatex('x'));
  });

  it('produces different output for different input', () => {
    expect(renderLatex('a')).not.toBe(renderLatex('b'));
  });

  it('does not throw on malformed LaTeX, still returns a string', () => {
    expect(() => renderLatex('\\frac{')).not.toThrow();
    expect(typeof renderLatex('\\frac{')).toBe('string');
  });

  it('returns a string for empty input', () => {
    expect(typeof renderLatex('')).toBe('string');
  });
});
