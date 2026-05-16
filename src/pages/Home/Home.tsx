import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRecommendations } from '../../services/recommendations';
import FormulaCard from '../../components/FormulaCard/FormulaCard';
import { SkeletonGrid } from '../../components/LoadingSkeleton/LoadingSkeleton';
import type { Formula } from '../../types/domain';
import './Home.css';

const subjects = [
  { id: 'physics', icon: '⚛️', color: 'physics' },
  { id: 'chemistry', icon: '🧪', color: 'chemistry' },
  { id: 'biology', icon: '🧬', color: 'biology' }
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Formula[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const isUk = i18n.language === 'uk';

  useEffect(() => {
    async function loadRecs() {
      setRecsLoading(true);
      try {
        const recs = await getRecommendations(user?.uid, 6);
        setRecommendations(recs);
      } catch (e) {
        console.warn('Failed to load recommendations:', e);
      } finally {
        setRecsLoading(false);
      }
    }
    loadRecs();
  }, [user]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{t('home.hero_title')}</h1>
            <p className="hero-subtitle">{t('home.hero_subtitle')}</p>
          </div>
        </div>
        <div className="hero-bg-decoration">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
      </section>

      {/* Subjects */}
      <section className="subjects-section">
        <div className="container">
          <div className="subjects-grid stagger-children">
            {subjects.map((subj) => (
              <Link
                key={subj.id}
                to={`/subject/${subj.id}`}
                className={`subject-card subject-${subj.color}`}
                id={`subject-card-${subj.id}`}
              >
                <div className="subject-icon">{subj.icon}</div>
                <h2 className="subject-name">{t(`subjects.${subj.id}`)}</h2>
                <p className="subject-desc">{t(`subjects.${subj.id}_desc`)}</p>
                <span className="subject-cta">
                  {t('home.explore')} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="recommendations-section animate-slide-up">
        <div className="container">
          <h2 className="section-title">{t('home.recommended')}</h2>
          {recsLoading ? (
            <SkeletonGrid count={3} />
          ) : recommendations.length > 0 ? (
            <div className="formulas-grid">
              {recommendations.map((formula) => (
                <FormulaCard key={formula.id} formula={formula} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
