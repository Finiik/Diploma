import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import katex from 'katex';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { useAuth } from '../../contexts/AuthContext';
import Calculator from '../../components/Calculator/Calculator';
import Breadcrumb, { type BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import { physicsData, getFormulaById as getPhysFormula, getAllFormulas as getPhysAll } from '../../data/physics';
import { chemistryData, getFormulaById as getChemFormula, getAllFormulas as getChemAll } from '../../data/chemistry';
import { biologyData, getFormulaById as getBioFormula, getAllFormulas as getBioAll } from '../../data/biology';
import type { Formula, Subject, SubjectData } from '../../types/domain';
import { isFirebaseConfigured } from '../../lib/env';
import './FormulaDetail.css';

type InteractionType = 'view' | 'calculation' | 'bookmark';

const subjectDataMap: Record<Subject, SubjectData> = {
  physics: physicsData,
  chemistry: chemistryData,
  biology: biologyData
};

const BOOKMARK_KEY: Record<'true' | 'false', string> = {
  true: 'formula.bookmark_remove',
  false: 'formula.bookmark_add'
};

async function safeLogInteraction(
  userId: string | undefined,
  formulaId: string,
  type: InteractionType
) {
  if (!isFirebaseConfigured() || !userId) return;
  try {
    const { logInteraction } = await import('../../firebase/firestore');
    await logInteraction(userId, formulaId, type);
  } catch (e) {
    console.warn('Failed to log interaction:', e);
  }
}

function findFormula(id: string | undefined): Formula | undefined {
  if (!id) return undefined;
  return getPhysFormula(id) || getChemFormula(id) || getBioFormula(id);
}

function findAllFormulas() {
  return [...getPhysAll(), ...getChemAll(), ...getBioAll()];
}

export default function FormulaDetail() {
  const { formulaId } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();
  const isUk = i18n.language === 'uk';

  const formula = findFormula(formulaId);
  const bookmarked = formula ? isBookmarked(formula.id) : false;

  useEffect(() => {
    if (formula && user?.uid) {
      safeLogInteraction(user.uid, formula.id, 'view');
    }
  }, [formula?.id, user?.uid]);

  if (!formula) {
    return (
      <div className="container">
        <p>{t('common.error')}</p>
        <Link to="/">{t('common.back')}</Link>
      </div>
    );
  }

  const renderedLatex = katex.renderToString(formula.latex, {
    throwOnError: false,
    displayMode: true
  });

  const allFormulas = findAllFormulas();
  const derivedFormulas = (formula.derivedFormulas || [])
    .map(id => allFormulas.find(f => f.id === id))
    .filter((f): f is Formula => f !== undefined);

  const handleCalculate = () => {
    if (user?.uid) {
      safeLogInteraction(user.uid, formula.id, 'calculation');
    }
  };

  // Build breadcrumb
  const subjectData = formula.subject
    ? subjectDataMap[formula.subject]
    : undefined;
  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('nav.home'), to: '/', icon: '🏠' }
  ];
  if (subjectData) {
    breadcrumbs.push({
      label: subjectData.name,
      labelEn: subjectData.nameEn,
      to: `/subject/${formula.subject}`,
      icon: subjectData.icon
    });
  }
  if (formula.topic) {
    breadcrumbs.push({ label: formula.topic, labelEn: formula.topic });
  }
  breadcrumbs.push({
    label: isUk ? formula.name : (formula.nameEn || formula.name)
  });

  return (
    <div className="formula-detail-page">
      <div className="container">
        <Breadcrumb items={breadcrumbs} />

        <div className="formula-detail animate-fade-in">
          <div className="formula-detail-header">
            <h1 className="formula-detail-title">
              {isUk ? formula.name : (formula.nameEn || formula.name)}
            </h1>
            <button
              className={`bookmark-btn-lg ${bookmarked ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(formula.id)}
              id="formula-bookmark-btn"
            >
              {bookmarked ? '★' : '☆'}
              <span>{t(BOOKMARK_KEY[bookmarked ? 'true' : 'false'])}</span>
            </button>
          </div>

          <div
            className="formula-detail-latex"
            dangerouslySetInnerHTML={{ __html: renderedLatex }}
          />

          <div className="formula-detail-desc">
            <h2>{t('formula.description')}</h2>
            <p>{isUk ? formula.description : (formula.descriptionEn || formula.description)}</p>
          </div>

          <div className="formula-detail-vars">
            <h2>{t('formula.variables')}</h2>
            <div className="vars-table">
              {formula.variables.map(v => (
                <div key={v.symbol} className="var-row">
                  <span className="var-symbol">{v.symbol}</span>
                  <span className="var-name">{isUk ? v.name : (v.nameEn || v.name)}</span>
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
                {derivedFormulas.map(df => {
                  const dfLatex = katex.renderToString(df.latex, { throwOnError: false });
                  return (
                    <Link
                      key={df.id}
                      to={`/formula/${df.id}`}
                      className="derived-card"
                      id={`derived-${df.id}`}
                    >
                      <span className="derived-name">
                        {isUk ? df.name : (df.nameEn || df.name)}
                      </span>
                      <div
                        className="derived-latex"
                        dangerouslySetInnerHTML={{ __html: dfLatex }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calculator */}
          <Calculator formula={formula} />
        </div>
      </div>
    </div>
  );
}
