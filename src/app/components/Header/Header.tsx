import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggleButton } from '@/features/theme';
import { SearchBar } from '@/features/search';
import { useMobileMenu } from '@/shared/hooks/useMobileMenu';
import { useLanguageToggle } from '@/shared/i18n/useLanguageToggle';
import { subjectIcon } from '@/shared/lib/subjectIcon';
import { SUBJECTS, SUBJECT_REGISTRY } from '@/shared/lib/subjects';
import './Header.css';

export default function Header() {
  const { t } = useTranslation();
  const { toggleLanguage } = useLanguageToggle();
  const {
    open: mobileMenuOpen,
    toggle: toggleMobileMenu,
    close: closeMobileMenu
  } = useMobileMenu();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" id="header-logo">
          <span className="logo-icon">🔬</span>
          <span className="logo-text">{t('app.title')}</span>
        </Link>

        <nav
          className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}
          id="header-nav"
        >
          {SUBJECTS.map((s) => (
            <Link
              key={s}
              to={SUBJECT_REGISTRY[s].route}
              className={`nav-link nav-${s}`}
            >
              <span className="nav-icon">{subjectIcon(s)}</span>
              {t(SUBJECT_REGISTRY[s].navKey)}
            </Link>
          ))}
          <div className="nav-divider"></div>
          <Link to="/theory" className="nav-link">
            <span className="nav-icon">📖</span>
            {t('nav.theory')}
          </Link>
          <Link to="/problems" className="nav-link">
            <span className="nav-icon">📝</span>
            {t('nav.problems')}
          </Link>
          <Link to="/bookmarks" className="nav-link nav-bookmarks">
            <span className="nav-icon">⭐</span>
            {t('nav.bookmarks')}
          </Link>
        </nav>

        {/* Backdrop overlay for mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-backdrop" onClick={closeMobileMenu} />
        )}

        <div className="header-actions">
          <SearchBar />
          <ThemeToggleButton />
          <button
            className="action-btn lang-toggle"
            onClick={toggleLanguage}
            id="lang-toggle"
          >
            {t('language.toggle')}
          </button>
          <button
            className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={t('a11y.menu')}
            id="hamburger-btn"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
