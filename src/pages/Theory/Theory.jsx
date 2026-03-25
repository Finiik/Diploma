import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { theoryData } from '../../data/theory';
import './Theory.css';

export default function Theory() {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language === 'uk';
  const [filter, setFilter] = useState('all');

  const subjects = ['all', 'physics', 'chemistry', 'biology'];
  const filtered = filter === 'all' ? theoryData : theoryData.filter(th => th.subject === filter);

  const getSubjectIcon = (s) => {
    if (s === 'physics') return '⚛️';
    if (s === 'chemistry') return '🧪';
    if (s === 'biology') return '🧬';
    return '📚';
  };

  return (
    <div className="theory-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('theory.title')}</h1>

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

        <div className="theory-list stagger-children">
          {filtered.map(th => (
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
                    {isUk ? 'Пов\'язані формули:' : 'Related formulas:'}
                  </span>
                  {th.relatedFormulas.map(fId => (
                    <Link key={fId} to={`/formula/${fId}`} className="theory-related-link">
                      {fId.replace(/^(phys_|chem_|bio_)/, '')}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
