/* ============================================
   The single source of truth for the subject set.

   Every subject-keyed concern (nav/footer links, the home grid, the
   filter pills, icon/colour, free-text subject detection, catalog
   aggregation order) derives from here, so adding a fourth subject is
   one new `SUBJECT_REGISTRY` entry — and a *compile error* everywhere a
   case would be missed — rather than a hand-edited literal repeated
   across ~7 files (Open/Closed). This module lives in `shared/` because
   it carries no feature data: the `Subject → SubjectData` mapping that
   *would* import a feature stays in `features/formulas/lib/formulas.ts`.
   ============================================ */

import type { Subject } from '@/shared/types/domain';

/** Presentation + detection metadata for one subject. */
export interface SubjectMeta {
  /** Emoji icon. */
  icon: string;
  /** CSS color custom-property reference. */
  color: string;
  /** Router path to the subject page. */
  route: string;
  /** i18n key for the short nav/footer label. */
  navKey: string;
  /** Matches a free-text mention of the subject (uk + en stems). */
  pattern: RegExp;
}

/**
 * Keyed by `Subject`, so an added subject without an entry is a compile
 * error here (closed-by-construction). The one place these literals live.
 */
export const SUBJECT_REGISTRY: Record<Subject, SubjectMeta> = {
  physics: {
    icon: '⚛️',
    color: 'var(--color-physics)',
    route: '/subject/physics',
    navKey: 'nav.physics',
    pattern: /(?:фізик|physic)/i
  },
  chemistry: {
    icon: '🧪',
    color: 'var(--color-chemistry)',
    route: '/subject/chemistry',
    navKey: 'nav.chemistry',
    pattern: /(?:хім|chem)/i
  },
  biology: {
    icon: '🧬',
    color: 'var(--color-biology)',
    route: '/subject/biology',
    navKey: 'nav.biology',
    pattern: /(?:біолог|bio)/i
  }
};

const SUBJECT_ORDER = ['physics', 'chemistry', 'biology'] as const;

// Compile-time guard: every Subject must appear in SUBJECT_ORDER, so the
// canonical *ordered* list carries the same exhaustiveness guarantee the
// keyed registry does (a missing subject fails `tsc`, not at runtime).
type AllSubjectsListed = Subject extends (typeof SUBJECT_ORDER)[number]
  ? true
  : never;
const _subjectsExhaustive: AllSubjectsListed = true;
void _subjectsExhaustive;

/** The canonical subjects, in display order. Iterate this everywhere. */
export const SUBJECTS: readonly Subject[] = SUBJECT_ORDER;
