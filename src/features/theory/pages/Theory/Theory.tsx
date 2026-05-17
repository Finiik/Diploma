import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { theoryData } from '@/features/theory/data/theory';
import { useLocalized } from '@/shared/hooks/useLocalized';
import { useContentFilters } from '@/shared/hooks/useContentFilters';
import { subjectIcon } from '@/shared/lib/subjectIcon';
import { stripFormulaIdPrefix } from '@/shared/lib/formulaId';
import Markdown from '@/shared/ui/Markdown/Markdown';
import SubjectFilterBar from '@/shared/ui/FilterBar/SubjectFilterBar';
import DifficultyFilterBar, {
  type DifficultyOption
} from '@/shared/ui/FilterBar/DifficultyFilterBar';
import './Theory.css';

interface DifficultyBadge {
  key: string;
  cls: string;
  icon: string;
}

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
                  <span className="theory-icon">{subjectIcon(th.subject)}</span>
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
                  <Markdown text={tr(th, 'content')} />
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
                        {stripFormulaIdPrefix(fId)}
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
