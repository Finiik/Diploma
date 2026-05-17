import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '@/features/search/services/search';
import type { SearchHit } from '@/shared/types/domain';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { resolveNavPath } from '@/shared/lib/navigation';

const MAX_RESULTS = 8;
const MIN_QUERY_LENGTH = 2;

/** Search-box state machine: query/results/open state, the min-length
    gate, click-outside dismissal, and navigation on select. */
export function useSearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const onQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim().length >= MIN_QUERY_LENGTH) {
      setResults(search(value).slice(0, MAX_RESULTS));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const onFocus = () => {
    if (query.length >= MIN_QUERY_LENGTH) setIsOpen(true);
  };

  const onSelect = (item: SearchHit) => {
    setIsOpen(false);
    setQuery('');
    const path = resolveNavPath(item);
    if (path) navigate(path);
  };

  return {
    query,
    results,
    isOpen,
    minQueryLength: MIN_QUERY_LENGTH,
    onQueryChange,
    onFocus,
    onSelect,
    containerRef
  };
}
