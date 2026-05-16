import { useState, useCallback } from 'react';

/**
 * Tracks which ids are "expanded" (accordion / show-more behaviour).
 * Replaces the ad-hoc `Record<string, boolean>` + toggler pattern.
 */
export function useExpandedSet() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const isOpen = useCallback((id: string) => !!open[id], [open]);

  const toggle = useCallback((id: string) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return { isOpen, toggle };
}
