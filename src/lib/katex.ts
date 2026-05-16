import katex from 'katex';

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

/**
 * Render a LaTeX string to an HTML string.
 *
 * On a parse failure it returns the *escaped* source wrapped in `<code>`
 * (never the raw input) so a bad expression can't break layout or inject
 * markup. This is the single KaTeX boundary — every component and the
 * assistant's markdown pipeline go through here.
 */
export function renderLatex(tex: string, display = false): string {
  try {
    return katex.renderToString(tex.trim(), {
      throwOnError: false,
      displayMode: display
    });
  } catch {
    const safe = tex.replace(/[&<>]/g, c => HTML_ESCAPE[c] ?? c);
    return `<code class="formula-inline">${safe}</code>`;
  }
}
