/* ============================================
   Problem Examples Data
   ============================================ */

import type { ProblemItem } from '../types/domain';

export const problemsData: ProblemItem[] = [
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
  },
  {
    id: 'prob_bernoulli_pipe',
    name: 'Тиск у звуженій трубі',
    nameEn: 'Pressure in a Narrow Pipe',
    subject: 'physics',
    topic: 'Механіка рідин',
    difficulty: 2,
    description: 'Вода тече по трубі. У широкій частині (S₁=0.01 м²) швидкість 2 м/с, тиск 200 кПа. Знайдіть тиск у вузькій частині (S₂=0.005 м²).',
    descriptionEn: 'Water flows through a pipe. In the wide section (S₁=0.01 m²) velocity is 2 m/s, pressure is 200 kPa. Find pressure in the narrow section (S₂=0.005 m²).',
    relatedFormula: 'phys_bernoulli',
    steps: [
      { text: 'З рівняння неперервності: v₂ = S₁·v₁/S₂ = 0.01·2/0.005 = 4 м/с', textEn: 'From continuity equation: v₂ = S₁·v₁/S₂ = 0.01·2/0.005 = 4 m/s' },
      { text: 'Рівняння Бернуллі: P₁ + ½ρv₁² = P₂ + ½ρv₂²', textEn: "Bernoulli's equation: P₁ + ½ρv₁² = P₂ + ½ρv₂²" },
      { text: 'P₂ = P₁ + ½ρ(v₁² - v₂²) = 200000 + 0.5·1000·(4 - 16)', textEn: 'P₂ = P₁ + ½ρ(v₁² - v₂²) = 200000 + 0.5·1000·(4 - 16)' },
      { text: 'P₂ = 200000 - 6000 = 194000 Па = 194 кПа', textEn: 'P₂ = 200000 - 6000 = 194000 Pa = 194 kPa' }
    ],
    answer: 'P₂ = 194 кПа',
    answerEn: 'P₂ = 194 kPa'
  },
  {
    id: 'prob_torque_wrench',
    name: 'Момент сили гайкового ключа',
    nameEn: 'Torque of a Wrench',
    subject: 'physics',
    topic: 'Обертальний рух',
    difficulty: 1,
    description: 'Механік прикладає силу 80 Н до гайкового ключа довжиною 0.3 м під кутом 90°. Знайдіть момент сили.',
    descriptionEn: 'A mechanic applies 80 N of force to a 0.3 m wrench at a 90° angle. Find the torque.',
    relatedFormula: 'phys_torque',
    steps: [
      { text: 'Формула моменту сили: τ = r · F · sin θ', textEn: 'Torque formula: τ = r · F · sin θ' },
      { text: 'При θ = 90°, sin 90° = 1', textEn: 'At θ = 90°, sin 90° = 1' },
      { text: 'τ = 0.3 · 80 · 1 = 24 Н·м', textEn: 'τ = 0.3 · 80 · 1 = 24 N·m' }
    ],
    answer: 'τ = 24 Н·м',
    answerEn: 'τ = 24 N·m'
  },
  {
    id: 'prob_doppler_ambulance',
    name: 'Ефект Доплера для швидкої',
    nameEn: 'Doppler Effect for Ambulance',
    subject: 'physics',
    topic: 'Електромагнітні хвилі',
    difficulty: 3,
    description: 'Швидка допомога їде зі швидкістю 30 м/с і подає сигнал частотою 800 Гц. Яку частоту почує нерухомий спостерігач, коли машина наближається? (v_звуку = 343 м/с)',
    descriptionEn: 'An ambulance moves at 30 m/s sounding a 800 Hz siren. What frequency does a stationary observer hear as it approaches? (v_sound = 343 m/s)',
    relatedFormula: 'phys_doppler',
    steps: [
      { text: "Ефект Доплера: f' = f · v/(v - v_s)", textEn: "Doppler effect: f' = f · v/(v - v_s)" },
      { text: "f' = 800 · 343/(343 - 30)", textEn: "f' = 800 · 343/(343 - 30)" },
      { text: "f' = 800 · 343/313 ≈ 876.7 Гц", textEn: "f' = 800 · 343/313 ≈ 876.7 Hz" },
      { text: 'Частота зростає, бо джерело наближається', textEn: 'Frequency increases because the source is approaching' }
    ],
    answer: "f' ≈ 877 Гц",
    answerEn: "f' ≈ 877 Hz"
  },
  {
    id: 'prob_osmotic_glucose',
    name: 'Осмотичний тиск розчину глюкози',
    nameEn: 'Osmotic Pressure of Glucose',
    subject: 'chemistry',
    topic: 'Колігативні властивості',
    difficulty: 2,
    description: 'Знайдіть осмотичний тиск 0.1 М розчину глюкози (неелектроліт) при 37°C.',
    descriptionEn: 'Find the osmotic pressure of a 0.1 M glucose solution (nonelectrolyte) at 37°C.',
    relatedFormula: 'chem_osmotic_pressure',
    steps: [
      { text: 'Формула: Π = i·C·R·T', textEn: 'Formula: Π = i·C·R·T' },
      { text: 'Глюкоза — неелектроліт, тому i = 1', textEn: 'Glucose is a nonelectrolyte, so i = 1' },
      { text: 'T = 37 + 273 = 310 К', textEn: 'T = 37 + 273 = 310 K' },
      { text: 'Π = 1 · 0.1 · 0.0821 · 310 ≈ 2.55 атм', textEn: 'Π = 1 · 0.1 · 0.0821 · 310 ≈ 2.55 atm' }
    ],
    answer: 'Π ≈ 2.55 атм',
    answerEn: 'Π ≈ 2.55 atm'
  },
  {
    id: 'prob_henderson_buffer',
    name: 'pH ацетатного буфера',
    nameEn: 'pH of Acetate Buffer',
    subject: 'chemistry',
    topic: 'Аналітична хімія',
    difficulty: 2,
    description: 'Буферний розчин містить 0.2 М ацетат натрію та 0.1 М оцтову кислоту. pKa = 4.75. Знайдіть pH.',
    descriptionEn: 'A buffer contains 0.2 M sodium acetate and 0.1 M acetic acid. pKa = 4.75. Find the pH.',
    relatedFormula: 'chem_henderson',
    steps: [
      { text: 'Рівняння Гендерсона-Гассельбаха: pH = pKa + log([A⁻]/[HA])', textEn: 'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])' },
      { text: 'pH = 4.75 + log(0.2/0.1)', textEn: 'pH = 4.75 + log(0.2/0.1)' },
      { text: 'pH = 4.75 + log(2) = 4.75 + 0.301', textEn: 'pH = 4.75 + log(2) = 4.75 + 0.301' },
      { text: 'pH ≈ 5.05', textEn: 'pH ≈ 5.05' }
    ],
    answer: 'pH ≈ 5.05',
    answerEn: 'pH ≈ 5.05'
  },
  {
    id: 'prob_titration_hcl',
    name: 'Титрування HCl розчином NaOH',
    nameEn: 'Titration of HCl with NaOH',
    subject: 'chemistry',
    topic: 'Аналітична хімія',
    difficulty: 1,
    description: 'Для титрування 25 мл розчину HCl знадобилось 30 мл 0.1 М розчину NaOH. Знайдіть концентрацію HCl.',
    descriptionEn: 'To titrate 25 mL of HCl solution, 30 mL of 0.1 M NaOH was needed. Find the concentration of HCl.',
    relatedFormula: 'chem_titration',
    steps: [
      { text: 'У точці еквівалентності: C₁V₁ = C₂V₂', textEn: 'At equivalence: C₁V₁ = C₂V₂' },
      { text: 'C₁ · 25 = 0.1 · 30', textEn: 'C₁ · 25 = 0.1 · 30' },
      { text: 'C₁ = 3/25 = 0.12 М', textEn: 'C₁ = 3/25 = 0.12 M' }
    ],
    answer: 'C(HCl) = 0.12 М',
    answerEn: 'C(HCl) = 0.12 M'
  },
  {
    id: 'prob_dna_gene',
    name: 'Довжина гена',
    nameEn: 'Gene Length',
    subject: 'biology',
    topic: 'Молекулярна біологія',
    difficulty: 1,
    description: 'Ген кодує білок із 300 амінокислот. Знайдіть довжину цього гена в нанометрах.',
    descriptionEn: 'A gene encodes a protein of 300 amino acids. Find the gene length in nanometers.',
    relatedFormula: 'bio_dna_length',
    steps: [
      { text: '1 амінокислота = 3 нуклеотиди (кодон)', textEn: '1 amino acid = 3 nucleotides (codon)' },
      { text: 'Кількість нуклеотидних пар: N = 300 × 3 = 900', textEn: 'Number of base pairs: N = 300 × 3 = 900' },
      { text: 'Довжина: L = N × 0.34 нм = 900 × 0.34 = 306 нм', textEn: 'Length: L = N × 0.34 nm = 900 × 0.34 = 306 nm' }
    ],
    answer: 'L = 306 нм',
    answerEn: 'L = 306 nm'
  },
  {
    id: 'prob_r0_flu',
    name: 'Базове репродуктивне число грипу',
    nameEn: 'Flu R₀ Calculation',
    subject: 'biology',
    topic: 'Епідеміологія',
    difficulty: 2,
    description: 'Ймовірність зараження грипом при контакті — 5%. Хвора людина контактує з 20 особами на день протягом 5 днів. Знайдіть R₀.',
    descriptionEn: 'Flu transmission probability per contact is 5%. An infected person contacts 20 people per day for 5 days. Find R₀.',
    relatedFormula: 'bio_r0',
    steps: [
      { text: 'R₀ = β · c · D', textEn: 'R₀ = β · c · D' },
      { text: 'R₀ = 0.05 · 20 · 5', textEn: 'R₀ = 0.05 · 20 · 5' },
      { text: 'R₀ = 5.0 — кожна хвора людина інфікує в середньому 5 осіб', textEn: 'R₀ = 5.0 — each infected person infects 5 others on average' },
      { text: 'R₀ > 1, тому епідемія буде поширюватися', textEn: 'R₀ > 1, so the epidemic will spread' }
    ],
    answer: 'R₀ = 5.0',
    answerEn: 'R₀ = 5.0'
  },
  {
    id: 'prob_protein_mw',
    name: 'Молекулярна маса інсуліну',
    nameEn: 'Insulin Molecular Weight',
    subject: 'biology',
    topic: 'Молекулярна біологія',
    difficulty: 3,
    description: 'Інсулін людини складається з 51 амінокислоти. Оцініть його молекулярну масу (середня маса амінокислоти — 128 Да).',
    descriptionEn: 'Human insulin consists of 51 amino acids. Estimate its molecular weight (average amino acid mass: 128 Da).',
    relatedFormula: 'bio_protein_mw',
    steps: [
      { text: 'Формула: M = n · m_aa - (n-1) · 18', textEn: 'Formula: M = n · m_aa - (n-1) · 18' },
      { text: 'M = 51 · 128 - 50 · 18', textEn: 'M = 51 · 128 - 50 · 18' },
      { text: 'M = 6528 - 900 = 5628 Да', textEn: 'M = 6528 - 900 = 5628 Da' },
      { text: 'Реальна маса інсуліну — ~5808 Да (різниця через різні бічні ланцюги)', textEn: 'Actual insulin MW is ~5808 Da (difference due to varied side chains)' }
    ],
    answer: 'M ≈ 5628 Да',
    answerEn: 'M ≈ 5628 Da'
  },
  {
    id: 'prob_selection_coeff',
    name: 'Коефіцієнт відбору серповидноклітинної анемії',
    nameEn: 'Sickle Cell Selection Coefficient',
    subject: 'biology',
    topic: 'Епідеміологія',
    difficulty: 3,
    description: 'Пристосованість генотипу AA = 1.0, генотипу AS = 1.15 (перевага гетерозигот у зоні малярії). Знайдіть коефіцієнт відбору проти AA.',
    descriptionEn: 'Fitness of AA genotype = 1.0, AS genotype = 1.15 (heterozygote advantage in malaria zones). Find selection coefficient against AA.',
    relatedFormula: 'bio_selection',
    steps: [
      { text: 'Коефіцієнт відбору: s = 1 - w_AA/w_AS', textEn: 'Selection coefficient: s = 1 - w_AA/w_AS' },
      { text: 's = 1 - 1.0/1.15', textEn: 's = 1 - 1.0/1.15' },
      { text: 's = 1 - 0.87 = 0.13', textEn: 's = 1 - 0.87 = 0.13' },
      { text: 'Це пояснює високу частоту алеля S у зонах малярії', textEn: 'This explains the high frequency of the S allele in malaria zones' }
    ],
    answer: 's ≈ 0.13 (13% зниження пристосованості)',
    answerEn: 's ≈ 0.13 (13% fitness reduction)'
  }
];

export function getProblemsBySubject(subject: string): ProblemItem[] {
  return problemsData.filter(p => p.subject === subject);
}

export function getProblemById(id: string): ProblemItem | undefined {
  return problemsData.find(p => p.id === id);
}
