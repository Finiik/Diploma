/* Characterization tests — localized-content field selection. */
import { describe, it, expect } from 'vitest';
import { pickLang } from '@/lib/pickLang';

describe('pickLang', () => {
  const item = { name: 'Маса', nameEn: 'Mass' };

  it('returns the base field in Ukrainian', () => {
    expect(pickLang(item, 'name', true)).toBe('Маса');
  });

  it('returns the *En field in English', () => {
    expect(pickLang(item, 'name', false)).toBe('Mass');
  });

  it('falls back to base when the *En field is missing', () => {
    expect(pickLang({ name: 'Маса' }, 'name', false)).toBe('Маса');
  });

  it('falls back to base when the *En field is empty', () => {
    expect(pickLang({ name: 'Маса', nameEn: '' }, 'name', false)).toBe('Маса');
  });

  it('works for any base key', () => {
    const crumb = { label: 'Головна', labelEn: 'Home' };
    expect(pickLang(crumb, 'label', false)).toBe('Home');
    expect(pickLang(crumb, 'label', true)).toBe('Головна');
  });
});
