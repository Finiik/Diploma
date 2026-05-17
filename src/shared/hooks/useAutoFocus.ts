import { useEffect, type RefObject } from 'react';

/** Focuses `ref` (after an optional delay) whenever `active` becomes true. */
export function useAutoFocus<T extends HTMLElement>(
  ref: RefObject<T | null>,
  active: boolean,
  delayMs = 0
): void {
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => ref.current?.focus(), delayMs);
    return () => clearTimeout(id);
  }, [ref, active, delayMs]);
}
