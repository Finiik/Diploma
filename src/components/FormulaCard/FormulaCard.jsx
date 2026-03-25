import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBookmarks } from '../../contexts/BookmarkContext';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import './FormulaCard.css';

export default function FormulaCard({ formula }) {
  const { t, i18n } = useTranslation();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isUk = i18n.language === 'uk';
  const bookmarked = isBookmarked(formula.id);

  const renderedLatex = katex.renderToString(formula.latex, {
    throwOnError: false,
    displayMode: true
  });

  return (
    <div className={`formula-card animate-fade-in subject-${formula.subject || 'default'}`} id={`formula-card-${formula.id}`}>
      <div className="formula-card-header">
        <Link to={`/formula/${formula.id}`} className="formula-card-title">
          {isUk ? formula.name : (formula.nameEn || formula.name)}
        </Link>
        <button
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleBookmark(formula.id); }}
          title={bookmarked ? t('formula.bookmark_remove') : t('formula.bookmark_add')}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>
      <Link to={`/formula/${formula.id}`} className="formula-card-body">
        <div
          className="formula-latex"
          dangerouslySetInnerHTML={{ __html: renderedLatex }}
        />
        <p className="formula-desc">
          {isUk ? formula.description : (formula.descriptionEn || formula.description)}
        </p>
      </Link>
    </div>
  );
}
