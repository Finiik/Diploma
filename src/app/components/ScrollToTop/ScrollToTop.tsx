import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Behaviour-only: scrolls to the top on every route change. Renders
 * nothing. Extracted from Layout so the shell composer owns *composition*,
 * not scroll-restoration policy (Single Responsibility).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
