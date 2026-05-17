import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBookmarkToggle } from '@/shared/bookmarks/useBookmarkToggle';
import type { FormulaMeta } from '@/shared/types/domain';
import { useLocalized } from '@/shared/hooks/useLocalized';
import Latex from '@/shared/ui/Latex/Latex';
import './FormulaCard.css';

interface FormulaCardProps {
  /** Display-only: the card shows name/latex/description, never computes. */
  formula: FormulaMeta;
}

export default function FormulaCard({ formula }: FormulaCardProps) {
  const { t } = useTranslation();
  const { bookmarked, toggle, labelKey } = useBookmarkToggle(formula.id);
  const tr = useLocalized();

  return (
    <div
      className={`formula-card animate-fade-in subject-${formula.subject || 'default'}`}
      id={`formula-card-${formula.id}`}
    >
      <div className="formula-card-header">
        <Link to={`/formula/${formula.id}`} className="formula-card-title">
          {tr(formula, 'name')}
        </Link>
        <button
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          title={t(labelKey)}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>
      <Link to={`/formula/${formula.id}`} className="formula-card-body">
        <Latex tex={formula.latex} display className="formula-latex" />
        <p className="formula-desc">{tr(formula, 'description')}</p>
      </Link>
    </div>
  );
}
