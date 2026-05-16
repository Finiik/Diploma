/* Characterization tests — Fuse.js search service. */
import { describe, it, expect } from 'vitest';
import { search, rebuildIndex } from '../services/search';

describe('search', () => {
  it('returns [] for empty or too-short queries', () => {
    expect(search('')).toEqual([]);
    expect(search(' ')).toEqual([]);
    expect(search('a')).toEqual([]);
  });

  it('finds Newton\'s second law by English name', () => {
    const results = search('Newton');
    expect(results.length).toBeGreaterThan(0);
    expect(results.map(r => r.id)).toContain('phys_newton2');
  });

  it('annotates each hit with score, matches, type and subject', () => {
    const top = search('Ohm')[0];
    expect(top).toBeTruthy();
    expect(top.type).toBe('formula');
    expect(typeof top.score).toBe('number');
    expect(top).toHaveProperty('matches');
  });

  it('rebuildIndex keeps search working', () => {
    rebuildIndex();
    expect(search('Newton').map(r => r.id)).toContain('phys_newton2');
  });
});
