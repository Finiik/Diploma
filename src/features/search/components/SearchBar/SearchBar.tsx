import { useTranslation } from 'react-i18next';
import { useSearchBox } from '@/features/search/hooks/useSearchBox';
import { SearchDropdown } from './SearchDropdown';
import './SearchBar.css';

export default function SearchBar() {
  const { t } = useTranslation();
  const {
    query,
    results,
    isOpen,
    minQueryLength,
    onQueryChange,
    onFocus,
    onSelect,
    containerRef
  } = useSearchBox();

  return (
    <div className="search-bar" ref={containerRef} id="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={onFocus}
          id="search-input"
        />
      </div>
      {isOpen && (
        <SearchDropdown
          results={results}
          query={query}
          minQueryLength={minQueryLength}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
