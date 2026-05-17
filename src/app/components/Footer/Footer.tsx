import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subjectIcon } from '@/shared/lib/subjectIcon';
import { SUBJECTS, SUBJECT_REGISTRY } from '@/shared/lib/subjects';

/** The site footer. Presentational; styling is global (Layout.css). */
export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🔬 {t('app.title')}</span>
          <p className="footer-desc">{t('footer.description')}</p>
        </div>
        <div className="footer-links">
          <h4 className="footer-heading">{t('footer.subjects')}</h4>
          {SUBJECTS.map((s) => (
            <Link key={s} to={SUBJECT_REGISTRY[s].route}>
              {subjectIcon(s)} {t(SUBJECT_REGISTRY[s].navKey)}
            </Link>
          ))}
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
  );
}
