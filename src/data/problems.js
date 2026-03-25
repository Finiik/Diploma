/* ============================================
   Problem Examples Data
   ============================================ */

export const problemsData = [
  {
    id: 'prob_newton_car',
    name: 'Прискорення автомобіля',
    nameEn: 'Car Acceleration',
    subject: 'physics',
    topic: 'Механіка',
    difficulty: 1,
    description: 'Визначте силу, що діє на автомобіль масою 1500 кг, якщо він розганяється з прискоренням 2 м/с².',
    descriptionEn: 'Determine the force acting on a car with mass 1500 kg if it accelerates at 2 m/s².',
    relatedFormula: 'phys_newton2',
    steps: [
      { text: 'Запишемо другий закон Ньютона: F = m · a', textEn: "Write Newton's second law: F = m · a" },
      { text: 'Підставимо значення: F = 1500 кг · 2 м/с²', textEn: 'Substitute values: F = 1500 kg · 2 m/s²' },
      { text: 'Обчислимо: F = 3000 Н = 3 кН', textEn: 'Calculate: F = 3000 N = 3 kN' }
    ],
    answer: 'F = 3000 Н',
    answerEn: 'F = 3000 N'
  },
  {
    id: 'prob_molarity',
    name: 'Молярна концентрація розчину NaCl',
    nameEn: 'Molarity of NaCl Solution',
    subject: 'chemistry',
    topic: 'Загальна хімія',
    difficulty: 2,
    description: 'Визначте молярну концентрацію розчину, якщо в 500 мл води розчинено 29.25 г NaCl (M = 58.5 г/моль).',
    descriptionEn: 'Determine the molarity of a solution if 29.25 g of NaCl (M = 58.5 g/mol) is dissolved in 500 mL of water.',
    relatedFormula: 'chem_molarity',
    steps: [
      { text: 'Знайдемо кількість речовини: n = m/M = 29.25/58.5 = 0.5 моль', textEn: 'Find the amount of substance: n = m/M = 29.25/58.5 = 0.5 mol' },
      { text: 'Переведемо об\'єм у літри: V = 500 мл = 0.5 л', textEn: 'Convert volume to liters: V = 500 mL = 0.5 L' },
      { text: 'Обчислимо молярність: C = n/V = 0.5/0.5 = 1 моль/л', textEn: 'Calculate molarity: C = n/V = 0.5/0.5 = 1 mol/L' }
    ],
    answer: 'C = 1 моль/л',
    answerEn: 'C = 1 mol/L'
  },
  {
    id: 'prob_hardy_weinberg',
    name: 'Частоти генотипів у популяції',
    nameEn: 'Genotype Frequencies in a Population',
    subject: 'biology',
    topic: 'Генетика та популяції',
    difficulty: 2,
    description: 'У популяції 16% особин мають рецесивний фенотип (aa). Визначте частоти алелів та генотипів.',
    descriptionEn: 'In a population, 16% of individuals have the recessive phenotype (aa). Determine allele and genotype frequencies.',
    relatedFormula: 'bio_hardy_weinberg',
    steps: [
      { text: 'q² = 0.16, отже q = √0.16 = 0.4', textEn: 'q² = 0.16, hence q = √0.16 = 0.4' },
      { text: 'p = 1 - q = 1 - 0.4 = 0.6', textEn: 'p = 1 - q = 1 - 0.4 = 0.6' },
      { text: 'p² (AA) = 0.36, 2pq (Aa) = 0.48, q² (aa) = 0.16', textEn: 'p² (AA) = 0.36, 2pq (Aa) = 0.48, q² (aa) = 0.16' },
      { text: 'Перевірка: 0.36 + 0.48 + 0.16 = 1 ✓', textEn: 'Check: 0.36 + 0.48 + 0.16 = 1 ✓' }
    ],
    answer: 'p = 0.6, q = 0.4; AA = 36%, Aa = 48%, aa = 16%',
    answerEn: 'p = 0.6, q = 0.4; AA = 36%, Aa = 48%, aa = 16%'
  }
];

export function getProblemsBySubject(subject) {
  return problemsData.filter(p => p.subject === subject);
}

export function getProblemById(id) {
  return problemsData.find(p => p.id === id);
}
