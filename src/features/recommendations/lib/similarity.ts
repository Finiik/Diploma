/* ============================================
   Collaborative-filtering math — pure, dependency-free.
   ============================================ */

import type { Interaction } from '@/shared/types/domain';
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
