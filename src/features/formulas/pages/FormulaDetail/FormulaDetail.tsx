import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Latex from '@/shared/ui/Latex/Latex';
import { symbolToTex } from '@/shared/lib/symbol-tex';
import { useBookmarks } from '@/shared/bookmarks/BookmarkContext';
import { Calculator } from '@/features/calculator';
import Breadcrumb from '@/shared/ui/Breadcrumb/Breadcrumb';
import {
  findFormulaById,
  findFormulasByIds,
  getSubjectData
} from '@/features/formulas/lib/formulas';
import { buildFormulaBreadcrumbs } from '@/features/formulas/lib/breadcrumbs';
import { useInteractionLog } from '@/shared/firebase/useInteractionLog';
import { useLocalized } from '@/shared/hooks/useLocalized';
import './FormulaDetail.css';

const BOOKMARK_KEY: Record<'true' | 'false', string> = {
  true: 'formula.bookmark_remove',
  false: 'formula.bookmark_add'
};

export default function FormulaDetail() {
  const { formulaId } = useParams();
  const { t } = useTranslation();
  const tr = useLocalized();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { logView, logCalculation } = useInteractionLog();

  const formula = formulaId ? findFormulaById(formulaId) : undefined;
  const bookmarked = formula ? isBookmarked(formula.id) : false;

  useEffect(() => {
    if (formula) logView(formula.id);
  }, [formula?.id, logView]);

  if (!formula) {
    return (
      <div className="container">
        <p>{t('common.error')}</p>
        <Link to="/">{t('common.back')}</Link>
      </div>
    );
  }

  const derivedFormulas = findFormulasByIds(formula.derivedFormulas || []);
  const subjectData = getSubjectData(formula.subject);
  const breadcrumbs = buildFormulaBreadcrumbs({
    formula,
    subjectData,
    homeLabel: t('nav.home'),
    formulaName: tr(formula, 'name')
  });

  return (
    <div className="formula-detail-page">
      <div className="container">
        <Breadcrumb items={breadcrumbs} />

        <div className="formula-detail animate-fade-in">
          <div className="formula-detail-header">
            <h1 className="formula-detail-title">{tr(formula, 'name')}</h1>
            <button
              className={`bookmark-btn-lg ${bookmarked ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(formula.id)}
              id="formula-bookmark-btn"
            >
              {bookmarked ? '★' : '☆'}
              <span>{t(BOOKMARK_KEY[bookmarked ? 'true' : 'false'])}</span>
            </button>
          </div>

          <Latex tex={formula.latex} display className="formula-detail-latex" />

          <div className="formula-detail-desc">
            <h2>{t('formula.description')}</h2>
            <p>{tr(formula, 'description')}</p>
          </div>

          <div className="formula-detail-vars">
            <h2>{t('formula.variables')}</h2>
            <div className="vars-table">
              {formula.variables.map((v) => (
                <div key={v.symbol} className="var-row">
                  <Latex tex={symbolToTex(v.symbol)} className="var-symbol" />
                  <span className="var-name">{tr(v, 'name')}</span>
                  <span className="var-unit">{v.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Derived formulas shown IMMEDIATELY */}
          {derivedFormulas.length > 0 && (
            <div className="derived-section">
              <h2>{t('formula.derived')}</h2>
              <div className="derived-grid">
                {derivedFormulas.map((df) => (
                  <Link
                    key={df.id}
                    to={`/formula/${df.id}`}
                    className="derived-card"
                    id={`derived-${df.id}`}
                  >
                    <span className="derived-name">{tr(df, 'name')}</span>
                    <Latex tex={df.latex} className="derived-latex" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Calculator */}
          <Calculator formula={formula} onCalculated={logCalculation} />
        </div>
      </div>
    </div>
  );
}
