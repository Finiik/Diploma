import { useTranslation } from 'react-i18next';
import type { SearchHit, ContentType } from '@/shared/types/domain';
import { useLocalized } from '@/shared/hooks/useLocalized';
import { subjectColor } from '@/shared/lib/subjectColor';
import { truncate } from '@/shared/lib/truncate';

const SEARCH_TYPE_KEY: Record<ContentType, string> = {
  formula: 'search.type_formula',
  theory: 'search.type_theory',
  problem: 'search.type_problem'
};

type SearchResultItemProps = {
  item: SearchHit;
  onSelect: (item: SearchHit) => void;
};

export function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  const { t } = useTranslation();
  const tr = useLocalized();

  return (
    <button className="search-result-item" onClick={() => onSelect(item)}>
      <div className="search-result-info">
        <span className="search-result-name">{tr(item, 'name')}</span>
        <span className="search-result-desc">
          {truncate(tr(item, 'description'), 60)}
        </span>
      </div>
      <span
        className="search-result-badge"
        style={{ background: subjectColor(item.subject) }}
      >
        {t(SEARCH_TYPE_KEY[item.type])}
      </span>
    </button>
  );
}
