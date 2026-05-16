/* Characterization tests — collaborative-filtering recommender.
   Firebase is forced unconfigured so the deterministic demo-data path is
   exercised (no network, no flakiness). */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getRecommendations } from '@/services/recommendations';

beforeEach(() => {
  // Read at call time inside isFirebaseConfigured() — safe to stub here.
  vi.stubEnv('VITE_FIREBASE_API_KEY', '');
  localStorage.clear();
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getRecommendations — cold start (no user history)', () => {
  it('returns the demo-popularity top-N in a stable, pinned order', async () => {
    const recs = await getRecommendations(null, 6);
    expect(recs.map(f => f.id)).toEqual([
      'chem_ideal_gas',
      'chem_molarity',
      'bio_hardy_weinberg',
      'phys_newton2',
      'phys_ohm',
      'phys_kinetic_energy'
    ]);
    for (const f of recs) {
      expect(typeof f.id).toBe('string');
      expect(f).toHaveProperty('name');
      expect(f).toHaveProperty('latex');
    }
  });

  it('honors the topN argument', async () => {
    expect(await getRecommendations(null, 3)).toHaveLength(3);
  });
});

describe('getRecommendations — collaborative path (known demo user)', () => {
  it('recommends formulas the user has NOT already interacted with', async () => {
    const already = new Set([
      'phys_newton2', 'phys_kinetic_energy', 'phys_work',
      'chem_ideal_gas', 'phys_momentum'
    ]);
    const recs = await getRecommendations('demo_user_1', 6);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(6);
    for (const f of recs) expect(already.has(f.id)).toBe(false);
  });
});
