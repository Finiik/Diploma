import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'katex/dist/katex.min.css';
import type { NavLink } from '@/shared/types/domain';
import { resolveNavPath } from '@/lib/navigation';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatScroll } from '@/hooks/useChatScroll';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import ChatFab from './ChatFab';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './AIAssistant.css';

/**
 * Thin shell: owns only open/close, wires the chat hooks to the presentational
 * pieces. Transcript state lives in useChatSession, scrolling in useChatScroll,
 * message rendering/markdown in MessageList / lib/markdown.
 */
export default function AIAssistant() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    input,
    setInput,
    isTyping,
    send,
    sendSuggestion,
    seedWelcome
  } = useChatSession();
  const { messagesEndRef, lastUserMsgRef } = useChatScroll(isOpen, [
    messages,
    isTyping
  ]);
  useAutoFocus(inputRef, isOpen, 300);

  // Greet on first open. Deps are complete and honest: seedWelcome is stable
  // and self-guards (it always resolves the transcript to a welcome- or
  // error-message and ignores concurrent calls), so this neither loops nor
  // leaves the panel blank.
  useEffect(() => {
    if (isOpen && messages.length === 0) seedWelcome();
  }, [isOpen, messages.length, seedWelcome]);

  const handleLinkClick = (link: NavLink) => {
    const path = resolveNavPath(link);
    if (path) navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <ChatFab
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        label={t('a11y.assistant')}
      />

      {isOpen && (
        <div className="ai-panel animate-scale-in" id="ai-assistant-panel">
          <ChatHeader onClose={() => setIsOpen(false)} />
          <MessageList
            messages={messages}
            isTyping={isTyping}
            lastUserMsgRef={lastUserMsgRef}
            messagesEndRef={messagesEndRef}
            onLinkClick={handleLinkClick}
            onSuggestion={sendSuggestion}
          />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={send}
            inputRef={inputRef}
          />
        </div>
      )}
    </>
  );
}
