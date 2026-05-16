import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { problemsData } from '../../data/problems';
import './Problems.css';

const SUBJECTS = ['all', 'physics', 'chemistry', 'biology'];
const DIFF_FILTERS = ['all', '1', '2', '3'];
const DIFF_STARS: Record<string, string> = { all: '', 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' };
const DIFF_KEY: Record<string, string> = {
  all: 'difficulty.all',
  1: 'problems.diff_1',
  2: 'problems.diff_2',
  3: 'problems.diff_3'
};
const SOLUTION_TOGGLE_KEY: Record<'true' | 'false', string> = {
  true: 'problems.hide_solution',
  false: 'problems.show_solution'
};

export default function Problems() {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language === 'uk';
  const [filter, setFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  const filtered = problemsData.filter(p => {
    const matchSubject = filter === 'all' || p.subject === filter;
    const matchDiff = diffFilter === 'all' || p.difficulty === Number(diffFilter);
    return matchSubject && matchDiff;
  });

  const toggleSolution = (id: string) => {
    setOpenSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="problems-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('problems.title')}</h1>

        <div className="filters-row animate-fade-in">
          <div className="filter-bar">
            {SUBJECTS.map(s => (
              <button
                key={s}
                className={`filter-btn ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {t(`subjects.${s}`)}
              </button>
            ))}
          </div>

          <div className="filter-bar difficulty-filter">
            {DIFF_FILTERS.map(d => (
              <button
                key={d}
                className={`filter-btn diff-filter-btn ${diffFilter === d ? 'active' : ''}`}
                onClick={() => setDiffFilter(d)}
              >
                {DIFF_STARS[d] && <span className="diff-stars">{DIFF_STARS[d]}</span>}{' '}
                {t(DIFF_KEY[d])}
              </button>
            ))}
          </div>
        </div>

        <div className="problems-list stagger-children">
          {filtered.length === 0 && (
            <p className="no-results">{t('common.no_results')}</p>
          )}
          {filtered.map(prob => (
            <article key={prob.id} className="problem-card" id={`problem-${prob.id}`}>
              <div className="problem-header">
                <h2 className="problem-title">
                  {isUk ? prob.name : prob.nameEn}
                </h2>
                <span className="problem-difficulty" title={t(`problems.diff_${prob.difficulty}`)}>
                  {DIFF_STARS[prob.difficulty]}
                </span>
              </div>

              <p className="problem-desc">
                {isUk ? prob.description : prob.descriptionEn}
              </p>

              <button
                className="solution-toggle"
                onClick={() => toggleSolution(prob.id)}
                id={`solution-toggle-${prob.id}`}
              >
                {t(SOLUTION_TOGGLE_KEY[openSolutions[prob.id] ? 'true' : 'false'])}
                <span className={`toggle-arrow ${openSolutions[prob.id] ? 'open' : ''}`}>▼</span>
              </button>

              {openSolutions[prob.id] && (
                <div className="solution animate-slide-up">
                  {prob.steps.map((step, i) => (
                    <div key={i} className="solution-step">
                      <span className="step-number">{t('problems.step')} {i + 1}</span>
                      <p className="step-text">{isUk ? step.text : step.textEn}</p>
                    </div>
                  ))}
                  <div className="solution-answer">
                    <strong>{t('formula.result')}:</strong>{' '}
                    {isUk ? prob.answer : prob.answerEn}
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
