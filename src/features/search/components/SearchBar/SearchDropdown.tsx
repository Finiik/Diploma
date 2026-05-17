import { useTranslation } from 'react-i18next';
import type { SearchHit } from '@/shared/types/domain';
import { SearchResultItem } from './SearchResultItem';

type SearchDropdownProps = {
  results: SearchHit[];
  query: string;
  minQueryLength: number;
  onSelect: (item: SearchHit) => void;
};

export function SearchDropdown({
  results,
  query,
  minQueryLength,
  onSelect
}: SearchDropdownProps) {
  const { t } = useTranslation();

  if (results.length > 0) {
    return (
      <div className="search-dropdown animate-scale-in">
        {results.map((item) => (
          <SearchResultItem key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  if (query.length >= minQueryLength) {
    return (
      <div className="search-dropdown animate-scale-in">
        <div className="search-no-results">{t('search.no_results')}</div>
      </div>
    );
  }

  return null;
}
