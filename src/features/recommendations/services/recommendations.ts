/* ============================================
   Collaborative Filtering Recommendation Engine
   This module owns only the recommendation algorithm and its
   popularity fallback. The interaction corpus is supplied by
   interactionSources; the math lives in lib/similarity.
   ============================================ */

import { getAllFormulas, findFormulasByIds } from '@/features/formulas';
import type {
  Formula,
  Interaction,
  InteractionsByUser
} from '@/shared/types/domain';
import {
  DEFAULT_RECOMMENDATION_COUNT,
  SIMILAR_USERS_NEIGHBOURHOOD
} from '@/features/recommendations/lib/constants';
import {
  interactionScore,
  buildUserVector,
  cosineSimilarity
} from '@/features/recommendations/lib/similarity';
import {
  composeInteractions,
  getLocalUserInteractions
} from '@/features/recommendations/services/interactionSources';

export async function getRecommendations(
  userId: string | null | undefined,
  topN = DEFAULT_RECOMMENDATION_COUNT
): Promise<Formula[]> {
  const allFormulas = getAllFormulas();
  const allFormulaIds = allFormulas.map((f) => f.id);

  const allInteractions = await composeInteractions();

  // Known user → their corpus row; otherwise the offline localStorage map.
  const userInteractions: Record<string, Interaction> =
    userId && allInteractions[userId]
      ? allInteractions[userId]
      : getLocalUserInteractions();

  // If user has no interactions, return popular formulas
  const userVector = buildUserVector(userInteractions, allFormulaIds);
  const hasInteractions = userVector.some((v) => v > 0);

  if (!hasInteractions) {
    return getPopularFormulas(allInteractions, topN);
  }

  // Compute similarity with all other users
  const similarities: {
    userId: string;
    similarity: number;
    interactions: Record<string, Interaction>;
  }[] = [];
  for (const [otherId, otherInteractions] of Object.entries(allInteractions)) {
    if (otherId === userId) continue;
    const otherVector = buildUserVector(otherInteractions, allFormulaIds);
    const sim = cosineSimilarity(userVector, otherVector);
    if (sim > 0) {
      similarities.push({
        userId: otherId,
        similarity: sim,
        interactions: otherInteractions
      });
    }
  }

  similarities.sort((a, b) => b.similarity - a.similarity);
  const topSimilar = similarities.slice(0, SIMILAR_USERS_NEIGHBOURHOOD);

  // Aggregate weighted scores from similar users
  const formulaScores: Record<string, number> = {};
  for (const { similarity, interactions } of topSimilar) {
    for (const [formulaId, interaction] of Object.entries(interactions)) {
      if (userInteractions[formulaId]) continue; // Skip already interacted
      const score = interactionScore(interaction) * similarity;
      formulaScores[formulaId] = (formulaScores[formulaId] || 0) + score;
    }
  }

  // Sort and return top N
  const sorted = Object.entries(formulaScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([id]) => id);

  return findFormulasByIds(sorted);
}

function getPopularFormulas(
  allInteractions: InteractionsByUser,
  topN: number
): Formula[] {
  const popularity: Record<string, number> = {};
  for (const interactions of Object.values(allInteractions)) {
    for (const [formulaId, interaction] of Object.entries(interactions)) {
      popularity[formulaId] =
        (popularity[formulaId] || 0) + interactionScore(interaction);
    }
  }

  const sorted = Object.entries(popularity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([id]) => id);

  return findFormulasByIds(sorted);
}
