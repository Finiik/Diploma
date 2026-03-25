import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import './Layout.css';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p className="footer-text">{t('footer.copyright')}</p>
          <p className="footer-desc">{t('footer.description')}</p>
        </div>
      </footer>
    </div>
  );
}
