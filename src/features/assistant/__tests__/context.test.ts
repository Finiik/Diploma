/* Characterization tests — retrieval context + navigation link chips. */
import { describe, it, expect } from 'vitest';
import {
  extractLinks,
  buildConceptLinks
} from '@/features/assistant/services/assistant/navLinks';
import { findRelevantContent } from '@/features/assistant/services/assistant/ragContext';
import { mergeById } from '@/shared/lib/mergeById';
import { matchConcept } from '@/features/assistant/services/assistant/courseGraph';

describe('mergeById', () => {
  it('dedupes by type:id and caps the result', () => {
    const a = [
      { type: 'formula', id: 'x' },
      { type: 'theory', id: 'y' }
    ];
    const b = [
      { type: 'formula', id: 'x' },
      { type: 'problems', id: 'z' }
    ];
    const merged = mergeById(a, b, 5);
    expect(merged).toHaveLength(3);
    expect(merged.map((l) => `${l.type}:${l.id}`)).toEqual([
      'formula:x',
      'theory:y',
      'problems:z'
    ]);
  });

  it('respects the cap', () => {
    const a = [
      { type: 'formula', id: '1' },
      { type: 'formula', id: '2' }
    ];
    const b = [
      { type: 'formula', id: '3' },
      { type: 'formula', id: '4' }
    ];
    expect(mergeById(a, b, 3)).toHaveLength(3);
  });
});

describe('extractLinks', () => {
  it('builds emoji-prefixed nav chips from search hits', () => {
    const links = extractLinks("Newton's second law", 'en');
    expect(links.length).toBeGreaterThan(0);
    expect(links.length).toBeLessThanOrEqual(4);
    expect(links.some((l) => l.id === 'phys_newton2')).toBe(true);
    expect(links[0].label).toMatch(/^[📐📖📝]/u);
  });
});

describe('buildConceptLinks', () => {
  it('builds nav chips (no emoji) from a matched concept', () => {
    const links = buildConceptLinks(matchConcept('Механіка'), 'uk');
    expect(links.length).toBeGreaterThan(0);
    expect(links.length).toBeLessThanOrEqual(4);
    for (const l of links) expect(l).toHaveProperty('id');
  });
});

describe('findRelevantContent', () => {
  it('emits a CONNECTED MATERIALS block for a known concept', () => {
    const ctx = findRelevantContent('Механіка', 'uk');
    expect(ctx).toContain('CONNECTED PLATFORM MATERIALS');
  });

  it('returns an empty string when nothing relevant matches', () => {
    expect(findRelevantContent('qwerty zxcvbn asdf', 'uk')).toBe('');
  });
});
