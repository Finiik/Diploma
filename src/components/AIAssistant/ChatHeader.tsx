import { useTranslation } from 'react-i18next';

interface ChatHeaderProps {
  onClose: () => void;
}

/** Assistant panel header: avatar, title, "powered by" status and close. */
export default function ChatHeader({ onClose }: ChatHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="ai-panel-header">
      <div className="ai-header-info">
        <span className="ai-avatar">🤖</span>
        <div>
          <h3 className="ai-header-title">SciLearn AI</h3>
          <span className="ai-header-status">{t('assistant.powered_by')}</span>
        </div>
      </div>
      <button className="ai-close-btn" onClick={onClose}>✕</button>
    </div>
  );
}
