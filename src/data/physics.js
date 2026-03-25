/* ============================================
   Physics Formula Data
   Organized by topic → subtopics → formulas
   ============================================ */

export const physicsData = {
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
    }
  ]
};

// Helper: get flat array of all formulas
export function getAllFormulas() {
  const formulas = [];
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
export function getFormulaById(id) {
  return getAllFormulas().find(f => f.id === id);
}
