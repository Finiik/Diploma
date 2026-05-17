/* ============================================
   Interaction data sources — where the recommender's corpus comes
   from. Each source is independently swappable; the algorithm in
   recommendations.ts depends only on the composed result.
   ============================================ */

import type { Interaction, InteractionsByUser } from '@/shared/types/domain';
import { isFirebaseConfigured } from '@/shared/lib/env';
import { DEMO_INTERACTIONS } from '@/features/recommendations/lib/demo-interactions';
import {
  FIREBASE_READ_TIMEOUT_MS,
  LOCAL_INTERACTIONS_STORAGE_KEY
} from '@/features/recommendations/lib/constants';

export interface InteractionsSource {
  load(): Promise<InteractionsByUser>;
}

/** Always-available baseline corpus. */
export const demoInteractionsSource: InteractionsSource = {
  load: async () => ({ ...DEMO_INTERACTIONS })
};

/**
 * Real multi-user data, read with a hard timeout so a slow network never
 * blocks the feed. Contributes nothing (and never throws) when Firebase
 * is not configured or the read fails — the caller falls back to demo.
 */
export const firebaseInteractionsSource: InteractionsSource = {
  async load() {
    if (!isFirebaseConfigured()) return {};
    try {
      const { getAllInteractions } = await import(
        '@/shared/firebase/firestore'
      );
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Firebase timeout')),
          FIREBASE_READ_TIMEOUT_MS
        )
      );
      return (await Promise.race([
        getAllInteractions(),
        timeoutPromise
      ])) as InteractionsByUser;
    } catch (e) {
      console.warn(
        'Using demo data for recommendations:',
        e instanceof Error ? e.message : e
      );
      return {};
    }
  }
};

/**
 * Merge sources in priority order; later sources override earlier ones on
 * key collision (preserves the original `{...demo, ...firebase}` semantics
 * and key ordering).
 */
export async function composeInteractions(
  sources: InteractionsSource[] = [
    demoInteractionsSource,
    firebaseInteractionsSource
  ]
): Promise<InteractionsByUser> {
  let all: InteractionsByUser = {};
  for (const source of sources) {
    all = { ...all, ...(await source.load()) };
  }
  return all;
}

/** The offline user's per-formula interaction map from localStorage. */
export function getLocalUserInteractions(): Record<string, Interaction> {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_INTERACTIONS_STORAGE_KEY) || '{}'
    ) as Record<string, Interaction>;
  } catch {
    return {};
  }
}
