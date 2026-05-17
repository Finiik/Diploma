/* Characterization tests — end-to-end responder chain (processMessage).

   These tests exercise the Dependency-Inversion seam directly: instead of
   stubbing global fetch, they inject a fake GeminiTransport into
   processMessage. `offlineTransport.isConfigured()` returns false, so the
   chain deterministically takes the offline fallback path regardless of
   local env — and the seam itself is what makes that possible. A second
   suite injects a *configured* fake to prove real Gemini text flows
   through the orchestrator unchanged. */
import { describe, it, expect } from 'vitest';
import { processMessage } from '@/features/assistant/services/assistantEngine';
import type {
  GeminiTransport,
  GeminiResponse
} from '@/features/assistant/services/assistant/geminiClient';

/** Forces the deterministic offline fallback path (no network, no env). */
const offlineTransport: GeminiTransport = {
  isConfigured: () => false,
  generate: () => Promise.reject(new Error('offline transport: not called'))
};

/** A configured fake that returns canned model text. */
function cannedTransport(text: string): GeminiTransport {
  return {
    isConfigured: () => true,
    generate: (): Promise<GeminiResponse> =>
      Promise.resolve({ candidates: [{ content: { parts: [{ text }] } }] })
  };
}

describe('input guard', () => {
  it('empty query → localized prompt, no links/suggestions', async () => {
    const r = await processMessage('', true, offlineTransport);
    expect(r.text).toBe('Будь ласка, напишіть ваше питання.');
    expect(r.links).toEqual([]);
    expect(r.suggestions).toEqual([]);
  });
});

describe('instant responders', () => {
  it('greeting reports the catalog size (78 formulas)', async () => {
    const uk = await processMessage('Привіт', true, offlineTransport);
    expect(uk.text).toContain('SciLearn AI');
    expect(uk.text).toContain('78');
    const en = await processMessage('hello', false, offlineTransport);
    expect(en.text).toContain('78 formulas');
  });

  it('help intent returns the capabilities card', async () => {
    const r = await processMessage('допомога', true, offlineTransport);
    expect(r.text).toMatch(/^🤖/u);
    expect(r.text).toContain('78');
  });

  it('thanks intent returns the acknowledgement', async () => {
    const r = await processMessage('дякую', true, offlineTransport);
    expect(r.text).toMatch(/^😊/u);
  });

  it('list intent returns the platform breakdown', async () => {
    const r = await processMessage('які є формули', true, offlineTransport);
    expect(r.text).toContain('📊');
    expect(r.text).toContain('30'); // physics formula count
  });

  it('pure-subject query returns the subject overview with a subject link', async () => {
    const r = await processMessage('Формули фізики', true, offlineTransport);
    expect(r.text).toContain('30');
    expect(
      r.links.some((l) => l.type === 'subject' && l.id === 'physics')
    ).toBe(true);
  });
});

describe('terminal AI responder → offline fallback', () => {
  it('a known formula query yields a rich card + a nav link to it', async () => {
    const r = await processMessage(
      'Другий закон Ньютона',
      true,
      offlineTransport
    );
    expect(r.text).toContain('Ньютона');
    expect(r.text).toContain('F = m');
    expect(r.links.some((l) => l.id === 'phys_newton2')).toBe(true);
  });

  it('a fully unmatched query yields the not-found message + suggestions, no links', async () => {
    // 'qwerty zxcvbn asdf' is confirmed to match no concept (see courseGraph
    // test) and no search hits, so the concept-graph link path stays empty.
    const r = await processMessage(
      'qwerty zxcvbn asdf',
      true,
      offlineTransport
    );
    expect(r.text.toLowerCase()).toContain('qwerty zxcvbn asdf');
    expect(r.suggestions.length).toBeGreaterThan(0);
    expect(r.links).toEqual([]);
  });
});

describe('terminal AI responder → injected Gemini transport (DIP seam)', () => {
  it('a configured fake transport: its text flows through processMessage', async () => {
    const r = await processMessage(
      'Другий закон Ньютона',
      true,
      cannedTransport('CANNED_MODEL_ANSWER')
    );
    expect(r.text).toBe('CANNED_MODEL_ANSWER');
    // Links are assembled independently of the AI/fallback decision, so the
    // nav link to the matched formula still surfaces.
    expect(r.links.some((l) => l.id === 'phys_newton2')).toBe(true);
  });

  it('a configured transport that throws falls back to the offline card', async () => {
    const throwing: GeminiTransport = {
      isConfigured: () => true,
      generate: () => Promise.reject(new Error('simulated API 500'))
    };
    const r = await processMessage('Другий закон Ньютона', true, throwing);
    expect(r.text).toContain('Ньютона'); // offline fallback card, not a throw
    expect(r.links.some((l) => l.id === 'phys_newton2')).toBe(true);
  });
});
