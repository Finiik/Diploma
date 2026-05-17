/* ============================================
   Instant intent detectors (no API call needed)
   ============================================ */

import type { Subject } from '@/shared/types/domain';
import { SUBJECTS, SUBJECT_REGISTRY } from '@/shared/lib/subjects';

export function detectHelpIntent(query: string): boolean {
  return /(?:допомог[аи]|help|що ти (?:вмієш|можеш|знаєш)|what can you|можливості|capabilities|як (?:користуватись|працюєш|працює)|how (?:do you work|to use)|menu|меню|інструкція|instructions)/i.test(
    query
  );
}

export function detectListIntent(query: string): boolean {
  return /(?:які є|які формули|list|перелічи|покажи всі|show all|список|скільки|all formulas|всі формули|what(?:'s| is) available)/i.test(
    query
  );
}

export function detectThanksIntent(query: string): boolean {
  return /^(?:дякую|дякуємо|спасибі|thanks|thank you|thx|ок|ok|зрозуміло|got it|cool|класно|супер|чудово)/i.test(
    query
  );
}

export function detectSubjectIntent(query: string): Subject | null {
  return SUBJECTS.find((s) => SUBJECT_REGISTRY[s].pattern.test(query)) ?? null;
}
