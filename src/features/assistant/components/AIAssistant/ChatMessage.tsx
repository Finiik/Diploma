import { forwardRef } from 'react';
import {
  formatMessage,
  type ContentLinkResolver
} from '@/features/assistant/lib/markdown';
import { findFormulaById } from '@/features/formulas';
import { resolveNavPath } from '@/shared/lib/navigation';
import type { NavLink } from '@/features/assistant/types';
import type { ChatMessage as ChatMsg } from './types';

const LINK_ICON: Record<NavLink['type'], string> = {
  formula: '📐',
  theory: '📖',
  problems: '📝',
  subject: '📝'
};

/**
 * In-text `[[formula:id|label]]` references become real links only when the
 * id resolves to a known formula — a hallucinated id degrades to plain text
 * rather than a dead route. Same target-resolution as the chips below.
 */
const resolveContentLink: ContentLinkResolver = (type, id) =>
  type === 'formula' && findFormulaById(id)
    ? resolveNavPath({ type: 'formula', id })
    : null;

interface ChatMessageProps {
  message: ChatMsg;
  onLinkClick: (link: NavLink) => void;
  onSuggestion: (text: string) => void;
}

/**
 * One transcript bubble. `dangerouslySetInnerHTML` is fed by `formatMessage`,
 * which escapes on KaTeX failure and HTML-escapes link labels — it is the
 * single sanitization boundary. Inline links rendered there are plain DOM
 * anchors, so their clicks are delegated here to the same `onLinkClick` path
 * the chips use (SPA navigation, not a full reload).
 */
const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, onLinkClick, onSuggestion }, ref) => {
    const handleInlineLink = (e: React.MouseEvent<HTMLDivElement>) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a.ai-inline-link'
      );
      if (!anchor) return;
      e.preventDefault();
      const id = anchor.dataset.navId;
      if (anchor.dataset.navType === 'formula' && id) {
        onLinkClick({ type: 'formula', id, label: anchor.textContent ?? '' });
      }
    };

    return (
      <div ref={ref} className={`ai-msg ai-msg-${message.role}`}>
        {message.role === 'bot' && <span className="ai-msg-avatar">🤖</span>}
        <div className="ai-msg-bubble">
          {/* Delegation only: the interactive targets are nested real
            <a href> anchors (keyboard-focusable; Enter dispatches a click
            that bubbles here). The div itself is not a control. */}
          <div
            className="ai-msg-text"
            onClick={message.role === 'bot' ? handleInlineLink : undefined}
            dangerouslySetInnerHTML={{
              __html: formatMessage(message.text, resolveContentLink)
            }}
          />
          {message.role === 'bot' && message.links.length > 0 && (
            <div className="ai-msg-links">
              {message.links.map((link, j) => (
                <button
                  key={j}
                  className="ai-link-btn"
                  onClick={() => onLinkClick(link)}
                >
                  {LINK_ICON[link.type]} {link.label}
                </button>
              ))}
            </div>
          )}
          {message.role === 'bot' && message.suggestions.length > 0 && (
            <div className="ai-msg-suggestions">
              {message.suggestions.map((sug, j) => (
                <button
                  key={j}
                  className="ai-suggestion-chip"
                  onClick={() => onSuggestion(sug)}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
