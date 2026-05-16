import { useState, useEffect, type DependencyList } from 'react';

/**
 * Runs an async `fetcher` whenever `deps` change, exposing `{ data, loading }`.
 * Errors are swallowed (logged) and leave the previous data in place — the
 * behaviour the pages relied on. A staleness guard prevents a late response
 * from overwriting newer state.
 */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
  initial: T
): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  // `deps` is the caller's trigger list, forwarded verbatim — the standard
  // generic-hook pattern; there is no static dependency to resolve here.
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetcher()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        console.warn('useAsyncResource: fetch failed', e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, deps);

  return { data, loading };
}
