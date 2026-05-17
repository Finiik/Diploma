import type { Subject } from '@/shared/types/domain';
import { SUBJECT_REGISTRY } from '@/shared/lib/subjects';

/** Subject → its CSS color custom-property. Reads the single
    SUBJECT_REGISTRY, which is `Record<Subject,…>` so a new subject is a
    compile error rather than a silent default. */
export function subjectColor(subject: Subject): string {
  return SUBJECT_REGISTRY[subject].color;
}
