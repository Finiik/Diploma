/* Characterization tests — localized-content field selection.
   pickLang(item, baseKey, isUk): uk → base; en → `${baseKey}En` when it's a
   non-empty string, else base. Missing base coerces to ''. */
import { describe, it, expect } from 'vitest';
import { pickLang } from '@/shared/lib/pickLang';

describe('pickLang — language selection', () => {
  const item = { name: 'Маса', nameEn: 'Mass' };

  it('returns the base field in Ukrainian', () => {
    expect(pickLang(item, 'name', true)).toBe('Маса');
  });

  it('returns the *En field in English', () => {
    expect(pickLang(item, 'name', false)).toBe('Mass');
  });

  it('ignores *En entirely when Ukrainian (even if base is empty)', () => {
    expect(pickLang({ name: '', nameEn: 'Mass' }, 'name', true)).toBe('');
  });
});

describe('pickLang — English fallback to base', () => {
  it('falls back when *En is missing', () => {
    expect(pickLang({ name: 'Маса' }, 'name', false)).toBe('Маса');
  });

  it('falls back when *En is the empty string', () => {
    expect(pickLang({ name: 'Маса', nameEn: '' }, 'name', false)).toBe('Маса');
  });

  it('does NOT fall back for a whitespace-only *En (only emptiness counts)', () => {
    // Characterization: the guard is `.length > 0`, not `.trim()`.
    expect(pickLang({ name: 'Маса', nameEn: '   ' }, 'name', false)).toBe(
      '   '
    );
  });

  it('returns base in English when base is present but *En empty', () => {
    expect(pickLang({ name: 'Тіло', nameEn: '' }, 'name', false)).toBe('Тіло');
  });
});

describe('pickLang — empty / missing base', () => {
  it('coerces a missing base to empty string', () => {
    // The type forbids this; the cast exercises the runtime `?? ''` guard.
    const broken = {} as unknown as { name: string };
    expect(pickLang(broken, 'name', true)).toBe('');
    expect(pickLang(broken, 'name', false)).toBe('');
  });

  it('uses *En when base is empty (English)', () => {
    expect(pickLang({ name: '', nameEn: 'Mass' }, 'name', false)).toBe('Mass');
  });

  it('returns empty string when both base and *En are empty', () => {
    expect(pickLang({ name: '', nameEn: '' }, 'name', false)).toBe('');
  });
});

describe('pickLang — key isolation & purity', () => {
  it('reads exactly `${baseKey}En`, not a sibling pair', () => {
    const multi = {
      title: 'Заголовок',
      titleEn: 'Title',
      name: 'Імʼя',
      nameEn: 'Name'
    };
    expect(pickLang(multi, 'title', false)).toBe('Title');
    expect(pickLang(multi, 'name', false)).toBe('Name');
    expect(pickLang(multi, 'title', true)).toBe('Заголовок');
  });

  it('works for arbitrary base keys', () => {
    const crumb = { label: 'Головна', labelEn: 'Home' };
    expect(pickLang(crumb, 'label', false)).toBe('Home');
    expect(pickLang(crumb, 'label', true)).toBe('Головна');
  });

  it('does not mutate the input object', () => {
    const src = { name: 'Маса', nameEn: 'Mass' };
    const snapshot = JSON.stringify(src);
    pickLang(src, 'name', false);
    pickLang(src, 'name', true);
    expect(JSON.stringify(src)).toBe(snapshot);
  });

  it('preserves leading/trailing whitespace of the chosen value', () => {
    expect(pickLang({ name: '  Маса  ' }, 'name', true)).toBe('  Маса  ');
  });
});
