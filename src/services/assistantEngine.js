/* ============================================
   AI Assistant Engine — Powered by Google Gemini
   Uses Gemini API with platform content as context
   Falls back to intelligent local search if API unavailable
   ============================================ */

import { search } from './search';
import { getAllFormulas } from '../data/physics';
import { getAllFormulas as getAllChemFormulas } from '../data/chemistry';
import { getAllFormulas as getAllBioFormulas } from '../data/biology';
import { theoryData } from '../data/theory';
import { problemsData } from '../data/problems';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Intent words to strip before searching
const INTENT_WORDS_UK = [
  'що таке', 'що це', 'поясни', 'розкажи про', 'як працює', 'як обчислити',
  'як порахувати', 'як знайти', 'формула для', 'закон', 'рівняння', 'визначення',
  'опиши', 'допоможи з', 'розв\'яжи', 'як розв\'язати', 'покажи', 'знайди',
  'скільки', 'яка', 'який', 'яке', 'чому'
];

const INTENT_WORDS_EN = [
  'what is', 'what are', 'explain', 'tell me about', 'how does', 'how to calculate',
  'how to compute', 'how to find', 'formula for', 'law of', 'equation for', 'define',
  'describe', 'help with', 'solve', 'how to solve', 'show me', 'find',
  'how much', 'how many', 'why', 'what'
];

// Strip intent words to get the core search query
function extractSearchQuery(query) {
  let cleaned = query.toLowerCase().trim();
  // Remove question marks and trailing dots
  cleaned = cleaned.replace(/[?!.]+$/, '').trim();

  // Try stripping Ukrainian intent words first
  for (const word of INTENT_WORDS_UK.sort((a, b) => b.length - a.length)) {
    if (cleaned.startsWith(word)) {
      cleaned = cleaned.slice(word.length).trim();
      break;
    }
  }
  // Try English intent words
  for (const word of INTENT_WORDS_EN.sort((a, b) => b.length - a.length)) {
    if (cleaned.startsWith(word)) {
      cleaned = cleaned.slice(word.length).trim();
      break;
    }
  }

  return cleaned || query.trim();
}

// Smart search: try original query, then cleaned query, then individual words
function smartSearch(query) {
  // Try full query first
  let results = search(query);
  if (results.length > 0) return results;

  // Try cleaned query (intent words stripped)
  const cleaned = extractSearchQuery(query);
  if (cleaned !== query.toLowerCase().trim()) {
    results = search(cleaned);
    if (results.length > 0) return results;
  }

  // Try individual significant words (3+ chars)
  const words = cleaned.split(/\s+/).filter(w => w.length >= 3);
  for (const word of words) {
    results = search(word);
    if (results.length > 0) return results;
  }

  return [];
}

function getAllFormulasFlat() {
  return [
    ...getAllFormulas(),
    ...getAllChemFormulas(),
    ...getAllBioFormulas()
  ];
}

function getSubjectEmoji(subject) {
  return { physics: '⚛️', chemistry: '🧪', biology: '🧬' }[subject] || '📚';
}

function getSubjectLabel(subject, isUk) {
  return {
    physics: isUk ? 'Фізика' : 'Physics',
    chemistry: isUk ? 'Хімія' : 'Chemistry',
    biology: isUk ? 'Біологія' : 'Biology'
  }[subject] || subject;
}

// Build a compact context summary for Gemini
function buildPlatformContext(isUk) {
  const allFormulas = getAllFormulasFlat();

  const formulaList = allFormulas.map(f => {
    const name = isUk ? f.name : f.nameEn;
    const desc = isUk ? (f.description || '').slice(0, 80) : (f.descriptionEn || '').slice(0, 80);
    return `- ${name} (id: ${f.id}, LaTeX: ${f.latex}): ${desc}`;
  }).join('\n');

  const theoryList = theoryData.map(t => {
    const name = isUk ? t.name : t.nameEn;
    const content = isUk ? (t.content || '').slice(0, 120) : (t.contentEn || '').slice(0, 120);
    return `- ${name} (${t.subject}, difficulty: ${t.difficulty}): ${content}`;
  }).join('\n');

  const problemList = problemsData.map(p => {
    const name = isUk ? p.name : p.nameEn;
    const desc = isUk ? (p.description || '').slice(0, 80) : (p.descriptionEn || '').slice(0, 80);
    return `- ${name} (${p.subject}, difficulty: ${p.difficulty}⭐): ${desc}`;
  }).join('\n');

  return { formulaList, theoryList, problemList, totalFormulas: allFormulas.length };
}

// Is the question phrased as a definition request ("що таке X", "what is X")?
function isDefinitionalQuery(query) {
  return /(?:^|\s)(?:що таке|що це|поясни|розкажи про|what(?:'s| is| are)|define|tell me about)(?:\s|$)/i
    .test(query.toLowerCase());
}

// Normalize for tolerant concept matching: lowercase, drop punctuation and
// apostrophes, fold ё→е, collapse whitespace.
function normalizeConcept(s) {
  return s
    .toLowerCase()
    .replace(/[?!.,;:()]+/g, ' ')
    .replace(/['’ʼ`]/g, '')
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance + a 0..1 similarity ratio, so small typos
// ("Авагадро" → "Авогадро") and inflections still resolve to the concept.
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[n];
}
function similarity(a, b) {
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - levenshtein(a, b) / max;
}

// Leading discourse fillers that bury the real subject ("А що таке…",
// "Ну поясни…"). Stripped before intent words so "А що таке стала Авогадро"
// reduces to "стала авогадро".
const FILLER_WORDS = [
  'а', 'і', 'й', 'та', 'ну', 'от', 'ось', 'тож', 'отже', 'тобто',
  'well', 'so', 'and', 'hmm', 'ок', 'окей', 'ok', 'okay', 'hey', 'гей'
];

// Reduce a query to its bare subject for concept matching: strip a leading
// run of fillers and intent phrases (looped, anywhere a prefix matches), so
// the typo-tolerant comparison sees just the topic.
function conceptCore(query) {
  let s = normalizeConcept(query.replace(/[?!.]+$/, ''));
  const intents = [...INTENT_WORDS_UK, ...INTENT_WORDS_EN]
    .map(normalizeConcept)
    .sort((a, b) => b.length - a.length);

  let changed = true;
  while (changed && s) {
    changed = false;
    for (const f of FILLER_WORDS) {
      if (s === f) { s = ''; changed = true; break; }
      if (s.startsWith(f + ' ')) { s = s.slice(f.length + 1).trim(); changed = true; break; }
    }
    if (changed) continue;
    for (const w of intents) {
      if (s === w) { s = ''; changed = true; break; }
      if (s.startsWith(w + ' ')) { s = s.slice(w.length + 1).trim(); changed = true; break; }
    }
  }
  return s || normalizeConcept(extractSearchQuery(query));
}

// Resolve a query to a concept in the field-agnostic knowledge base. Exact
// key matches win; otherwise a WHOLE-string fuzzy match (short queries only)
// tolerates typos/inflections. Whole-string — not substring — so specific
// lookups like "сила тяжіння" aren't swallowed by the broad "сила" concept.
function matchConcept(query) {
  const raw = normalizeConcept(query.replace(/[?!.]+$/, ''));
  const core = conceptCore(query);

  for (const c of CONCEPTS) {
    for (const k of c.keys) {
      const nk = normalizeConcept(k);
      if (core === nk || raw === nk) return c;
    }
  }

  // Fuzzy whole-string match, short queries only, to avoid hijacking longer
  // specific questions.
  if (core.split(' ').filter(Boolean).length > 4) return null;

  let best = null;
  for (const c of CONCEPTS) {
    for (const k of c.keys) {
      const nk = normalizeConcept(k);
      const s = Math.max(similarity(core, nk), similarity(raw, nk));
      if (s >= 0.84 && (!best || s > best.s)) best = { c, s };
    }
  }
  return best ? best.c : null;
}

// Broad conceptual = a definition request whose subject is a recognized
// concept that has no curated links (a whole field like "фізика"). Those
// inject nothing so weak fuzzy hits can't bias the model.
function isBroadConceptualQuery(query) {
  return isDefinitionalQuery(query) && matchConcept(query) !== null;
}

// Index every platform item by id so a concept's "related" list resolves to
// real names + navigation targets. Field-agnostic: covers all subjects.
let _itemsById = null;
function itemsById() {
  if (_itemsById) return _itemsById;
  const idx = {};
  [
    [getAllFormulas(), 'physics'],
    [getAllChemFormulas(), 'chemistry'],
    [getAllBioFormulas(), 'biology']
  ].forEach(([list, subject]) =>
    list.forEach(f => { idx[f.id] = { ...f, type: 'formula', subject: f.subject || subject }; })
  );
  theoryData.forEach(t => { idx[t.id] = { ...t, type: 'theory' }; });
  problemsData.forEach(p => { idx[p.id] = { ...p, type: 'problem' }; });
  _itemsById = idx;
  return idx;
}

function resolveRelated(concept) {
  if (!concept?.related) return [];
  const idx = itemsById();
  return concept.related.map(id => idx[id]).filter(Boolean);
}

// Serialize one platform item into the Gemini prompt context.
function formatItemContext(item, isUk) {
  const name = isUk ? item.name : (item.nameEn || item.name);
  if (item.type === 'formula') {
    const desc = isUk ? item.description : item.descriptionEn;
    const vars = item.variables ? item.variables.map(v =>
      `${v.symbol} (${isUk ? v.name : v.nameEn}, ${v.unit})`
    ).join(', ') : '';
    return `\nFORMULA: ${name}\nLaTeX: ${item.latex}\nDescription: ${desc}\nVariables: ${vars}\nID: ${item.id}\nSubject: ${item.subject}\n`;
  }
  if (item.type === 'theory') {
    const content = isUk ? item.content : item.contentEn;
    return `\nTHEORY: ${name}\nContent: ${content}\nRelated formulas: ${(item.relatedFormulas || []).join(', ')}\n`;
  }
  if (item.type === 'problem') {
    const desc = isUk ? item.description : item.descriptionEn;
    const steps = item.steps ? item.steps.map((s, i) =>
      `Step ${i + 1}: ${isUk ? s.text : s.textEn}`
    ).join('\n') : '';
    const answer = isUk ? item.answer : item.answerEn;
    return `\nPROBLEM: ${name}\nDescription: ${desc}\n${steps}\nAnswer: ${answer}\nRelated formula: ${item.relatedFormula || 'none'}\n`;
  }
  return '';
}

// Build platform context for the Gemini prompt. A recognized concept pulls in
// its curated cross-topic materials (e.g. Avogadro → mole, molarity, ideal
// gas) so the model connects topics instead of answering in isolation. Broad
// fields with no curated links inject nothing; everything else falls back to
// fuzzy search, keeping only strong matches.
function findRelevantContent(query, isUk) {
  const related = resolveRelated(matchConcept(query));
  if (related.length > 0) {
    let context = '\n\n--- RELATED PLATFORM MATERIALS (the question connects to these; weave them together and tell the student they can open them) ---\n';
    related.forEach(item => { context += formatItemContext(item, isUk); });
    return context;
  }

  if (isBroadConceptualQuery(query)) return '';

  const results = smartSearch(query)
    .filter(r => r.score == null || r.score <= 0.4)
    .slice(0, 3);
  if (results.length === 0) return '';

  let context = '\n\n--- POSSIBLY RELATED PLATFORM ITEMS (reference these ONLY if they directly help answer the question; ignore them otherwise) ---\n';
  results.forEach(item => { context += formatItemContext(item, isUk); });
  return context;
}

// Build navigation links from search results
function extractLinks(query, isUk) {
  const results = smartSearch(query);
  return results.slice(0, 4).map(item => {
    const label = isUk ? item.name : (item.nameEn || item.name);
    if (item.type === 'formula') {
      return { type: 'formula', id: item.id, label: `📐 ${label}` };
    } else if (item.type === 'theory') {
      return { type: 'theory', id: item.id, label: `📖 ${label}` };
    } else if (item.type === 'problem') {
      return { type: 'problems', id: item.id, label: `📝 ${label}` };
    }
    return null;
  }).filter(Boolean);
}

// Call Gemini API
async function callGemini(userMessage, isUk) {
  const { formulaList, theoryList, problemList, totalFormulas } = buildPlatformContext(isUk);
  const relevantContent = findRelevantContent(userMessage, isUk);

  const lang = isUk ? 'Ukrainian' : 'English';

  const systemPrompt = `You are SciLearn AI — a friendly, knowledgeable science tutor for a learning platform covering Physics, Chemistry and Biology.

HOW TO ANSWER:
1. ALWAYS respond in ${lang}.
2. Answer the student's ACTUAL question first, directly and clearly, using your own knowledge.
3. For broad or conceptual questions (e.g. "what is physics?", "why does X happen?", "what is energy?"), give a clear GENERAL explanation of the field or idea in plain language. Do NOT jump to a single specific formula unless the student explicitly asked for one.
4. Bring up a specific platform formula/topic/problem ONLY when it genuinely helps answer THIS question. When you do, name it and say the student can open it on the platform. Never force an unrelated formula into the answer. If a "RELATED PLATFORM MATERIALS" block is provided below, the question links several platform topics — connect them: explain how they relate and point the student to each listed material so they see the bigger picture.
5. Keep it concise: 3-6 sentences for simple questions, a little more for explanations. Move from the general idea to specifics, not the other way around.
6. Write formulas in LaTeX wrapped in $$...$$. Show calculation steps clearly when solving a problem.
7. Be encouraging and educational. Use at most 1-2 emoji. Use **bold** for emphasis; do NOT use markdown headers (#).
8. If something isn't on the platform, still answer from your knowledge.

The catalog below is the platform's library — use it ONLY to point students to relevant materials, NOT as the source of your answer and NOT something to recite.

PLATFORM CATALOG (${totalFormulas} formulas, ${theoryData.length} theory articles, ${problemsData.length} problems):

FORMULAS:
${formulaList}

THEORY ARTICLES:
${theoryList}

PROBLEMS:
${problemList}
${relevantContent}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\nUser question: ' + userMessage }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
      topP: 0.9
    }
  };

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

// ============================================
// Rich Local Fallback — detailed, helpful responses
// ============================================

function detectHelpIntent(query) {
  return /(?:допомог[аи]|help|що ти (?:вмієш|можеш|знаєш)|what can you|можливості|capabilities|як (?:користуватись|працюєш|працює)|how (?:do you work|to use)|menu|меню|інструкція|instructions)/i.test(query);
}

function detectListIntent(query) {
  return /(?:які є|які формули|list|перелічи|покажи всі|show all|список|скільки|all formulas|всі формули|what(?:'s| is) available)/i.test(query);
}

function detectThanksIntent(query) {
  return /^(?:дякую|дякуємо|спасибі|thanks|thank you|thx|ок|ok|зрозуміло|got it|cool|класно|супер|чудово)/i.test(query);
}

function detectSubjectIntent(query) {
  if (/(?:фізик|physic)/i.test(query)) return 'physics';
  if (/(?:хім|chem)/i.test(query)) return 'chemistry';
  if (/(?:біолог|bio)/i.test(query)) return 'biology';
  return null;
}

// General-concept knowledge base for broad/definitional questions, so the
// offline fallback answers "what is physics?" with an explanation of the
// field instead of forcing the nearest specific formula. Extend as needed.
// Field-agnostic concept knowledge base. Each entry can carry:
//   related  — platform item ids (any subject) to surface as links/context
//   seeAlso  — keys of sibling concepts, offered as follow-up suggestions
// The matching/linking engine is generic; adding a concept for any field is
// purely a data change here.
const CONCEPTS = [
  {
    keys: ['фізика', 'фізику', 'фізики', 'physics'],
    emoji: '⚛️',
    uk: { title: 'Фізика', body: 'Фізика — це природнича наука, яка вивчає матерію, енергію та фундаментальні взаємодії, а також закони, за якими рухається і змінюється світ. Основні розділи: механіка, термодинаміка, електрика й магнетизм, оптика, коливання та хвилі, атомна і ядерна фізика.' },
    en: { title: 'Physics', body: 'Physics is a natural science that studies matter, energy and the fundamental interactions, and the laws that govern how the world moves and changes. Main branches: mechanics, thermodynamics, electricity & magnetism, optics, oscillations & waves, and atomic & nuclear physics.' },
    seeAlso: ['енергія', 'сила', 'атом']
  },
  {
    keys: ['хімія', 'хімію', 'хімії', 'chemistry'],
    emoji: '🧪',
    uk: { title: 'Хімія', body: 'Хімія — це наука про речовини, їхній склад, будову, властивості та перетворення під час хімічних реакцій. Вона вивчає атоми й молекули, зв’язки між ними, розчини, кислоти та основи, а також енергію хімічних процесів.' },
    en: { title: 'Chemistry', body: 'Chemistry is the science of substances — their composition, structure, properties and the transformations they undergo in chemical reactions. It studies atoms and molecules, bonds, solutions, acids and bases, and the energy of chemical processes.' },
    seeAlso: ['моль', 'молярна концентрація', 'атом']
  },
  {
    keys: ['біологія', 'біологію', 'біології', 'biology'],
    emoji: '🧬',
    uk: { title: 'Біологія', body: 'Біологія — це наука про живі організми: їхню будову, функціонування, розвиток, спадковість та взаємодію із середовищем. Основні напрями: клітинна біологія, генетика, екологія, фізіологія та еволюція.' },
    en: { title: 'Biology', body: 'Biology is the science of living organisms — their structure, function, growth, heredity and interaction with the environment. Main areas: cell biology, genetics, ecology, physiology and evolution.' },
    seeAlso: ['клітина', 'днк']
  },
  {
    keys: ['енергія', 'енергію', 'енергії', 'energy'],
    emoji: '⚡',
    uk: { title: 'Енергія', body: 'Енергія — це фізична величина, що характеризує здатність системи виконувати роботу. Вона буває кінетичною, потенціальною, тепловою, електричною, хімічною тощо; за законом збереження енергія не зникає, а лише переходить з однієї форми в іншу.' },
    en: { title: 'Energy', body: 'Energy is a physical quantity describing a system’s ability to do work. It comes in kinetic, potential, thermal, electrical, chemical and other forms; by the conservation law it is never destroyed, only converted between forms.' },
    related: ['phys_kinetic_energy', 'phys_work', 'phys_mass_energy', 'theory_thermodynamics'],
    seeAlso: ['сила', 'атом']
  },
  {
    keys: ['сила', 'силу', 'сили', 'force'],
    emoji: '🧲',
    uk: { title: 'Сила', body: 'Сила — це міра взаємодії тіл, що змінює їхній стан руху або форму. Вона векторна (має величину й напрям), вимірюється в ньютонах (Н), а її дію описують закони Ньютона.' },
    en: { title: 'Force', body: 'Force is a measure of interaction between bodies that changes their state of motion or shape. It is a vector (has magnitude and direction), measured in newtons (N), and its effects are described by Newton’s laws.' },
    related: ['phys_newton2', 'phys_weight', 'phys_gravity_law', 'theory_newton_laws'],
    seeAlso: ['енергія']
  },
  {
    keys: ['атом', 'атома', 'атоми', 'atom'],
    emoji: '⚛️',
    uk: { title: 'Атом', body: 'Атом — найменша частинка хімічного елемента, що зберігає його властивості. Складається з ядра (протони й нейтрони) та електронів навколо нього; саме будова атома визначає хімічну поведінку речовини.' },
    en: { title: 'Atom', body: 'An atom is the smallest particle of a chemical element that retains its properties. It consists of a nucleus (protons and neutrons) and surrounding electrons; the atomic structure determines a substance’s chemical behaviour.' },
    related: ['phys_mass_energy', 'phys_photon_energy', 'phys_radioactive_decay'],
    seeAlso: ['стала авогадро', 'моль']
  },
  {
    keys: ['клітина', 'клітину', 'клітини', 'cell'],
    emoji: '🦠',
    uk: { title: 'Клітина', body: 'Клітина — це структурна й функціональна одиниця всіх живих організмів. Вона має мембрану, цитоплазму та органели (а в еукаріотів — ядро) і здатна до обміну речовин, росту та поділу.' },
    en: { title: 'Cell', body: 'The cell is the structural and functional unit of all living organisms. It has a membrane, cytoplasm and organelles (and a nucleus in eukaryotes), and is capable of metabolism, growth and division.' },
    related: ['bio_osmotic_pressure', 'theory_cell_biology'],
    seeAlso: ['днк', 'біологія']
  },
  {
    keys: ['днк', 'дезоксирибонуклеїнова кислота', 'dna', 'deoxyribonucleic acid'],
    emoji: '🧬',
    uk: { title: 'ДНК', body: 'ДНК (дезоксирибонуклеїнова кислота) — біополімер, що зберігає спадкову інформацію у послідовності нуклеотидів (A, T, G, C). Вона організована у подвійну спіраль, копіюється під час поділу клітини й через триплети-кодони задає синтез білків.' },
    en: { title: 'DNA', body: 'DNA (deoxyribonucleic acid) is a biopolymer that stores hereditary information in a sequence of nucleotides (A, T, G, C). It is organised as a double helix, copied during cell division, and via three-letter codons directs protein synthesis.' },
    related: ['bio_dna_length', 'bio_codon_count', 'bio_protein_mw', 'theory_cell_biology'],
    seeAlso: ['клітина', 'біологія']
  },
  {
    keys: ['стала авогадро', 'число авогадро', 'постійна авогадро', 'константа авогадро', 'авогадро',
      "avogadro's number", 'avogadro number', 'avogadro constant', 'avogadro'],
    emoji: '🧪',
    uk: { title: 'Стала Авогадро', body: 'Стала (число) Авогадро Nₐ ≈ 6.022·10²³ моль⁻¹ — це кількість структурних частинок (атомів, молекул, йонів) в одному молі речовини. Саме вона пов’язує мікросвіт окремих частинок із макроскопічними величинами: переводить кількість речовини (моль) у число частинок, а молярну масу — у масу однієї молекули. Тому стала Авогадро лежить в основі розрахунків кількості речовини, молярної концентрації розчинів та рівняння стану ідеального газу.' },
    en: { title: "Avogadro's Constant", body: "Avogadro's constant (number) Nₐ ≈ 6.022·10²³ mol⁻¹ is the number of structural particles (atoms, molecules, ions) in one mole of a substance. It bridges the microscopic world of single particles with macroscopic quantities: it converts amount of substance (moles) into a particle count and molar mass into the mass of one molecule. It therefore underpins calculations of amount of substance, solution molarity and the ideal-gas law." },
    related: ['chem_molar_mass', 'chem_molarity', 'chem_ideal_gas', 'theory_solutions'],
    seeAlso: ['моль', 'молярна концентрація', 'атом']
  },
  {
    keys: ['моль', 'молі', 'моля', 'кількість речовини', 'mole', 'amount of substance'],
    emoji: '🧪',
    uk: { title: 'Моль і кількість речовини', body: 'Моль — одиниця кількості речовини, що містить рівно стільки частинок, скільки задає стала Авогадро (≈ 6.022·10²³). Кількість речовини обчислюють як n = m/M (маса поділена на молярну масу), і вона є вхідною величиною для молярної концентрації розчинів та рівняння стану ідеального газу.' },
    en: { title: 'Mole and Amount of Substance', body: "The mole is the unit of amount of substance containing exactly as many particles as Avogadro's constant defines (≈ 6.022·10²³). Amount of substance is computed as n = m/M (mass over molar mass) and feeds into solution molarity and the ideal-gas law." },
    related: ['chem_molar_mass', 'chem_molarity', 'chem_ideal_gas'],
    seeAlso: ['стала авогадро', 'молярна концентрація']
  },
  {
    keys: ['молярна концентрація', 'молярність', 'концентрація розчину', 'концентрація',
      'molarity', 'molar concentration', 'concentration'],
    emoji: '🧪',
    uk: { title: 'Молярна концентрація', body: 'Молярна концентрація (молярність) — кількість молів розчиненої речовини в одному літрі розчину: C = n/V. Вона спирається на поняття молю (а отже й сталу Авогадро) і є базовою величиною для розрахунків розчинів, розбавлення та pH.' },
    en: { title: 'Molarity', body: "Molarity is the number of moles of solute per litre of solution: C = n/V. It builds on the mole (and hence Avogadro's constant) and is the core quantity for solution, dilution and pH calculations." },
    related: ['chem_molarity', 'chem_dilution', 'chem_mass_fraction', 'theory_solutions'],
    seeAlso: ['моль', 'стала авогадро']
  }
];

// Return a general explanation when the question is a broad definitional one
// whose subject is a known concept. Specific lookups (e.g. "що таке закон
// Ома") have a multi-word core and fall through to formula/theory search.
// Display title of the concept owning a given key (for seeAlso suggestions).
function conceptTitle(key, isUk) {
  const nk = normalizeConcept(key);
  for (const c of CONCEPTS) {
    if (c.keys.some(k => normalizeConcept(k) === nk)) {
      return isUk ? c.uk.title : c.en.title;
    }
  }
  return key;
}

// Concept-graph navigation links (any subject), reused by the fallback and
// the Gemini path so the topic still surfaces its connected materials.
function buildConceptLinks(concept, isUk) {
  return resolveRelated(concept).slice(0, 4).map(item => {
    const label = isUk ? item.name : (item.nameEn || item.name);
    if (item.type === 'formula') return { type: 'formula', id: item.id, label };
    if (item.type === 'theory') return { type: 'theory', id: item.id, label };
    if (item.type === 'problem') return { type: 'problems', id: item.id, label };
    return null;
  }).filter(Boolean);
}

function mergeLinks(primary, extra, cap = 5) {
  const seen = new Set(primary.map(l => `${l.type}:${l.id}`));
  const out = [...primary];
  for (const l of extra) {
    const key = `${l.type}:${l.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
    if (out.length >= cap) break;
  }
  return out.slice(0, cap);
}

function detectConceptualAnswer(query, isUk) {
  const c = matchConcept(query);
  if (!c) return null;
  const t = isUk ? c.uk : c.en;
  let text = `${c.emoji} **${t.title}**\n\n${t.body}`;

  // Show how this concept connects to other platform topics.
  const related = resolveRelated(c);
  if (related.length > 0) {
    const names = related.map(r => (isUk ? r.name : (r.nameEn || r.name)));
    text += `\n\n${isUk ? '🔗 На платформі це пов’язано з' : '🔗 On the platform this connects to'}: ${names.join(', ')}.`;
  }

  const suggestions = (c.seeAlso || []).map(k => conceptTitle(k, isUk)).slice(0, 3);
  return { text, suggestions };
}

function localFallback(query, isUk) {
  // Help intent
  if (detectHelpIntent(query)) {
    const allFormulas = getAllFormulasFlat();
    return {
      text: isUk
        ? `🤖 Ось що я вмію:\n\n• **Формули** — знайду будь-яку з ${allFormulas.length} формул та поясню її\n• **Теорія** — розкажу про теоретичні матеріали (${theoryData.length} статей)\n• **Задачі** — допоможу знайти приклади розв'язків (${problemsData.length} задач)\n• **Калькулятор** — підкажу, де обчислити значення\n\nПросто напишіть питання!`
        : `🤖 Here's what I can do:\n\n• **Formulas** — find any of ${allFormulas.length} formulas and explain them\n• **Theory** — explain theoretical materials (${theoryData.length} articles)\n• **Problems** — help find example solutions (${problemsData.length} problems)\n• **Calculator** — point you to the right calculator\n\nJust ask a question!`,
      suggestions: isUk
        ? ['Закон Ома', 'Що таке pH?', 'Задачі з біології']
        : ["Ohm's law", 'What is pH?', 'Biology problems']
    };
  }

  // List intent
  if (detectListIntent(query)) {
    const subjectMatch = query.match(/(?:фізик|physic)/i) ? 'physics'
      : query.match(/(?:хім|chem)/i) ? 'chemistry'
      : query.match(/(?:біолог|bio)/i) ? 'biology' : null;

    if (subjectMatch) {
      const formulas = getAllFormulasFlat().filter(f =>
        f.topic?.toLowerCase().includes(subjectMatch) ||
        f.id?.startsWith(subjectMatch.slice(0, 4))
      );
      const fBySubject = {
        physics: getAllFormulas(),
        chemistry: getAllChemFormulas(),
        biology: getAllBioFormulas()
      }[subjectMatch] || [];

      const names = fBySubject.slice(0, 8).map(f => `• ${isUk ? f.name : f.nameEn}`).join('\n');
      return {
        text: `${getSubjectEmoji(subjectMatch)} **${getSubjectLabel(subjectMatch, isUk)}** — ${fBySubject.length} ${isUk ? 'формул' : 'formulas'}:\n\n${names}${fBySubject.length > 8 ? `\n\n...${isUk ? 'та ще' : 'and'} ${fBySubject.length - 8} ${isUk ? 'більше' : 'more'}` : ''}`,
        suggestions: []
      };
    }

    const all = getAllFormulasFlat();
    return {
      text: isUk
        ? `📊 На платформі доступно:\n\n• ⚛️ Фізика — ${getAllFormulas().length} формул\n• 🧪 Хімія — ${getAllChemFormulas().length} формул\n• 🧬 Біологія — ${getAllBioFormulas().length} формул\n• 📖 ${theoryData.length} теоретичних статей\n• 📝 ${problemsData.length} прикладів задач`
        : `📊 Available on the platform:\n\n• ⚛️ Physics — ${getAllFormulas().length} formulas\n• 🧪 Chemistry — ${getAllChemFormulas().length} formulas\n• 🧬 Biology — ${getAllBioFormulas().length} formulas\n• 📖 ${theoryData.length} theory articles\n• 📝 ${problemsData.length} problem examples`,
      suggestions: isUk
        ? ['Формули фізики', 'Формули хімії', 'Формули біології']
        : ['Physics formulas', 'Chemistry formulas', 'Biology formulas']
    };
  }

  // Broad conceptual question (e.g. "що таке фізика?") — answer the concept
  // generally instead of forcing the nearest specific formula.
  const concept = detectConceptualAnswer(query, isUk);
  if (concept) return concept;

  // Search-based response
  const results = smartSearch(query);

  if (results.length === 0) {
    return {
      text: isUk
        ? `🤔 На жаль, не знайшов точної відповіді на **"${query}"**.\n\nСпробуйте:\n• Використати ключові слова (напр. "закон Ома", "pH", "ДНК")\n• Написати назву формули або теми\n• Запитати "допомога" для списку можливостей`
        : `🤔 Sorry, I couldn't find a precise answer for **"${query}"**.\n\nTry:\n• Using key terms (e.g., "Ohm's law", "pH", "DNA")\n• Typing a formula or topic name\n• Asking "help" for available capabilities`,
      suggestions: isUk
        ? ['Які є формули?', 'Допомога', 'Закон Ньютона']
        : ['Available formulas?', 'Help', "Newton's law"]
    };
  }

  const top = results[0];

  // A weak fuzzy match shouldn't masquerade as a confident answer card.
  // Offer it as a suggestion instead of asserting it as THE answer.
  if (top.score != null && top.score > 0.55) {
    return {
      text: isUk
        ? `🤔 Точної відповіді на **"${query}"** не знайшов. Можливо, ви мали на увазі щось із наведеного нижче — або уточніть питання.`
        : `🤔 I couldn't find an exact answer for **"${query}"**. You might mean one of the items below — or try rephrasing the question.`,
      suggestions: results.slice(0, 3).map(r => (isUk ? r.name : (r.nameEn || r.name)))
    };
  }

  const others = results.slice(1, 4);
  const name = isUk ? top.name : (top.nameEn || top.name);

  // Formula response — rich with variables
  if (top.type === 'formula') {
    const desc = isUk ? top.description : top.descriptionEn;
    const vars = top.variables
      ? top.variables.map(v => {
          const vName = isUk ? v.name : v.nameEn;
          return `  • **${v.symbol}** — ${vName} (${v.unit})`;
        }).join('\n')
      : '';
    const subjEmoji = getSubjectEmoji(top.subject);

    let text = `${subjEmoji} **${name}**\n\n$$${top.latex}$$\n\n${desc}`;
    if (vars) {
      text += `\n\n**${isUk ? 'Змінні' : 'Variables'}:**\n${vars}`;
    }
    text += `\n\n${isUk ? '💡 Натисніть кнопку нижче, щоб перейти до формули з калькулятором.' : '💡 Click the button below to open the formula with calculator.'}`;

    // Add related formulas
    if (others.length > 0) {
      const related = others
        .filter(o => o.type === 'formula')
        .slice(0, 2)
        .map(o => isUk ? o.name : o.nameEn);
      if (related.length > 0) {
        text += `\n\n${isUk ? '🔗 Також дивіться' : '🔗 Also see'}: ${related.join(', ')}`;
      }
    }

    return { text, suggestions: [] };
  }

  // Theory response — preview with content
  if (top.type === 'theory') {
    const desc = isUk ? top.description : top.descriptionEn;
    const content = (isUk ? top.content : top.contentEn) || '';
    const preview = content.split('\n\n').slice(0, 2).join('\n\n');
    const diffLabels = { 1: '🟢', 2: '🟡', 3: '🔴' };

    let text = `📖 **${name}** ${diffLabels[top.difficulty] || ''}\n\n${desc}\n\n${preview.slice(0, 300)}${content.length > 300 ? '...' : ''}`;

    if (top.relatedFormulas && top.relatedFormulas.length > 0) {
      text += `\n\n${isUk ? '📐 Пов\'язані формули' : '📐 Related formulas'}: ${top.relatedFormulas.join(', ')}`;
    }

    return { text, suggestions: [] };
  }

  // Problem response — with steps preview
  if (top.type === 'problem') {
    const desc = isUk ? top.description : top.descriptionEn;
    const stepsPreview = top.steps
      ? top.steps.slice(0, 2).map((s, i) => {
          const stepText = isUk ? s.text : s.textEn;
          return `  ${i + 1}. ${stepText}`;
        }).join('\n')
      : '';
    const answer = isUk ? top.answer : top.answerEn;

    let text = `📝 **${name}** ${'⭐'.repeat(top.difficulty || 1)}\n\n${desc}\n\n**${isUk ? 'Розв\'язок' : 'Solution'}:**\n${stepsPreview}`;
    if (top.steps && top.steps.length > 2) {
      text += `\n  ... ${isUk ? 'ще' : 'more'} ${top.steps.length - 2} ${isUk ? 'кроків' : 'steps'}`;
    }
    text += `\n\n**${isUk ? 'Відповідь' : 'Answer'}:** ${answer}`;

    return { text, suggestions: [] };
  }

  // Generic result
  return {
    text: `🔍 **${name}**\n\n${isUk ? top.description : (top.descriptionEn || top.description)}`,
    suggestions: []
  };
}

// ============================================
// Main entry point — async
// ============================================
export async function processMessage(query, isUk = true) {
  if (!query || query.trim().length === 0) {
    return {
      text: isUk ? 'Будь ласка, напишіть ваше питання.' : 'Please type your question.',
      links: [],
      suggestions: []
    };
  }

  const trimmed = query.trim();

  // ---- INSTANT INTENTS (no API call needed) ----

  // Greeting
  if (/^(?:привіт|hello|hi|hey|вітаю|добрий|доброго|good|здрастуй|здоров)/i.test(trimmed)) {
    const allFormulas = getAllFormulasFlat();
    return {
      text: isUk
        ? `👋 Привіт! Я — **SciLearn AI** на базі Google Gemini. Я знаю всі ${allFormulas.length} формул, ${theoryData.length} теоретичних статей та ${problemsData.length} задач на платформі. Запитуйте що завгодно!`
        : `👋 Hi! I'm **SciLearn AI** powered by Google Gemini. I know all ${allFormulas.length} formulas, ${theoryData.length} theory articles, and ${problemsData.length} problems on the platform. Ask me anything!`,
      links: [],
      suggestions: isUk
        ? ['Поясни закон Ома', 'Як обчислити pH?', 'Що таке E=mc²?']
        : ["Explain Ohm's law", 'How to calculate pH?', 'What is E=mc²?']
    };
  }

  // Help / capabilities
  if (detectHelpIntent(trimmed)) {
    const allFormulas = getAllFormulasFlat();
    return {
      text: isUk
        ? `🤖 Ось що я вмію:\n\n• **Формули** — знайду будь-яку з ${allFormulas.length} формул та поясню її\n• **Теорія** — розкажу про теоретичні матеріали (${theoryData.length} статей)\n• **Задачі** — допоможу знайти приклади розв'язків (${problemsData.length} задач)\n• **Калькулятор** — підкажу, де обчислити значення\n\nПросто напишіть назву формули, теми або запитання!`
        : `🤖 Here's what I can do:\n\n• **Formulas** — find any of ${allFormulas.length} formulas and explain them\n• **Theory** — explain theoretical materials (${theoryData.length} articles)\n• **Problems** — help find example solutions (${problemsData.length} problems)\n• **Calculator** — point you to the right calculator\n\nJust type a formula name, topic, or question!`,
      links: [],
      suggestions: isUk
        ? ['Закон Ома', 'Що таке pH?', 'Задачі з біології']
        : ["Ohm's law", 'What is pH?', 'Biology problems']
    };
  }

  // Thanks
  if (detectThanksIntent(trimmed)) {
    return {
      text: isUk
        ? '😊 Будь ласка! Якщо є ще питання — запитуйте, я завжди готовий допомогти!'
        : "😊 You're welcome! If you have more questions, feel free to ask!",
      links: [],
      suggestions: isUk
        ? ['Що таке E=mc²?', 'Формули хімії', 'Задачі з фізики']
        : ['What is E=mc²?', 'Chemistry formulas', 'Physics problems']
    };
  }

  // List all / statistics
  if (detectListIntent(trimmed)) {
    const subj = detectSubjectIntent(trimmed);
    if (subj) {
      const fBySubject = {
        physics: getAllFormulas(),
        chemistry: getAllChemFormulas(),
        biology: getAllBioFormulas()
      }[subj] || [];
      const names = fBySubject.slice(0, 10).map(f => `• ${isUk ? f.name : f.nameEn}`).join('\n');
      return {
        text: `${getSubjectEmoji(subj)} **${getSubjectLabel(subj, isUk)}** — ${fBySubject.length} ${isUk ? 'формул' : 'formulas'}:\n\n${names}${fBySubject.length > 10 ? `\n\n...${isUk ? 'та ще' : 'and'} ${fBySubject.length - 10} ${isUk ? 'більше' : 'more'}` : ''}`,
        links: [{ type: 'subject', id: subj, label: isUk ? 'Переглянути всі' : 'View all' }],
        suggestions: []
      };
    }
    return {
      text: isUk
        ? `📊 На платформі доступно:\n\n• ⚛️ Фізика — ${getAllFormulas().length} формул\n• 🧪 Хімія — ${getAllChemFormulas().length} формул\n• 🧬 Біологія — ${getAllBioFormulas().length} формул\n• 📖 ${theoryData.length} теоретичних статей\n• 📝 ${problemsData.length} прикладів задач\n\nОберіть предмет для деталей!`
        : `📊 Available on the platform:\n\n• ⚛️ Physics — ${getAllFormulas().length} formulas\n• 🧪 Chemistry — ${getAllChemFormulas().length} formulas\n• 🧬 Biology — ${getAllBioFormulas().length} formulas\n• 📖 ${theoryData.length} theory articles\n• 📝 ${problemsData.length} problem examples\n\nPick a subject for details!`,
      links: [],
      suggestions: isUk
        ? ['Формули фізики', 'Формули хімії', 'Формули біології']
        : ['Physics formulas', 'Chemistry formulas', 'Biology formulas']
    };
  }

  // Pure subject query (e.g., just "фізика" or "chemistry")
  const pureSubject = detectSubjectIntent(trimmed);
  if (pureSubject && trimmed.length < 15) {
    const fBySubject = {
      physics: getAllFormulas(),
      chemistry: getAllChemFormulas(),
      biology: getAllBioFormulas()
    }[pureSubject] || [];
    const topics = [...new Set(fBySubject.map(f => f.topic))].filter(Boolean);
    return {
      text: `${getSubjectEmoji(pureSubject)} **${getSubjectLabel(pureSubject, isUk)}**\n\n${isUk ? 'Доступно' : 'Available'}: ${fBySubject.length} ${isUk ? 'формул' : 'formulas'} ${isUk ? 'з' : 'in'} ${topics.length} ${isUk ? 'тем' : 'topics'}:\n${topics.map(t => `• ${t}`).join('\n')}\n\n${isUk ? 'Запитайте конкретну формулу або тему!' : 'Ask about a specific formula or topic!'}`,
      links: [{ type: 'subject', id: pureSubject, label: isUk ? 'Відкрити предмет' : 'Open subject' }],
      suggestions: isUk
        ? [`Формули ${getSubjectLabel(pureSubject, true).toLowerCase()}`]
        : [`${getSubjectLabel(pureSubject, false)} formulas`]
    };
  }

  // ---- GEMINI API (for complex questions) ----

  // Navigation links: search hits first, then curated concept-graph links so
  // a topic like "стала Авогадро" still surfaces its connected materials
  // (mole, molarity, ideal-gas law) even with no direct search hit.
  const conceptMatch = matchConcept(trimmed);
  let links = extractLinks(trimmed, isUk);
  if (conceptMatch) {
    links = mergeLinks(links, buildConceptLinks(conceptMatch, isUk));
  }

  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
    try {
      const geminiResponse = await callGemini(trimmed, isUk);
      return {
        text: geminiResponse,
        links,
        suggestions: []
      };
    } catch (err) {
      console.warn('Gemini API failed, using local fallback:', err.message);
    }
  }

  // ---- RICH LOCAL FALLBACK ----
  const fallback = localFallback(trimmed, isUk);
  return {
    text: fallback.text,
    links,
    suggestions: fallback.suggestions || []
  };
}
