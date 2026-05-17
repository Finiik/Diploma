/** The three-dot "assistant is typing" bubble. */
export default function TypingIndicator() {
  return (
    <div className="ai-msg ai-msg-bot">
      <span className="ai-msg-avatar">🤖</span>
      <div className="ai-msg-bubble ai-typing">
        <span className="ai-dot"></span>
        <span className="ai-dot"></span>
        <span className="ai-dot"></span>
      </div>
    </div>
  );
}
