import type { Subject } from '@/shared/types/domain';

/** Subject → its emoji icon. Exhaustive over `Subject`, so a new subject
    is a compile error here rather than a silent default. Single source of
    truth (kept in sync with SubjectData.icon in the course data). */
const SUBJECT_ICON: Record<Subject, string> = {
  physics: '⚛️',
  chemistry: '🧪',
  biology: '🧬'
};

export function subjectIcon(subject: Subject): string {
  return SUBJECT_ICON[subject];
}
