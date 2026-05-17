import type { Subject } from '@/shared/types/domain';
import { SUBJECT_REGISTRY } from '@/shared/lib/subjects';

/** Subject → its emoji icon. Reads the single SUBJECT_REGISTRY, which is
    `Record<Subject,…>` so a new subject is a compile error rather than a
    silent default. (Kept in sync with SubjectData.icon in the course data.) */
export function subjectIcon(subject: Subject): string {
  return SUBJECT_REGISTRY[subject].icon;
}
