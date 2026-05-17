import { useTranslation } from 'react-i18next';
import { theoryData } from '@/features/theory/data/theory';
import { useContentFilters } from '@/shared/hooks/useContentFilters';
import SubjectFilterBar from '@/shared/ui/FilterBar/SubjectFilterBar';
import DifficultyFilterBar, {
  type DifficultyOption
} from '@/shared/ui/FilterBar/DifficultyFilterBar';
import TheoryCard from '@/features/theory/components/TheoryCard/TheoryCard';
import './Theory.css';

// Page-specific filter config (the badge scale itself is shared in
// @/shared/lib/difficulty; these are this page's pill labels/icons).
const DIFF_OPTIONS: DifficultyOption[] = [
  { value: 'all', icon: '📊', labelKey: 'difficulty.all' },
  { value: '1', icon: '🟢', labelKey: 'difficulty.beginner' },
  { value: '2', icon: '🟡', labelKey: 'difficulty.intermediate' },
  { value: '3', icon: '🔴', labelKey: 'difficulty.advanced' }
];

export default function Theory() {
  const { t } = useTranslation();
  const { subject, setSubject, difficulty, setDifficulty, filtered } =
    useContentFilters(theoryData);

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
          {filtered.map((th) => (
            <TheoryCard key={th.id} item={th} />
          ))}
        </div>
      </div>
    </div>
  );
}
