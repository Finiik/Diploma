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

describe('formatMessage — inline content links', () => {
  // Mirrors the real resolver: a href only for an id that exists in the
  // catalog (here, the single known id `phys_ohm`); unknown ids → null.
  const resolve = (type: string, id: string) =>
    type === 'formula' && id === 'phys_ohm' ? `/formula/${id}` : null;

  it('turns a resolvable token into a clickable anchor', () => {
    const out = formatMessage(
      'дивись [[formula:phys_ohm|Закон Ома]] детальніше',
      resolve
    );
    expect(out).toContain('<a class="ai-inline-link"');
    expect(out).toContain('data-nav-type="formula"');
    expect(out).toContain('data-nav-id="phys_ohm"');
    expect(out).toContain('href="/formula/phys_ohm"');
    expect(out).toContain('>Закон Ома</a>');
    expect(out).not.toContain('[[');
  });

  it('degrades an unresolvable token to its plain label', () => {
    const out = formatMessage('[[formula:made_up|Невідома]] формула', resolve);
    expect(out).toContain('Невідома');
    expect(out).not.toContain('<a');
    expect(out).not.toContain('[[');
  });

  it('degrades to the label when no resolver is supplied', () => {
    expect(formatMessage('[[formula:phys_ohm|Закон Ома]] тут')).toBe(
      'Закон Ома тут'
    );
  });

  it('keeps bold wrapping a link token', () => {
    const out = formatMessage('**[[formula:phys_ohm|Закон Ома]]**', resolve);
    expect(out).toContain('<strong>');
    expect(out).toContain('<a class="ai-inline-link"');
    expect(out).toContain('</strong>');
  });

  it('HTML-escapes the model-supplied label', () => {
    const out = formatMessage(
      '[[formula:x|<img src=x onerror=alert(1)>]]',
      resolve
    );
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;img');
  });

  it('scrubs a raw (id: …) catalog echo to the bare name', () => {
    expect(
      formatMessage('розділі Закон Ома (id: phys_ohm). Там', resolve)
    ).toBe('розділі Закон Ома. Там');
  });

  it('scrubs the (id: …, LaTeX: …) form including the LaTeX tail', () => {
    const out = formatMessage('Закон Ома (id: phys_ohm, LaTeX: V=IR) пояснює');
    expect(out).toBe('Закон Ома пояснює');
  });

  it('scrubs a raw echo whose LaTeX has nested parens', () => {
    const out = formatMessage(
      'функція (id: phys_sin, LaTeX: y=\\sin(\\theta)) тут'
    );
    expect(out).not.toContain('(id:');
    expect(out).toBe('функція тут');
  });

  it('keeps bold tidy when the id echo sat inside the bold span', () => {
    expect(formatMessage('**Закон Ома (id: phys_ohm)**')).toBe(
      '<strong>Закон Ома</strong>'
    );
  });

  it('coexists with math and newlines without leaking the sentinel', () => {
    const out = formatMessage(
      'формула $E=mc^2$\nвідкрий [[formula:phys_ohm|Закон Ома]]',
      resolve
    );
    expect(out).toContain('katex');
    expect(out).toContain('<br/>');
    expect(out).toContain('href="/formula/phys_ohm"');
    expect(out).not.toContain(NUL);
    expect(out).not.toContain('[[');
  });
});
