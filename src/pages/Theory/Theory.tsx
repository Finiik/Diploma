import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { theoryData } from '@/data/theory';
import { useLocalized } from '@/shared/hooks/useLocalized';
import { useContentFilters } from '@/shared/hooks/useContentFilters';
import SubjectFilterBar from '@/components/FilterBar/SubjectFilterBar';
import DifficultyFilterBar, {
  type DifficultyOption
} from '@/components/FilterBar/DifficultyFilterBar';
import './Theory.css';

interface DifficultyBadge {
  key: string;
  cls: string;
  icon: string;
}

const SUBJECT_ICON: Record<string, string> = {
  physics: '⚛️',
  chemistry: '🧪',
  biology: '🧬'
};
const DIFF_BADGE: Record<string, DifficultyBadge> = {
  1: { key: 'difficulty.beginner', cls: 'diff-beginner', icon: '🟢' },
  2: { key: 'difficulty.intermediate', cls: 'diff-intermediate', icon: '🟡' },
  3: { key: 'difficulty.advanced', cls: 'diff-advanced', icon: '🔴' }
};
const DIFF_OPTIONS: DifficultyOption[] = [
  { value: 'all', icon: '📊', labelKey: 'difficulty.all' },
  { value: '1', icon: '🟢', labelKey: 'difficulty.beginner' },
  { value: '2', icon: '🟡', labelKey: 'difficulty.intermediate' },
  { value: '3', icon: '🔴', labelKey: 'difficulty.advanced' }
];

export default function Theory() {
  const { t } = useTranslation();
  const tr = useLocalized();
  const { subject, setSubject, difficulty, setDifficulty, filtered } =
    useContentFilters(theoryData);

  const getSubjectIcon = (s: string) => SUBJECT_ICON[s] || '📚';
  const getDifficultyBadge = (level: number): DifficultyBadge =>
    DIFF_BADGE[level] || DIFF_BADGE[1];

  return (
    <div className="theory-page">
      <div className="container">
        <h1 className="page-title animate-fade-in">{t('theory.title')}</h1>

        <div className="filters-row animate-fade-in">
          <SubjectFilterBar value={subject} onChange={setSubject} />
          <DifficultyFilterBar
            value={difficulty}
            onChange={setDifficulty}
            options={DIFF_OPTIONS}
            iconClassName="diff-icon"
          />
        </div>

        <div className="theory-list stagger-children">
          {filtered.length === 0 && (
            <p className="no-results">{t('common.no_results')}</p>
          )}
          {filtered.map((th) => {
            const badge = getDifficultyBadge(th.difficulty);
            return (
              <article
                key={th.id}
                className={`theory-card subject-${th.subject}`}
              >
                <div className="theory-card-header">
                  <span className="theory-icon">
                    {getSubjectIcon(th.subject)}
                  </span>
                  <div>
                    <h2 className="theory-card-title">{tr(th, 'name')}</h2>
                    <p className="theory-card-topic">{th.topic}</p>
                  </div>
                  <span className={`difficulty-badge ${badge.cls}`}>
                    {badge.icon} {t(badge.key)}
                  </span>
                </div>
                <p className="theory-card-desc">{tr(th, 'description')}</p>
                <div className="theory-content">
                  {tr(th, 'content')
                    .split('\n\n')
                    .map((para, i) => (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: para
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }}
                      />
                    ))}
                </div>
                {th.relatedFormulas && th.relatedFormulas.length > 0 && (
                  <div className="theory-related">
                    <span className="theory-related-label">
                      {t('theory.related_formulas')}
                    </span>
                    {th.relatedFormulas.map((fId) => (
                      <Link
                        key={fId}
                        to={`/formula/${fId}`}
                        className="theory-related-link"
                      >
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
