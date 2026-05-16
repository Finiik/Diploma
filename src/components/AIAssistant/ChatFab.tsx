interface ChatFabProps {
  isOpen: boolean;
  onToggle: () => void;
  label: string;
}

/** The floating action button that opens/closes the assistant panel. */
export default function ChatFab({ isOpen, onToggle, label }: ChatFabProps) {
  return (
    <button
      className={`ai-fab ${isOpen ? 'ai-fab-active' : ''}`}
      onClick={onToggle}
      aria-label={label}
      id="ai-assistant-toggle"
    >
      {isOpen ? (
        <span className="ai-fab-icon">✕</span>
      ) : (
        <>
          <span className="ai-fab-icon">🤖</span>
          <span className="ai-fab-pulse"></span>
        </>
      )}
    </button>
  );
}
