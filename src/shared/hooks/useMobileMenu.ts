import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBodyScrollLock } from './useBodyScrollLock';

/**
 * Mobile-nav open/close state machine: closes on route change and locks
 * body scroll while open. Encapsulates the menu's behaviour so layout
 * components stay declarative.
 */
export function useMobileMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useBodyScrollLock(open);

  return {
    open,
    toggle: () => setOpen((v) => !v),
    close: () => setOpen(false)
  };
}
