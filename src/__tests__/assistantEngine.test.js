/* Characterization tests — end-to-end responder chain (processMessage).
   fetch is mocked to reject so the Gemini path always falls through to the
   deterministic offline responders/fallback, regardless of local env. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { processMessage } from '../services/assistantEngine';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('no network in tests'))));
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('input guard', () => {
  it('empty query → localized prompt, no links/suggestions', async () => {
    const r = await processMessage('');
    expect(r.text).toBe('Будь ласка, напишіть ваше питання.');
    expect(r.links).toEqual([]);
    expect(r.suggestions).toEqual([]);
  });
});

describe('instant responders', () => {
  it('greeting reports the catalog size (78 formulas)', async () => {
    const uk = await processMessage('Привіт');
    expect(uk.text).toContain('SciLearn AI');
    expect(uk.text).toContain('78');
    const en = await processMessage('hello', false);
    expect(en.text).toContain('78 formulas');
  });

  it('help intent returns the capabilities card', async () => {
    const r = await processMessage('допомога');
    expect(r.text).toMatch(/^🤖/u);
    expect(r.text).toContain('78');
  });

  it('thanks intent returns the acknowledgement', async () => {
    expect((await processMessage('дякую')).text).toMatch(/^😊/u);
  });

  it('list intent returns the platform breakdown', async () => {
    const r = await processMessage('які є формули');
    expect(r.text).toContain('📊');
    expect(r.text).toContain('30'); // physics formula count
  });

  it('pure-subject query returns the subject overview with a subject link', async () => {
    const r = await processMessage('Формули фізики');
    expect(r.text).toContain('30');
    expect(r.links.some(l => l.type === 'subject' && l.id === 'physics')).toBe(true);
  });
});

describe('terminal AI responder → offline fallback', () => {
  it('a known formula query yields a rich card + a nav link to it', async () => {
    const r = await processMessage('Другий закон Ньютона');
    expect(r.text).toContain('Ньютона');
    expect(r.text).toContain('F = m');
    expect(r.links.some(l => l.id === 'phys_newton2')).toBe(true);
  });

  it('a fully unmatched query yields the not-found message + suggestions, no links', async () => {
    // 'qwerty zxcvbn asdf' is confirmed to match no concept (see courseGraph
    // test) and no search hits, so the concept-graph link path stays empty.
    const r = await processMessage('qwerty zxcvbn asdf');
    expect(r.text.toLowerCase()).toContain('qwerty zxcvbn asdf');
    expect(r.suggestions.length).toBeGreaterThan(0);
    expect(r.links).toEqual([]);
  });
});
