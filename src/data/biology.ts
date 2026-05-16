/* ============================================
   Biology Formula Data
   ============================================ */

import type { SubjectData, Formula } from '@/types/domain';

export const biologyData: SubjectData = {
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
              description:
                'Рівняння Харді-Вайнберга описує частоти генотипів у популяції, що перебуває в рівновазі. p — частота домінантного алеля, q — рецесивного.',
              descriptionEn:
                'The Hardy-Weinberg equation describes genotype frequencies in a population at equilibrium. p = dominant allele frequency, q = recessive allele frequency.',
              variables: [
                {
                  symbol: 'p²',
                  name: 'Частота гомозигот AA',
                  nameEn: 'AA homozygote frequency',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'p',
                  name: 'Частота алеля A',
                  nameEn: 'Allele A frequency',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (values) => {
                const q = 1 - values.p;
                return {
                  'p²': values.p * values.p,
                  '2pq': 2 * values.p * q,
                  'q²': q * q
                };
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
              description:
                'Модель експоненційного зростання описує збільшення популяції за ідеальних умов (необмежені ресурси).',
              descriptionEn:
                'The exponential growth model describes population increase under ideal conditions (unlimited resources).',
              variables: [
                {
                  symbol: 'N_t',
                  name: 'Розмір популяції',
                  nameEn: 'Population size',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'N_0',
                  name: 'Початковий розмір',
                  nameEn: 'Initial size',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'r',
                  name: 'Швидкість зростання',
                  nameEn: 'Growth rate',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 't',
                  name: 'Час',
                  nameEn: 'Time',
                  unit: '',
                  type: 'input'
                }
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
              description:
                'Рівняння описує залежність швидкості ферментативної реакції від концентрації субстрату. Vmax — максимальна швидкість, Km — стала Міхаеліса.',
              descriptionEn:
                'The equation describes the dependence of enzymatic reaction rate on substrate concentration. Vmax = maximum rate, Km = Michaelis constant.',
              variables: [
                {
                  symbol: 'v',
                  name: 'Швидкість реакції',
                  nameEn: 'Reaction rate',
                  unit: 'моль/(л·с)',
                  type: 'result'
                },
                {
                  symbol: 'V_max',
                  name: 'Максимальна швидкість',
                  nameEn: 'Maximum rate',
                  unit: 'моль/(л·с)',
                  type: 'input'
                },
                {
                  symbol: 'S',
                  name: 'Концентрація субстрату',
                  nameEn: 'Substrate concentration',
                  unit: 'моль/л',
                  type: 'input'
                },
                {
                  symbol: 'K_m',
                  name: 'Стала Міхаеліса',
                  nameEn: 'Michaelis constant',
                  unit: 'моль/л',
                  type: 'input'
                }
              ],
              compute: (values) =>
                (values.V_max * values.S) / (values.K_m + values.S),
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
              description:
                'ІМТ — показник співвідношення маси тіла до зросту. Використовується для оцінки ваги: <18.5 — недостатня, 18.5-24.9 — нормальна, 25-29.9 — надмірна, >30 — ожиріння.',
              descriptionEn:
                'BMI is a measure of body weight relative to height. Used for weight assessment: <18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, >30 obese.',
              variables: [
                {
                  symbol: 'BMI',
                  name: 'Індекс маси тіла',
                  nameEn: 'BMI',
                  unit: 'кг/м²',
                  type: 'result'
                },
                {
                  symbol: 'm',
                  name: 'Маса тіла',
                  nameEn: 'Body mass',
                  unit: 'кг (kg)',
                  type: 'input'
                },
                {
                  symbol: 'h',
                  name: 'Зріст',
                  nameEn: 'Height',
                  unit: 'м (m)',
                  type: 'input'
                }
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
    },
    {
      id: 'ecology',
      name: 'Екологія',
      nameEn: 'Ecology',
      subtopics: [
        {
          id: 'population_ecology',
          name: 'Популяційна екологія',
          nameEn: 'Population Ecology',
          formulas: [
            {
              id: 'bio_logistic_growth',
              name: 'Логістичне зростання популяції',
              nameEn: 'Logistic Population Growth',
              latex:
                '\\frac{dN}{dt} = r \\cdot N \\cdot \\left(1 - \\frac{N}{K}\\right)',
              description:
                'Модель логістичного зростання враховує обмеженість ресурсів. K — ємність середовища (максимальний розмір популяції).',
              descriptionEn:
                'The logistic growth model accounts for resource limitations. K = carrying capacity (maximum population size).',
              variables: [
                {
                  symbol: 'dN/dt',
                  name: 'Швидкість зростання',
                  nameEn: 'Growth rate',
                  unit: 'особин/час',
                  type: 'result'
                },
                {
                  symbol: 'r',
                  name: 'Внутрішня швидкість',
                  nameEn: 'Intrinsic rate',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'N',
                  name: 'Поточний розмір',
                  nameEn: 'Current population',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'K',
                  name: 'Ємність середовища',
                  nameEn: 'Carrying capacity',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (values) =>
                values.r * values.N * (1 - values.N / values.K),
              resultVar: 'dN/dt',
              derivedFormulas: ['bio_population_growth'],
              topic: 'Екологія',
              subtopic: 'Популяційна екологія'
            }
          ]
        },
        {
          id: 'biodiversity',
          name: 'Біорізноманіття',
          nameEn: 'Biodiversity',
          formulas: [
            {
              id: 'bio_shannon',
              name: 'Індекс Шеннона',
              nameEn: 'Shannon Diversity Index',
              latex: "H' = -\\sum_{i=1}^{S} p_i \\cdot \\ln(p_i)",
              description:
                'Індекс Шеннона вимірює різноманітність видів у екосистемі. p_i — частка кожного виду у загальній кількості. Для калькулятора: спрощений варіант для 2 видів.',
              descriptionEn:
                'Shannon index measures species diversity in an ecosystem. p_i = proportion of each species. Calculator: simplified for 2 species.',
              variables: [
                {
                  symbol: "H'",
                  name: 'Індекс Шеннона',
                  nameEn: 'Shannon index',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'p₁',
                  name: 'Частка виду 1',
                  nameEn: 'Species 1 proportion',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'p₂',
                  name: 'Частка виду 2',
                  nameEn: 'Species 2 proportion',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (values) => {
                const p1 = values['p₁'];
                const p2 = values['p₂'];
                let h = 0;
                if (p1 > 0) h -= p1 * Math.log(p1);
                if (p2 > 0) h -= p2 * Math.log(p2);
                return h;
              },
              resultVar: "H'",
              derivedFormulas: ['bio_simpson'],
              topic: 'Екологія',
              subtopic: 'Біорізноманіття'
            },
            {
              id: 'bio_simpson',
              name: 'Індекс Сімпсона',
              nameEn: "Simpson's Diversity Index",
              latex: 'D = 1 - \\sum_{i=1}^{S} p_i^2',
              description:
                'Індекс Сімпсона показує ймовірність того, що два випадково обрані організми належать до різних видів. Для калькулятора: спрощений для 3 видів.',
              descriptionEn:
                "Simpson's index shows the probability that two randomly chosen organisms belong to different species. Calculator: simplified for 3 species.",
              variables: [
                {
                  symbol: 'D',
                  name: 'Індекс Сімпсона',
                  nameEn: 'Simpson index',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'p₁',
                  name: 'Частка виду 1',
                  nameEn: 'Species 1 proportion',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'p₂',
                  name: 'Частка виду 2',
                  nameEn: 'Species 2 proportion',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'p₃',
                  name: 'Частка виду 3',
                  nameEn: 'Species 3 proportion',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (values) =>
                1 - (values['p₁'] ** 2 + values['p₂'] ** 2 + values['p₃'] ** 2),
              resultVar: 'D',
              derivedFormulas: ['bio_shannon'],
              topic: 'Екологія',
              subtopic: 'Біорізноманіття'
            }
          ]
        }
      ]
    },
    {
      id: 'cell_biology',
      name: 'Клітинна біологія',
      nameEn: 'Cell Biology',
      subtopics: [
        {
          id: 'cell_processes',
          name: 'Клітинні процеси',
          nameEn: 'Cell Processes',
          formulas: [
            {
              id: 'bio_osmotic_pressure',
              name: 'Осмотичний тиск',
              nameEn: 'Osmotic Pressure',
              latex: '\\Pi = iCRT',
              description:
                'Осмотичний тиск залежить від ізотонічного коефіцієнта, молярної концентрації, газової сталої та температури.',
              descriptionEn:
                'Osmotic pressure depends on the isotonic coefficient, molar concentration, gas constant, and temperature.',
              variables: [
                {
                  symbol: 'Π',
                  name: 'Осмотичний тиск',
                  nameEn: 'Osmotic pressure',
                  unit: 'Па (Pa)',
                  type: 'result'
                },
                {
                  symbol: 'i',
                  name: 'Ізотонічний коефіцієнт',
                  nameEn: "Van't Hoff factor",
                  unit: '',
                  type: 'input',
                  defaultValue: 1
                },
                {
                  symbol: 'C',
                  name: 'Молярна концентрація',
                  nameEn: 'Molar concentration',
                  unit: 'моль/л',
                  type: 'input'
                },
                {
                  symbol: 'R',
                  name: 'Газова стала',
                  nameEn: 'Gas constant',
                  unit: 'Дж/(моль·К)',
                  type: 'input',
                  defaultValue: 8.314
                },
                {
                  symbol: 'T',
                  name: 'Температура',
                  nameEn: 'Temperature',
                  unit: 'К (K)',
                  type: 'input',
                  defaultValue: 310
                }
              ],
              compute: (v) => v.i * v.C * v.R * v.T,
              resultVar: 'Π',
              derivedFormulas: ['bio_michaelis_menten'],
              topic: 'Клітинна біологія',
              subtopic: 'Клітинні процеси'
            },
            {
              id: 'bio_dilution_plating',
              name: 'Підрахунок колоній (розведення)',
              nameEn: 'Colony Count (Dilution Plating)',
              latex: 'N = \\frac{C}{V \\cdot D}',
              description:
                "Кількість бактерій на мл визначається за числом колоній, об'ємом посіву та розведенням.",
              descriptionEn:
                'Bacterial count per mL is determined from colony count, plating volume, and dilution factor.',
              variables: [
                {
                  symbol: 'N',
                  name: 'Кількість бактерій/мл',
                  nameEn: 'Bacteria per mL',
                  unit: 'КУО/мл',
                  type: 'result'
                },
                {
                  symbol: 'C',
                  name: 'Кількість колоній',
                  nameEn: 'Colony count',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'V',
                  name: "Об'єм посіву",
                  nameEn: 'Plating volume',
                  unit: 'мл',
                  type: 'input'
                },
                {
                  symbol: 'D',
                  name: 'Фактор розведення',
                  nameEn: 'Dilution factor',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (v) => v.C / (v.V * v.D),
              resultVar: 'N',
              derivedFormulas: ['bio_population_growth'],
              topic: 'Клітинна біологія',
              subtopic: 'Клітинні процеси'
            }
          ]
        }
      ]
    },
    {
      id: 'physiology',
      name: 'Фізіологія',
      nameEn: 'Physiology',
      subtopics: [
        {
          id: 'cardiovascular',
          name: 'Серцево-судинна система',
          nameEn: 'Cardiovascular System',
          formulas: [
            {
              id: 'bio_cardiac_output',
              name: 'Серцевий викид',
              nameEn: 'Cardiac Output',
              latex: 'CO = SV \\cdot HR',
              description:
                "Серцевий викид — об'єм крові, який серце перекачує за хвилину. Дорівнює добутку ударного об'єму на частоту серцевих скорочень.",
              descriptionEn:
                'Cardiac output is the volume of blood pumped per minute. It equals stroke volume times heart rate.',
              variables: [
                {
                  symbol: 'CO',
                  name: 'Серцевий викид',
                  nameEn: 'Cardiac output',
                  unit: 'л/хв',
                  type: 'result'
                },
                {
                  symbol: 'SV',
                  name: "Ударний об'єм",
                  nameEn: 'Stroke volume',
                  unit: 'мл',
                  type: 'input',
                  defaultValue: 70
                },
                {
                  symbol: 'HR',
                  name: 'Частота скорочень',
                  nameEn: 'Heart rate',
                  unit: 'уд/хв',
                  type: 'input',
                  defaultValue: 72
                }
              ],
              compute: (v) => (v.SV * v.HR) / 1000,
              resultVar: 'CO',
              derivedFormulas: ['bio_bmi'],
              topic: 'Фізіологія',
              subtopic: 'Серцево-судинна система'
            },
            {
              id: 'bio_bmr',
              name: 'Базальний метаболізм (Харріс-Бенедикт)',
              nameEn: 'Basal Metabolic Rate (Harris-Benedict)',
              latex: 'BMR = 88.362 + 13.397m + 4.799h - 5.677a',
              description:
                'Формула Харріса-Бенедикта (для чоловіків) оцінює базальний метаболізм на основі маси тіла, зросту та віку.',
              descriptionEn:
                'Harris-Benedict equation (for males) estimates basal metabolic rate based on weight, height, and age.',
              variables: [
                {
                  symbol: 'BMR',
                  name: 'Базальний метаболізм',
                  nameEn: 'BMR',
                  unit: 'ккал/день',
                  type: 'result'
                },
                {
                  symbol: 'm',
                  name: 'Маса тіла',
                  nameEn: 'Body weight',
                  unit: 'кг (kg)',
                  type: 'input'
                },
                {
                  symbol: 'h',
                  name: 'Зріст',
                  nameEn: 'Height',
                  unit: 'см (cm)',
                  type: 'input'
                },
                {
                  symbol: 'a',
                  name: 'Вік',
                  nameEn: 'Age',
                  unit: 'років',
                  type: 'input'
                }
              ],
              compute: (v) => 88.362 + 13.397 * v.m + 4.799 * v.h - 5.677 * v.a,
              resultVar: 'BMR',
              derivedFormulas: ['bio_bmi', 'bio_cardiac_output'],
              topic: 'Фізіологія',
              subtopic: 'Серцево-судинна система'
            }
          ]
        }
      ]
    },
    {
      id: 'mendelian_genetics',
      name: 'Менделівська генетика',
      nameEn: 'Mendelian Genetics',
      subtopics: [
        {
          id: 'inheritance',
          name: 'Закони спадковості',
          nameEn: 'Laws of Inheritance',
          formulas: [
            {
              id: 'bio_monohybrid',
              name: 'Моногібридне схрещування',
              nameEn: 'Monohybrid Cross Ratio',
              latex: '\\text{F}_2: \\quad 1AA : 2Aa : 1aa',
              description:
                'При схрещуванні двох гетерозигот (Aa × Aa) у F₂ отримуємо розщеплення генотипів 1:2:1 та фенотипів 3:1.',
              descriptionEn:
                'Crossing two heterozygotes (Aa × Aa) yields F₂ genotype ratio 1:2:1 and phenotype ratio 3:1.',
              variables: [
                {
                  symbol: 'N_заг',
                  name: 'Загальна кількість нащадків',
                  nameEn: 'Total offspring',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'AA',
                  name: 'Гомозиготи домін.',
                  nameEn: 'Dominant homozygotes',
                  unit: '',
                  type: 'result'
                }
              ],
              compute: (v) => ({
                AA: Math.round(v['N_заг'] * 0.25),
                Aa: Math.round(v['N_заг'] * 0.5),
                aa: Math.round(v['N_заг'] * 0.25)
              }),
              resultVar: 'AA',
              multiResult: true,
              derivedFormulas: ['bio_hardy_weinberg', 'bio_dihybrid'],
              topic: 'Менделівська генетика',
              subtopic: 'Закони спадковості'
            },
            {
              id: 'bio_dihybrid',
              name: 'Дигібридне схрещування',
              nameEn: 'Dihybrid Cross Ratio',
              latex: '\\text{F}_2: \\quad 9:3:3:1',
              description:
                'При дигібридному схрещуванні (AaBb × AaBb) розщеплення за фенотипом у F₂: 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb.',
              descriptionEn:
                'Dihybrid cross (AaBb × AaBb) yields F₂ phenotype ratio: 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb.',
              variables: [
                {
                  symbol: 'N_заг',
                  name: 'Загальна кількість',
                  nameEn: 'Total offspring',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'AB',
                  name: 'A_B_ (обидві домін.)',
                  nameEn: 'A_B_ (both dominant)',
                  unit: '',
                  type: 'result'
                }
              ],
              compute: (v) => ({
                AB: Math.round((v['N_заг'] * 9) / 16),
                Ab: Math.round((v['N_заг'] * 3) / 16),
                aB: Math.round((v['N_заг'] * 3) / 16),
                ab: Math.round((v['N_заг'] * 1) / 16)
              }),
              resultVar: 'AB',
              multiResult: true,
              derivedFormulas: ['bio_monohybrid', 'bio_hardy_weinberg'],
              topic: 'Менделівська генетика',
              subtopic: 'Закони спадковості'
            }
          ]
        }
      ]
    },
    {
      id: 'metabolism',
      name: 'Метаболізм',
      nameEn: 'Metabolism',
      subtopics: [
        {
          id: 'energy_metabolism',
          name: 'Енергетичний обмін',
          nameEn: 'Energy Metabolism',
          formulas: [
            {
              id: 'bio_respiration_quotient',
              name: 'Дихальний коефіцієнт',
              nameEn: 'Respiratory Quotient',
              latex: 'RQ = \\frac{V_{CO_2}}{V_{O_2}}',
              description:
                "Дихальний коефіцієнт — відношення об'єму виділеного CO₂ до поглиненого O₂. RQ = 1 для вуглеводів, 0.7 для жирів.",
              descriptionEn:
                'Respiratory quotient — ratio of CO₂ produced to O₂ consumed. RQ = 1 for carbs, 0.7 for fats.',
              variables: [
                {
                  symbol: 'RQ',
                  name: 'Дихальний коефіцієнт',
                  nameEn: 'Respiratory quotient',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'V_CO₂',
                  name: "Об'єм CO₂",
                  nameEn: 'CO₂ volume',
                  unit: 'л',
                  type: 'input'
                },
                {
                  symbol: 'V_O₂',
                  name: "Об'єм O₂",
                  nameEn: 'O₂ volume',
                  unit: 'л',
                  type: 'input'
                }
              ],
              compute: (v) => v['V_CO₂'] / v['V_O₂'],
              resultVar: 'RQ',
              derivedFormulas: ['bio_bmr', 'bio_caloric_expenditure'],
              topic: 'Метаболізм',
              subtopic: 'Енергетичний обмін'
            },
            {
              id: 'bio_caloric_expenditure',
              name: 'Добова витрата калорій',
              nameEn: 'Daily Caloric Expenditure',
              latex: 'TDEE = BMR \\cdot AF',
              description:
                'Загальна добова витрата енергії = базальний метаболізм × коефіцієнт активності (1.2 — сидячий, 1.55 — помірний, 1.9 — активний).',
              descriptionEn:
                'Total daily energy expenditure = BMR × activity factor (1.2 sedentary, 1.55 moderate, 1.9 very active).',
              variables: [
                {
                  symbol: 'TDEE',
                  name: 'Добова витрата',
                  nameEn: 'Total daily expenditure',
                  unit: 'ккал',
                  type: 'result'
                },
                {
                  symbol: 'BMR',
                  name: 'Базальний метаболізм',
                  nameEn: 'Basal metabolic rate',
                  unit: 'ккал',
                  type: 'input'
                },
                {
                  symbol: 'AF',
                  name: 'Коефіцієнт активності',
                  nameEn: 'Activity factor',
                  unit: '',
                  type: 'input',
                  defaultValue: 1.55
                }
              ],
              compute: (v) => v.BMR * v.AF,
              resultVar: 'TDEE',
              derivedFormulas: ['bio_bmr', 'bio_bmi'],
              topic: 'Метаболізм',
              subtopic: 'Енергетичний обмін'
            },
            {
              id: 'bio_water_balance',
              name: 'Водний баланс організму',
              nameEn: 'Body Water Balance',
              latex: 'W = 0.6 \\cdot m',
              description:
                'Загальний вміст води в організмі людини становить приблизно 60% від маси тіла.',
              descriptionEn:
                'Total body water is approximately 60% of body weight.',
              variables: [
                {
                  symbol: 'W',
                  name: "Об'єм води",
                  nameEn: 'Total body water',
                  unit: 'кг (L)',
                  type: 'result'
                },
                {
                  symbol: 'm',
                  name: 'Маса тіла',
                  nameEn: 'Body mass',
                  unit: 'кг',
                  type: 'input'
                }
              ],
              compute: (v) => 0.6 * v.m,
              resultVar: 'W',
              derivedFormulas: ['bio_bmi'],
              topic: 'Метаболізм',
              subtopic: 'Енергетичний обмін'
            }
          ]
        }
      ]
    },
    {
      id: 'molecular_bio',
      name: 'Молекулярна біологія',
      nameEn: 'Molecular Biology',
      subtopics: [
        {
          id: 'dna_protein',
          name: 'ДНК та білки',
          nameEn: 'DNA & Proteins',
          formulas: [
            {
              id: 'bio_dna_length',
              name: 'Довжина молекули ДНК',
              nameEn: 'DNA Molecule Length',
              latex: 'L = N \\cdot 0.34\\,\\text{нм}',
              description:
                'Довжина молекули ДНК визначається кількістю нуклеотидних пар, кожна з яких має крок 0.34 нм.',
              descriptionEn:
                'DNA length is determined by the number of base pairs, each spaced 0.34 nm apart.',
              variables: [
                {
                  symbol: 'L',
                  name: 'Довжина ДНК',
                  nameEn: 'DNA length',
                  unit: 'нм',
                  type: 'result'
                },
                {
                  symbol: 'N',
                  name: 'Кількість нуклеотидних пар',
                  nameEn: 'Number of base pairs',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (v) => v.N * 0.34,
              resultVar: 'L',
              derivedFormulas: ['bio_codon_count'],
              topic: 'Молекулярна біологія',
              subtopic: 'ДНК та білки'
            },
            {
              id: 'bio_protein_mw',
              name: 'Молекулярна маса білка',
              nameEn: 'Protein Molecular Weight',
              latex: 'M_w = n \\cdot \\bar{m}_{aa} - (n-1) \\cdot 18',
              description:
                "Молекулярна маса білка: сума мас амінокислот мінус маса води, що виділилася при утворенні пептидних зв'язків.",
              descriptionEn:
                'Protein MW: sum of amino acid masses minus water released during peptide bond formation.',
              variables: [
                {
                  symbol: 'M_w',
                  name: 'Молекулярна маса',
                  nameEn: 'Molecular weight',
                  unit: 'Да',
                  type: 'result'
                },
                {
                  symbol: 'n',
                  name: 'Кількість амінокислот',
                  nameEn: 'Number of amino acids',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'm_aa',
                  name: 'Середня маса амінокислоти',
                  nameEn: 'Average amino acid mass',
                  unit: 'Да',
                  type: 'input',
                  defaultValue: 128
                }
              ],
              compute: (v) => v.n * v.m_aa - (v.n - 1) * 18,
              resultVar: 'M_w',
              derivedFormulas: ['bio_dna_length'],
              topic: 'Молекулярна біологія',
              subtopic: 'ДНК та білки'
            },
            {
              id: 'bio_codon_count',
              name: 'Кількість кодонів',
              nameEn: 'Codon Count',
              latex: 'C = \\frac{N_{bp}}{3}',
              description:
                'Кількість кодонів (трійок нуклеотидів) у мРНК визначає кількість амінокислот у білку.',
              descriptionEn:
                'The number of codons (nucleotide triplets) in mRNA determines the number of amino acids.',
              variables: [
                {
                  symbol: 'C',
                  name: 'Кількість кодонів',
                  nameEn: 'Number of codons',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'N_bp',
                  name: 'Кількість нуклеотидів',
                  nameEn: 'Number of nucleotides',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (v) => Math.floor(v.N_bp / 3),
              resultVar: 'C',
              derivedFormulas: ['bio_protein_mw'],
              topic: 'Молекулярна біологія',
              subtopic: 'ДНК та білки'
            }
          ]
        }
      ]
    },
    {
      id: 'epidemiology',
      name: 'Епідеміологія',
      nameEn: 'Epidemiology',
      subtopics: [
        {
          id: 'disease_spread',
          name: 'Поширення захворювань',
          nameEn: 'Disease Spread',
          formulas: [
            {
              id: 'bio_r0',
              name: 'Базове репродуктивне число',
              nameEn: 'Basic Reproduction Number',
              latex: 'R_0 = \\beta \\cdot c \\cdot D',
              description:
                'Середня кількість людей, яких може інфікувати одна хвора людина. Якщо R₀ > 1, епідемія зростає.',
              descriptionEn:
                'Average number of people infected by one case. If R₀ > 1, the epidemic grows.',
              variables: [
                {
                  symbol: 'R₀',
                  name: 'Репродуктивне число',
                  nameEn: 'Reproduction number',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'β',
                  name: 'Ймовірність зараження',
                  nameEn: 'Transmission probability',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'c',
                  name: 'Кількість контактів/день',
                  nameEn: 'Contacts per day',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'D',
                  name: 'Тривалість інфекції',
                  nameEn: 'Duration of infection',
                  unit: 'дні',
                  type: 'input'
                }
              ],
              compute: (v) => v['β'] * v.c * v.D,
              resultVar: 'R₀',
              derivedFormulas: ['bio_prevalence'],
              topic: 'Епідеміологія',
              subtopic: 'Поширення захворювань'
            },
            {
              id: 'bio_prevalence',
              name: 'Поширеність захворювання',
              nameEn: 'Disease Prevalence',
              latex:
                'P = \\frac{\\text{хворих}}{\\text{популяція}} \\times 100\\%',
              description:
                'Частка населення, що має захворювання на певний момент часу.',
              descriptionEn:
                'Proportion of a population that has a disease at a given time point.',
              variables: [
                {
                  symbol: 'P',
                  name: 'Поширеність',
                  nameEn: 'Prevalence',
                  unit: '%',
                  type: 'result'
                },
                {
                  symbol: 'cases',
                  name: 'Кількість хворих',
                  nameEn: 'Number of cases',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'pop',
                  name: 'Популяція',
                  nameEn: 'Population',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (v) => (v.cases / v.pop) * 100,
              resultVar: 'P',
              derivedFormulas: ['bio_r0'],
              topic: 'Епідеміологія',
              subtopic: 'Поширення захворювань'
            },
            {
              id: 'bio_selection',
              name: 'Коефіцієнт відбору',
              nameEn: 'Selection Coefficient',
              latex: 's = 1 - \\frac{w_{Aa}}{w_{AA}}',
              description:
                'Міра зниження пристосованості генотипу порівняно з найбільш пристосованим генотипом.',
              descriptionEn:
                'Measure of fitness reduction of a genotype compared to the fittest genotype.',
              variables: [
                {
                  symbol: 's',
                  name: 'Коефіцієнт відбору',
                  nameEn: 'Selection coefficient',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'w_Aa',
                  name: 'Пристосованість Aa',
                  nameEn: 'Fitness of Aa',
                  unit: '',
                  type: 'input'
                },
                {
                  symbol: 'w_AA',
                  name: 'Пристосованість AA',
                  nameEn: 'Fitness of AA',
                  unit: '',
                  type: 'input',
                  defaultValue: 1
                }
              ],
              compute: (v) => 1 - v.w_Aa / v.w_AA,
              resultVar: 's',
              derivedFormulas: ['bio_hardy_weinberg'],
              topic: 'Епідеміологія',
              subtopic: 'Поширення захворювань'
            },
            {
              id: 'bio_doubling_time',
              name: 'Час подвоєння популяції',
              nameEn: 'Population Doubling Time',
              latex: 't_d = \\frac{\\ln 2}{r}',
              description:
                'Час, необхідний для подвоєння чисельності популяції при сталій швидкості росту.',
              descriptionEn:
                'Time required for a population to double at a constant growth rate.',
              variables: [
                {
                  symbol: 't_d',
                  name: 'Час подвоєння',
                  nameEn: 'Doubling time',
                  unit: '',
                  type: 'result'
                },
                {
                  symbol: 'r',
                  name: 'Швидкість росту',
                  nameEn: 'Growth rate',
                  unit: '',
                  type: 'input'
                }
              ],
              compute: (v) => Math.log(2) / v.r,
              resultVar: 't_d',
              derivedFormulas: ['bio_population_growth'],
              topic: 'Епідеміологія',
              subtopic: 'Поширення захворювань'
            }
          ]
        }
      ]
    }
  ]
};

export function getAllFormulas(): Formula[] {
  const formulas: Formula[] = [];
  for (const topic of biologyData.topics) {
    for (const subtopic of topic.subtopics) {
      for (const formula of subtopic.formulas) {
        formulas.push({ ...formula, subject: 'biology' });
      }
    }
  }
  return formulas;
}

export function getFormulaById(id: string): Formula | undefined {
  return getAllFormulas().find((f) => f.id === id);
}
