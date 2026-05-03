import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  const { i18n } = useTranslation();
  const isUk = i18n.language === 'uk';

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator">›</span>}
          {item.to ? (
            <Link to={item.to} className="breadcrumb-link">
              {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
              {isUk ? item.label : (item.labelEn || item.label)}
            </Link>
          ) : (
            <span className="breadcrumb-current">
              {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
              {isUk ? item.label : (item.labelEn || item.label)}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
