import { renderLatex } from '@/shared/lib/katex';

/**
 * Resolves a content reference to an in-app href, or `null` when the id is
 * unknown (e.g. the model hallucinated one). Injected by the caller so this
 * module stays pure and free of any domain/catalog import — the single
 * HTML-injection boundary owns escaping, not content knowledge.
 */
export type ContentLinkResolver = (type: string, id: string) => string | null;

/**
 * Sentinel wrapping a stashed-block index. It's a NUL char (built at runtime
 * so the source stays plain ASCII) — NUL can't occur in chat text or KaTeX
 * output, so the reinjection regex targets placeholders exactly. The old
 * code matched bare `\d+`, which corrupted every literal number in the
 * surrounding prose (a message with no math turned "78 formulas" into
 * "undefined formulas").
 */
const SENTINEL = String.fromCharCode(0);
const PLACEHOLDER = new RegExp(`${SENTINEL}(\\d+)${SENTINEL}`, 'g');

/**
 * Content link token the Gemini prompt asks the model to emit instead of a
 * raw "(id: ...)": `[[formula:phys_ohm|Закон Ома]]`. Parsed here into a
 * clickable anchor so the reference behaves like the chips under the answer.
 */
const LINK_TOKEN = /\[\[(\w+):([\w-]+)\|([^\]\n]+)\]\]/g;

/**
 * Defensive scrub of the raw catalog artifact `(id: phys_ohm, LaTeX: V=IR)`.
 * The prompt asks the model to use {@link LINK_TOKEN} instead, but model
 * compliance is not a guarantee — if it echoes the catalog form anyway, the
 * leading space + whole parenthetical is removed so the bare name still
 * reads cleanly (the body allows one level of nested parens so LaTeX like
 * `\sin(\theta)` doesn't cut the match short).
 */
const RAW_ID_REF = /\s*\(\s*id:\s*[\w-]+(?:[^()]|\([^()]*\))*\)/gi;

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Render an assistant message to HTML: real KaTeX for `$$...$$` (block) and
 * `$...$` (inline), in-app links for `[[type:id|label]]` tokens, plus
 * `**bold**` and newline handling for the surrounding text. Math and link
 * anchors are stashed to sentinel placeholders first so the markdown pass
 * can't mangle the generated markup.
 *
 * `resolveLink` is optional and injected (never imported here): with no
 * resolver, or for an id it can't resolve, the token degrades to its plain
 * label — the raw `[[...]]` token never reaches the user either way. A
 * non-compliant raw `(id: …, LaTeX: …)` echo is scrubbed for the same
 * reason: the user never sees the catalog artifact.
 *
 * This is the assistant's only HTML-injection boundary — keep it pure and
 * unit-testable, never inline it back into the component.
 */
export function formatMessage(
  text: string,
  resolveLink?: ContentLinkResolver
): string {
  if (!text) return '';

  const blocks: string[] = [];
  const stash = (html: string): string => {
    blocks.push(html);
    return `${SENTINEL}${blocks.length - 1}${SENTINEL}`;
  };

  let out = text
    .replace(RAW_ID_REF, '')
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m: string, tex: string) =>
      stash(renderLatex(tex, true))
    )
    .replace(/\$([^$\n]+?)\$/g, (_m: string, tex: string) =>
      stash(renderLatex(tex, false))
    )
    .replace(
      LINK_TOKEN,
      (_m: string, type: string, id: string, label: string) => {
        const safeLabel = escapeHtml(label.trim());
        const href = resolveLink?.(type, id) ?? null;
        if (!href) return stash(safeLabel);
        return stash(
          `<a class="ai-inline-link" data-nav-type="${escapeHtml(type)}" ` +
            `data-nav-id="${escapeHtml(id)}" href="${escapeHtml(href)}">` +
            `${safeLabel}</a>`
        );
      }
    );

  out = out
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  return out.replace(
    PLACEHOLDER,
    (_m: string, i: string) => blocks[Number(i)] ?? ''
  );
}
