import { useTranslation } from 'react-i18next';
import './LoadingSkeleton.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-block skeleton-formula"></div>
      <div className="skeleton-line skeleton-desc"></div>
      <div className="skeleton-line skeleton-desc-short"></div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-desc"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="formulas-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function PageLoader() {
  const { t } = useTranslation();
  return (
    <div className="page-loader">
      <div className="loader-spinner"></div>
      <p className="loader-text">{t('common.loading')}</p>
    </div>
  );
}
