import { useTranslation } from 'react-i18next';
import { SUBJECTS } from '@/shared/lib/subjects';

const SUBJECT_FILTERS = ['all', ...SUBJECTS];

interface SubjectFilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

/** The "All / Physics / Chemistry / Biology" pill row (shared by Theory & Problems). */
export default function SubjectFilterBar({
  value,
  onChange
}: SubjectFilterBarProps) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      {SUBJECT_FILTERS.map((s) => (
        <button
          key={s}
          className={`filter-btn ${value === s ? 'active' : ''}`}
          onClick={() => onChange(s)}
        >
          {t(`subjects.${s}`)}
        </button>
      ))}
    </div>
  );
}
