/* ============================================
   Theory Data
   ============================================ */

export const theoryData = [
  {
    id: 'theory_newton_laws',
    name: 'Закони Ньютона',
    nameEn: "Newton's Laws of Motion",
    subject: 'physics',
    topic: 'Механіка',
    description: 'Три фундаментальні закони механіки, що описують рух тіл під дією сил.',
    descriptionEn: 'Three fundamental laws of mechanics that describe the motion of objects under the action of forces.',
    content: `**Перший закон Ньютона (закон інерції):** Тіло зберігає стан спокою або рівномірного прямолінійного руху, якщо на нього не діють інші тіла або дія інших тіл скомпенсована.

**Другий закон Ньютона:** Прискорення тіла прямо пропорційне рівнодійній силі, що діє на тіло, та обернено пропорційне його масі: F = ma.

**Третій закон Ньютона:** Тіла діють одне на одне із силами, рівними за модулем і протилежними за напрямком: F₁₂ = -F₂₁.`,
    contentEn: `**Newton's First Law (Law of Inertia):** An object remains at rest or in uniform rectilinear motion unless acted upon by an external force.

**Newton's Second Law:** The acceleration of a body is directly proportional to the net force acting on it and inversely proportional to its mass: F = ma.

**Newton's Third Law:** For every action, there is an equal and opposite reaction: F₁₂ = -F₂₁.`,
    relatedFormulas: ['phys_newton2', 'phys_weight', 'phys_momentum']
  },
  {
    id: 'theory_solutions',
    name: 'Розчини та концентрація',
    nameEn: 'Solutions and Concentration',
    subject: 'chemistry',
    topic: 'Загальна хімія',
    description: 'Основні поняття розчинів: типи розчинів, способи вираження концентрації.',
    descriptionEn: 'Basic concepts of solutions: types of solutions, methods of expressing concentration.',
    content: `**Розчин** — однорідна суміш двох або більше речовин. Складається з розчинника (зазвичай рідина) та розчиненої речовини.

**Способи вираження концентрації:**
- Молярна концентрація (молярність) — кількість молів речовини в 1 л розчину
- Масова частка — відсоток маси розчиненої речовини від загальної маси розчину
- Моляльність — кількість молів речовини на 1 кг розчинника

**Закон розбавлення:** C₁V₁ = C₂V₂ — при розбавленні кількість речовини не змінюється.`,
    contentEn: `**Solution** — a homogeneous mixture of two or more substances. Consists of a solvent (usually liquid) and a solute.

**Methods of expressing concentration:**
- Molarity — number of moles of solute per 1 L of solution
- Mass fraction — percentage of solute mass to total solution mass
- Molality — number of moles of solute per 1 kg of solvent

**Dilution law:** C₁V₁ = C₂V₂ — during dilution, the amount of substance remains unchanged.`,
    relatedFormulas: ['chem_molarity', 'chem_dilution', 'chem_mass_fraction']
  },
  {
    id: 'theory_hardy_weinberg',
    name: 'Закон Харді-Вайнберга',
    nameEn: 'Hardy-Weinberg Principle',
    subject: 'biology',
    topic: 'Генетика та популяції',
    description: 'Принцип генетичної рівноваги в популяціях.',
    descriptionEn: 'The principle of genetic equilibrium in populations.',
    content: `**Закон Харді-Вайнберга** стверджує, що частоти алелів і генотипів у популяції залишаються незмінними з покоління в покоління за відсутності еволюційних факторів.

**Умови рівноваги:**
1. Велика популяція (відсутність генетичного дрейфу)
2. Випадкове схрещування
3. Відсутність мутацій
4. Відсутність міграції
5. Відсутність природного добору

**Рівняння:** p² + 2pq + q² = 1, де p + q = 1.`,
    contentEn: `**The Hardy-Weinberg Law** states that allele and genotype frequencies in a population remain constant from generation to generation in the absence of evolutionary forces.

**Equilibrium conditions:**
1. Large population (no genetic drift)
2. Random mating
3. No mutations
4. No migration
5. No natural selection

**Equation:** p² + 2pq + q² = 1, where p + q = 1.`,
    relatedFormulas: ['bio_hardy_weinberg', 'bio_population_growth']
  }
];

export function getTheoryBySubject(subject) {
  return theoryData.filter(t => t.subject === subject);
}

export function getTheoryById(id) {
  return theoryData.find(t => t.id === id);
}
