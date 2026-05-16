/* ============================================
   AI Assistant Engine — Powered by Google Gemini

   Thin orchestrator. Handles instant intents (no API call), then routes to
   the Gemini client, and finally to the rich local fallback. The pieces live
   in ./assistant/*:
     text        — intent stripping, fuzzy/concept matching primitives
     subjects    — formula catalogs, labels, localization
     courseGraph — auto-derived concept knowledge graph (graph/keyword RAG)
     context     — Gemini context block + navigation link chips
     gemini      — Gemini API client
     intents     — instant intent detectors
     fallback    — detailed offline responses
   ============================================ */

import { theoryData } from '../data/theory';
import { problemsData } from '../data/problems';
import {
  getAllFormulasFlat, formulasBySubject,
  getAllFormulas, getAllChemFormulas, getAllBioFormulas,
  getSubjectEmoji, getSubjectLabel
} from './assistant/subjects';
import { matchConcept } from './assistant/courseGraph';
import { extractLinks, buildConceptLinks, mergeLinks } from './assistant/context';
import { callGemini, geminiConfigured } from './assistant/gemini';
import {
  detectHelpIntent, detectListIntent, detectThanksIntent, detectSubjectIntent
} from './assistant/intents';
import { localFallback } from './assistant/fallback';

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
      const fBySubject = formulasBySubject(subj);
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
    const fBySubject = formulasBySubject(pureSubject);
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

  if (geminiConfigured()) {
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
