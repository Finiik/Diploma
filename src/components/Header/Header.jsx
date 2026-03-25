import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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

        <nav className="header-nav" id="header-nav">
          <Link to="/subject/physics" className="nav-link nav-physics">{t('nav.physics')}</Link>
          <Link to="/subject/chemistry" className="nav-link nav-chemistry">{t('nav.chemistry')}</Link>
          <Link to="/subject/biology" className="nav-link nav-biology">{t('nav.biology')}</Link>
          <Link to="/theory" className="nav-link">{t('nav.theory')}</Link>
          <Link to="/problems" className="nav-link">{t('nav.problems')}</Link>
          <Link to="/bookmarks" className="nav-link nav-bookmarks">{t('nav.bookmarks')}</Link>
        </nav>

        <div className="header-actions">
          <SearchBar />
          <button
            className="action-btn theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? t('theme.dark') : t('theme.light')}
            id="theme-toggle"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="action-btn lang-toggle"
            onClick={toggleLanguage}
            id="lang-toggle"
          >
            {i18n.language === 'uk' ? 'EN' : 'UA'}
          </button>
        </div>
      </div>
    </header>
  );
}
