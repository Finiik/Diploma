import { useTranslation } from 'react-i18next';
import { useBookmarks } from '@/shared/bookmarks/BookmarkContext';
import { FormulaCard, findFormulasByIds } from '@/features/formulas';
import './Bookmarks.css';

export default function Bookmarks() {
  const { t } = useTranslation();
  const { bookmarks } = useBookmarks();

  const bookmarkedFormulas = findFormulasByIds(bookmarks);

  return (
    <div className="bookmarks-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('bookmarks.title')}</h1>

        {bookmarkedFormulas.length === 0 ? (
          <div className="bookmarks-empty animate-fade-in">
            <div className="empty-icon">☆</div>
            <p className="empty-title">{t('bookmarks.empty')}</p>
            <p className="empty-hint">{t('bookmarks.empty_hint')}</p>
          </div>
        ) : (
          <div className="formulas-grid stagger-children">
            {bookmarkedFormulas.map((formula) => (
              <FormulaCard key={formula.id} formula={formula} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
