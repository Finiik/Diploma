/* ============================================
   Physics Formula Data
   Organized by topic → subtopics → formulas
   ============================================ */

import type { SubjectData, Formula } from '@/types/domain';

export const physicsData: SubjectData = {
  id: 'physics',
  name: 'Фізика',
  nameEn: 'Physics',
  icon: '⚛️',
  color: 'physics',
  topics: [
    {
      id: 'mechanics',
      name: 'Механіка',
      nameEn: 'Mechanics',
      subtopics: [
        {
          id: 'dynamics',
          name: 'Динаміка',
          nameEn: 'Dynamics',
          formulas: [
            {
              id: 'phys_newton2',
              name: 'Другий закон Ньютона',
              nameEn: "Newton's Second Law",
              latex: 'F = m \\cdot a',
              description: 'Сила дорівнює добутку маси тіла на прискорення. Це фундаментальний закон механіки, що описує зв\'язок між силою, масою та прискоренням.',
              descriptionEn: 'Force equals mass times acceleration. This is a fundamental law of mechanics describing the relationship between force, mass, and acceleration.',
              variables: [
                { symbol: 'F', name: 'Сила', nameEn: 'Force', unit: 'Н (N)', type: 'result' },
                { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' },
                { symbol: 'a', name: 'Прискорення', nameEn: 'Acceleration', unit: 'м/с² (m/s²)', type: 'input' }
              ],
              compute: (values) => values.m * values.a,
              resultVar: 'F',
              derivedFormulas: ['phys_weight', 'phys_momentum', 'phys_kinetic_energy'],
              topic: 'Механіка',
              subtopic: 'Динаміка'
            },
            {
              id: 'phys_weight',
              name: 'Сила тяжіння',
              nameEn: 'Weight (Gravitational Force)',
              latex: 'P = m \\cdot g',
              description: 'Сила тяжіння — сила, з якою Земля притягує тіло. Прискорення вільного падіння g ≈ 9.81 м/с².',
              descriptionEn: 'Weight is the gravitational force acting on an object. The acceleration due to gravity g ≈ 9.81 m/s².',
              variables: [
                { symbol: 'P', name: 'Сила тяжіння', nameEn: 'Weight', unit: 'Н (N)', type: 'result' },
                { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' },
                { symbol: 'g', name: 'Прискорення вільного падіння', nameEn: 'Gravitational acceleration', unit: 'м/с² (m/s²)', type: 'input', defaultValue: 9.81 }
              ],
              compute: (values) => values.m * values.g,
              resultVar: 'P',
              derivedFormulas: ['phys_newton2'],
              topic: 'Механіка',
              subtopic: 'Динаміка'
            },
            {
              id: 'phys_momentum',
              name: 'Імпульс тіла',
              nameEn: 'Momentum',
              latex: 'p = m \\cdot v',
              description: 'Імпульс — це добуток маси тіла на його швидкість. Характеризує кількість руху тіла.',
              descriptionEn: 'Momentum is the product of mass and velocity. It characterizes the quantity of motion.',
              variables: [
                { symbol: 'p', name: 'Імпульс', nameEn: 'Momentum', unit: 'кг·м/с (kg·m/s)', type: 'result' },
                { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' },
                { symbol: 'v', name: 'Швидкість', nameEn: 'Velocity', unit: 'м/с (m/s)', type: 'input' }
              ],
              compute: (values) => values.m * values.v,
              resultVar: 'p',
              derivedFormulas: ['phys_newton2', 'phys_kinetic_energy'],
              topic: 'Механіка',
              subtopic: 'Динаміка'
            }
          ]
        },
        {
          id: 'energy',
          name: 'Енергія',
          nameEn: 'Energy',
          formulas: [
            {
              id: 'phys_kinetic_energy',
              name: 'Кінетична енергія',
              nameEn: 'Kinetic Energy',
              latex: 'E_k = \\frac{m \\cdot v^2}{2}',
              description: 'Кінетична енергія — енергія руху тіла. Залежить від маси та квадрату швидкості.',
              descriptionEn: 'Kinetic energy is the energy of motion. It depends on mass and the square of velocity.',
              variables: [
                { symbol: 'E_k', name: 'Кінетична енергія', nameEn: 'Kinetic energy', unit: 'Дж (J)', type: 'result' },
                { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' },
                { symbol: 'v', name: 'Швидкість', nameEn: 'Velocity', unit: 'м/с (m/s)', type: 'input' }
              ],
              compute: (values) => (values.m * values.v * values.v) / 2,
              resultVar: 'E_k',
              derivedFormulas: ['phys_work', 'phys_momentum'],
              topic: 'Механіка',
              subtopic: 'Енергія'
            },
            {
              id: 'phys_work',
              name: 'Робота сили',
              nameEn: 'Work',
              latex: 'A = F \\cdot s \\cdot \\cos\\alpha',
              description: 'Робота сили — скалярна величина, що дорівнює добутку сили на переміщення та косинус кута між ними.',
              descriptionEn: 'Work is the scalar quantity equal to the product of force, displacement, and cosine of the angle between them.',
              variables: [
                { symbol: 'A', name: 'Робота', nameEn: 'Work', unit: 'Дж (J)', type: 'result' },
                { symbol: 'F', name: 'Сила', nameEn: 'Force', unit: 'Н (N)', type: 'input' },
                { symbol: 's', name: 'Переміщення', nameEn: 'Displacement', unit: 'м (m)', type: 'input' },
                { symbol: 'α', name: 'Кут (градуси)', nameEn: 'Angle (degrees)', unit: '°', type: 'input', defaultValue: 0 }
              ],
              compute: (values) => values.F * values.s * Math.cos(values['α'] * Math.PI / 180),
              resultVar: 'A',
              derivedFormulas: ['phys_kinetic_energy', 'phys_newton2'],
              topic: 'Механіка',
              subtopic: 'Енергія'
            }
          ]
        }
      ]
    },
    {
      id: 'electricity',
      name: 'Електрика',
      nameEn: 'Electricity',
      subtopics: [
        {
          id: 'circuits',
          name: 'Електричні кола',
          nameEn: 'Electric Circuits',
          formulas: [
            {
              id: 'phys_ohm',
              name: 'Закон Ома',
              nameEn: "Ohm's Law",
              latex: 'I = \\frac{U}{R}',
              description: 'Закон Ома для ділянки кола: сила струму прямо пропорційна напрузі та обернено пропорційна опору.',
              descriptionEn: "Ohm's law: current is directly proportional to voltage and inversely proportional to resistance.",
              variables: [
                { symbol: 'I', name: 'Сила струму', nameEn: 'Current', unit: 'А (A)', type: 'result' },
                { symbol: 'U', name: 'Напруга', nameEn: 'Voltage', unit: 'В (V)', type: 'input' },
                { symbol: 'R', name: 'Опір', nameEn: 'Resistance', unit: 'Ом (Ω)', type: 'input' }
              ],
              compute: (values) => values.U / values.R,
              resultVar: 'I',
              derivedFormulas: ['phys_power_electric'],
              topic: 'Електрика',
              subtopic: 'Електричні кола'
            },
            {
              id: 'phys_power_electric',
              name: 'Електрична потужність',
              nameEn: 'Electric Power',
              latex: 'P = U \\cdot I',
              description: 'Потужність електричного струму — робота, яку виконує струм за одиницю часу.',
              descriptionEn: 'Electric power is the work done by the electric current per unit of time.',
              variables: [
                { symbol: 'P', name: 'Потужність', nameEn: 'Power', unit: 'Вт (W)', type: 'result' },
                { symbol: 'U', name: 'Напруга', nameEn: 'Voltage', unit: 'В (V)', type: 'input' },
                { symbol: 'I', name: 'Сила струму', nameEn: 'Current', unit: 'А (A)', type: 'input' }
              ],
              compute: (values) => values.U * values.I,
              resultVar: 'P',
              derivedFormulas: ['phys_ohm'],
              topic: 'Електрика',
              subtopic: 'Електричні кола'
            }
          ]
        }
      ]
    },
    {
      id: 'thermodynamics',
      name: 'Термодинаміка',
      nameEn: 'Thermodynamics',
      subtopics: [
        {
          id: 'heat',
          name: 'Теплові процеси',
          nameEn: 'Heat Processes',
          formulas: [
            {
              id: 'phys_heat_energy',
              name: 'Кількість теплоти',
              nameEn: 'Heat Energy',
              latex: 'Q = c \\cdot m \\cdot \\Delta T',
              description: 'Кількість теплоти, необхідна для нагрівання тіла, залежить від питомої теплоємності речовини, маси тіла та зміни температури.',
              descriptionEn: 'The amount of heat required to warm a body depends on the specific heat capacity, mass, and temperature change.',
              variables: [
                { symbol: 'Q', name: 'Кількість теплоти', nameEn: 'Heat energy', unit: 'Дж (J)', type: 'result' },
                { symbol: 'c', name: 'Питома теплоємність', nameEn: 'Specific heat capacity', unit: 'Дж/(кг·°C)', type: 'input' },
                { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' },
                { symbol: 'ΔT', name: 'Зміна температури', nameEn: 'Temperature change', unit: '°C (K)', type: 'input' }
              ],
              compute: (values) => values.c * values.m * values['ΔT'],
              resultVar: 'Q',
              derivedFormulas: ['phys_heat_phase', 'phys_thermal_efficiency'],
              topic: 'Термодинаміка',
              subtopic: 'Теплові процеси'
            },
            {
              id: 'phys_heat_phase',
              name: 'Теплота фазового переходу',
              nameEn: 'Heat of Phase Change',
              latex: 'Q = L \\cdot m',
              description: 'Кількість теплоти при фазовому переході (плавлення, кипіння) дорівнює добутку питомої теплоти переходу на масу речовини.',
              descriptionEn: 'Heat during phase change (melting, boiling) equals the product of specific latent heat and mass.',
              variables: [
                { symbol: 'Q', name: 'Кількість теплоти', nameEn: 'Heat energy', unit: 'Дж (J)', type: 'result' },
                { symbol: 'L', name: 'Питома теплота переходу', nameEn: 'Specific latent heat', unit: 'Дж/кг (J/kg)', type: 'input' },
                { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' }
              ],
              compute: (values) => values.L * values.m,
              resultVar: 'Q',
              derivedFormulas: ['phys_heat_energy'],
              topic: 'Термодинаміка',
              subtopic: 'Теплові процеси'
            }
          ]
        },
        {
          id: 'thermo_laws',
          name: 'Закони термодинаміки',
          nameEn: 'Laws of Thermodynamics',
          formulas: [
            {
              id: 'phys_thermal_efficiency',
              name: 'ККД теплового двигуна',
              nameEn: 'Thermal Efficiency',
              latex: '\\eta = \\frac{A}{Q_1} \\times 100\\%',
              description: 'Коефіцієнт корисної дії теплового двигуна — відношення виконаної роботи до отриманої теплоти, виражене у відсотках.',
              descriptionEn: 'Thermal efficiency is the ratio of work done to heat received, expressed as a percentage.',
              variables: [
                { symbol: 'η', name: 'ККД', nameEn: 'Efficiency', unit: '%', type: 'result' },
                { symbol: 'A', name: 'Виконана робота', nameEn: 'Work done', unit: 'Дж (J)', type: 'input' },
                { symbol: 'Q_1', name: 'Отримана теплота', nameEn: 'Heat received', unit: 'Дж (J)', type: 'input' }
              ],
              compute: (values) => (values.A / values.Q_1) * 100,
              resultVar: 'η',
              derivedFormulas: ['phys_heat_energy', 'phys_work'],
              topic: 'Термодинаміка',
              subtopic: 'Закони термодинаміки'
            },
            {
              id: 'phys_carnot',
              name: 'ККД циклу Карно',
              nameEn: 'Carnot Efficiency',
              latex: '\\eta_{\\text{Карно}} = 1 - \\frac{T_2}{T_1}',
              description: 'Максимально можливий ККД теплового двигуна, що працює між двома температурами. T₁ — температура нагрівача, T₂ — температура холодильника.',
              descriptionEn: 'Maximum possible efficiency of a heat engine operating between two temperatures. T₁ = hot reservoir, T₂ = cold reservoir.',
              variables: [
                { symbol: 'η', name: 'ККД Карно', nameEn: 'Carnot efficiency', unit: '', type: 'result' },
                { symbol: 'T_1', name: 'Температура нагрівача', nameEn: 'Hot reservoir temperature', unit: 'К (K)', type: 'input' },
                { symbol: 'T_2', name: 'Температура холодильника', nameEn: 'Cold reservoir temperature', unit: 'К (K)', type: 'input' }
              ],
              compute: (values) => 1 - (values.T_2 / values.T_1),
              resultVar: 'η',
              derivedFormulas: ['phys_thermal_efficiency'],
              topic: 'Термодинаміка',
              subtopic: 'Закони термодинаміки'
            }
          ]
        }
      ]
    },
    {
      id: 'optics',
      name: 'Оптика',
      nameEn: 'Optics',
      subtopics: [
        {
          id: 'geometric_optics',
          name: 'Геометрична оптика',
          nameEn: 'Geometric Optics',
          formulas: [
            {
              id: 'phys_snell',
              name: 'Закон Снелліуса',
              nameEn: "Snell's Law",
              latex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2',
              description: 'Закон заломлення світла: добуток показника заломлення середовища на синус кута падіння дорівнює аналогічному добутку для заломленого променя.',
              descriptionEn: "Snell's law of refraction: the product of the refractive index and sine of the angle of incidence equals that for the refracted ray.",
              variables: [
                { symbol: 'θ₂', name: 'Кут заломлення', nameEn: 'Refraction angle', unit: '° (degrees)', type: 'result' },
                { symbol: 'n₁', name: 'Показник заломлення 1', nameEn: 'Refractive index 1', unit: '', type: 'input', defaultValue: 1 },
                { symbol: 'θ₁', name: 'Кут падіння', nameEn: 'Angle of incidence', unit: '° (degrees)', type: 'input' },
                { symbol: 'n₂', name: 'Показник заломлення 2', nameEn: 'Refractive index 2', unit: '', type: 'input' }
              ],
              compute: (v) => Math.asin((v['n₁'] * Math.sin(v['θ₁'] * Math.PI / 180)) / v['n₂']) * 180 / Math.PI,
              resultVar: 'θ₂',
              derivedFormulas: ['phys_thin_lens'],
              topic: 'Оптика', subtopic: 'Геометрична оптика'
            },
            {
              id: 'phys_thin_lens',
              name: 'Формула тонкої лінзи',
              nameEn: 'Thin Lens Equation',
              latex: '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
              description: 'Зв\'язує фокусну відстань лінзи з відстанню від предмета до лінзи та від лінзи до зображення.',
              descriptionEn: 'Relates the focal length of a lens to the object distance and image distance.',
              variables: [
                { symbol: 'f', name: 'Фокусна відстань', nameEn: 'Focal length', unit: 'м (m)', type: 'result' },
                { symbol: 'd', name: 'Відстань до предмета', nameEn: 'Object distance', unit: 'м (m)', type: 'input' },
                { symbol: "d'", name: 'Відстань до зображення', nameEn: 'Image distance', unit: 'м (m)', type: 'input' }
              ],
              compute: (v) => 1 / (1/v.d + 1/v["d'"]),
              resultVar: 'f',
              derivedFormulas: ['phys_snell'],
              topic: 'Оптика', subtopic: 'Геометрична оптика'
            },
            {
              id: 'phys_magnification',
              name: 'Збільшення лінзи',
              nameEn: 'Lens Magnification',
              latex: 'M = \\frac{d\'}{d}',
              description: 'Лінійне збільшення лінзи — відношення відстані до зображення до відстані до предмета.',
              descriptionEn: 'Linear magnification is the ratio of image distance to object distance.',
              variables: [
                { symbol: 'M', name: 'Збільшення', nameEn: 'Magnification', unit: '', type: 'result' },
                { symbol: "d'", name: 'Відстань до зображення', nameEn: 'Image distance', unit: 'м (m)', type: 'input' },
                { symbol: 'd', name: 'Відстань до предмета', nameEn: 'Object distance', unit: 'м (m)', type: 'input' }
              ],
              compute: (v) => v["d'"] / v.d,
              resultVar: 'M',
              derivedFormulas: ['phys_thin_lens'],
              topic: 'Оптика', subtopic: 'Геометрична оптика'
            }
          ]
        }
      ]
    },
    {
      id: 'waves',
      name: 'Коливання і хвилі',
      nameEn: 'Oscillations & Waves',
      subtopics: [
        {
          id: 'wave_properties',
          name: 'Властивості хвиль',
          nameEn: 'Wave Properties',
          formulas: [
            {
              id: 'phys_wave_speed',
              name: 'Швидкість хвилі',
              nameEn: 'Wave Speed',
              latex: 'v = \\lambda \\cdot f',
              description: 'Швидкість хвилі дорівнює добутку довжини хвилі на частоту.',
              descriptionEn: 'Wave speed equals wavelength times frequency.',
              variables: [
                { symbol: 'v', name: 'Швидкість хвилі', nameEn: 'Wave speed', unit: 'м/с (m/s)', type: 'result' },
                { symbol: 'λ', name: 'Довжина хвилі', nameEn: 'Wavelength', unit: 'м (m)', type: 'input' },
                { symbol: 'f', name: 'Частота', nameEn: 'Frequency', unit: 'Гц (Hz)', type: 'input' }
              ],
              compute: (v) => v['λ'] * v.f,
              resultVar: 'v',
              derivedFormulas: ['phys_period_freq'],
              topic: 'Коливання і хвилі', subtopic: 'Властивості хвиль'
            },
            {
              id: 'phys_period_freq',
              name: 'Період і частота',
              nameEn: 'Period and Frequency',
              latex: 'T = \\frac{1}{f}',
              description: 'Період коливань — час одного повного коливання. Обернено пропорційний частоті.',
              descriptionEn: 'Period is the time for one complete oscillation. Inversely proportional to frequency.',
              variables: [
                { symbol: 'T', name: 'Період', nameEn: 'Period', unit: 'с (s)', type: 'result' },
                { symbol: 'f', name: 'Частота', nameEn: 'Frequency', unit: 'Гц (Hz)', type: 'input' }
              ],
              compute: (v) => 1 / v.f,
              resultVar: 'T',
              derivedFormulas: ['phys_wave_speed', 'phys_pendulum'],
              topic: 'Коливання і хвилі', subtopic: 'Властивості хвиль'
            },
            {
              id: 'phys_pendulum',
              name: 'Період математичного маятника',
              nameEn: 'Simple Pendulum Period',
              latex: 'T = 2\\pi\\sqrt{\\frac{l}{g}}',
              description: 'Період коливань математичного маятника залежить лише від довжини нитки та прискорення вільного падіння.',
              descriptionEn: 'The period of a simple pendulum depends only on the string length and gravitational acceleration.',
              variables: [
                { symbol: 'T', name: 'Період', nameEn: 'Period', unit: 'с (s)', type: 'result' },
                { symbol: 'l', name: 'Довжина маятника', nameEn: 'Pendulum length', unit: 'м (m)', type: 'input' },
                { symbol: 'g', name: 'Прискорення вільного падіння', nameEn: 'Gravitational acceleration', unit: 'м/с² (m/s²)', type: 'input', defaultValue: 9.81 }
              ],
              compute: (v) => 2 * Math.PI * Math.sqrt(v.l / v.g),
              resultVar: 'T',
              derivedFormulas: ['phys_period_freq', 'phys_wave_speed'],
              topic: 'Коливання і хвилі', subtopic: 'Властивості хвиль'
            }
          ]
        }
      ]
    },
    {
      id: 'gravitation',
      name: 'Гравітація',
      nameEn: 'Gravitation',
      subtopics: [{
        id: 'universal_gravity',
        name: 'Закон всесвітнього тяжіння',
        nameEn: 'Universal Gravitation',
        formulas: [
          {
            id: 'phys_gravity_law',
            name: 'Закон всесвітнього тяжіння',
            nameEn: 'Law of Universal Gravitation',
            latex: 'F = G\\frac{m_1 m_2}{r^2}',
            description: 'Сила гравітаційного притягання між двома тілами пропорційна добутку їх мас та обернено пропорційна квадрату відстані. G = 6.674×10⁻¹¹.',
            descriptionEn: 'Gravitational force between two bodies is proportional to the product of their masses and inversely proportional to the square of distance. G = 6.674×10⁻¹¹.',
            variables: [
              { symbol: 'F', name: 'Сила тяжіння', nameEn: 'Gravitational force', unit: 'Н (N)', type: 'result' },
              { symbol: 'G', name: 'Гравітаційна стала', nameEn: 'Gravitational constant', unit: 'Н·м²/кг²', type: 'input', defaultValue: 6.674e-11 },
              { symbol: 'm₁', name: 'Маса 1', nameEn: 'Mass 1', unit: 'кг', type: 'input' },
              { symbol: 'm₂', name: 'Маса 2', nameEn: 'Mass 2', unit: 'кг', type: 'input' },
              { symbol: 'r', name: 'Відстань', nameEn: 'Distance', unit: 'м', type: 'input' }
            ],
            compute: (v) => v.G * v['m₁'] * v['m₂'] / (v.r * v.r),
            resultVar: 'F', derivedFormulas: ['phys_orbital_v', 'phys_escape_v'],
            topic: 'Гравітація', subtopic: 'Закон всесвітнього тяжіння'
          },
          {
            id: 'phys_orbital_v',
            name: 'Перша космічна швидкість',
            nameEn: 'Orbital Velocity',
            latex: 'v_1 = \\sqrt{\\frac{GM}{R}}',
            description: 'Мінімальна швидкість для виходу на навколоземну орбіту. Для Землі ≈ 7.9 км/с.',
            descriptionEn: 'Minimum speed to enter orbit around a body. For Earth ≈ 7.9 km/s.',
            variables: [
              { symbol: 'v₁', name: 'Орбітальна швидкість', nameEn: 'Orbital velocity', unit: 'м/с', type: 'result' },
              { symbol: 'G', name: 'Гравітаційна стала', nameEn: 'Gravitational constant', unit: '', type: 'input', defaultValue: 6.674e-11 },
              { symbol: 'M', name: 'Маса планети', nameEn: 'Planet mass', unit: 'кг', type: 'input', defaultValue: 5.972e24 },
              { symbol: 'R', name: 'Радіус орбіти', nameEn: 'Orbital radius', unit: 'м', type: 'input', defaultValue: 6.371e6 }
            ],
            compute: (v) => Math.sqrt(v.G * v.M / v.R),
            resultVar: 'v₁', derivedFormulas: ['phys_escape_v', 'phys_gravity_law'],
            topic: 'Гравітація', subtopic: 'Закон всесвітнього тяжіння'
          },
          {
            id: 'phys_escape_v',
            name: 'Друга космічна швидкість',
            nameEn: 'Escape Velocity',
            latex: 'v_2 = \\sqrt{\\frac{2GM}{R}}',
            description: 'Мінімальна швидкість для подолання гравітаційного поля планети. Для Землі ≈ 11.2 км/с.',
            descriptionEn: 'Minimum speed to escape a planet\'s gravitational field. For Earth ≈ 11.2 km/s.',
            variables: [
              { symbol: 'v₂', name: 'Швидкість втечі', nameEn: 'Escape velocity', unit: 'м/с', type: 'result' },
              { symbol: 'G', name: 'Гравітаційна стала', nameEn: 'Gravitational constant', unit: '', type: 'input', defaultValue: 6.674e-11 },
              { symbol: 'M', name: 'Маса планети', nameEn: 'Planet mass', unit: 'кг', type: 'input', defaultValue: 5.972e24 },
              { symbol: 'R', name: 'Радіус', nameEn: 'Radius', unit: 'м', type: 'input', defaultValue: 6.371e6 }
            ],
            compute: (v) => Math.sqrt(2 * v.G * v.M / v.R),
            resultVar: 'v₂', derivedFormulas: ['phys_orbital_v', 'phys_gravity_law'],
            topic: 'Гравітація', subtopic: 'Закон всесвітнього тяжіння'
          }
        ]
      }]
    },
    {
      id: 'nuclear',
      name: 'Ядерна фізика',
      nameEn: 'Nuclear Physics',
      subtopics: [{
        id: 'radioactivity',
        name: 'Радіоактивність',
        nameEn: 'Radioactivity',
        formulas: [
          {
            id: 'phys_mass_energy',
            name: 'Еквівалентність маси та енергії',
            nameEn: 'Mass-Energy Equivalence',
            latex: 'E = mc^2',
            description: 'Знаменита формула Ейнштейна: енергія дорівнює масі, помноженій на квадрат швидкості світла.',
            descriptionEn: "Einstein's famous equation: energy equals mass times the speed of light squared.",
            variables: [
              { symbol: 'E', name: 'Енергія', nameEn: 'Energy', unit: 'Дж (J)', type: 'result' },
              { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' },
              { symbol: 'c', name: 'Швидкість світла', nameEn: 'Speed of light', unit: 'м/с', type: 'input', defaultValue: 299792458 }
            ],
            compute: (v) => v.m * v.c * v.c,
            resultVar: 'E', derivedFormulas: ['phys_radioactive_decay'],
            topic: 'Ядерна фізика', subtopic: 'Радіоактивність'
          },
          {
            id: 'phys_radioactive_decay',
            name: 'Закон радіоактивного розпаду',
            nameEn: 'Radioactive Decay Law',
            latex: 'N = N_0 \\cdot 2^{-t/T_{1/2}}',
            description: 'Кількість нерозпалих ядер зменшується експоненційно. T₁/₂ — період напіврозпаду.',
            descriptionEn: 'The number of undecayed nuclei decreases exponentially. T₁/₂ — half-life.',
            variables: [
              { symbol: 'N', name: 'Кількість ядер', nameEn: 'Remaining nuclei', unit: '', type: 'result' },
              { symbol: 'N₀', name: 'Початкова кількість', nameEn: 'Initial nuclei', unit: '', type: 'input' },
              { symbol: 't', name: 'Час', nameEn: 'Time', unit: '', type: 'input' },
              { symbol: 'T½', name: 'Період напіврозпаду', nameEn: 'Half-life', unit: '', type: 'input' }
            ],
            compute: (v) => v['N₀'] * Math.pow(2, -v.t / v['T½']),
            resultVar: 'N', derivedFormulas: ['phys_mass_energy'],
            topic: 'Ядерна фізика', subtopic: 'Радіоактивність'
          },
          {
            id: 'phys_photon_energy',
            name: 'Енергія фотона',
            nameEn: 'Photon Energy',
            latex: 'E = h \\cdot f = \\frac{hc}{\\lambda}',
            description: 'Енергія фотона пропорційна частоті випромінювання. h = 6.626×10⁻³⁴ Дж·с — стала Планка.',
            descriptionEn: 'Photon energy is proportional to radiation frequency. h = 6.626×10⁻³⁴ J·s — Planck constant.',
            variables: [
              { symbol: 'E', name: 'Енергія фотона', nameEn: 'Photon energy', unit: 'Дж (J)', type: 'result' },
              { symbol: 'h', name: 'Стала Планка', nameEn: 'Planck constant', unit: 'Дж·с', type: 'input', defaultValue: 6.626e-34 },
              { symbol: 'f', name: 'Частота', nameEn: 'Frequency', unit: 'Гц (Hz)', type: 'input' }
            ],
            compute: (v) => v.h * v.f,
            resultVar: 'E', derivedFormulas: ['phys_mass_energy', 'phys_wave_speed'],
            topic: 'Ядерна фізика', subtopic: 'Радіоактивність'
          }
        ]
      }]
    },
    {
      id: 'fluid_mechanics',
      name: 'Механіка рідин',
      nameEn: 'Fluid Mechanics',
      subtopics: [{
        id: 'hydrostatics',
        name: 'Гідростатика',
        nameEn: 'Hydrostatics',
        formulas: [
          {
            id: 'phys_bernoulli',
            name: 'Рівняння Бернуллі',
            nameEn: "Bernoulli's Equation",
            latex: 'P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}',
            description: 'Закон збереження енергії для потоку ідеальної рідини: сума тиску, кінетичної та потенціальної енергії є сталою.',
            descriptionEn: "Conservation of energy in fluid flow: sum of pressure, kinetic, and potential energy is constant.",
            variables: [
              { symbol: 'P', name: 'Тиск', nameEn: 'Pressure', unit: 'Па (Pa)', type: 'input' },
              { symbol: 'ρ', name: 'Густина рідини', nameEn: 'Fluid density', unit: 'кг/м³', type: 'input' },
              { symbol: 'v', name: 'Швидкість потоку', nameEn: 'Flow velocity', unit: 'м/с', type: 'input' },
              { symbol: 'g', name: 'Прискорення вільного падіння', nameEn: 'Gravitational acceleration', unit: 'м/с²', type: 'input', defaultValue: 9.81 },
              { symbol: 'h', name: 'Висота', nameEn: 'Height', unit: 'м (m)', type: 'input' },
              { symbol: 'E_total', name: 'Повна енергія', nameEn: 'Total energy', unit: 'Па', type: 'result' }
            ],
            compute: (v) => v.P + 0.5 * v['ρ'] * v.v * v.v + v['ρ'] * v.g * v.h,
            resultVar: 'E_total', derivedFormulas: ['phys_archimedes'],
            topic: 'Механіка рідин', subtopic: 'Гідростатика'
          },
          {
            id: 'phys_archimedes',
            name: 'Закон Архімеда',
            nameEn: "Archimedes' Principle",
            latex: 'F_a = \\rho_f \\cdot g \\cdot V',
            description: 'Виштовхувальна сила, що діє на тіло, занурене в рідину, дорівнює вазі витісненої рідини.',
            descriptionEn: "The buoyant force on an object submerged in fluid equals the weight of displaced fluid.",
            variables: [
              { symbol: 'F_a', name: 'Сила Архімеда', nameEn: 'Buoyant force', unit: 'Н (N)', type: 'result' },
              { symbol: 'ρ_f', name: 'Густина рідини', nameEn: 'Fluid density', unit: 'кг/м³', type: 'input' },
              { symbol: 'g', name: 'Прискорення', nameEn: 'Gravity', unit: 'м/с²', type: 'input', defaultValue: 9.81 },
              { symbol: 'V', name: "Об'єм зануреної частини", nameEn: 'Submerged volume', unit: 'м³', type: 'input' }
            ],
            compute: (v) => v['ρ_f'] * v.g * v.V,
            resultVar: 'F_a', derivedFormulas: ['phys_bernoulli'],
            topic: 'Механіка рідин', subtopic: 'Гідростатика'
          },
          {
            id: 'phys_continuity',
            name: 'Рівняння неперервності',
            nameEn: 'Continuity Equation',
            latex: 'A_1 v_1 = A_2 v_2',
            description: 'Об\'ємна витрата рідини залишається сталою: при звуженні труби швидкість потоку зростає.',
            descriptionEn: 'Volume flow rate remains constant: when a pipe narrows, flow velocity increases.',
            variables: [
              { symbol: 'A₁', name: 'Площа перерізу 1', nameEn: 'Cross-section area 1', unit: 'м²', type: 'input' },
              { symbol: 'v₁', name: 'Швидкість 1', nameEn: 'Velocity 1', unit: 'м/с', type: 'input' },
              { symbol: 'A₂', name: 'Площа перерізу 2', nameEn: 'Cross-section area 2', unit: 'м²', type: 'input' },
              { symbol: 'v₂', name: 'Швидкість 2', nameEn: 'Velocity 2', unit: 'м/с', type: 'result' }
            ],
            compute: (v) => (v['A₁'] * v['v₁']) / v['A₂'],
            resultVar: 'v₂', derivedFormulas: ['phys_bernoulli'],
            topic: 'Механіка рідин', subtopic: 'Гідростатика'
          }
        ]
      }]
    },
    {
      id: 'em_waves',
      name: 'Електромагнітні хвилі',
      nameEn: 'Electromagnetic Waves',
      subtopics: [{
        id: 'wave_properties',
        name: 'Властивості хвиль',
        nameEn: 'Wave Properties',
        formulas: [
          {
            id: 'phys_em_wave',
            name: 'Рівняння електромагнітної хвилі',
            nameEn: 'EM Wave Equation',
            latex: 'c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}}',
            description: 'Швидкість світла у вакуумі визначається магнітною та електричною сталими.',
            descriptionEn: 'Speed of light in vacuum is determined by magnetic and electric constants.',
            variables: [
              { symbol: 'c', name: 'Швидкість світла', nameEn: 'Speed of light', unit: 'м/с', type: 'result' },
              { symbol: 'μ₀', name: 'Магнітна стала', nameEn: 'Magnetic constant', unit: 'Гн/м', type: 'input', defaultValue: 1.2566e-6 },
              { symbol: 'ε₀', name: 'Електрична стала', nameEn: 'Electric constant', unit: 'Ф/м', type: 'input', defaultValue: 8.854e-12 }
            ],
            compute: (v) => 1 / Math.sqrt(v['μ₀'] * v['ε₀']),
            resultVar: 'c', derivedFormulas: ['phys_photon_energy'],
            topic: 'Електромагнітні хвилі', subtopic: 'Властивості хвиль'
          },
          {
            id: 'phys_doppler',
            name: 'Ефект Доплера',
            nameEn: 'Doppler Effect',
            latex: "f' = f \\cdot \\frac{v \\pm v_o}{v \\mp v_s}",
            description: 'Зміна частоти хвилі внаслідок руху джерела або спостерігача.',
            descriptionEn: 'Change in wave frequency due to relative motion of source or observer.',
            variables: [
              { symbol: "f'", name: 'Спостережена частота', nameEn: 'Observed frequency', unit: 'Гц', type: 'result' },
              { symbol: 'f', name: 'Частота джерела', nameEn: 'Source frequency', unit: 'Гц', type: 'input' },
              { symbol: 'v', name: 'Швидкість хвилі', nameEn: 'Wave speed', unit: 'м/с', type: 'input', defaultValue: 343 },
              { symbol: 'v_o', name: 'Швидкість спостерігача', nameEn: 'Observer speed', unit: 'м/с', type: 'input', defaultValue: 0 },
              { symbol: 'v_s', name: 'Швидкість джерела', nameEn: 'Source speed', unit: 'м/с', type: 'input' }
            ],
            compute: (v) => v.f * ((v.v + v.v_o) / (v.v - v.v_s)),
            resultVar: "f'", derivedFormulas: ['phys_wave_speed'],
            topic: 'Електромагнітні хвилі', subtopic: 'Властивості хвиль'
          }
        ]
      }]
    },
    {
      id: 'rotational',
      name: 'Обертальний рух',
      nameEn: 'Rotational Mechanics',
      subtopics: [{
        id: 'rotation_basics',
        name: 'Основи обертання',
        nameEn: 'Rotation Basics',
        formulas: [
          {
            id: 'phys_torque',
            name: 'Момент сили',
            nameEn: 'Torque',
            latex: '\\tau = r \\cdot F \\cdot \\sin\\theta',
            description: 'Момент сили — міра здатності сили обертати тіло навколо осі.',
            descriptionEn: 'Torque measures the ability of a force to cause rotational motion about an axis.',
            variables: [
              { symbol: 'τ', name: 'Момент сили', nameEn: 'Torque', unit: 'Н·м', type: 'result' },
              { symbol: 'r', name: 'Плече сили', nameEn: 'Lever arm', unit: 'м', type: 'input' },
              { symbol: 'F', name: 'Сила', nameEn: 'Force', unit: 'Н', type: 'input' },
              { symbol: 'θ', name: 'Кут', nameEn: 'Angle', unit: 'рад', type: 'input', defaultValue: 1.5708 }
            ],
            compute: (v) => v.r * v.F * Math.sin(v['θ']),
            resultVar: 'τ', derivedFormulas: ['phys_moment_inertia'],
            topic: 'Обертальний рух', subtopic: 'Основи обертання'
          },
          {
            id: 'phys_moment_inertia',
            name: 'Кінетична енергія обертання',
            nameEn: 'Rotational Kinetic Energy',
            latex: 'E_k = \\frac{1}{2} I \\omega^2',
            description: 'Кінетична енергія тіла, що обертається, залежить від моменту інерції та кутової швидкості.',
            descriptionEn: 'Rotational kinetic energy depends on the moment of inertia and angular velocity.',
            variables: [
              { symbol: 'E_k', name: 'Кінетична енергія', nameEn: 'Kinetic energy', unit: 'Дж', type: 'result' },
              { symbol: 'I', name: 'Момент інерції', nameEn: 'Moment of inertia', unit: 'кг·м²', type: 'input' },
              { symbol: 'ω', name: 'Кутова швидкість', nameEn: 'Angular velocity', unit: 'рад/с', type: 'input' }
            ],
            compute: (v) => 0.5 * v.I * v['ω'] * v['ω'],
            resultVar: 'E_k', derivedFormulas: ['phys_torque'],
            topic: 'Обертальний рух', subtopic: 'Основи обертання'
          }
        ]
      }]
    }
  ]
};

// Helper: get flat array of all formulas
export function getAllFormulas(): Formula[] {
  const formulas: Formula[] = [];
  for (const topic of physicsData.topics) {
    for (const subtopic of topic.subtopics) {
      for (const formula of subtopic.formulas) {
        formulas.push({ ...formula, subject: 'physics' });
      }
    }
  }
  return formulas;
}

// Helper: find formula by ID
export function getFormulaById(id: string): Formula | undefined {
  return getAllFormulas().find(f => f.id === id);
}
