/* Characterization tests — the single KaTeX render boundary. */
import { describe, it, expect } from 'vitest';
import { renderLatex } from '@/lib/katex';

describe('renderLatex', () => {
  it('renders KaTeX markup', () => {
    expect(renderLatex('a+b')).toContain('katex');
  });

  it('uses display mode only when requested', () => {
    expect(renderLatex('a', true)).toContain('katex-display');
    expect(renderLatex('a', false)).not.toContain('katex-display');
  });

  it('trims the input', () => {
    expect(renderLatex('  x  ')).toBe(renderLatex('x'));
  });
});
