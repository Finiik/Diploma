/* ============================================
   Chemistry Formula Data
   ============================================ */

import type { SubjectData, Formula } from '@/types/domain';

export const chemistryData: SubjectData = {
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
    },
    {
      id: 'chemical_reactions',
      name: 'Хімічні реакції',
      nameEn: 'Chemical Reactions',
      subtopics: [
        {
          id: 'kinetics',
          name: 'Хімічна кінетика',
          nameEn: 'Chemical Kinetics',
          formulas: [
            {
              id: 'chem_reaction_rate',
              name: 'Швидкість хімічної реакції',
              nameEn: 'Reaction Rate',
              latex: 'v = \\frac{\\Delta C}{\\Delta t}',
              description: 'Швидкість реакції визначається як зміна концентрації реагенту або продукту за одиницю часу.',
              descriptionEn: 'Reaction rate is defined as the change in concentration of reactant or product per unit time.',
              variables: [
                { symbol: 'v', name: 'Швидкість реакції', nameEn: 'Reaction rate', unit: 'моль/(л·с)', type: 'result' },
                { symbol: 'ΔC', name: 'Зміна концентрації', nameEn: 'Concentration change', unit: 'моль/л (mol/L)', type: 'input' },
                { symbol: 'Δt', name: 'Проміжок часу', nameEn: 'Time interval', unit: 'с (s)', type: 'input' }
              ],
              compute: (values) => values['ΔC'] / values['Δt'],
              resultVar: 'v',
              derivedFormulas: ['chem_equilibrium'],
              topic: 'Хімічні реакції',
              subtopic: 'Хімічна кінетика'
            },
            {
              id: 'chem_arrhenius',
              name: 'Правило Вант-Гоффа',
              nameEn: "Van 't Hoff Rule",
              latex: 'v_{t_2} = v_{t_1} \\cdot \\gamma^{\\frac{t_2 - t_1}{10}}',
              description: 'При підвищенні температури на кожні 10°C швидкість реакції зростає у γ разів (γ = 2-4).',
              descriptionEn: 'For every 10°C temperature increase, reaction rate increases by a factor of γ (γ = 2-4).',
              variables: [
                { symbol: 'v₂', name: 'Нова швидкість', nameEn: 'New rate', unit: 'моль/(л·с)', type: 'result' },
                { symbol: 'v₁', name: 'Початкова швидкість', nameEn: 'Initial rate', unit: 'моль/(л·с)', type: 'input' },
                { symbol: 'γ', name: 'Коефіцієнт Вант-Гоффа', nameEn: "Van 't Hoff coefficient", unit: '', type: 'input', defaultValue: 2 },
                { symbol: 't₁', name: 'Початкова температура', nameEn: 'Initial temperature', unit: '°C', type: 'input' },
                { symbol: 't₂', name: 'Кінцева температура', nameEn: 'Final temperature', unit: '°C', type: 'input' }
              ],
              compute: (values) => values['v₁'] * Math.pow(values['γ'], (values['t₂'] - values['t₁']) / 10),
              resultVar: 'v₂',
              derivedFormulas: ['chem_reaction_rate'],
              topic: 'Хімічні реакції',
              subtopic: 'Хімічна кінетика'
            }
          ]
        },
        {
          id: 'equilibrium',
          name: 'Хімічна рівновага',
          nameEn: 'Chemical Equilibrium',
          formulas: [
            {
              id: 'chem_equilibrium',
              name: 'Константа рівноваги',
              nameEn: 'Equilibrium Constant',
              latex: 'K_c = \\frac{[C]^c \\cdot [D]^d}{[A]^a \\cdot [B]^b}',
              description: 'Константа рівноваги — відношення добутку концентрацій продуктів до добутку концентрацій реагентів у степенях їхніх стехіометричних коефіцієнтів.',
              descriptionEn: 'The equilibrium constant is the ratio of products of product concentrations to reactant concentrations raised to their stoichiometric coefficients.',
              variables: [
                { symbol: 'K_c', name: 'Константа рівноваги', nameEn: 'Equilibrium constant', unit: '', type: 'result' },
                { symbol: '[C]', name: 'Концентрація продукту C', nameEn: 'Product C concentration', unit: 'моль/л', type: 'input' },
                { symbol: '[D]', name: 'Концентрація продукту D', nameEn: 'Product D concentration', unit: 'моль/л', type: 'input' },
                { symbol: '[A]', name: 'Концентрація реагенту A', nameEn: 'Reactant A concentration', unit: 'моль/л', type: 'input' },
                { symbol: '[B]', name: 'Концентрація реагенту B', nameEn: 'Reactant B concentration', unit: 'моль/л', type: 'input' }
              ],
              compute: (values) => (values['[C]'] * values['[D]']) / (values['[A]'] * values['[B]']),
              resultVar: 'K_c',
              derivedFormulas: ['chem_reaction_rate'],
              topic: 'Хімічні реакції',
              subtopic: 'Хімічна рівновага'
            }
          ]
        }
      ]
    },
    {
      id: 'electrochemistry',
      name: 'Електрохімія',
      nameEn: 'Electrochemistry',
      subtopics: [
        {
          id: 'electrolysis',
          name: 'Електроліз',
          nameEn: 'Electrolysis',
          formulas: [
            {
              id: 'chem_faraday',
              name: 'Перший закон Фарадея',
              nameEn: "Faraday's First Law",
              latex: 'm = \\frac{M \\cdot I \\cdot t}{n \\cdot F}',
              description: 'Маса речовини, виділеної при електролізі, пропорційна силі струму та часу. F = 96485 Кл/моль — стала Фарадея.',
              descriptionEn: 'Mass deposited during electrolysis is proportional to current and time. F = 96485 C/mol — Faraday constant.',
              variables: [
                { symbol: 'm', name: 'Маса речовини', nameEn: 'Mass deposited', unit: 'г (g)', type: 'result' },
                { symbol: 'M', name: 'Молярна маса', nameEn: 'Molar mass', unit: 'г/моль', type: 'input' },
                { symbol: 'I', name: 'Сила струму', nameEn: 'Current', unit: 'А (A)', type: 'input' },
                { symbol: 't', name: 'Час', nameEn: 'Time', unit: 'с (s)', type: 'input' },
                { symbol: 'n', name: 'Кількість електронів', nameEn: 'Number of electrons', unit: '', type: 'input' },
                { symbol: 'F', name: 'Стала Фарадея', nameEn: 'Faraday constant', unit: 'Кл/моль', type: 'input', defaultValue: 96485 }
              ],
              compute: (v) => (v.M * v.I * v.t) / (v.n * v.F),
              resultVar: 'm',
              derivedFormulas: ['chem_molarity'],
              topic: 'Електрохімія', subtopic: 'Електроліз'
            },
            {
              id: 'chem_nernst',
              name: 'Рівняння Нернста',
              nameEn: 'Nernst Equation',
              latex: 'E = E^0 - \\frac{RT}{nF}\\ln Q',
              description: 'Рівняння Нернста описує залежність електродного потенціалу від концентрації іонів у розчині.',
              descriptionEn: 'The Nernst equation describes the dependence of electrode potential on ion concentration.',
              variables: [
                { symbol: 'E', name: 'Потенціал', nameEn: 'Cell potential', unit: 'В (V)', type: 'result' },
                { symbol: 'E⁰', name: 'Стандартний потенціал', nameEn: 'Standard potential', unit: 'В (V)', type: 'input' },
                { symbol: 'R', name: 'Газова стала', nameEn: 'Gas constant', unit: 'Дж/(моль·К)', type: 'input', defaultValue: 8.314 },
                { symbol: 'T', name: 'Температура', nameEn: 'Temperature', unit: 'К (K)', type: 'input', defaultValue: 298 },
                { symbol: 'n', name: 'Кількість електронів', nameEn: 'Electrons transferred', unit: '', type: 'input' },
                { symbol: 'F', name: 'Стала Фарадея', nameEn: 'Faraday constant', unit: 'Кл/моль', type: 'input', defaultValue: 96485 },
                { symbol: 'Q', name: 'Реакційна частка', nameEn: 'Reaction quotient', unit: '', type: 'input' }
              ],
              compute: (v) => v['E⁰'] - (v.R * v.T / (v.n * v.F)) * Math.log(v.Q),
              resultVar: 'E',
              derivedFormulas: ['chem_faraday'],
              topic: 'Електрохімія', subtopic: 'Електроліз'
            }
          ]
        }
      ]
    },
    {
      id: 'thermochemistry',
      name: 'Термохімія',
      nameEn: 'Thermochemistry',
      subtopics: [
        {
          id: 'enthalpy',
          name: 'Ентальпія',
          nameEn: 'Enthalpy',
          formulas: [
            {
              id: 'chem_enthalpy',
              name: 'Зміна ентальпії реакції',
              nameEn: 'Reaction Enthalpy Change',
              latex: '\\Delta H = \\sum H_{\\text{прод}} - \\sum H_{\\text{реаг}}',
              description: 'Зміна ентальпії реакції — різниця між сумами ентальпій утворення продуктів і реагентів.',
              descriptionEn: 'Enthalpy change equals the difference between formation enthalpies of products and reactants.',
              variables: [
                { symbol: 'ΔH', name: 'Зміна ентальпії', nameEn: 'Enthalpy change', unit: 'кДж/моль', type: 'result' },
                { symbol: 'H_прод', name: 'Σ ентальпій продуктів', nameEn: 'Products enthalpy sum', unit: 'кДж/моль', type: 'input' },
                { symbol: 'H_реаг', name: 'Σ ентальпій реагентів', nameEn: 'Reactants enthalpy sum', unit: 'кДж/моль', type: 'input' }
              ],
              compute: (v) => v['H_прод'] - v['H_реаг'],
              resultVar: 'ΔH',
              derivedFormulas: ['chem_combustion_heat'],
              topic: 'Термохімія', subtopic: 'Ентальпія'
            },
            {
              id: 'chem_combustion_heat',
              name: 'Теплота згоряння',
              nameEn: 'Heat of Combustion',
              latex: 'Q = q \\cdot m',
              description: 'Кількість теплоти, що виділяється при повному згорянні речовини, пропорційна масі та питомій теплоті згоряння.',
              descriptionEn: 'Heat released during complete combustion is proportional to mass and specific heat of combustion.',
              variables: [
                { symbol: 'Q', name: 'Виділена теплота', nameEn: 'Heat released', unit: 'кДж', type: 'result' },
                { symbol: 'q', name: 'Питома теплота згоряння', nameEn: 'Specific heat of combustion', unit: 'кДж/кг', type: 'input' },
                { symbol: 'm', name: 'Маса речовини', nameEn: 'Mass', unit: 'кг (kg)', type: 'input' }
              ],
              compute: (v) => v.q * v.m,
              resultVar: 'Q',
              derivedFormulas: ['chem_enthalpy'],
              topic: 'Термохімія', subtopic: 'Ентальпія'
            },
            {
              id: 'chem_molar_mass',
              name: 'Кількість речовини',
              nameEn: 'Amount of Substance',
              latex: 'n = \\frac{m}{M}',
              description: 'Кількість речовини (в молях) дорівнює відношенню маси речовини до її молярної маси.',
              descriptionEn: 'Amount of substance (in moles) equals mass divided by molar mass.',
              variables: [
                { symbol: 'n', name: 'Кількість речовини', nameEn: 'Amount of substance', unit: 'моль (mol)', type: 'result' },
                { symbol: 'm', name: 'Маса', nameEn: 'Mass', unit: 'г (g)', type: 'input' },
                { symbol: 'M', name: 'Молярна маса', nameEn: 'Molar mass', unit: 'г/моль (g/mol)', type: 'input' }
              ],
              compute: (v) => v.m / v.M,
              resultVar: 'n',
              derivedFormulas: ['chem_molarity', 'chem_ideal_gas'],
              topic: 'Термохімія', subtopic: 'Ентальпія'
            }
          ]
        }
      ]
    },
    {
      id: 'gas_laws',
      name: 'Газові закони',
      nameEn: 'Gas Laws',
      subtopics: [{
        id: 'gas_mixtures',
        name: 'Суміші газів',
        nameEn: 'Gas Mixtures',
        formulas: [
          {
            id: 'chem_dalton',
            name: 'Закон Дальтона',
            nameEn: "Dalton's Law of Partial Pressures",
            latex: 'P_{\\text{заг}} = P_1 + P_2 + ... + P_n',
            description: 'Загальний тиск суміші газів дорівнює сумі парціальних тисків кожного газу.',
            descriptionEn: 'Total pressure of a gas mixture equals the sum of partial pressures of each gas.',
            variables: [
              { symbol: 'P_заг', name: 'Загальний тиск', nameEn: 'Total pressure', unit: 'атм', type: 'result' },
              { symbol: 'P₁', name: 'Парціальний тиск 1', nameEn: 'Partial pressure 1', unit: 'атм', type: 'input' },
              { symbol: 'P₂', name: 'Парціальний тиск 2', nameEn: 'Partial pressure 2', unit: 'атм', type: 'input' },
              { symbol: 'P₃', name: 'Парціальний тиск 3', nameEn: 'Partial pressure 3', unit: 'атм', type: 'input', defaultValue: 0 }
            ],
            compute: (v) => v['P₁'] + v['P₂'] + v['P₃'],
            resultVar: 'P_заг', derivedFormulas: ['chem_ideal_gas', 'chem_graham'],
            topic: 'Газові закони', subtopic: 'Суміші газів'
          },
          {
            id: 'chem_graham',
            name: 'Закон Грехема (ефузія)',
            nameEn: "Graham's Law of Effusion",
            latex: '\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}}',
            description: 'Швидкість ефузії газу обернено пропорційна кореню з його молярної маси.',
            descriptionEn: 'The rate of effusion is inversely proportional to the square root of molar mass.',
            variables: [
              { symbol: 'r₁/r₂', name: 'Відношення швидкостей', nameEn: 'Rate ratio', unit: '', type: 'result' },
              { symbol: 'M₁', name: 'Молярна маса газу 1', nameEn: 'Molar mass gas 1', unit: 'г/моль', type: 'input' },
              { symbol: 'M₂', name: 'Молярна маса газу 2', nameEn: 'Molar mass gas 2', unit: 'г/моль', type: 'input' }
            ],
            compute: (v) => Math.sqrt(v['M₂'] / v['M₁']),
            resultVar: 'r₁/r₂', derivedFormulas: ['chem_dalton', 'chem_ideal_gas'],
            topic: 'Газові закони', subtopic: 'Суміші газів'
          }
        ]
      }]
    },
    {
      id: 'organic',
      name: 'Органічна хімія',
      nameEn: 'Organic Chemistry',
      subtopics: [{
        id: 'organic_basics',
        name: 'Основи органіки',
        nameEn: 'Organic Basics',
        formulas: [
          {
            id: 'chem_unsaturation',
            name: 'Ступінь ненасиченості',
            nameEn: 'Degree of Unsaturation',
            latex: 'DBE = \\frac{2C + 2 + N - H - X}{2}',
            description: 'Ступінь ненасиченості (DBE) показує кількість подвійних зв\'язків та циклів. C, H, N, X — кількість атомів вуглецю, водню, азоту, галогенів.',
            descriptionEn: 'Degree of unsaturation (DBE) shows the number of double bonds and rings. C, H, N, X — carbon, hydrogen, nitrogen, halogen atom counts.',
            variables: [
              { symbol: 'DBE', name: 'Ступінь ненасиченості', nameEn: 'Degree of unsaturation', unit: '', type: 'result' },
              { symbol: 'C', name: 'Кількість C', nameEn: 'Carbon count', unit: '', type: 'input' },
              { symbol: 'H', name: 'Кількість H', nameEn: 'Hydrogen count', unit: '', type: 'input' },
              { symbol: 'N', name: 'Кількість N', nameEn: 'Nitrogen count', unit: '', type: 'input', defaultValue: 0 },
              { symbol: 'X', name: 'Кількість галогенів', nameEn: 'Halogen count', unit: '', type: 'input', defaultValue: 0 }
            ],
            compute: (v) => (2 * v.C + 2 + v.N - v.H - v.X) / 2,
            resultVar: 'DBE', derivedFormulas: ['chem_molar_mass'],
            topic: 'Органічна хімія', subtopic: 'Основи органіки'
          },
          {
            id: 'chem_mass_percent',
            name: 'Масова частка елемента',
            nameEn: 'Mass Percent of Element',
            latex: 'w = \\frac{n \\cdot A_r}{M_r} \\cdot 100\\%',
            description: 'Масова частка елемента в сполуці: відношення маси атомів елемента до молярної маси сполуки.',
            descriptionEn: 'Mass percent of an element: ratio of atomic mass contribution to molar mass of compound.',
            variables: [
              { symbol: 'w', name: 'Масова частка', nameEn: 'Mass percent', unit: '%', type: 'result' },
              { symbol: 'n', name: 'Кількість атомів', nameEn: 'Number of atoms', unit: '', type: 'input' },
              { symbol: 'Aᵣ', name: 'Атомна маса елемента', nameEn: 'Atomic mass', unit: 'г/моль', type: 'input' },
              { symbol: 'Mᵣ', name: 'Молярна маса сполуки', nameEn: 'Compound molar mass', unit: 'г/моль', type: 'input' }
            ],
            compute: (v) => (v.n * v['Aᵣ'] / v['Mᵣ']) * 100,
            resultVar: 'w', derivedFormulas: ['chem_molar_mass', 'chem_mass_fraction'],
            topic: 'Органічна хімія', subtopic: 'Основи органіки'
          },
          {
            id: 'chem_yield',
            name: 'Вихід продукту реакції',
            nameEn: 'Reaction Yield',
            latex: '\\eta = \\frac{m_{\\text{практ}}}{m_{\\text{теор}}} \\cdot 100\\%',
            description: 'Відношення реально отриманої маси продукту до теоретично можливої.',
            descriptionEn: 'Ratio of actual product mass to theoretically possible mass.',
            variables: [
              { symbol: 'η', name: 'Вихід реакції', nameEn: 'Reaction yield', unit: '%', type: 'result' },
              { symbol: 'm_практ', name: 'Практична маса', nameEn: 'Actual mass', unit: 'г', type: 'input' },
              { symbol: 'm_теор', name: 'Теоретична маса', nameEn: 'Theoretical mass', unit: 'г', type: 'input' }
            ],
            compute: (v) => (v['m_практ'] / v['m_теор']) * 100,
            resultVar: 'η', derivedFormulas: ['chem_molar_mass'],
            topic: 'Органічна хімія', subtopic: 'Основи органіки'
          }
        ]
      }]
    },
    {
      id: 'colligative',
      name: 'Колігативні властивості',
      nameEn: 'Colligative Properties',
      subtopics: [{
        id: 'solution_props',
        name: 'Властивості розчинів',
        nameEn: 'Solution Properties',
        formulas: [
          {
            id: 'chem_osmotic_pressure',
            name: 'Осмотичний тиск',
            nameEn: 'Osmotic Pressure',
            latex: '\\Pi = i \\cdot C \\cdot R \\cdot T',
            description: "Осмотичний тиск розчину пропорційний молярній концентрації, температурі та фактору Вант-Гоффа.",
            descriptionEn: "Osmotic pressure is proportional to molar concentration, temperature, and van't Hoff factor.",
            variables: [
              { symbol: 'Π', name: 'Осмотичний тиск', nameEn: 'Osmotic pressure', unit: 'атм', type: 'result' },
              { symbol: 'i', name: "Фактор Вант-Гоффа", nameEn: "Van't Hoff factor", unit: '', type: 'input', defaultValue: 1 },
              { symbol: 'C', name: 'Молярна концентрація', nameEn: 'Molar concentration', unit: 'моль/л', type: 'input' },
              { symbol: 'R', name: 'Газова стала', nameEn: 'Gas constant', unit: 'л·атм/(моль·К)', type: 'input', defaultValue: 0.0821 },
              { symbol: 'T', name: 'Температура', nameEn: 'Temperature', unit: 'К', type: 'input', defaultValue: 298 }
            ],
            compute: (v) => v.i * v.C * v.R * v.T,
            resultVar: 'Π', derivedFormulas: ['chem_boiling_elevation'],
            topic: 'Колігативні властивості', subtopic: 'Властивості розчинів'
          },
          {
            id: 'chem_boiling_elevation',
            name: 'Підвищення температури кипіння',
            nameEn: 'Boiling Point Elevation',
            latex: '\\Delta T_b = i \\cdot K_b \\cdot m',
            description: 'Додавання розчиненої речовини підвищує температуру кипіння розчинника.',
            descriptionEn: 'Adding solute raises the boiling point of the solvent.',
            variables: [
              { symbol: 'ΔT_b', name: 'Підвищення Т кипіння', nameEn: 'Boiling point elevation', unit: '°C', type: 'result' },
              { symbol: 'i', name: "Фактор Вант-Гоффа", nameEn: "Van't Hoff factor", unit: '', type: 'input', defaultValue: 1 },
              { symbol: 'K_b', name: 'Ебуліоскопічна стала', nameEn: 'Ebullioscopic constant', unit: '°C·кг/моль', type: 'input', defaultValue: 0.512 },
              { symbol: 'm', name: 'Моляльність', nameEn: 'Molality', unit: 'моль/кг', type: 'input' }
            ],
            compute: (v) => v.i * v.K_b * v.m,
            resultVar: 'ΔT_b', derivedFormulas: ['chem_freezing_depression'],
            topic: 'Колігативні властивості', subtopic: 'Властивості розчинів'
          },
          {
            id: 'chem_freezing_depression',
            name: 'Зниження температури замерзання',
            nameEn: 'Freezing Point Depression',
            latex: '\\Delta T_f = i \\cdot K_f \\cdot m',
            description: 'Додавання розчиненої речовини знижує температуру замерзання розчинника.',
            descriptionEn: 'Adding solute lowers the freezing point of the solvent.',
            variables: [
              { symbol: 'ΔT_f', name: 'Зниження Т замерзання', nameEn: 'Freezing point depression', unit: '°C', type: 'result' },
              { symbol: 'i', name: "Фактор Вант-Гоффа", nameEn: "Van't Hoff factor", unit: '', type: 'input', defaultValue: 1 },
              { symbol: 'K_f', name: 'Кріоскопічна стала', nameEn: 'Cryoscopic constant', unit: '°C·кг/моль', type: 'input', defaultValue: 1.86 },
              { symbol: 'm', name: 'Моляльність', nameEn: 'Molality', unit: 'моль/кг', type: 'input' }
            ],
            compute: (v) => v.i * v.K_f * v.m,
            resultVar: 'ΔT_f', derivedFormulas: ['chem_boiling_elevation'],
            topic: 'Колігативні властивості', subtopic: 'Властивості розчинів'
          }
        ]
      }]
    },
    {
      id: 'analytical',
      name: 'Аналітична хімія',
      nameEn: 'Analytical Chemistry',
      subtopics: [{
        id: 'quantitative',
        name: 'Кількісний аналіз',
        nameEn: 'Quantitative Analysis',
        formulas: [
          {
            id: 'chem_henderson',
            name: 'Рівняння Гендерсона-Гассельбаха',
            nameEn: 'Henderson-Hasselbalch Equation',
            latex: 'pH = pK_a + \\log\\frac{[A^-]}{[HA]}',
            description: 'Розраховує pH буферного розчину, знаючи pKa кислоти та співвідношення солі до кислоти.',
            descriptionEn: 'Calculates pH of a buffer solution knowing the pKa and the ratio of conjugate base to acid.',
            variables: [
              { symbol: 'pH', name: 'Водневий показник', nameEn: 'pH value', unit: '', type: 'result' },
              { symbol: 'pK_a', name: 'pKa кислоти', nameEn: 'pKa of acid', unit: '', type: 'input' },
              { symbol: '[A⁻]', name: 'Концентрація основи', nameEn: 'Base concentration', unit: 'моль/л', type: 'input' },
              { symbol: '[HA]', name: 'Концентрація кислоти', nameEn: 'Acid concentration', unit: 'моль/л', type: 'input' }
            ],
            compute: (v) => v.pK_a + Math.log10(v['[A⁻]'] / v['[HA]']),
            resultVar: 'pH', derivedFormulas: ['chem_ph'],
            topic: 'Аналітична хімія', subtopic: 'Кількісний аналіз'
          },
          {
            id: 'chem_percent_composition',
            name: 'Відсотковий склад елемента',
            nameEn: 'Percent Composition',
            latex: '\\%_{element} = \\frac{n \\cdot A_r}{M_r} \\times 100\\%',
            description: 'Масова частка елемента у сполуці: відношення маси атомів елемента до молярної маси сполуки.',
            descriptionEn: 'Mass fraction of an element: ratio of atomic mass of element to molar mass of compound.',
            variables: [
              { symbol: '%', name: 'Відсотковий склад', nameEn: 'Percent composition', unit: '%', type: 'result' },
              { symbol: 'n', name: 'Кількість атомів', nameEn: 'Number of atoms', unit: '', type: 'input' },
              { symbol: 'A_r', name: 'Атомна маса', nameEn: 'Atomic mass', unit: 'г/моль', type: 'input' },
              { symbol: 'M_r', name: 'Молярна маса сполуки', nameEn: 'Molar mass of compound', unit: 'г/моль', type: 'input' }
            ],
            compute: (v) => (v.n * v.A_r / v.M_r) * 100,
            resultVar: '%', derivedFormulas: ['chem_molar_mass'],
            topic: 'Аналітична хімія', subtopic: 'Кількісний аналіз'
          },
          {
            id: 'chem_titration',
            name: 'Титрування',
            nameEn: 'Titration',
            latex: 'C_1 V_1 = C_2 V_2',
            description: 'У точці еквівалентності кількість молів кислоти дорівнює кількості молів основи.',
            descriptionEn: 'At the equivalence point, moles of acid equal moles of base.',
            variables: [
              { symbol: 'C₁', name: 'Концентрація 1', nameEn: 'Concentration 1', unit: 'моль/л', type: 'input' },
              { symbol: 'V₁', name: "Об'єм 1", nameEn: 'Volume 1', unit: 'мл', type: 'input' },
              { symbol: 'C₂', name: 'Концентрація 2', nameEn: 'Concentration 2', unit: 'моль/л', type: 'input' },
              { symbol: 'V₂', name: "Об'єм 2", nameEn: 'Volume 2', unit: 'мл', type: 'result' }
            ],
            compute: (v) => (v['C₁'] * v['V₁']) / v['C₂'],
            resultVar: 'V₂', derivedFormulas: ['chem_ph', 'chem_henderson'],
            topic: 'Аналітична хімія', subtopic: 'Кількісний аналіз'
          },
          {
            id: 'chem_solubility_product',
            name: 'Добуток розчинності',
            nameEn: 'Solubility Product',
            latex: 'K_{sp} = [A^+]^m \\cdot [B^-]^n',
            description: 'Константа добутку розчинності — добуток концентрацій іонів малорозчинної солі.',
            descriptionEn: 'Solubility product constant is the product of ion concentrations of a sparingly soluble salt.',
            variables: [
              { symbol: 'K_sp', name: 'Добуток розчинності', nameEn: 'Solubility product', unit: '', type: 'result' },
              { symbol: '[A⁺]', name: 'Концентрація катіона', nameEn: 'Cation concentration', unit: 'моль/л', type: 'input' },
              { symbol: 'm', name: 'Коефіцієнт катіона', nameEn: 'Cation coefficient', unit: '', type: 'input', defaultValue: 1 },
              { symbol: '[B⁻]', name: 'Концентрація аніона', nameEn: 'Anion concentration', unit: 'моль/л', type: 'input' },
              { symbol: 'n', name: 'Коефіцієнт аніона', nameEn: 'Anion coefficient', unit: '', type: 'input', defaultValue: 1 }
            ],
            compute: (v) => Math.pow(v['[A⁺]'], v.m) * Math.pow(v['[B⁻]'], v.n),
            resultVar: 'K_sp', derivedFormulas: ['chem_equilibrium'],
            topic: 'Аналітична хімія', subtopic: 'Кількісний аналіз'
          }
        ]
      }]
    }
  ]
};

export function getAllFormulas(): Formula[] {
  const formulas: Formula[] = [];
  for (const topic of chemistryData.topics) {
    for (const subtopic of topic.subtopics) {
      for (const formula of subtopic.formulas) {
        formulas.push({ ...formula, subject: 'chemistry' });
      }
    }
  }
  return formulas;
}

export function getFormulaById(id: string): Formula | undefined {
  return getAllFormulas().find(f => f.id === id);
}
