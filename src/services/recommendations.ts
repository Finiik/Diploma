/* ============================================
   Collaborative Filtering Recommendation Engine
   Uses Firebase for real multi-user interaction data
   Falls back instantly to demo data when Firebase is not configured
   ============================================ */

import { getAllFormulas, findFormulasByIds } from '@/lib/formulas';
import type { Formula, Interaction, InteractionsByUser } from '@/types/domain';
import { isFirebaseConfigured } from '@/lib/env';

// Pre-seeded demo users for initial recommendations
const DEMO_INTERACTIONS: InteractionsByUser = {
  demo_user_1: {
    phys_newton2: { views: 5, calculations: 3, bookmarks: 1 },
    phys_kinetic_energy: { views: 3, calculations: 2, bookmarks: 1 },
    phys_work: { views: 4, calculations: 1, bookmarks: 0 },
    chem_ideal_gas: { views: 2, calculations: 1, bookmarks: 1 },
    phys_momentum: { views: 3, calculations: 2, bookmarks: 0 }
  },
  demo_user_2: {
    chem_ideal_gas: { views: 6, calculations: 4, bookmarks: 1 },
    chem_molarity: { views: 4, calculations: 3, bookmarks: 1 },
    chem_dilution: { views: 3, calculations: 2, bookmarks: 0 },
    phys_newton2: { views: 2, calculations: 1, bookmarks: 0 },
    bio_hardy_weinberg: { views: 1, calculations: 1, bookmarks: 0 }
  },
  demo_user_3: {
    bio_hardy_weinberg: { views: 5, calculations: 3, bookmarks: 1 },
    bio_population_growth: { views: 4, calculations: 2, bookmarks: 1 },
    bio_bmi: { views: 3, calculations: 2, bookmarks: 0 },
    chem_molarity: { views: 2, calculations: 1, bookmarks: 1 },
    phys_kinetic_energy: { views: 1, calculations: 0, bookmarks: 0 }
  },
  demo_user_4: {
    phys_ohm: { views: 5, calculations: 4, bookmarks: 1 },
    phys_power_electric: { views: 4, calculations: 3, bookmarks: 1 },
    phys_newton2: { views: 3, calculations: 1, bookmarks: 0 },
    chem_dilution: { views: 2, calculations: 1, bookmarks: 0 },
    phys_kinetic_energy: { views: 2, calculations: 1, bookmarks: 0 }
  },
  demo_user_5: {
    bio_michaelis_menten: { views: 4, calculations: 3, bookmarks: 1 },
    bio_hardy_weinberg: { views: 3, calculations: 2, bookmarks: 0 },
    chem_ph: { views: 4, calculations: 2, bookmarks: 1 },
    chem_molarity: { views: 2, calculations: 1, bookmarks: 0 },
    bio_population_growth: { views: 2, calculations: 1, bookmarks: 0 }
  }
};

function interactionScore(interaction: Interaction | undefined): number {
  if (!interaction) return 0;
  return (
    (interaction.views || 0) * 1 +
    (interaction.calculations || 0) * 3 +
    (interaction.bookmarks || 0) * 5
  );
}

function buildUserVector(
  interactions: Record<string, Interaction>,
  allFormulaIds: string[]
): number[] {
  return allFormulaIds.map((id) => interactionScore(interactions[id]));
}

function cosineSimilarity(a: number[], b: number[]): number {
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

export async function getRecommendations(
  userId: string | null | undefined,
  topN = 6
): Promise<Formula[]> {
  const allFormulas = getAllFormulas();
  const allFormulaIds = allFormulas.map((f) => f.id);

  // Start with demo data — always available instantly
  let allInteractions: InteractionsByUser = { ...DEMO_INTERACTIONS };

  // Only try Firebase if configured
  if (isFirebaseConfigured()) {
    try {
      const { getAllInteractions } = await import('@/firebase/firestore');
      // Add a timeout so we don't block the UI
      const firebasePromise = getAllInteractions();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase timeout')), 2000)
      );
      const firebaseInteractions = (await Promise.race([
        firebasePromise,
        timeoutPromise
      ])) as InteractionsByUser;
      allInteractions = { ...allInteractions, ...firebaseInteractions };
    } catch (e) {
      console.warn('Using demo data for recommendations:', e instanceof Error ? e.message : e);
    }
  }

  // Get current user interactions from local storage as fast fallback
  let userInteractions: Record<string, Interaction> = {};
  if (userId && allInteractions[userId]) {
    userInteractions = allInteractions[userId];
  } else {
    // Check localStorage for local user interactions
    try {
      const local = JSON.parse(localStorage.getItem('userInteractions') || '{}') as Record<
        string,
        Interaction
      >;
      userInteractions = local;
    } catch {
      userInteractions = {};
    }
  }

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
      similarities.push({ userId: otherId, similarity: sim, interactions: otherInteractions });
    }
  }

  similarities.sort((a, b) => b.similarity - a.similarity);
  const topSimilar = similarities.slice(0, 5);

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

function getPopularFormulas(allInteractions: InteractionsByUser, topN: number): Formula[] {
  const popularity: Record<string, number> = {};
  for (const interactions of Object.values(allInteractions)) {
    for (const [formulaId, interaction] of Object.entries(interactions)) {
      popularity[formulaId] = (popularity[formulaId] || 0) + interactionScore(interaction);
    }
  }

  const sorted = Object.entries(popularity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([id]) => id);

  return findFormulasByIds(sorted);
}
