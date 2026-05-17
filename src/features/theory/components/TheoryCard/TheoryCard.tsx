import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalized } from '@/shared/hooks/useLocalized';
import { subjectIcon } from '@/shared/lib/subjectIcon';
import { stripFormulaIdPrefix } from '@/shared/lib/formulaId';
import { difficultyBadge } from '@/shared/lib/difficulty';
import Markdown from '@/shared/ui/Markdown/Markdown';
import type { TheoryItem } from '@/shared/types/domain';

interface TheoryCardProps {
  item: TheoryItem;
}

/** One theory article. Presentational; styling is global (Theory.css). */
export default function TheoryCard({ item }: TheoryCardProps) {
  const { t } = useTranslation();
  const tr = useLocalized();
  const badge = difficultyBadge(item.difficulty);

  return (
    <article className={`theory-card subject-${item.subject}`}>
      <div className="theory-card-header">
        <span className="theory-icon">{subjectIcon(item.subject)}</span>
        <div>
          <h2 className="theory-card-title">{tr(item, 'name')}</h2>
          <p className="theory-card-topic">{item.topic}</p>
        </div>
        <span className={`difficulty-badge ${badge.cls}`}>
          {badge.icon} {t(badge.labelKey)}
        </span>
      </div>
      <p className="theory-card-desc">{tr(item, 'description')}</p>
      <div className="theory-content">
        <Markdown text={tr(item, 'content')} />
      </div>
      {item.relatedFormulas && item.relatedFormulas.length > 0 && (
        <div className="theory-related">
          <span className="theory-related-label">
            {t('theory.related_formulas')}
          </span>
          {item.relatedFormulas.map((fId) => (
            <Link
              key={fId}
              to={`/formula/${fId}`}
              className="theory-related-link"
            >
              {stripFormulaIdPrefix(fId)}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
