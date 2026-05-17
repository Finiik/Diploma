/* ============================================
   Collaborative Filtering Recommendation Engine
   This module owns only the recommendation pipeline: resolve the corpus
   and the user's row, then either cold-start to popularity or rank by
   similar-user interest. The interaction corpus is supplied by
   interactionSources; all the math lives in lib/similarity.
   ============================================ */

import { getAllFormulas, findFormulasByIds } from '@/features/formulas';
import type { Formula } from '@/shared/types/domain';
import {
  DEFAULT_RECOMMENDATION_COUNT,
  SIMILAR_USERS_NEIGHBOURHOOD
} from '@/features/recommendations/lib/constants';
import {
  buildUserVector,
  findSimilarUsers,
  aggregateNeighbourScores,
  rankByPopularity
} from '@/features/recommendations/lib/similarity';
import {
  composeInteractions,
  getLocalUserInteractions
} from '@/features/recommendations/services/interactionSources';

export async function getRecommendations(
  userId: string | null | undefined,
  topN = DEFAULT_RECOMMENDATION_COUNT
): Promise<Formula[]> {
  const allFormulaIds = getAllFormulas().map((f) => f.id);
  const allInteractions = await composeInteractions();

  // Known user → their corpus row; otherwise the offline localStorage map.
  const userInteractions =
    userId && allInteractions[userId]
      ? allInteractions[userId]
      : getLocalUserInteractions();

  const userVector = buildUserVector(userInteractions, allFormulaIds);
  const hasInteractions = userVector.some((v) => v > 0);

  // Cold start → popularity; otherwise similar-user weighted interest.
  const rankedIds = hasInteractions
    ? aggregateNeighbourScores(
        findSimilarUsers(
          userVector,
          allInteractions,
          allFormulaIds,
          userId,
          SIMILAR_USERS_NEIGHBOURHOOD
        ),
        userInteractions
      )
    : rankByPopularity(allInteractions);

  return findFormulasByIds(rankedIds.slice(0, topN));
}
