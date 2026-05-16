import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { problemsData } from '@/data/problems';
import { useLocalized } from '@/hooks/useLocalized';
import { useExpandedSet } from '@/hooks/useExpandedSet';
import { useContentFilters } from '@/hooks/useContentFilters';
import SubjectFilterBar from '@/components/FilterBar/SubjectFilterBar';
import DifficultyFilterBar, { type DifficultyOption } from '@/components/FilterBar/DifficultyFilterBar';
import './Problems.css';

const DIFF_STARS: Record<string, string> = { all: '', 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' };
const DIFF_OPTIONS: DifficultyOption[] = [
  { value: 'all', labelKey: 'difficulty.all' },
  { value: '1', icon: '⭐', labelKey: 'problems.diff_1' },
  { value: '2', icon: '⭐⭐', labelKey: 'problems.diff_2' },
  { value: '3', icon: '⭐⭐⭐', labelKey: 'problems.diff_3' }
];
const SOLUTION_TOGGLE_KEY: Record<'true' | 'false', string> = {
  true: 'problems.hide_solution',
  false: 'problems.show_solution'
};

export default function Problems() {
  const { t } = useTranslation();
  const tr = useLocalized();
  const { isOpen, toggle } = useExpandedSet();
  const { subject, setSubject, difficulty, setDifficulty, filtered } =
    useContentFilters(problemsData);

  return (
    <div className="problems-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('problems.title')}</h1>

        <div className="filters-row animate-fade-in">
          <SubjectFilterBar value={subject} onChange={setSubject} />
          <DifficultyFilterBar
            value={difficulty}
            onChange={setDifficulty}
            options={DIFF_OPTIONS}
            iconClassName="diff-stars"
          />
        </div>

        <div className="problems-list stagger-children">
          {filtered.length === 0 && (
            <p className="no-results">{t('common.no_results')}</p>
          )}
          {filtered.map(prob => (
            <article key={prob.id} className="problem-card" id={`problem-${prob.id}`}>
              <div className="problem-header">
                <h2 className="problem-title">
                  {tr(prob, 'name')}
                </h2>
                <span className="problem-difficulty" title={t(`problems.diff_${prob.difficulty}`)}>
                  {DIFF_STARS[prob.difficulty]}
                </span>
              </div>

              <p className="problem-desc">
                {tr(prob, 'description')}
              </p>

              <button
                className="solution-toggle"
                onClick={() => toggle(prob.id)}
                id={`solution-toggle-${prob.id}`}
              >
                {t(SOLUTION_TOGGLE_KEY[isOpen(prob.id) ? 'true' : 'false'])}
                <span className={`toggle-arrow ${isOpen(prob.id) ? 'open' : ''}`}>▼</span>
              </button>

              {isOpen(prob.id) && (
                <div className="solution animate-slide-up">
                  {prob.steps.map((step, i) => (
                    <div key={i} className="solution-step">
                      <span className="step-number">{t('problems.step')} {i + 1}</span>
                      <p className="step-text">{tr(step, 'text')}</p>
                    </div>
                  ))}
                  <div className="solution-answer">
                    <strong>{t('formula.result')}:</strong>{' '}
                    {tr(prob, 'answer')}
                  </div>
                  {prob.relatedFormula && (
                    <Link to={`/formula/${prob.relatedFormula}`} className="problem-formula-link">
                      {t('problems.go_to_formula')}
                    </Link>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
