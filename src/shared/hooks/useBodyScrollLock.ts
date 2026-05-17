import { useEffect } from 'react';

/** Locks `<body>` scrolling while `locked` is true; always restores on cleanup. */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [locked]);
}
