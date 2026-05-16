import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBookmarks } from '@/contexts/BookmarkContext';
import type { Formula } from '@/types/domain';
import { useLocalized } from '@/hooks/useLocalized';
import Latex from '@/components/Latex/Latex';
import './FormulaCard.css';

const BOOKMARK_KEY: Record<'true' | 'false', string> = {
  true: 'formula.bookmark_remove',
  false: 'formula.bookmark_add'
};

interface FormulaCardProps {
  formula: Formula;
}

export default function FormulaCard({ formula }: FormulaCardProps) {
  const { t } = useTranslation();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const tr = useLocalized();
  const bookmarked = isBookmarked(formula.id);

  return (
    <div className={`formula-card animate-fade-in subject-${formula.subject || 'default'}`} id={`formula-card-${formula.id}`}>
      <div className="formula-card-header">
        <Link to={`/formula/${formula.id}`} className="formula-card-title">
          {tr(formula, 'name')}
        </Link>
        <button
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleBookmark(formula.id); }}
          title={t(BOOKMARK_KEY[bookmarked ? 'true' : 'false'])}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>
      <Link to={`/formula/${formula.id}`} className="formula-card-body">
        <Latex tex={formula.latex} display className="formula-latex" />
        <p className="formula-desc">
          {tr(formula, 'description')}
        </p>
      </Link>
    </div>
  );
}
