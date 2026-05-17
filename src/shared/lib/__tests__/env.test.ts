/* Characterization tests — Firebase-configured detection.
   `!!key && key !== 'YOUR_API_KEY' && !key.startsWith('YOUR_')`, read at
   call time so VITE_FIREBASE_API_KEY can be stubbed per case. */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { isFirebaseConfigured } from '@/shared/lib/env';

afterEach(() => {
  vi.unstubAllEnvs();
});

const withKey = (value: string) => {
  vi.stubEnv('VITE_FIREBASE_API_KEY', value);
  return isFirebaseConfigured();
};

describe('isFirebaseConfigured — unconfigured', () => {
  it('is false for an empty key', () => {
    expect(withKey('')).toBe(false);
  });

  it('is false for the literal placeholder', () => {
    expect(withKey('YOUR_API_KEY')).toBe(false);
  });

  it('is false for any YOUR_* placeholder', () => {
    expect(withKey('YOUR_PROJECT_KEY')).toBe(false);
    expect(withKey('YOUR_')).toBe(false);
  });
});

describe('isFirebaseConfigured — configured', () => {
  it('is true for a real-looking key', () => {
    expect(withKey('AIzaSyReal-Key_123')).toBe(true);
  });

  it('only blocks the exact "YOUR_" prefix, not "YOUR..."', () => {
    // "YOURKEY" has no underscore → not a recognised placeholder.
    expect(withKey('YOURKEY')).toBe(true);
  });

  it('is case-sensitive (lowercase placeholder is treated as real)', () => {
    expect(withKey('your_api_key')).toBe(true);
  });

  it('QUIRK: a whitespace-only key counts as configured', () => {
    // Truthy and not a placeholder → true. Pinned, not endorsed.
    expect(withKey('   ')).toBe(true);
  });
});
