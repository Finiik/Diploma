/* ============================================
   Biology Formula Data
   ============================================ */

export const biologyData = {
  id: 'biology',
  name: 'Біологія',
  nameEn: 'Biology',
  icon: '🧬',
  color: 'biology',
  topics: [
    {
      id: 'genetics',
      name: 'Генетика та популяції',
      nameEn: 'Genetics & Populations',
      subtopics: [
        {
          id: 'population_genetics',
          name: 'Популяційна генетика',
          nameEn: 'Population Genetics',
          formulas: [
            {
              id: 'bio_hardy_weinberg',
              name: 'Рівняння Харді-Вайнберга',
              nameEn: 'Hardy-Weinberg Equation',
              latex: 'p^2 + 2pq + q^2 = 1',
              description: 'Рівняння Харді-Вайнберга описує частоти генотипів у популяції, що перебуває в рівновазі. p — частота домінантного алеля, q — рецесивного.',
              descriptionEn: 'The Hardy-Weinberg equation describes genotype frequencies in a population at equilibrium. p = dominant allele frequency, q = recessive allele frequency.',
              variables: [
                { symbol: 'p²', name: 'Частота гомозигот AA', nameEn: 'AA homozygote frequency', unit: '', type: 'result' },
                { symbol: 'p', name: 'Частота алеля A', nameEn: 'Allele A frequency', unit: '', type: 'input' }
              ],
              compute: (values) => {
                const q = 1 - values.p;
                return { 'p²': values.p * values.p, '2pq': 2 * values.p * q, 'q²': q * q };
              },
              resultVar: 'p²',
              multiResult: true,
              derivedFormulas: ['bio_population_growth'],
              topic: 'Генетика та популяції',
              subtopic: 'Популяційна генетика'
            },
            {
              id: 'bio_population_growth',
              name: 'Експоненційне зростання популяції',
              nameEn: 'Exponential Population Growth',
              latex: 'N_t = N_0 \\cdot e^{rt}',
              description: 'Модель експоненційного зростання описує збільшення популяції за ідеальних умов (необмежені ресурси).',
              descriptionEn: 'The exponential growth model describes population increase under ideal conditions (unlimited resources).',
              variables: [
                { symbol: 'N_t', name: 'Розмір популяції', nameEn: 'Population size', unit: '', type: 'result' },
                { symbol: 'N_0', name: 'Початковий розмір', nameEn: 'Initial size', unit: '', type: 'input' },
                { symbol: 'r', name: 'Швидкість зростання', nameEn: 'Growth rate', unit: '', type: 'input' },
                { symbol: 't', name: 'Час', nameEn: 'Time', unit: '', type: 'input' }
              ],
              compute: (values) => values.N_0 * Math.exp(values.r * values.t),
              resultVar: 'N_t',
              derivedFormulas: ['bio_hardy_weinberg'],
              topic: 'Генетика та популяції',
              subtopic: 'Популяційна генетика'
            }
          ]
        }
      ]
    },
    {
      id: 'biochemistry',
      name: 'Біохімія',
      nameEn: 'Biochemistry',
      subtopics: [
        {
          id: 'enzymes',
          name: 'Ферменти',
          nameEn: 'Enzymes',
          formulas: [
            {
              id: 'bio_michaelis_menten',
              name: 'Рівняння Міхаеліса-Ментен',
              nameEn: 'Michaelis-Menten Equation',
              latex: 'v = \\frac{V_{max} \\cdot [S]}{K_m + [S]}',
              description: 'Рівняння описує залежність швидкості ферментативної реакції від концентрації субстрату. Vmax — максимальна швидкість, Km — стала Міхаеліса.',
              descriptionEn: 'The equation describes the dependence of enzymatic reaction rate on substrate concentration. Vmax = maximum rate, Km = Michaelis constant.',
              variables: [
                { symbol: 'v', name: 'Швидкість реакції', nameEn: 'Reaction rate', unit: 'моль/(л·с)', type: 'result' },
                { symbol: 'V_max', name: 'Максимальна швидкість', nameEn: 'Maximum rate', unit: 'моль/(л·с)', type: 'input' },
                { symbol: 'S', name: 'Концентрація субстрату', nameEn: 'Substrate concentration', unit: 'моль/л', type: 'input' },
                { symbol: 'K_m', name: 'Стала Міхаеліса', nameEn: 'Michaelis constant', unit: 'моль/л', type: 'input' }
              ],
              compute: (values) => (values.V_max * values.S) / (values.K_m + values.S),
              resultVar: 'v',
              derivedFormulas: ['bio_bmi'],
              topic: 'Біохімія',
              subtopic: 'Ферменти'
            }
          ]
        },
        {
          id: 'health_metrics',
          name: 'Біометрія',
          nameEn: 'Biometrics',
          formulas: [
            {
              id: 'bio_bmi',
              name: 'Індекс маси тіла (ІМТ)',
              nameEn: 'Body Mass Index (BMI)',
              latex: 'BMI = \\frac{m}{h^2}',
              description: 'ІМТ — показник співвідношення маси тіла до зросту. Використовується для оцінки ваги: <18.5 — недостатня, 18.5-24.9 — нормальна, 25-29.9 — надмірна, >30 — ожиріння.',
              descriptionEn: 'BMI is a measure of body weight relative to height. Used for weight assessment: <18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, >30 obese.',
              variables: [
                { symbol: 'BMI', name: 'Індекс маси тіла', nameEn: 'BMI', unit: 'кг/м²', type: 'result' },
                { symbol: 'm', name: 'Маса тіла', nameEn: 'Body mass', unit: 'кг (kg)', type: 'input' },
                { symbol: 'h', name: 'Зріст', nameEn: 'Height', unit: 'м (m)', type: 'input' }
              ],
              compute: (values) => values.m / (values.h * values.h),
              resultVar: 'BMI',
              derivedFormulas: ['bio_michaelis_menten'],
              topic: 'Біохімія',
              subtopic: 'Біометрія'
            }
          ]
        }
      ]
    }
  ]
};

export function getAllFormulas() {
  const formulas = [];
  for (const topic of biologyData.topics) {
    for (const subtopic of topic.subtopics) {
      for (const formula of subtopic.formulas) {
        formulas.push({ ...formula, subject: 'biology' });
      }
    }
  }
  return formulas;
}

export function getFormulaById(id) {
  return getAllFormulas().find(f => f.id === id);
}
