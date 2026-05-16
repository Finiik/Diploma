import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalized } from '../../hooks/useLocalized';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  labelEn?: string;
  to?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation();
  const tr = useLocalized();

  return (
    <nav className="breadcrumb" aria-label={t('a11y.breadcrumb')}>
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator">›</span>}
          {item.to ? (
            <Link to={item.to} className="breadcrumb-link">
              {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
              {tr(item, 'label')}
            </Link>
          ) : (
            <span className="breadcrumb-current">
              {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
              {tr(item, 'label')}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
