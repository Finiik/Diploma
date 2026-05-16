/* Characterization tests — Firebase-configured detection.
   VITE_FIREBASE_API_KEY is read at call time, so it can be stubbed here. */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { isFirebaseConfigured } from '@/lib/env';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isFirebaseConfigured', () => {
  it('is false for an empty key', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', '');
    expect(isFirebaseConfigured()).toBe(false);
  });

  it('is false for the literal placeholder key', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'YOUR_API_KEY');
    expect(isFirebaseConfigured()).toBe(false);
  });

  it('is false for any YOUR_* placeholder', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'YOUR_PROJECT_KEY');
    expect(isFirebaseConfigured()).toBe(false);
  });

  it('is true for a real-looking key', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'AIzaSyReal-Key_123');
    expect(isFirebaseConfigured()).toBe(true);
  });
});
