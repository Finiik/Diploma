import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { problemsData } from '../../data/problems';
import './Problems.css';

export default function Problems() {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language === 'uk';
  const [filter, setFilter] = useState('all');
  const [openSolutions, setOpenSolutions] = useState({});

  const subjects = ['all', 'physics', 'chemistry', 'biology'];
  const filtered = filter === 'all' ? problemsData : problemsData.filter(p => p.subject === filter);

  const toggleSolution = (id) => {
    setOpenSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const difficultyLabel = (level) => {
    const labels = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' };
    return labels[level] || '⭐';
  };

  return (
    <div className="problems-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('problems.title')}</h1>

        <div className="filter-bar animate-fade-in">
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

        <div className="problems-list stagger-children">
          {filtered.map(prob => (
            <article key={prob.id} className="problem-card" id={`problem-${prob.id}`}>
              <div className="problem-header">
                <h2 className="problem-title">
                  {isUk ? prob.name : prob.nameEn}
                </h2>
                <span className="problem-difficulty">
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
