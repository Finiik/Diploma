import { renderLatex } from './katex';

/**
 * Sentinel wrapping a stashed-math index. It's a NUL char (built at runtime
 * so the source stays plain ASCII) — NUL can't occur in chat text or KaTeX
 * output, so the reinjection regex targets placeholders exactly. The old
 * code matched bare `\d+`, which corrupted every literal number in the
 * surrounding prose (a message with no math turned "78 formulas" into
 * "undefined formulas").
 */
const SENTINEL = String.fromCharCode(0);
const PLACEHOLDER = new RegExp(`${SENTINEL}(\\d+)${SENTINEL}`, 'g');

/**
 * Render an assistant message to HTML: real KaTeX for `$$...$$` (block) and
 * `$...$` (inline), plus `**bold**` and newline handling for the surrounding
 * text. Math is stashed to sentinel placeholders first so the markdown pass
 * can't mangle the generated KaTeX markup.
 *
 * This is the assistant's only HTML-injection boundary — keep it pure and
 * unit-testable, never inline it back into the component.
 */
export function formatMessage(text: string): string {
  if (!text) return '';

  const mathBlocks: string[] = [];
  const stash = (html: string): string => {
    mathBlocks.push(html);
    return `${SENTINEL}${mathBlocks.length - 1}${SENTINEL}`;
  };

  let out = text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m: string, tex: string) =>
      stash(renderLatex(tex, true))
    )
    .replace(/\$([^$\n]+?)\$/g, (_m: string, tex: string) =>
      stash(renderLatex(tex, false))
    );

  out = out
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  return out.replace(
    PLACEHOLDER,
    (_m: string, i: string) => mathBlocks[Number(i)] ?? ''
  );
}
