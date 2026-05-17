import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { processMessage } from '@/features/assistant/services/assistantEngine';
import { defaultGeminiTransport } from '@/features/assistant/services/assistant/geminiClient';
import type { ChatMessage } from '@/features/assistant/components/AIAssistant/types';
import { resolveLang } from '@/shared/i18n/lang';

/**
 * The single composition point: the app boundary picks the real Gemini
 * adapter and threads it into the engine (mirroring how `getDefaultIndex()`
 * injects `DEFAULT_CORPUS_SOURCES` at one wiring point). The orchestrator,
 * responder chain and gemini client name only the `GeminiTransport` port —
 * the concretion lives here, so the dependency is genuinely inverted (and
 * a test can swap it without stubbing global fetch).
 */
const transport = defaultGeminiTransport;

/**
 * Owns the chat transcript, the input box and the typing flag. `send` and
 * `sendSuggestion` were ~90% identical handlers in the component — they now
 * share one `run`, differing only by the error message key.
 */
export function useChatSession() {
  const { t, i18n } = useTranslation();
  const lang = resolveLang(i18n.language);

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
        const response = await processMessage(text, lang, transport);
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
    [lang, t]
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
      const welcome = await processMessage('привіт', lang, transport);
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
  }, [lang, t]);

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
