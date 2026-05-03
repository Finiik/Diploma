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
  },
  {
    id: 'prob_heat_energy',
    name: 'Нагрівання води',
    nameEn: 'Heating Water',
    subject: 'physics',
    topic: 'Термодинаміка',
    difficulty: 1,
    description: 'Яку кількість теплоти потрібно витратити, щоб нагріти 2 кг води від 20°C до 80°C? Питома теплоємність води c = 4200 Дж/(кг·°C).',
    descriptionEn: 'How much heat is needed to warm 2 kg of water from 20°C to 80°C? Specific heat of water c = 4200 J/(kg·°C).',
    relatedFormula: 'phys_heat_energy',
    steps: [
      { text: 'Запишемо формулу: Q = c · m · ΔT', textEn: 'Write the formula: Q = c · m · ΔT' },
      { text: 'Знайдемо ΔT = 80 - 20 = 60°C', textEn: 'Find ΔT = 80 - 20 = 60°C' },
      { text: 'Підставимо: Q = 4200 · 2 · 60', textEn: 'Substitute: Q = 4200 · 2 · 60' },
      { text: 'Q = 504 000 Дж = 504 кДж', textEn: 'Q = 504,000 J = 504 kJ' }
    ],
    answer: 'Q = 504 000 Дж = 504 кДж',
    answerEn: 'Q = 504,000 J = 504 kJ'
  },
  {
    id: 'prob_ohm',
    name: 'Опір у електричному колі',
    nameEn: 'Resistance in Electric Circuit',
    subject: 'physics',
    topic: 'Електрика',
    difficulty: 2,
    description: 'Через резистор тече струм 0.5 А при напрузі 12 В. Визначте опір резистора та потужність, що виділяється на ньому.',
    descriptionEn: 'A current of 0.5 A flows through a resistor at 12 V. Find the resistance and the power dissipated.',
    relatedFormula: 'phys_ohm',
    steps: [
      { text: 'За законом Ома: R = U/I = 12/0.5 = 24 Ом', textEn: "By Ohm's Law: R = U/I = 12/0.5 = 24 Ω" },
      { text: 'Потужність: P = U · I = 12 · 0.5 = 6 Вт', textEn: 'Power: P = U · I = 12 · 0.5 = 6 W' },
      { text: 'Перевірка: P = I²R = 0.25 · 24 = 6 Вт ✓', textEn: 'Check: P = I²R = 0.25 · 24 = 6 W ✓' }
    ],
    answer: 'R = 24 Ом, P = 6 Вт',
    answerEn: 'R = 24 Ω, P = 6 W'
  },
  {
    id: 'prob_dilution',
    name: 'Розбавлення розчину HCl',
    nameEn: 'Diluting HCl Solution',
    subject: 'chemistry',
    topic: 'Загальна хімія',
    difficulty: 1,
    description: 'Маємо 200 мл розчину HCl з концентрацією 2 моль/л. До якого об\'єму треба довести розчин водою, щоб отримати концентрацію 0.5 моль/л?',
    descriptionEn: 'We have 200 mL of HCl solution at 2 mol/L. To what volume should we dilute it to get 0.5 mol/L?',
    relatedFormula: 'chem_dilution',
    steps: [
      { text: 'C₁V₁ = C₂V₂', textEn: 'C₁V₁ = C₂V₂' },
      { text: '2 · 0.2 = 0.5 · V₂', textEn: '2 · 0.2 = 0.5 · V₂' },
      { text: 'V₂ = 0.4/0.5 = 0.8 л = 800 мл', textEn: 'V₂ = 0.4/0.5 = 0.8 L = 800 mL' }
    ],
    answer: 'V₂ = 800 мл',
    answerEn: 'V₂ = 800 mL'
  },
  {
    id: 'prob_ph',
    name: 'Обчислення pH розчину',
    nameEn: 'Calculating Solution pH',
    subject: 'chemistry',
    topic: 'Загальна хімія',
    difficulty: 2,
    description: 'Визначте pH розчину, в якому концентрація іонів водню [H⁺] = 0.00001 моль/л.',
    descriptionEn: 'Determine the pH of a solution where hydrogen ion concentration [H⁺] = 0.00001 mol/L.',
    relatedFormula: 'chem_ph',
    steps: [
      { text: 'pH = -log[H⁺]', textEn: 'pH = -log[H⁺]' },
      { text: 'pH = -log(0.00001) = -log(10⁻⁵)', textEn: 'pH = -log(0.00001) = -log(10⁻⁵)' },
      { text: 'pH = -(-5) = 5', textEn: 'pH = -(-5) = 5' },
      { text: 'pH = 5 (кисле середовище)', textEn: 'pH = 5 (acidic environment)' }
    ],
    answer: 'pH = 5',
    answerEn: 'pH = 5'
  },
  {
    id: 'prob_logistic',
    name: 'Логістичне зростання популяції оленів',
    nameEn: 'Logistic Growth of Deer Population',
    subject: 'biology',
    topic: 'Екологія',
    difficulty: 3,
    description: 'Популяція оленів: N = 500, r = 0.1, ємність середовища K = 2000. Визначте швидкість зростання.',
    descriptionEn: 'Deer population: N = 500, r = 0.1, carrying capacity K = 2000. Determine the growth rate.',
    relatedFormula: 'bio_logistic_growth',
    steps: [
      { text: 'Формула: dN/dt = r · N · (1 - N/K)', textEn: 'Formula: dN/dt = r · N · (1 - N/K)' },
      { text: 'Підставимо: dN/dt = 0.1 · 500 · (1 - 500/2000)', textEn: 'Substitute: dN/dt = 0.1 · 500 · (1 - 500/2000)' },
      { text: 'dN/dt = 50 · (1 - 0.25) = 50 · 0.75', textEn: 'dN/dt = 50 · (1 - 0.25) = 50 · 0.75' },
      { text: 'dN/dt = 37.5 особин за одиницю часу', textEn: 'dN/dt = 37.5 individuals per time unit' }
    ],
    answer: 'dN/dt = 37.5 особин/час',
    answerEn: 'dN/dt = 37.5 individuals/time unit'
  },
  {
    id: 'prob_bmi',
    name: 'Обчислення індексу маси тіла',
    nameEn: 'Calculating BMI',
    subject: 'biology',
    topic: 'Біохімія',
    difficulty: 1,
    description: 'Людина має масу 75 кг і зріст 1.80 м. Визначте ІМТ та оцініть його.',
    descriptionEn: 'A person weighs 75 kg and is 1.80 m tall. Calculate BMI and evaluate it.',
    relatedFormula: 'bio_bmi',
    steps: [
      { text: 'Формула: BMI = m/h²', textEn: 'Formula: BMI = m/h²' },
      { text: 'BMI = 75 / (1.80)² = 75 / 3.24', textEn: 'BMI = 75 / (1.80)² = 75 / 3.24' },
      { text: 'BMI ≈ 23.1', textEn: 'BMI ≈ 23.1' },
      { text: '23.1 — у межах норми (18.5-24.9)', textEn: '23.1 — within normal range (18.5-24.9)' }
    ],
    answer: 'BMI ≈ 23.1 (нормальна вага)',
    answerEn: 'BMI ≈ 23.1 (normal weight)'
  },
  {
    id: 'prob_wave',
    name: 'Швидкість звукової хвилі',
    nameEn: 'Speed of Sound Wave',
    subject: 'physics',
    topic: 'Коливання і хвилі',
    difficulty: 1,
    description: 'Довжина звукової хвилі становить 0.68 м, а частота — 500 Гц. Визначте швидкість звуку.',
    descriptionEn: 'A sound wave has wavelength 0.68 m and frequency 500 Hz. Find the speed of sound.',
    relatedFormula: 'phys_wave_speed',
    steps: [
      { text: 'Формула: v = λ · f', textEn: 'Formula: v = λ · f' },
      { text: 'v = 0.68 · 500', textEn: 'v = 0.68 · 500' },
      { text: 'v = 340 м/с', textEn: 'v = 340 m/s' }
    ],
    answer: 'v = 340 м/с',
    answerEn: 'v = 340 m/s'
  },
  {
    id: 'prob_pendulum',
    name: 'Період маятника годинника',
    nameEn: 'Clock Pendulum Period',
    subject: 'physics',
    topic: 'Коливання і хвилі',
    difficulty: 2,
    description: 'Яку довжину повинен мати маятник годинника, щоб його період дорівнював 2 с? (g = 9.81 м/с²)',
    descriptionEn: 'What length should a clock pendulum have for a period of 2 s? (g = 9.81 m/s²)',
    relatedFormula: 'phys_pendulum',
    steps: [
      { text: 'T = 2π√(l/g) → l = g·T²/(4π²)', textEn: 'T = 2π√(l/g) → l = g·T²/(4π²)' },
      { text: 'l = 9.81 · 4 / (4 · 9.87)', textEn: 'l = 9.81 · 4 / (4 · 9.87)' },
      { text: 'l = 39.24 / 39.48 ≈ 0.994 м', textEn: 'l = 39.24 / 39.48 ≈ 0.994 m' },
      { text: 'l ≈ 1 м (секундний маятник)', textEn: 'l ≈ 1 m (seconds pendulum)' }
    ],
    answer: 'l ≈ 0.994 м ≈ 1 м',
    answerEn: 'l ≈ 0.994 m ≈ 1 m'
  },
  {
    id: 'prob_faraday',
    name: 'Електроліз розчину CuSO₄',
    nameEn: 'Electrolysis of CuSO₄ Solution',
    subject: 'chemistry',
    topic: 'Електрохімія',
    difficulty: 3,
    description: 'Через розчин CuSO₄ пропускали струм 5 А протягом 30 хвилин. Яка маса міді виділилася на катоді? (M_Cu = 64 г/моль, n = 2)',
    descriptionEn: 'A current of 5 A was passed through CuSO₄ solution for 30 min. What mass of copper was deposited? (M_Cu = 64 g/mol, n = 2)',
    relatedFormula: 'chem_faraday',
    steps: [
      { text: 'm = M·I·t / (n·F)', textEn: 'm = M·I·t / (n·F)' },
      { text: 't = 30 хв = 1800 с', textEn: 't = 30 min = 1800 s' },
      { text: 'm = 64 · 5 · 1800 / (2 · 96485)', textEn: 'm = 64 · 5 · 1800 / (2 · 96485)' },
      { text: 'm = 576000 / 192970 ≈ 2.99 г', textEn: 'm = 576000 / 192970 ≈ 2.99 g' }
    ],
    answer: 'm ≈ 2.99 г Cu',
    answerEn: 'm ≈ 2.99 g Cu'
  },
  {
    id: 'prob_molar_mass',
    name: 'Кількість речовини глюкози',
    nameEn: 'Amount of Glucose',
    subject: 'chemistry',
    topic: 'Термохімія',
    difficulty: 1,
    description: 'Скільки молів міститься в 90 г глюкози (C₆H₁₂O₆)? Молярна маса глюкози M = 180 г/моль.',
    descriptionEn: 'How many moles are in 90 g of glucose (C₆H₁₂O₆)? Molar mass M = 180 g/mol.',
    relatedFormula: 'chem_molar_mass',
    steps: [
      { text: 'n = m / M', textEn: 'n = m / M' },
      { text: 'n = 90 / 180', textEn: 'n = 90 / 180' },
      { text: 'n = 0.5 моль', textEn: 'n = 0.5 mol' }
    ],
    answer: 'n = 0.5 моль',
    answerEn: 'n = 0.5 mol'
  },
  {
    id: 'prob_osmotic',
    name: 'Осмотичний тиск розчину NaCl',
    nameEn: 'Osmotic Pressure of NaCl Solution',
    subject: 'biology',
    topic: 'Клітинна біологія',
    difficulty: 2,
    description: 'Обчисліть осмотичний тиск 0.15 моль/л розчину NaCl при 37°C. NaCl дисоціює на 2 іони (i = 2).',
    descriptionEn: 'Calculate the osmotic pressure of 0.15 mol/L NaCl solution at 37°C. NaCl dissociates into 2 ions (i = 2).',
    relatedFormula: 'bio_osmotic_pressure',
    steps: [
      { text: 'Π = i·C·R·T', textEn: 'Π = i·C·R·T' },
      { text: 'T = 37 + 273 = 310 К', textEn: 'T = 37 + 273 = 310 K' },
      { text: 'Π = 2 · 0.15 · 8.314 · 310', textEn: 'Π = 2 · 0.15 · 8.314 · 310' },
      { text: 'Π ≈ 771.5 кПа ≈ 7.6 атм', textEn: 'Π ≈ 771.5 kPa ≈ 7.6 atm' }
    ],
    answer: 'Π ≈ 771.5 кПа',
    answerEn: 'Π ≈ 771.5 kPa'
  },
  {
    id: 'prob_cardiac',
    name: 'Серцевий викид спортсмена',
    nameEn: 'Athlete Cardiac Output',
    subject: 'biology',
    topic: 'Фізіологія',
    difficulty: 2,
    description: 'Ударний об\'єм серця тренованого спортсмена — 100 мл, ЧСС у спокої — 55 уд/хв. Визначте серцевий викид.',
    descriptionEn: 'An athlete has stroke volume 100 mL and resting heart rate 55 bpm. Calculate cardiac output.',
    relatedFormula: 'bio_cardiac_output',
    steps: [
      { text: 'CO = SV × HR / 1000', textEn: 'CO = SV × HR / 1000' },
      { text: 'CO = 100 × 55 / 1000', textEn: 'CO = 100 × 55 / 1000' },
      { text: 'CO = 5500 / 1000 = 5.5 л/хв', textEn: 'CO = 5500 / 1000 = 5.5 L/min' },
      { text: 'Це норма для тренованого спортсмена', textEn: 'This is normal for a trained athlete' }
    ],
    answer: 'CO = 5.5 л/хв',
    answerEn: 'CO = 5.5 L/min'
  }
];

export function getProblemsBySubject(subject) {
  return problemsData.filter(p => p.subject === subject);
}

export function getProblemById(id) {
  return problemsData.find(p => p.id === id);
}
