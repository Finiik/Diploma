import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { physicsData } from '../../data/physics';
import { chemistryData } from '../../data/chemistry';
import { biologyData } from '../../data/biology';
import FormulaCard from '../../components/FormulaCard/FormulaCard';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import type { SubjectData } from '../../types/domain';
import { useLocalized } from '../../hooks/useLocalized';
import './Subject.css';

const subjectMap: Record<string, SubjectData | undefined> = {
  physics: physicsData,
  chemistry: chemistryData,
  biology: biologyData
};

export default function Subject() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { t } = useTranslation();
  const tr = useLocalized();
  const subject = subjectId ? subjectMap[subjectId] : undefined;

  if (!subject) {
    return (
      <div className="container">
        <p>{t('common.error')}</p>
        <Link to="/">{t('common.back')}</Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t('nav.home'), to: '/', icon: '🏠' },
    { label: subject.name, labelEn: subject.nameEn, icon: subject.icon }
  ];

  return (
    <div className="subject-page">
      <div className="container">
        <Breadcrumb items={breadcrumbs} />

        <div className="subject-header animate-fade-in">
          <div className="subject-title-row">
            <span className="subject-page-icon">{subject.icon}</span>
            <h1 className="page-title">{tr(subject, 'name')}</h1>
          </div>
        </div>

        <div className="topics-list stagger-children">
          {subject.topics.map((topic) => (
            <div key={topic.id} className="topic-section" id={`topic-${topic.id}`}>
              <h2 className="topic-title">{tr(topic, 'name')}</h2>

              {topic.subtopics.map((subtopic) => (
                <div key={subtopic.id} className="subtopic-section" id={`subtopic-${subtopic.id}`}>
                  <h3 className="subtopic-title">{tr(subtopic, 'name')}</h3>
                  <div className="formulas-grid">
                    {subtopic.formulas.map((formula) => (
                      <FormulaCard
                        key={formula.id}
                        formula={{ ...formula, subject: subject.id }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
