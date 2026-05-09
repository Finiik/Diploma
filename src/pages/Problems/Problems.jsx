import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { problemsData } from '../../data/problems';
import './Problems.css';

export default function Problems() {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language === 'uk';
  const [filter, setFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [openSolutions, setOpenSolutions] = useState({});

  const subjects = ['all', 'physics', 'chemistry', 'biology'];

  const filtered = problemsData.filter(p => {
    const matchSubject = filter === 'all' || p.subject === filter;
    const matchDiff = diffFilter === 'all' || p.difficulty === Number(diffFilter);
    return matchSubject && matchDiff;
  });

  const toggleSolution = (id) => {
    setOpenSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const difficultyLabel = (level) => {
    const labels = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' };
    return labels[level] || '⭐';
  };

  const getDiffName = (level) => {
    const names = {
      1: isUk ? 'Легка' : 'Easy',
      2: isUk ? 'Середня' : 'Medium',
      3: isUk ? 'Складна' : 'Hard'
    };
    return names[level] || names[1];
  };

  return (
    <div className="problems-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('problems.title')}</h1>

        <div className="filters-row animate-fade-in">
          <div className="filter-bar">
            {subjects.map(s => (
              <button
                key={s}
                className={`filter-btn ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 'all' ? t('common.all') : t(`subjects.${s}`)}
              </button>
            ))}
          </div>

          <div className="filter-bar difficulty-filter">
            {['all', '1', '2', '3'].map(d => {
              const label = d === 'all'
                ? (isUk ? 'Всі рівні' : 'All levels')
                : `${difficultyLabel(Number(d))} ${getDiffName(Number(d))}`;
              return (
                <button
                  key={d}
                  className={`filter-btn diff-filter-btn ${diffFilter === d ? 'active' : ''}`}
                  onClick={() => setDiffFilter(d)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="problems-list stagger-children">
          {filtered.length === 0 && (
            <p className="no-results">{isUk ? 'Нічого не знайдено' : 'No results found'}</p>
          )}
          {filtered.map(prob => (
            <article key={prob.id} className="problem-card" id={`problem-${prob.id}`}>
              <div className="problem-header">
                <h2 className="problem-title">
                  {isUk ? prob.name : prob.nameEn}
                </h2>
                <span className="problem-difficulty" title={getDiffName(prob.difficulty)}>
                  {difficultyLabel(prob.difficulty)}
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
                {openSolutions[prob.id] ? t('problems.hide_solution') : t('problems.show_solution')}
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
                      {isUk ? 'Перейти до формули →' : 'Go to formula →'}
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
