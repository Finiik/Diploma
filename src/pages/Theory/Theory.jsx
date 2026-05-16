import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { theoryData } from '../../data/theory';
import './Theory.css';

const SUBJECTS = ['all', 'physics', 'chemistry', 'biology'];
const DIFF_FILTERS = ['all', '1', '2', '3'];
const SUBJECT_ICON = { physics: '⚛️', chemistry: '🧪', biology: '🧬' };
const DIFF_BADGE = {
  1: { key: 'difficulty.beginner', cls: 'diff-beginner', icon: '🟢' },
  2: { key: 'difficulty.intermediate', cls: 'diff-intermediate', icon: '🟡' },
  3: { key: 'difficulty.advanced', cls: 'diff-advanced', icon: '🔴' }
};
const DIFF_FILTER_ICON = { all: '📊', 1: '🟢', 2: '🟡', 3: '🔴' };
const DIFF_FILTER_KEY = {
  all: 'difficulty.all',
  1: 'difficulty.beginner',
  2: 'difficulty.intermediate',
  3: 'difficulty.advanced'
};

export default function Theory() {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language === 'uk';
  const [filter, setFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');

  const filtered = theoryData.filter(th => {
    const matchSubject = filter === 'all' || th.subject === filter;
    const matchDiff = diffFilter === 'all' || th.difficulty === Number(diffFilter);
    return matchSubject && matchDiff;
  });

  const getSubjectIcon = (s) => SUBJECT_ICON[s] || '📚';
  const getDifficultyBadge = (level) => DIFF_BADGE[level] || DIFF_BADGE[1];

  return (
    <div className="theory-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('theory.title')}</h1>

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
                <span className="diff-icon">{DIFF_FILTER_ICON[d]}</span> {t(DIFF_FILTER_KEY[d])}
              </button>
            ))}
          </div>
        </div>

        <div className="theory-list stagger-children">
          {filtered.length === 0 && (
            <p className="no-results">{t('common.no_results')}</p>
          )}
          {filtered.map(th => {
            const badge = getDifficultyBadge(th.difficulty);
            return (
              <article key={th.id} className={`theory-card subject-${th.subject}`}>
                <div className="theory-card-header">
                  <span className="theory-icon">{getSubjectIcon(th.subject)}</span>
                  <div>
                    <h2 className="theory-card-title">
                      {isUk ? th.name : th.nameEn}
                    </h2>
                    <p className="theory-card-topic">
                      {isUk ? th.topic : th.topic}
                    </p>
                  </div>
                  <span className={`difficulty-badge ${badge.cls}`}>
                    {badge.icon} {t(badge.key)}
                  </span>
                </div>
                <p className="theory-card-desc">
                  {isUk ? th.description : th.descriptionEn}
                </p>
                <div className="theory-content">
                  {(isUk ? th.content : th.contentEn).split('\n\n').map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{
                      __html: para
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }} />
                  ))}
                </div>
                {th.relatedFormulas && th.relatedFormulas.length > 0 && (
                  <div className="theory-related">
                    <span className="theory-related-label">
                      {t('theory.related_formulas')}
                    </span>
                    {th.relatedFormulas.map(fId => (
                      <Link key={fId} to={`/formula/${fId}`} className="theory-related-link">
                        {fId.replace(/^(phys_|chem_|bio_)/, '')}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
