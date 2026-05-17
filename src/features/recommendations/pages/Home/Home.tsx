import { useTranslation } from 'react-i18next';
import { useAuth } from '@/shared/auth/AuthContext';
import { getRecommendations } from '@/features/recommendations/services/recommendations';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { DEFAULT_RECOMMENDATION_COUNT } from '@/features/recommendations/lib/constants';
import SubjectsGrid from '@/features/recommendations/components/SubjectsGrid/SubjectsGrid';
import RecommendationsFeed from '@/features/recommendations/components/RecommendationsFeed/RecommendationsFeed';
import type { Formula } from '@/shared/types/domain';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: recommendations, loading: recsLoading } = useAsyncResource<
    Formula[]
  >(
    () => getRecommendations(user?.uid, DEFAULT_RECOMMENDATION_COUNT),
    [user],
    []
  );

  return (
    <div className="home-page">
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

      <SubjectsGrid />

      <RecommendationsFeed
        recommendations={recommendations}
        loading={recsLoading}
      />
    </div>
  );
}
