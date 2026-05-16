/* Characterization tests — assistant message markdown/KaTeX pipeline.
   Pins the bold/newline transforms and the math-stash → KaTeX reinjection. */
import { describe, it, expect } from 'vitest';
import { formatMessage } from '@/lib/markdown';

describe('formatMessage', () => {
  it('returns an empty string for empty input', () => {
    expect(formatMessage('')).toBe('');
  });

  it('converts **bold** to <strong>', () => {
    expect(formatMessage('a **b** c')).toBe('a <strong>b</strong> c');
  });

  it('converts newlines to <br/>', () => {
    expect(formatMessage('a\nb')).toBe('a<br/>b');
  });

  it('renders inline $...$ math via KaTeX, leaving no literal $', () => {
    const out = formatMessage('$E=mc^2$');
    expect(out).toContain('katex');
    expect(out).not.toContain('$');
  });

  it('renders block $$...$$ math in display mode', () => {
    const out = formatMessage('$$a+b$$');
    expect(out).toContain('katex-display');
    expect(out).not.toContain('$');
  });

  it('keeps surrounding bold around rendered math', () => {
    const out = formatMessage('**Energy** $E=mc^2$');
    expect(out).toContain('<strong>Energy</strong>');
    expect(out).toContain('katex');
  });
});
