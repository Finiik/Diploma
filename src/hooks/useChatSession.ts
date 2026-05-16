import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { processMessage } from '@/services/assistantEngine';
import type { ChatMessage } from '@/components/AIAssistant/types';

/**
 * Owns the chat transcript, the input box and the typing flag. `send` and
 * `sendSuggestion` were ~90% identical handlers in the component — they now
 * share one `run`, differing only by the error message key.
 */
export function useChatSession() {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language === 'uk';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const run = useCallback(
    async (text: string, errorKey: string) => {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text, timestamp: Date.now() }
      ]);
      setInput('');
      setIsTyping(true);
      try {
        const response = await processMessage(text, isUk);
        setMessages((prev) => [
          ...prev,
          { role: 'bot', ...response, timestamp: Date.now() }
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: t(errorKey),
            links: [],
            suggestions: [],
            timestamp: Date.now()
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isUk, t]
  );

  const send = useCallback(() => {
    const query = input.trim();
    if (query) run(query, 'assistant.error');
  }, [input, run]);

  const sendSuggestion = useCallback(
    (text: string) => run(text, 'assistant.error_short'),
    [run]
  );

  // Guards a second concurrent seed if the panel is reopened while the first
  // welcome request is still in flight.
  const seedingRef = useRef(false);

  /**
   * Bot greeting shown the first time the panel is opened. Always resolves
   * the transcript to a message — the welcome on success, an error bubble on
   * failure — so the panel can never be left silently blank.
   */
  const seedWelcome = useCallback(async () => {
    if (seedingRef.current) return;
    seedingRef.current = true;
    setIsTyping(true);
    try {
      const welcome = await processMessage('привіт', isUk);
      setMessages([{ role: 'bot', ...welcome, timestamp: Date.now() }]);
    } catch {
      setMessages([
        {
          role: 'bot',
          text: t('assistant.error'),
          links: [],
          suggestions: [],
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsTyping(false);
      seedingRef.current = false;
    }
  }, [isUk, t]);

  return {
    messages,
    input,
    setInput,
    isTyping,
    send,
    sendSuggestion,
    seedWelcome
  };
}
