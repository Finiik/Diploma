import { Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../Header/Header';
import './Layout.css';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">🔬 {t('app.title')}</span>
            <p className="footer-desc">{t('footer.description')}</p>
          </div>
          <div className="footer-links">
            <h4 className="footer-heading">{t('footer.subjects')}</h4>
            <Link to="/subject/physics">⚛️ {t('nav.physics')}</Link>
            <Link to="/subject/chemistry">🧪 {t('nav.chemistry')}</Link>
            <Link to="/subject/biology">🧬 {t('nav.biology')}</Link>
          </div>
          <div className="footer-links">
            <h4 className="footer-heading">{t('footer.resources')}</h4>
            <Link to="/theory">{t('nav.theory')}</Link>
            <Link to="/problems">{t('nav.problems')}</Link>
            <Link to="/bookmarks">{t('nav.bookmarks')}</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <p className="footer-copyright">{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
