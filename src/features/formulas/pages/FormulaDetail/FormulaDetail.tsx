import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Latex from '@/shared/ui/Latex/Latex';
import { useBookmarks } from '@/shared/bookmarks/BookmarkContext';
import { Calculator } from '@/features/calculator';
import Breadcrumb from '@/shared/ui/Breadcrumb/Breadcrumb';
import FormulaVariablesTable from '@/features/formulas/components/FormulaVariablesTable/FormulaVariablesTable';
import DerivedFormulasGrid from '@/features/formulas/components/DerivedFormulasGrid/DerivedFormulasGrid';
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

          <FormulaVariablesTable variables={formula.variables} />

          {/* Derived formulas shown IMMEDIATELY */}
          <DerivedFormulasGrid formulas={derivedFormulas} />

          {/* Calculator */}
          <Calculator formula={formula} onCalculated={logCalculation} />
        </div>
      </div>
    </div>
  );
}
