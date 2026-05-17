import { type RefObject } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import type { NavLink } from '@/features/assistant/types';
import type { ChatMessage as ChatMsg } from './types';

interface MessageListProps {
  messages: ChatMsg[];
  isTyping: boolean;
  lastUserMsgRef: RefObject<HTMLDivElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onLinkClick: (link: NavLink) => void;
  onSuggestion: (text: string) => void;
}

/** The scrollable transcript: messages, typing indicator and bottom anchor. */
export default function MessageList({
  messages,
  isTyping,
  lastUserMsgRef,
  messagesEndRef,
  onLinkClick,
  onSuggestion
}: MessageListProps) {
  const lastUserIndex = messages.map((m) => m.role).lastIndexOf('user');

  return (
    <div className="ai-messages">
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          ref={i === lastUserIndex ? lastUserMsgRef : null}
          message={msg}
          onLinkClick={onLinkClick}
          onSuggestion={onSuggestion}
        />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
