import { useEffect, useRef, type RefObject } from 'react';

/**
 * Calls `onOutside` on a mousedown outside `ref`. Subscribes once (the latest
 * callback is read via a ref) so passing an inline closure doesn't re-bind
 * the listener every render.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void
): void {
  const cb = useRef(onOutside);
  cb.current = onOutside;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        cb.current();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref]);
}
