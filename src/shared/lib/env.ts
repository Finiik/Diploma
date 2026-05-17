/**
 * Whether real Firebase credentials are present.
 *
 * Reads `import.meta.env` at call time (not module load) so tests can stub
 * `VITE_FIREBASE_API_KEY` per-case. A placeholder key (`YOUR_API_KEY` or any
 * `YOUR_*`) or a missing/empty key means the app runs in offline mode.
 */
export function isFirebaseConfigured(): boolean {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return !!key && key !== 'YOUR_API_KEY' && !key.startsWith('YOUR_');
}
