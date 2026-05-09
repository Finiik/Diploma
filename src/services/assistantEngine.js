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

// Search for relevant content to include in Gemini prompt
function findRelevantContent(query, isUk) {
  const results = smartSearch(query);
  if (results.length === 0) return '';

  const top = results.slice(0, 5);
  let context = '\n\n--- RELEVANT CONTENT FOUND ---\n';

  top.forEach(item => {
    const name = isUk ? item.name : (item.nameEn || item.name);
    if (item.type === 'formula') {
      const desc = isUk ? item.description : item.descriptionEn;
      const vars = item.variables ? item.variables.map(v =>
        `${v.symbol} (${isUk ? v.name : v.nameEn}, ${v.unit})`
      ).join(', ') : '';
      context += `\nFORMULA: ${name}\nLaTeX: ${item.latex}\nDescription: ${desc}\nVariables: ${vars}\nID: ${item.id}\nSubject: ${item.subject}\n`;
    } else if (item.type === 'theory') {
      const content = isUk ? item.content : item.contentEn;
      context += `\nTHEORY: ${name}\nContent: ${content}\nRelated formulas: ${(item.relatedFormulas || []).join(', ')}\n`;
    } else if (item.type === 'problem') {
      const desc = isUk ? item.description : item.descriptionEn;
      const steps = item.steps ? item.steps.map((s, i) =>
        `Step ${i + 1}: ${isUk ? s.text : s.textEn}`
      ).join('\n') : '';
      const answer = isUk ? item.answer : item.answerEn;
      context += `\nPROBLEM: ${name}\nDescription: ${desc}\n${steps}\nAnswer: ${answer}\nRelated formula: ${item.relatedFormula || 'none'}\n`;
    }
  });

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

  const systemPrompt = `You are SciLearn AI — a friendly, knowledgeable assistant for a science learning platform. You help students with Physics, Chemistry, and Biology.

RULES:
1. ALWAYS respond in ${lang}.
2. Keep responses concise (3-6 sentences max for simple questions, more for explanations).
3. When mentioning formulas, write them in plain text or LaTeX (wrap in $$...$$).
4. When a formula from the platform matches the question, mention it by name and say the student can find it on the platform.
5. Be encouraging and educational.
6. If asked about something NOT on the platform, still answer using your knowledge but note it's not in the platform yet.
7. Use emoji sparingly (1-2 per message).
8. For math calculations, show the steps clearly.
9. Do NOT use markdown headers (#). Use **bold** for emphasis.

PLATFORM CONTENT (${totalFormulas} formulas, ${theoryData.length} theory articles, ${problemsData.length} problems):

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

  // Extract navigation links using smart search
  const links = extractLinks(trimmed, isUk);

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
