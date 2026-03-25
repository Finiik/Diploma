/* ============================================
   Chemistry Formula Data
   ============================================ */

export const chemistryData = {
  id: 'chemistry',
  name: 'Хімія',
  nameEn: 'Chemistry',
  icon: '🧪',
  color: 'chemistry',
  topics: [
    {
      id: 'general_chemistry',
      name: 'Загальна хімія',
      nameEn: 'General Chemistry',
      subtopics: [
        {
          id: 'solutions',
          name: 'Розчини',
          nameEn: 'Solutions',
          formulas: [
            {
              id: 'chem_molarity',
              name: 'Молярна концентрація',
              nameEn: 'Molarity',
              latex: 'C_M = \\frac{n}{V}',
              description: 'Молярна концентрація — кількість молів розчиненої речовини в одному літрі розчину.',
              descriptionEn: 'Molarity is the number of moles of solute per liter of solution.',
              variables: [
                { symbol: 'C_M', name: 'Молярна концентрація', nameEn: 'Molarity', unit: 'моль/л (mol/L)', type: 'result' },
                { symbol: 'n', name: 'Кількість речовини', nameEn: 'Amount of substance', unit: 'моль (mol)', type: 'input' },
                { symbol: 'V', name: 'Об\'єм розчину', nameEn: 'Volume of solution', unit: 'л (L)', type: 'input' }
              ],
              compute: (values) => values.n / values.V,
              resultVar: 'C_M',
              derivedFormulas: ['chem_dilution', 'chem_mass_fraction'],
              topic: 'Загальна хімія',
              subtopic: 'Розчини'
            },
            {
              id: 'chem_dilution',
              name: 'Закон розбавлення',
              nameEn: 'Dilution Law',
              latex: 'C_1 \\cdot V_1 = C_2 \\cdot V_2',
              description: 'При розбавленні розчину добуток концентрації на об\'єм залишається незмінним.',
              descriptionEn: 'When diluting a solution, the product of concentration and volume remains constant.',
              variables: [
                { symbol: 'C_2', name: 'Кінцева концентрація', nameEn: 'Final concentration', unit: 'моль/л (mol/L)', type: 'result' },
                { symbol: 'C_1', name: 'Початкова концентрація', nameEn: 'Initial concentration', unit: 'моль/л (mol/L)', type: 'input' },
                { symbol: 'V_1', name: 'Початковий об\'єм', nameEn: 'Initial volume', unit: 'л (L)', type: 'input' },
                { symbol: 'V_2', name: 'Кінцевий об\'єм', nameEn: 'Final volume', unit: 'л (L)', type: 'input' }
              ],
              compute: (values) => (values.C_1 * values.V_1) / values.V_2,
              resultVar: 'C_2',
              derivedFormulas: ['chem_molarity'],
              topic: 'Загальна хімія',
              subtopic: 'Розчини'
            },
            {
              id: 'chem_mass_fraction',
              name: 'Масова частка',
              nameEn: 'Mass Fraction',
              latex: 'w = \\frac{m_{\\text{речовини}}}{m_{\\text{розчину}}} \\times 100\\%',
              description: 'Масова частка — відношення маси розчиненої речовини до загальної маси розчину, виражене у відсотках.',
              descriptionEn: 'Mass fraction is the ratio of the mass of solute to the total mass of the solution, expressed as a percentage.',
              variables: [
                { symbol: 'w', name: 'Масова частка', nameEn: 'Mass fraction', unit: '%', type: 'result' },
                { symbol: 'm_s', name: 'Маса речовини', nameEn: 'Mass of solute', unit: 'г (g)', type: 'input' },
                { symbol: 'm_r', name: 'Маса розчину', nameEn: 'Mass of solution', unit: 'г (g)', type: 'input' }
              ],
              compute: (values) => (values.m_s / values.m_r) * 100,
              resultVar: 'w',
              derivedFormulas: ['chem_molarity'],
              topic: 'Загальна хімія',
              subtopic: 'Розчини'
            }
          ]
        },
        {
          id: 'gases',
          name: 'Гази',
          nameEn: 'Gases',
          formulas: [
            {
              id: 'chem_ideal_gas',
              name: 'Рівняння ідеального газу',
              nameEn: 'Ideal Gas Law',
              latex: 'PV = nRT',
              description: 'Рівняння стану ідеального газу зв\'язує тиск, об\'єм, кількість речовини та температуру. R = 8.314 Дж/(моль·К).',
              descriptionEn: 'The ideal gas law relates pressure, volume, amount of substance, and temperature. R = 8.314 J/(mol·K).',
              variables: [
                { symbol: 'P', name: 'Тиск', nameEn: 'Pressure', unit: 'Па (Pa)', type: 'result' },
                { symbol: 'n', name: 'Кількість речовини', nameEn: 'Amount of substance', unit: 'моль (mol)', type: 'input' },
                { symbol: 'R', name: 'Газова стала', nameEn: 'Gas constant', unit: 'Дж/(моль·К)', type: 'input', defaultValue: 8.314 },
                { symbol: 'T', name: 'Температура', nameEn: 'Temperature', unit: 'К (K)', type: 'input' },
                { symbol: 'V', name: 'Об\'єм', nameEn: 'Volume', unit: 'м³ (m³)', type: 'input' }
              ],
              compute: (values) => (values.n * values.R * values.T) / values.V,
              resultVar: 'P',
              derivedFormulas: ['chem_molarity'],
              topic: 'Загальна хімія',
              subtopic: 'Гази'
            },
            {
              id: 'chem_ph',
              name: 'Водневий показник (pH)',
              nameEn: 'pH Value',
              latex: 'pH = -\\log[H^+]',
              description: 'pH — міра кислотності розчину. Визначається як від\'ємний десятковий логарифм концентрації іонів водню.',
              descriptionEn: 'pH is a measure of solution acidity. Defined as the negative base-10 logarithm of hydrogen ion concentration.',
              variables: [
                { symbol: 'pH', name: 'Водневий показник', nameEn: 'pH value', unit: '', type: 'result' },
                { symbol: 'H', name: 'Концентрація H⁺', nameEn: 'H⁺ concentration', unit: 'моль/л (mol/L)', type: 'input' }
              ],
              compute: (values) => -Math.log10(values.H),
              resultVar: 'pH',
              derivedFormulas: ['chem_molarity'],
              topic: 'Загальна хімія',
              subtopic: 'Гази'
            }
          ]
        }
      ]
    }
  ]
};

export function getAllFormulas() {
  const formulas = [];
  for (const topic of chemistryData.topics) {
    for (const subtopic of topic.subtopics) {
      for (const formula of subtopic.formulas) {
        formulas.push({ ...formula, subject: 'chemistry' });
      }
    }
  }
  return formulas;
}

export function getFormulaById(id) {
  return getAllFormulas().find(f => f.id === id);
}
