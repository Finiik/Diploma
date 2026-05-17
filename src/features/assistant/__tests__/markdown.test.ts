/* Characterization tests — assistant message markdown/KaTeX pipeline.
   Pins the bold/newline transforms, math stash → KaTeX reinjection, and the
   regression where literal numbers in prose were corrupted to "undefined". */
import { describe, it, expect } from 'vitest';
import { formatMessage } from '@/features/assistant/lib/markdown';

const NUL = String.fromCharCode(0);

describe('formatMessage — text transforms', () => {
  it('returns an empty string for empty input', () => {
    expect(formatMessage('')).toBe('');
  });

  it('converts **bold** to <strong>', () => {
    expect(formatMessage('a **b** c')).toBe('a <strong>b</strong> c');
  });

  it('converts every newline to <br/>', () => {
    expect(formatMessage('a\nb\n\nc')).toBe('a<br/>b<br/><br/>c');
  });

  it('handles multiple bold spans', () => {
    expect(formatMessage('**x** and **y**')).toBe(
      '<strong>x</strong> and <strong>y</strong>'
    );
  });

  it('leaves plain prose untouched', () => {
    expect(formatMessage('just words, no markup')).toBe(
      'just words, no markup'
    );
  });
});

describe('formatMessage — KaTeX', () => {
  it('renders inline $...$ math, leaving no literal $', () => {
    const out = formatMessage('$E=mc^2$');
    expect(out).toContain('katex');
    expect(out).not.toContain('$');
  });

  it('renders block $$...$$ math in display mode', () => {
    const out = formatMessage('$$a+b$$');
    expect(out).toContain('katex-display');
    expect(out).not.toContain('$');
  });

  it('renders several math segments in one message', () => {
    const out = formatMessage('first $a$ then $b$ end');
    expect(out).toContain('first ');
    expect(out).toContain(' then ');
    expect(out).toContain(' end');
    expect(out).toContain('katex');
    expect(out).not.toContain('$');
  });

  it('keeps surrounding bold around rendered math', () => {
    const out = formatMessage('**Energy** $E=mc^2$');
    expect(out).toContain('<strong>Energy</strong>');
    expect(out).toContain('katex');
  });

  it('never leaks the internal sentinel into the output', () => {
    expect(formatMessage('mix $x$ and 9 words')).not.toContain(NUL);
  });
});

describe('formatMessage — number-corruption regression', () => {
  it('preserves literal numbers when there is no math at all', () => {
    expect(formatMessage('I have 3 apples and 12 oranges')).toBe(
      'I have 3 apples and 12 oranges'
    );
  });

  it('does not emit the string "undefined" for plain numbers', () => {
    expect(formatMessage('78 formulas available')).toBe(
      '78 formulas available'
    );
  });

  it('preserves prose numbers that surround rendered math', () => {
    const out = formatMessage('in 3 steps: $E=mc^2$ and 2 more');
    expect(out).toContain('in 3 steps:');
    expect(out).toContain('and 2 more');
    expect(out).toContain('katex');
    expect(out).not.toContain('undefined');
    expect(out).not.toContain('$');
  });

  it('keeps digits that live inside a bold span', () => {
    expect(formatMessage('**Step 1** done')).toBe(
      '<strong>Step 1</strong> done'
    );
  });

  it('keeps digits across newlines', () => {
    expect(formatMessage('3\n4')).toBe('3<br/>4');
  });
});
