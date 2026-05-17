import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subjectIcon } from '@/shared/lib/subjectIcon';
import type { Subject } from '@/shared/types/domain';

/** The subjects surfaced on the landing page, in display order. */
const HOME_SUBJECTS: Subject[] = ['physics', 'chemistry', 'biology'];

/** The subject-cards grid on the home page. Presentational only. */
export default function SubjectsGrid() {
  const { t } = useTranslation();

  return (
    <section className="subjects-section">
      <div className="container">
        <div className="subjects-grid stagger-children">
          {HOME_SUBJECTS.map((id) => (
            <Link
              key={id}
              to={`/subject/${id}`}
              className={`subject-card subject-${id}`}
              id={`subject-card-${id}`}
            >
              <div className="subject-icon">{subjectIcon(id)}</div>
              <h2 className="subject-name">{t(`subjects.${id}`)}</h2>
              <p className="subject-desc">{t(`subjects.${id}_desc`)}</p>
              <span className="subject-cta">{t('home.explore')} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
