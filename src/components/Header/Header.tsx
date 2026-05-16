import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

const THEME_TITLE_KEY: Record<string, string> = {
  light: 'theme.dark',
  dark: 'theme.light'
};

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" id="header-logo">
          <span className="logo-icon">🔬</span>
          <span className="logo-text">{t('app.title')}</span>
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`} id="header-nav">
          <Link to="/subject/physics" className="nav-link nav-physics">
            <span className="nav-icon">⚛️</span>{t('nav.physics')}
          </Link>
          <Link to="/subject/chemistry" className="nav-link nav-chemistry">
            <span className="nav-icon">🧪</span>{t('nav.chemistry')}
          </Link>
          <Link to="/subject/biology" className="nav-link nav-biology">
            <span className="nav-icon">🧬</span>{t('nav.biology')}
          </Link>
          <div className="nav-divider"></div>
          <Link to="/theory" className="nav-link">
            <span className="nav-icon">📖</span>{t('nav.theory')}
          </Link>
          <Link to="/problems" className="nav-link">
            <span className="nav-icon">📝</span>{t('nav.problems')}
          </Link>
          <Link to="/bookmarks" className="nav-link nav-bookmarks">
            <span className="nav-icon">⭐</span>{t('nav.bookmarks')}
          </Link>
        </nav>

        {/* Backdrop overlay for mobile menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="header-actions">
          <SearchBar />
          <button
            className="action-btn theme-toggle"
            onClick={toggleTheme}
            title={t(THEME_TITLE_KEY[theme])}
            id="theme-toggle"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="action-btn lang-toggle"
            onClick={toggleLanguage}
            id="lang-toggle"
          >
            {t('language.toggle')}
          </button>
          <button
            className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
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
