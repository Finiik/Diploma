import { type RefObject, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

/** Text field + send button; Enter (without Shift) sends. */
export default function ChatInput({ value, onChange, onSend, inputRef }: ChatInputProps) {
  const { t } = useTranslation();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="ai-input-area">
      <input
        ref={inputRef}
        type="text"
        className="ai-input"
        placeholder={t('assistant.placeholder')}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        id="ai-input"
      />
      <button className="ai-send-btn" onClick={onSend} disabled={!value.trim()}>
        ➤
      </button>
    </div>
  );
}
