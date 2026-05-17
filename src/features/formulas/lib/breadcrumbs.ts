/* ============================================
   Formula-detail breadcrumb assembly — pure. The localized strings are
   resolved by the caller and passed in, keeping this unit i18n-free and
   unit-testable.
   ============================================ */

import type { Formula, SubjectData } from '@/shared/types/domain';
import type { BreadcrumbItem } from '@/shared/ui/Breadcrumb/Breadcrumb';

export function buildFormulaBreadcrumbs(params: {
  formula: Formula;
  subjectData: SubjectData | undefined;
  homeLabel: string;
  formulaName: string;
}): BreadcrumbItem[] {
  const { formula, subjectData, homeLabel, formulaName } = params;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: homeLabel, to: '/', icon: '🏠' }
  ];

  if (subjectData) {
    breadcrumbs.push({
      label: subjectData.name,
      labelEn: subjectData.nameEn,
      to: `/subject/${formula.subject}`,
      icon: subjectData.icon
    });
  }

  if (formula.topic) {
    breadcrumbs.push({ label: formula.topic, labelEn: formula.topic });
  }

  breadcrumbs.push({ label: formulaName });
  return breadcrumbs;
}
