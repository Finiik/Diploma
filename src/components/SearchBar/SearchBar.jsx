import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { search } from '../../services/search';
import './SearchBar.css';

export default function SearchBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
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

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery('');
    if (item.type === 'formula') {
      navigate(`/formula/${item.id}`);
    } else if (item.type === 'theory') {
      navigate(`/theory`);
    } else if (item.type === 'problem') {
      navigate(`/problems`);
    }
  };

  const isUk = i18n.language === 'uk';

  const getTypeLabel = (type) => {
    if (type === 'formula') return isUk ? 'Формула' : 'Formula';
    if (type === 'theory') return isUk ? 'Теорія' : 'Theory';
    if (type === 'problem') return isUk ? 'Задача' : 'Problem';
    return type;
  };

  const getSubjectColor = (subject) => {
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
                <span className="search-result-name">
                  {isUk ? item.name : (item.nameEn || item.name)}
                </span>
                <span className="search-result-desc">
                  {isUk ? (item.description || '').slice(0, 60) : (item.descriptionEn || item.description || '').slice(0, 60)}...
                </span>
              </div>
              <span
                className="search-result-badge"
                style={{ background: getSubjectColor(item.subject) }}
              >
                {getTypeLabel(item.type)}
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
