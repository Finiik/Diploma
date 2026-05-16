import { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { renderLatex } from '../../lib/katex';

interface LatexProps {
  /** Raw LaTeX source. */
  tex: string;
  /** Block (display) mode vs inline. Defaults to inline. */
  display?: boolean;
  /** Class applied to the wrapper element. */
  className?: string;
}

/**
 * Renders KaTeX once per `tex`/`display` change. The `dangerouslySetInnerHTML`
 * is safe because `renderLatex` escapes on failure and KaTeX sanitizes its
 * own output. Replaces the ad-hoc `katex.renderToString` + div pattern that
 * was duplicated (and re-run every render) across the formula components.
 */
export default function Latex({ tex, display = false, className }: LatexProps) {
  const html = useMemo(() => renderLatex(tex, display), [tex, display]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
