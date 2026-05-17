import { renderInlineMarkdown } from '@/shared/lib/markdown';

/**
 * Renders authored prose: split on blank lines into paragraphs, each run
 * through the inline-markdown boundary. This component owns the single
 * `dangerouslySetInnerHTML` trust decision for course content so pages
 * never re-implement the split/render/inject sequence themselves.
 */
export default function Markdown({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((para, i) => (
        <p
          key={i}
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(para) }}
        />
      ))}
    </>
  );
}
