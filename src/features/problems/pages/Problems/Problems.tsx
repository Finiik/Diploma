import { useTranslation } from 'react-i18next';
import { problemsData } from '@/features/problems/data/problems';
import { useExpandedSet } from '@/shared/hooks/useExpandedSet';
import { useContentFilters } from '@/shared/hooks/useContentFilters';
import SubjectFilterBar from '@/shared/ui/FilterBar/SubjectFilterBar';
import DifficultyFilterBar, {
  type DifficultyOption
} from '@/shared/ui/FilterBar/DifficultyFilterBar';
import ProblemCard from '@/features/problems/components/ProblemCard/ProblemCard';
import './Problems.css';

// Page-specific filter config (the difficulty scale itself is shared in
// @/shared/lib/difficulty; these are this page's pill labels/icons).
const DIFF_OPTIONS: DifficultyOption[] = [
  { value: 'all', labelKey: 'difficulty.all' },
  { value: '1', icon: '⭐', labelKey: 'problems.diff_1' },
  { value: '2', icon: '⭐⭐', labelKey: 'problems.diff_2' },
  { value: '3', icon: '⭐⭐⭐', labelKey: 'problems.diff_3' }
];

export default function Problems() {
  const { t } = useTranslation();
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
          {filtered.map((prob) => (
            <ProblemCard
              key={prob.id}
              problem={prob}
              isOpen={isOpen(prob.id)}
              onToggle={() => toggle(prob.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
