import { renderLatex } from './katex';

/**
 * Render an assistant message to HTML: real KaTeX for `$$...$$` (block) and
 * `$...$` (inline), plus `**bold**` and newline handling for the surrounding
 * text. Math is stashed to numeric placeholders first so the markdown pass
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
    return `${mathBlocks.length - 1}`;
  };

  let out = text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m: string, tex: string) => stash(renderLatex(tex, true)))
    .replace(/\$([^$\n]+?)\$/g, (_m: string, tex: string) => stash(renderLatex(tex, false)));

  out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  return out.replace(/(\d+)/g, (_m: string, i: string) => mathBlocks[Number(i)]);
}
