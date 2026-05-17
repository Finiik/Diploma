import { useTranslation } from 'react-i18next';
import { FormulaCard } from '@/features/formulas';
import { SkeletonGrid } from '@/shared/ui/LoadingSkeleton/LoadingSkeleton';
import { DEFAULT_RECOMMENDATION_COUNT } from '@/features/recommendations/lib/constants';
import type { Formula } from '@/shared/types/domain';

interface RecommendationsFeedProps {
  recommendations: Formula[];
  loading: boolean;
}

/** The "recommended for you" feed on the home page. Presentational only. */
export default function RecommendationsFeed({
  recommendations,
  loading
}: RecommendationsFeedProps) {
  const { t } = useTranslation();

  return (
    <section className="recommendations-section animate-slide-up">
      <div className="container">
        <h2 className="section-title">{t('home.recommended')}</h2>
        {loading ? (
          <SkeletonGrid count={DEFAULT_RECOMMENDATION_COUNT} />
        ) : recommendations.length > 0 ? (
          <div className="formulas-grid">
            {recommendations.map((formula) => (
              <FormulaCard key={formula.id} formula={formula} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
