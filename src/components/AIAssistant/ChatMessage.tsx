import { forwardRef } from 'react';
import { formatMessage } from '@/lib/markdown';
import type { NavLink } from '@/types/domain';
import type { ChatMessage as ChatMsg } from './types';

const LINK_ICON: Record<NavLink['type'], string> = {
  formula: '📐',
  theory: '📖',
  problems: '📝',
  subject: '📝'
};

interface ChatMessageProps {
  message: ChatMsg;
  onLinkClick: (link: NavLink) => void;
  onSuggestion: (text: string) => void;
}

/**
 * One transcript bubble. `dangerouslySetInnerHTML` is fed by `formatMessage`,
 * which escapes on KaTeX failure — it is the single sanitization boundary.
 */
const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, onLinkClick, onSuggestion }, ref) => (
    <div ref={ref} className={`ai-msg ai-msg-${message.role}`}>
      {message.role === 'bot' && <span className="ai-msg-avatar">🤖</span>}
      <div className="ai-msg-bubble">
        <div
          className="ai-msg-text"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
        />
        {message.role === 'bot' && message.links.length > 0 && (
          <div className="ai-msg-links">
            {message.links.map((link, j) => (
              <button key={j} className="ai-link-btn" onClick={() => onLinkClick(link)}>
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
  )
);
ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
