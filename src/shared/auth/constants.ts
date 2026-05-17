/* ============================================
   Auth — offline-mode constants
   ============================================ */

/**
 * Synthetic uid assigned to the offline user when Firebase is
 * unconfigured or anonymous auth fails. It is intentionally NOT a key in
 * the demo interaction dataset, so the recommender treats this user as a
 * cold start and serves popular formulas.
 */
export const OFFLINE_USER_ID = 'local_user';

/**
 * How long to wait for anonymous sign-in before giving up and letting the
 * app run unauthenticated. Kept short so a slow/blocked auth endpoint
 * never holds the UI on the loading state.
 */
export const AUTH_FALLBACK_TIMEOUT_MS = 3000;
