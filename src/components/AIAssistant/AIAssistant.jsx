import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { processMessage } from '../../services/assistantEngine';
import './AIAssistant.css';

export default function AIAssistant() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isUk = i18n.language === 'uk';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      (async () => {
        const welcome = await processMessage('привіт', isUk);
        setMessages([{ role: 'bot', ...welcome, timestamp: Date.now() }]);
      })();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    const userMsg = { role: 'user', text: userQuery, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await processMessage(userQuery, isUk);
      setMessages(prev => [...prev, { role: 'bot', ...response, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: isUk ? '❌ Виникла помилка. Спробуйте ще раз.' : '❌ An error occurred. Please try again.',
        links: [], suggestions: [], timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = async (text) => {
    setInput('');
    const userMsg = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await processMessage(text, isUk);
      setMessages(prev => [...prev, { role: 'bot', ...response, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: isUk ? '❌ Виникла помилка.' : '❌ An error occurred.',
        links: [], suggestions: [], timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLinkClick = (link) => {
    if (link.type === 'formula') {
      navigate(`/formula/${link.id}`);
    } else if (link.type === 'theory') {
      navigate('/theory');
    } else if (link.type === 'problems') {
      navigate('/problems');
    } else if (link.type === 'subject') {
      navigate(`/subject/${link.id}`);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\$\$(.*?)\$\$/g, '<code class="formula-inline">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant"
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

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-panel animate-scale-in" id="ai-assistant-panel">
          {/* Header */}
          <div className="ai-panel-header">
            <div className="ai-header-info">
              <span className="ai-avatar">🤖</span>
              <div>
                <h3 className="ai-header-title">SciLearn AI</h3>
                <span className="ai-header-status">
                  {isUk ? '✨ Gemini' : '✨ Gemini'}
                </span>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="ai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ai-msg-${msg.role}`}>
                {msg.role === 'bot' && <span className="ai-msg-avatar">🤖</span>}
                <div className="ai-msg-bubble">
                  <div
                    className="ai-msg-text"
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                  {/* Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="ai-msg-links">
                      {msg.links.map((link, j) => (
                        <button
                          key={j}
                          className="ai-link-btn"
                          onClick={() => handleLinkClick(link)}
                        >
                          {link.type === 'formula' ? '📐' : link.type === 'theory' ? '📖' : '📝'}{' '}
                          {link.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="ai-msg-suggestions">
                      {msg.suggestions.map((sug, j) => (
                        <button
                          key={j}
                          className="ai-suggestion-chip"
                          onClick={() => handleSuggestion(sug)}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="ai-msg ai-msg-bot">
                <span className="ai-msg-avatar">🤖</span>
                <div className="ai-msg-bubble ai-typing">
                  <span className="ai-dot"></span>
                  <span className="ai-dot"></span>
                  <span className="ai-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-input-area">
            <input
              ref={inputRef}
              type="text"
              className="ai-input"
              placeholder={isUk ? 'Запитайте щось...' : 'Ask something...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              id="ai-input"
            />
            <button
              className="ai-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
