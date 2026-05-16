/* Characterization tests — text/NLP primitives.
   Pin current behavior BEFORE the JS→TS migration so the rename can't
   silently change query parsing, typo tolerance, or concept extraction. */
import { describe, it, expect } from 'vitest';
import {
  extractSearchQuery,
  normalizeConcept,
  levenshtein,
  similarity,
  conceptCore,
  INTENT_WORDS_UK,
  INTENT_WORDS_EN,
  FILLER_WORDS
} from '@/services/assistant/text';

describe('levenshtein', () => {
  it('classic kitten→sitting distance is 3', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });
  it('handles empty strings', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
    expect(levenshtein('abc', 'abc')).toBe(0);
  });
});

describe('similarity', () => {
  it('identical strings → 1', () => {
    expect(similarity('abc', 'abc')).toBe(1);
  });
  it('two empty strings → 1', () => {
    expect(similarity('', '')).toBe(1);
  });
  it('kitten/sitting ≈ 0.571', () => {
    expect(similarity('kitten', 'sitting')).toBeCloseTo(1 - 3 / 7, 5);
  });
  it('typo "Авагадро"/"Авогадро" stays above the 0.84 concept threshold', () => {
    expect(
      similarity(normalizeConcept('Авагадро'), normalizeConcept('Авогадро'))
    ).toBeGreaterThanOrEqual(0.84);
  });
});

describe('normalizeConcept', () => {
  it('lowercases, drops punctuation and apostrophes, folds ё→е', () => {
    expect(normalizeConcept('Що таке Авогадро?')).toBe('що таке авогадро');
    expect(normalizeConcept("Don't!")).toBe('dont');
    expect(normalizeConcept('ёлка  тест')).toBe('елка тест');
  });
});

describe('extractSearchQuery', () => {
  it('strips a leading Ukrainian intent phrase', () => {
    expect(extractSearchQuery('Що таке сила тяжіння?')).toBe('сила тяжіння');
  });
  it('strips a leading English intent phrase', () => {
    expect(extractSearchQuery("What is Ohm's law?")).toBe("ohm's law");
  });
  it('falls back to the trimmed original when nothing strips', () => {
    expect(extractSearchQuery('pH')).toBe('ph');
  });
});

describe('conceptCore', () => {
  it('strips leading filler then intent phrase down to the bare subject', () => {
    expect(conceptCore('А що таке стала Авогадро?')).toBe('стала авогадро');
  });
  it('reduces a plain concept query to its normalized core', () => {
    expect(conceptCore('Механіка')).toBe('механіка');
  });
});

describe('exported word lists', () => {
  it('intent/filler lists are non-empty arrays', () => {
    expect(Array.isArray(INTENT_WORDS_UK) && INTENT_WORDS_UK.length).toBeTruthy();
    expect(Array.isArray(INTENT_WORDS_EN) && INTENT_WORDS_EN.length).toBeTruthy();
    expect(FILLER_WORDS).toContain('а');
  });
});
