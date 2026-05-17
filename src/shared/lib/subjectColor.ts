import type { Subject } from '@/shared/types/domain';

/** Subject → its CSS color custom-property. Exhaustive over `Subject`,
    so a new subject is a compile error here rather than a silent default. */
const SUBJECT_COLOR: Record<Subject, string> = {
  physics: 'var(--color-physics)',
  chemistry: 'var(--color-chemistry)',
  biology: 'var(--color-biology)'
};

export function subjectColor(subject: Subject): string {
  return SUBJECT_COLOR[subject];
}
