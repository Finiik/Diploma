/* ============================================
   Theory Data
   ============================================ */

import type { TheoryItem } from '@/shared/types/domain';

export const theoryData: TheoryItem[] = [
  {
    id: 'theory_newton_laws',
    name: 'Закони Ньютона',
    nameEn: "Newton's Laws of Motion",
    subject: 'physics',
    difficulty: 1,
    topic: 'Механіка',
    description:
      'Три фундаментальні закони механіки, що описують рух тіл під дією сил.',
    descriptionEn:
      'Three fundamental laws of mechanics that describe the motion of objects under the action of forces.',
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
    difficulty: 1,
    topic: 'Загальна хімія',
    description:
      'Основні поняття розчинів: типи розчинів, способи вираження концентрації.',
    descriptionEn:
      'Basic concepts of solutions: types of solutions, methods of expressing concentration.',
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
    difficulty: 2,
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
  },
  {
    id: 'theory_thermodynamics',
    name: 'Закони термодинаміки',
    nameEn: 'Laws of Thermodynamics',
    subject: 'physics',
    difficulty: 2,
    topic: 'Термодинаміка',
    description:
      'Основні закони термодинаміки, що описують теплові процеси та перетворення енергії.',
    descriptionEn:
      'Fundamental laws of thermodynamics describing heat processes and energy transformations.',
    content: `**Нульовий закон:** Якщо два тіла перебувають у тепловій рівновазі з третім, вони перебувають у рівновазі між собою.

**Перший закон (закон збереження енергії):** Кількість теплоти, передана системі, дорівнює сумі зміни внутрішньої енергії та виконаної роботи: Q = ΔU + A.

**Другий закон:** Теплота не може самовільно переходити від холодного тіла до гарячого. Ентропія ізольованої системи не зменшується.

**ККД теплового двигуна** завжди менший за 100%. Максимальний ККД визначається циклом Карно: η = 1 - T₂/T₁.`,
    contentEn: `**Zeroth Law:** If two systems are in thermal equilibrium with a third, they are in equilibrium with each other.

**First Law (Energy Conservation):** Heat transferred to a system equals the sum of internal energy change and work done: Q = ΔU + A.

**Second Law:** Heat cannot spontaneously flow from a colder body to a hotter one. Entropy of an isolated system never decreases.

**Heat engine efficiency** is always less than 100%. Maximum efficiency is defined by the Carnot cycle: η = 1 - T₂/T₁.`,
    relatedFormulas: [
      'phys_heat_energy',
      'phys_thermal_efficiency',
      'phys_carnot'
    ]
  },
  {
    id: 'theory_electricity',
    name: 'Електричне коло та закон Ома',
    nameEn: "Electric Circuits and Ohm's Law",
    subject: 'physics',
    difficulty: 3,
    topic: 'Електрика',
    description: 'Основні поняття електричних кіл: струм, напруга, опір.',
    descriptionEn:
      'Basic concepts of electric circuits: current, voltage, resistance.',
    content: `**Електричний струм** — впорядкований рух заряджених частинок. Сила струму (I) вимірюється в амперах (А).

**Закон Ома для ділянки кола:** I = U/R — сила струму прямо пропорційна напрузі та обернено пропорційна опору.

**З'єднання провідників:**
- **Послідовне:** R_заг = R₁ + R₂ + ... , I = const, U = U₁ + U₂
- **Паралельне:** 1/R_заг = 1/R₁ + 1/R₂ + ... , U = const, I = I₁ + I₂

**Потужність:** P = U·I = I²R = U²/R. Вимірюється у ватах (Вт).`,
    contentEn: `**Electric current** — ordered movement of charged particles. Current (I) is measured in amperes (A).

**Ohm's Law for a circuit section:** I = U/R — current is directly proportional to voltage and inversely proportional to resistance.

**Conductor connections:**
- **Series:** R_total = R₁ + R₂ + ... , I = const, U = U₁ + U₂
- **Parallel:** 1/R_total = 1/R₁ + 1/R₂ + ... , U = const, I = I₁ + I₂

**Power:** P = U·I = I²R = U²/R. Measured in watts (W).`,
    relatedFormulas: ['phys_ohm', 'phys_power_electric']
  },
  {
    id: 'theory_kinetics',
    name: 'Хімічна кінетика',
    nameEn: 'Chemical Kinetics',
    subject: 'chemistry',
    difficulty: 2,
    topic: 'Хімічні реакції',
    description:
      'Вивчення швидкості хімічних реакцій та факторів, що на неї впливають.',
    descriptionEn:
      'Study of the rates of chemical reactions and factors that affect them.',
    content: `**Швидкість хімічної реакції** — зміна концентрації реагенту або продукту за одиницю часу: v = ΔC/Δt.

**Фактори, що впливають на швидкість:**
1. **Природа реагентів** — різні речовини реагують з різною швидкістю
2. **Концентрація** — зі збільшенням концентрації швидкість зростає
3. **Температура** — правило Вант-Гоффа: при підвищенні на 10°C швидкість зростає в 2-4 рази
4. **Каталізатор** — прискорює реакцію, не витрачаючись
5. **Площа поверхні** — для гетерогенних реакцій

**Хімічна рівновага** настає, коли швидкості прямої та зворотної реакцій рівні.`,
    contentEn: `**Reaction rate** — change in concentration of reactant or product per unit time: v = ΔC/Δt.

**Factors affecting rate:**
1. **Nature of reactants** — different substances react at different rates
2. **Concentration** — increasing concentration increases rate
3. **Temperature** — Van 't Hoff rule: for every 10°C increase, rate increases 2-4 times
4. **Catalyst** — speeds up reaction without being consumed
5. **Surface area** — for heterogeneous reactions

**Chemical equilibrium** occurs when forward and reverse reaction rates are equal.`,
    relatedFormulas: [
      'chem_reaction_rate',
      'chem_arrhenius',
      'chem_equilibrium'
    ]
  },
  {
    id: 'theory_ph',
    name: 'Кислотно-основна теорія',
    nameEn: 'Acid-Base Theory',
    subject: 'chemistry',
    difficulty: 2,
    topic: 'Загальна хімія',
    description: 'Поняття кислот, основ та водневого показника pH.',
    descriptionEn: 'Concepts of acids, bases, and the pH scale.',
    content: `**Кислоти** — речовини, що утворюють іони H⁺ у водному розчині (теорія Ареніуса).
**Основи** — речовини, що утворюють іони OH⁻.

**Шкала pH:**
- pH < 7 — кислотне середовище
- pH = 7 — нейтральне середовище
- pH > 7 — лужне середовище

**Обчислення pH:** pH = -log[H⁺]. Наприклад, [H⁺] = 0.001 моль/л → pH = 3.

**Буферні розчини** — розчини, що зберігають pH при додаванні невеликих кількостей кислоти або лугу.`,
    contentEn: `**Acids** — substances that produce H⁺ ions in aqueous solution (Arrhenius theory).
**Bases** — substances that produce OH⁻ ions.

**pH Scale:**
- pH < 7 — acidic environment
- pH = 7 — neutral environment
- pH > 7 — alkaline environment

**Calculating pH:** pH = -log[H⁺]. For example, [H⁺] = 0.001 mol/L → pH = 3.

**Buffer solutions** — solutions that maintain pH when small amounts of acid or base are added.`,
    relatedFormulas: ['chem_ph', 'chem_molarity']
  },
  {
    id: 'theory_ecology',
    name: 'Основи екології',
    nameEn: 'Ecology Fundamentals',
    subject: 'biology',
    difficulty: 1,
    topic: 'Екологія',
    description:
      'Основні екологічні концепції: екосистеми, біорізноманіття, популяційна динаміка.',
    descriptionEn:
      'Key ecological concepts: ecosystems, biodiversity, population dynamics.',
    content: `**Екосистема** — сукупність живих організмів та середовища їх існування, що функціонує як єдина система.

**Біорізноманіття** вимірюється різними індексами:
- **Індекс Шеннона (H')** — враховує кількість видів та рівномірність їх розподілу
- **Індекс Сімпсона (D)** — ймовірність належності двох випадкових особин до різних видів

**Моделі зростання популяції:**
- **Експоненційна** (J-крива): N_t = N₀·e^(rt) — необмежені ресурси
- **Логістична** (S-крива): враховує ємність середовища (K)

**Ємність середовища (K)** — максимальна чисельність популяції, яку може підтримувати екосистема.`,
    contentEn: `**Ecosystem** — a community of living organisms and their environment functioning as a single system.

**Biodiversity** is measured by various indices:
- **Shannon Index (H')** — accounts for species count and evenness of distribution
- **Simpson's Index (D)** — probability that two random individuals belong to different species

**Population growth models:**
- **Exponential** (J-curve): N_t = N₀·e^(rt) — unlimited resources
- **Logistic** (S-curve): accounts for carrying capacity (K)

**Carrying capacity (K)** — maximum population size that an ecosystem can sustain.`,
    relatedFormulas: ['bio_logistic_growth', 'bio_shannon', 'bio_simpson']
  },
  {
    id: 'theory_enzymes',
    name: 'Ферментативна кінетика',
    nameEn: 'Enzyme Kinetics',
    subject: 'biology',
    difficulty: 3,
    topic: 'Біохімія',
    description:
      'Механізми роботи ферментів та кінетика ферментативних реакцій.',
    descriptionEn:
      'Mechanisms of enzyme action and kinetics of enzymatic reactions.',
    content: `**Ферменти** — біологічні каталізатори білкової природи, що прискорюють хімічні реакції в організмі.

**Модель Міхаеліса-Ментен:** v = (V_max · [S]) / (K_m + [S])
- **V_max** — максимальна швидкість при насиченні ферменту субстратом
- **K_m** (стала Міхаеліса) — концентрація субстрату, при якій швидкість = V_max/2

**Фактори, що впливають на активність ферментів:**
1. **Температура** — оптимальна ~37°C для людських ферментів
2. **pH** — кожен фермент має оптимальний pH
3. **Концентрація субстрату** — зростання до насичення
4. **Інгібітори** — конкурентні та неконкурентні`,
    contentEn: `**Enzymes** — biological catalysts of protein nature that accelerate chemical reactions in organisms.

**Michaelis-Menten Model:** v = (V_max · [S]) / (K_m + [S])
- **V_max** — maximum rate when enzyme is saturated with substrate
- **K_m** (Michaelis constant) — substrate concentration at which rate = V_max/2

**Factors affecting enzyme activity:**
1. **Temperature** — optimal ~37°C for human enzymes
2. **pH** — each enzyme has an optimal pH
3. **Substrate concentration** — increases until saturation
4. **Inhibitors** — competitive and non-competitive`,
    relatedFormulas: ['bio_michaelis_menten']
  },
  {
    id: 'theory_optics',
    name: 'Геометрична оптика',
    nameEn: 'Geometric Optics',
    subject: 'physics',
    difficulty: 1,
    topic: 'Оптика',
    description:
      'Закони заломлення та відбивання світла, лінзи та оптичні прилади.',
    descriptionEn:
      'Laws of refraction and reflection of light, lenses and optical instruments.',
    content: `**Закон відбивання:** Кут падіння дорівнює куту відбивання.

**Закон заломлення (Снелліуса):** n₁·sin(θ₁) = n₂·sin(θ₂). При переході з оптично менш щільного середовища в більш щільне промінь наближається до нормалі.

**Повне внутрішнє відбивання** відбувається, коли кут падіння перевищує критичний кут: sin(θ_кр) = n₂/n₁.

**Формула тонкої лінзи:** 1/f = 1/d + 1/d', де f — фокусна відстань, d — відстань до предмета, d' — до зображення.

**Збільшення лінзи:** M = d'/d = H'/H (відношення розмірів зображення до предмета).`,
    contentEn: `**Law of Reflection:** Angle of incidence equals angle of reflection.

**Snell's Law:** n₁·sin(θ₁) = n₂·sin(θ₂). When light passes from a less dense to a denser medium, it bends toward the normal.

**Total Internal Reflection** occurs when incidence angle exceeds the critical angle: sin(θ_c) = n₂/n₁.

**Thin Lens Equation:** 1/f = 1/d + 1/d', where f = focal length, d = object distance, d' = image distance.

**Magnification:** M = d'/d = H'/H (ratio of image size to object size).`,
    relatedFormulas: ['phys_snell', 'phys_thin_lens', 'phys_magnification']
  },
  {
    id: 'theory_waves',
    name: 'Коливання і хвилі',
    nameEn: 'Oscillations and Waves',
    subject: 'physics',
    difficulty: 1,
    topic: 'Коливання і хвилі',
    description: 'Механічні коливання, хвилі та їх властивості.',
    descriptionEn: 'Mechanical oscillations, waves and their properties.',
    content: `**Коливання** — періодичний рух тіла навколо положення рівноваги.

**Характеристики коливань:**
- **Амплітуда (A)** — максимальне відхилення
- **Період (T)** — час одного повного коливання
- **Частота (f = 1/T)** — кількість коливань за секунду
- **Фаза** — стан коливання у даний момент

**Хвиля** — поширення коливань у просторі. v = λ·f.

**Математичний маятник:** T = 2π√(l/g) — період не залежить від маси та амплітуди (при малих кутах).

**Резонанс** виникає, коли частота вимушених коливань збігається з власною частотою системи.`,
    contentEn: `**Oscillation** — periodic motion around an equilibrium position.

**Oscillation characteristics:**
- **Amplitude (A)** — maximum displacement
- **Period (T)** — time for one complete oscillation
- **Frequency (f = 1/T)** — oscillations per second
- **Phase** — state of oscillation at a given moment

**Wave** — propagation of oscillations through space. v = λ·f.

**Simple Pendulum:** T = 2π√(l/g) — period is independent of mass and amplitude (for small angles).

**Resonance** occurs when driving frequency matches the natural frequency of a system.`,
    relatedFormulas: ['phys_wave_speed', 'phys_period_freq', 'phys_pendulum']
  },
  {
    id: 'theory_electrochemistry',
    name: 'Електрохімія',
    nameEn: 'Electrochemistry',
    subject: 'chemistry',
    difficulty: 3,
    topic: 'Електрохімія',
    description: "Зв'язок між хімічними реакціями та електричним струмом.",
    descriptionEn:
      'The relationship between chemical reactions and electric current.',
    content: `**Електроліз** — процес розкладання речовини електричним струмом.

**Закони Фарадея:**
1. Маса речовини, виділеної при електролізі, пропорційна кількості електрики: m = (M·I·t)/(n·F)
2. Маси різних речовин, виділених однаковою кількістю електрики, відносяться як їх еквівалентні маси

**Стала Фарадея:** F = 96485 Кл/моль

**Рівняння Нернста** описує залежність потенціалу електрода від концентрації іонів: E = E⁰ - (RT/nF)·ln(Q)

**Гальванічний елемент** — пристрій, що перетворює хімічну енергію в електричну. ЕРС = E(катод) - E(анод).`,
    contentEn: `**Electrolysis** — decomposition of a substance by electric current.

**Faraday's Laws:**
1. Mass deposited is proportional to charge passed: m = (M·I·t)/(n·F)
2. Masses of different substances deposited by equal charge are proportional to their equivalent masses

**Faraday Constant:** F = 96,485 C/mol

**Nernst Equation** describes electrode potential dependence on ion concentration: E = E⁰ - (RT/nF)·ln(Q)

**Galvanic cell** converts chemical energy to electrical energy. EMF = E(cathode) - E(anode).`,
    relatedFormulas: ['chem_faraday', 'chem_nernst']
  },
  {
    id: 'theory_thermochem',
    name: 'Термохімія та ентальпія',
    nameEn: 'Thermochemistry and Enthalpy',
    subject: 'chemistry',
    difficulty: 3,
    topic: 'Термохімія',
    description: 'Тепловий ефект хімічних реакцій, закон Гесса.',
    descriptionEn: "Heat effects of chemical reactions, Hess's law.",
    content: `**Ентальпія (H)** — термодинамічна функція, що характеризує теплоту реакції при постійному тиску.

**Екзотермічна реакція:** ΔH < 0 (теплота виділяється)
**Ендотермічна реакція:** ΔH > 0 (теплота поглинається)

**Закон Гесса:** Тепловий ефект реакції не залежить від шляху, а лише від початкового і кінцевого стану.

**Теплота згоряння** — кількість теплоти, що виділяється при повному згорянні 1 моля речовини.

**Кількість речовини:** n = m/M — фундаментальне співвідношення для стехіометричних розрахунків.`,
    contentEn: `**Enthalpy (H)** — thermodynamic function characterizing reaction heat at constant pressure.

**Exothermic reaction:** ΔH < 0 (heat released)
**Endothermic reaction:** ΔH > 0 (heat absorbed)

**Hess's Law:** The enthalpy change of a reaction is independent of the pathway, only depending on initial and final states.

**Heat of combustion** — heat released when 1 mole of substance is completely burned.

**Amount of substance:** n = m/M — fundamental relation for stoichiometric calculations.`,
    relatedFormulas: [
      'chem_enthalpy',
      'chem_combustion_heat',
      'chem_molar_mass'
    ]
  },
  {
    id: 'theory_cell_biology',
    name: 'Клітинна біологія',
    nameEn: 'Cell Biology',
    subject: 'biology',
    difficulty: 2,
    topic: 'Клітинна біологія',
    description:
      'Будова клітини, транспорт через мембрану, мікробіологічні методи.',
    descriptionEn:
      'Cell structure, membrane transport, microbiological methods.',
    content: `**Клітина** — структурна та функціональна одиниця живого організму.

**Осмос** — переміщення молекул розчинника через напівпроникну мембрану від менш концентрованого до більш концентрованого розчину.

**Осмотичний тиск:** Π = iCRT — залежить від концентрації розчиненої речовини та температури.

**Типи розчинів:**
- **Гіпотонічний** — клітина набухає (тургор)
- **Ізотонічний** — рівновага
- **Гіпертонічний** — клітина зморщується (плазмоліз)

**Метод розведень** у мікробіології дозволяє підрахувати кількість живих бактерій у зразку: N = C/(V·D).`,
    contentEn: `**Cell** — the structural and functional unit of all living organisms.

**Osmosis** — movement of solvent molecules through a semipermeable membrane from low to high concentration.

**Osmotic pressure:** Π = iCRT — depends on solute concentration and temperature.

**Solution types:**
- **Hypotonic** — cell swells (turgor)
- **Isotonic** — equilibrium
- **Hypertonic** — cell shrinks (plasmolysis)

**Dilution plating** in microbiology counts viable bacteria in a sample: N = C/(V·D).`,
    relatedFormulas: ['bio_osmotic_pressure', 'bio_dilution_plating']
  },
  {
    id: 'theory_cardiovascular',
    name: 'Фізіологія серцево-судинної системи',
    nameEn: 'Cardiovascular Physiology',
    subject: 'biology',
    difficulty: 2,
    topic: 'Фізіологія',
    description: 'Робота серця, кровообіг та основні показники.',
    descriptionEn: 'Heart function, blood circulation and key metrics.',
    content: `**Серцевий цикл** складається з систоли (скорочення) та діастоли (розслаблення).

**Серцевий викид (CO):** CO = SV × HR
- SV (ударний об'єм) ≈ 70 мл
- HR (ЧСС у спокої) ≈ 60-80 уд/хв
- CO у спокої ≈ 5 л/хв

**Артеріальний тиск:** систолічний/діастолічний. Норма: 120/80 мм рт.ст.

**Базальний метаболізм (BMR)** — мінімальна кількість енергії для підтримання життєдіяльності у стані спокою. Залежить від маси тіла, зросту, віку та статі.

**Формула Харріса-Бенедикта (чоловіки):**
BMR = 88.362 + 13.397×m + 4.799×h - 5.677×a`,
    contentEn: `**Cardiac cycle** consists of systole (contraction) and diastole (relaxation).

**Cardiac Output (CO):** CO = SV × HR
- SV (stroke volume) ≈ 70 mL
- HR (resting heart rate) ≈ 60-80 bpm
- CO at rest ≈ 5 L/min

**Blood pressure:** systolic/diastolic. Normal: 120/80 mmHg.

**Basal Metabolic Rate (BMR)** — minimum energy needed to sustain life at rest. Depends on weight, height, age, and sex.

**Harris-Benedict Equation (males):**
BMR = 88.362 + 13.397×m + 4.799×h - 5.677×a`,
    relatedFormulas: ['bio_cardiac_output', 'bio_bmr', 'bio_bmi']
  }
];

export function getTheoryBySubject(subject: string): TheoryItem[] {
  return theoryData.filter((t) => t.subject === subject);
}

export function getTheoryById(id: string): TheoryItem | undefined {
  return theoryData.find((t) => t.id === id);
}
