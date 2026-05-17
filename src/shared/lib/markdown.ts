/**
 * Inline markdown → HTML for authored prose: `**bold**` and newline →
 * `<br/>`. This is the single HTML-injection boundary for theory content
 * (consumed via `dangerouslySetInnerHTML`) — keep it pure and
 * unit-testable, never inline it back into a component.
 *
 * The input is trusted authored content (`theoryData`); this preserves the
 * prior exact transform byte-for-byte. Any future sanitization belongs
 * here, in this one place.
 */
export function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}
