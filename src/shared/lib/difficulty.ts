/* ============================================
   The single source of truth for the difficulty scale.

   Theory rendered a level→{cls,icon,labelKey} badge map and Problems an
   independent level→stars map; the *scale itself* (levels 1–3) was
   duplicated and could drift. The two visual encodings legitimately
   differ (traffic-light badge vs. star count), so they stay as two
   functions over one shared level set rather than one forced map.
   ============================================ */

export const DIFFICULTY_LEVELS = [1, 2, 3] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

interface DifficultyBadge {
  cls: string;
  icon: string;
  /** i18n key for the badge label. */
  labelKey: string;
}

const BADGE: Record<DifficultyLevel, DifficultyBadge> = {
  1: { cls: 'diff-beginner', icon: '🟢', labelKey: 'difficulty.beginner' },
  2: {
    cls: 'diff-intermediate',
    icon: '🟡',
    labelKey: 'difficulty.intermediate'
  },
  3: { cls: 'diff-advanced', icon: '🔴', labelKey: 'difficulty.advanced' }
};

/** Traffic-light badge for a difficulty level (Theory). Unknown → level 1. */
export function difficultyBadge(level: number): DifficultyBadge {
  return BADGE[level as DifficultyLevel] ?? BADGE[1];
}

const STARS: Record<DifficultyLevel, string> = {
  1: '⭐',
  2: '⭐⭐',
  3: '⭐⭐⭐'
};

/** Star string for a difficulty level (Problems). Unknown → ''. */
export function difficultyStars(level: number): string {
  return STARS[level as DifficultyLevel] ?? '';
}
