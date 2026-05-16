/* ============================================
   Instant intent detectors (no API call needed)
   ============================================ */

export function detectHelpIntent(query) {
  return /(?:допомог[аи]|help|що ти (?:вмієш|можеш|знаєш)|what can you|можливості|capabilities|як (?:користуватись|працюєш|працює)|how (?:do you work|to use)|menu|меню|інструкція|instructions)/i.test(query);
}

export function detectListIntent(query) {
  return /(?:які є|які формули|list|перелічи|покажи всі|show all|список|скільки|all formulas|всі формули|what(?:'s| is) available)/i.test(query);
}

export function detectThanksIntent(query) {
  return /^(?:дякую|дякуємо|спасибі|thanks|thank you|thx|ок|ok|зрозуміло|got it|cool|класно|супер|чудово)/i.test(query);
}

export function detectSubjectIntent(query) {
  if (/(?:фізик|physic)/i.test(query)) return 'physics';
  if (/(?:хім|chem)/i.test(query)) return 'chemistry';
  if (/(?:біолог|bio)/i.test(query)) return 'biology';
  return null;
}
