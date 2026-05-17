/* Unit tests — the pure CF helpers extracted from the recommender. */
import { describe, it, expect } from 'vitest';
import {
  buildUserVector,
  findSimilarUsers,
  aggregateNeighbourScores,
  rankByPopularity
} from '@/features/recommendations/lib/similarity';
import type { InteractionsByUser } from '@/shared/types/domain';

const IDS = ['a', 'b', 'c'];
const corpus: InteractionsByUser = {
  me: { a: { views: 5 } },
  twin: { a: { views: 5 }, b: { calculations: 3 } },
  other: { c: { bookmarks: 9 } }
};

describe('findSimilarUsers', () => {
  it('excludes self and zero-similarity users, ranked descending', () => {
    const me = buildUserVector(corpus.me, IDS);
    const neighbours = findSimilarUsers(me, corpus, IDS, 'me', 10);
    // 'twin' shares formula a (similarity > 0); 'other' is orthogonal.
    expect(neighbours).toHaveLength(1);
    expect(neighbours[0].interactions).toBe(corpus.twin);
    expect(neighbours[0].similarity).toBeGreaterThan(0);
  });

  it('caps the neighbourhood size', () => {
    const me = buildUserVector(corpus.me, IDS);
    expect(findSimilarUsers(me, corpus, IDS, 'me', 0)).toHaveLength(0);
  });
});

describe('aggregateNeighbourScores', () => {
  it('skips formulas the user already interacted with', () => {
    const me = buildUserVector(corpus.me, IDS);
    const neighbours = findSimilarUsers(me, corpus, IDS, 'me', 10);
    const ranked = aggregateNeighbourScores(neighbours, corpus.me);
    expect(ranked).toContain('b'); // twin's unseen formula
    expect(ranked).not.toContain('a'); // already interacted with
  });
});

describe('rankByPopularity', () => {
  it('ranks by total interaction score across all users', () => {
    // Same interaction kind everywhere so weights cancel: 'x' is touched
    // by two users and must outrank single-user 'y'.
    const popCorpus: InteractionsByUser = {
      u1: { x: { views: 1 }, y: { views: 1 } },
      u2: { x: { views: 1 } }
    };
    const ranked = rankByPopularity(popCorpus);
    expect(ranked).toEqual(['x', 'y']);
  });
});
