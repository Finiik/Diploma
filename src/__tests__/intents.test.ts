/* Characterization tests — instant intent detectors (pure regex). */
import { describe, it, expect } from 'vitest';
import {
  detectHelpIntent,
  detectListIntent,
  detectThanksIntent,
  detectSubjectIntent
} from '@/services/assistant/intents';

describe('detectHelpIntent', () => {
  it('matches help phrasings, both languages', () => {
    expect(detectHelpIntent('допомога')).toBe(true);
    expect(detectHelpIntent('what can you do')).toBe(true);
    expect(detectHelpIntent('Другий закон Ньютона')).toBe(false);
  });
});

describe('detectListIntent', () => {
  it('matches list/enumeration phrasings', () => {
    expect(detectListIntent('які є формули')).toBe(true);
    expect(detectListIntent('show all')).toBe(true);
    expect(detectListIntent('привіт')).toBe(false);
  });
});

describe('detectThanksIntent', () => {
  it('matches gratitude only at the start of the message', () => {
    expect(detectThanksIntent('дякую')).toBe(true);
    expect(detectThanksIntent('thanks a lot')).toBe(true);
    expect(detectThanksIntent('я не дякую тобі')).toBe(false);
  });
});

describe('detectSubjectIntent', () => {
  it('maps a query to a subject key or null', () => {
    expect(detectSubjectIntent('формули фізики')).toBe('physics');
    expect(detectSubjectIntent('chemistry stuff')).toBe('chemistry');
    expect(detectSubjectIntent('біологія')).toBe('biology');
    expect(detectSubjectIntent('quantum gravity')).toBeNull();
  });
});
