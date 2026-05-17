import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { search } from '@/services/search';
import type { SearchHit, ContentType, Subject } from '@/shared/types/domain';
import { useLocalized } from '@/hooks/useLocalized';
import { useClickOutside } from '@/hooks/useClickOutside';
import { resolveNavPath } from '@/shared/lib/navigation';
import './SearchBar.css';

const SEARCH_TYPE_KEY: Record<ContentType, string> = {
  formula: 'search.type_formula',
  theory: 'search.type_theory',
  problem: 'search.type_problem'
};

export default function SearchBar() {
  const { t } = useTranslation();
  const tr = useLocalized();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const searchResults = search(value);
      setResults(searchResults.slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (item: SearchHit) => {
    setIsOpen(false);
    setQuery('');
    const path = resolveNavPath(item);
    if (path) navigate(path);
  };

  const getSubjectColor = (subject: Subject) => {
    if (subject === 'physics') return 'var(--color-physics)';
    if (subject === 'chemistry') return 'var(--color-chemistry)';
    if (subject === 'biology') return 'var(--color-biology)';
    return 'var(--color-primary)';
  };

  return (
    <div className="search-bar" ref={ref} id="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          id="search-input"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-dropdown animate-scale-in">
          {results.map((item) => (
            <button
              key={item.id}
              className="search-result-item"
              onClick={() => handleSelect(item)}
            >
              <div className="search-result-info">
                <span className="search-result-name">{tr(item, 'name')}</span>
                <span className="search-result-desc">
                  {tr(item, 'description').slice(0, 60)}...
                </span>
              </div>
              <span
                className="search-result-badge"
                style={{ background: getSubjectColor(item.subject) }}
              >
                {t(SEARCH_TYPE_KEY[item.type])}
              </span>
            </button>
          ))}
        </div>
      )}
      {isOpen && results.length === 0 && query.length >= 2 && (
        <div className="search-dropdown animate-scale-in">
          <div className="search-no-results">{t('search.no_results')}</div>
        </div>
      )}
    </div>
  );
}
