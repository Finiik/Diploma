/* ============================================
   Collaborative-filtering math — pure, dependency-free.
   ============================================ */

import type {
  Interaction,
  InteractionsByUser
} from '@/shared/types/domain';
import { INTERACTION_WEIGHTS } from './constants';

export function interactionScore(
  interaction: Interaction | undefined
): number {
  if (!interaction) return 0;
  return (
    (interaction.views || 0) * INTERACTION_WEIGHTS.view +
    (interaction.calculations || 0) * INTERACTION_WEIGHTS.calculation +
    (interaction.bookmarks || 0) * INTERACTION_WEIGHTS.bookmark
  );
}

export function buildUserVector(
  interactions: Record<string, Interaction>,
  allFormulaIds: string[]
): number[] {
  return allFormulaIds.map((id) => interactionScore(interactions[id]));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

/** A neighbour in the collaborative-filtering neighbourhood. */
export interface UserNeighbour {
  similarity: number;
  interactions: Record<string, Interaction>;
}

/**
 * The top-`neighbourhood` users most similar to `userVector`, excluding
 * `excludeUserId` and any user with zero similarity, ranked descending.
 */
export function findSimilarUsers(
  userVector: number[],
  allInteractions: InteractionsByUser,
  allFormulaIds: string[],
  excludeUserId: string | null | undefined,
  neighbourhood: number
): UserNeighbour[] {
  const neighbours: UserNeighbour[] = [];
  for (const [otherId, interactions] of Object.entries(allInteractions)) {
    if (otherId === excludeUserId) continue;
    const similarity = cosineSimilarity(
      userVector,
      buildUserVector(interactions, allFormulaIds)
    );
    if (similarity > 0) neighbours.push({ similarity, interactions });
  }
  neighbours.sort((a, b) => b.similarity - a.similarity);
  return neighbours.slice(0, neighbourhood);
}

function rankByScore(scores: Record<string, number>): string[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id);
}

/**
 * Formula ids ranked by similarity-weighted neighbour interest, skipping
 * formulas the user has already interacted with.
 */
export function aggregateNeighbourScores(
  neighbours: UserNeighbour[],
  userInteractions: Record<string, Interaction>
): string[] {
  const scores: Record<string, number> = {};
  for (const { similarity, interactions } of neighbours) {
    for (const [formulaId, interaction] of Object.entries(interactions)) {
      if (userInteractions[formulaId]) continue;
      scores[formulaId] =
        (scores[formulaId] || 0) + interactionScore(interaction) * similarity;
    }
  }
  return rankByScore(scores);
}

/** Formula ids ranked by total interaction score across all users. */
export function rankByPopularity(
  allInteractions: InteractionsByUser
): string[] {
  const popularity: Record<string, number> = {};
  for (const interactions of Object.values(allInteractions)) {
    for (const [formulaId, interaction] of Object.entries(interactions)) {
      popularity[formulaId] =
        (popularity[formulaId] || 0) + interactionScore(interaction);
    }
  }
  return rankByScore(popularity);
}
