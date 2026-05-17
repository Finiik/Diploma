/* ============================================
   search — tuning constants (single source of truth).
   ============================================ */

/**
 * Minimum trimmed query length before the search box opens / the index
 * is queried. One constant so the UI gate (useSearchBox), the service
 * guard (createSearchIndex.query) and Fuse's `minMatchCharLength` can't
 * disagree.
 */
export const MIN_QUERY_LENGTH = 2;

/** Max results surfaced in the search-box dropdown. */
export const MAX_RESULTS = 8;
