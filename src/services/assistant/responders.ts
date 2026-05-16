/* ============================================
   Responder chain (strategy / chain-of-responsibility)

   processMessage is just "run the query through an ordered list of
   responders; first one that owns it wins". Each responder is
   (query, isUk) => partial response | null:
     - return null  → "not mine", try the next responder
     - return {...} → this is the answer; the loop stops here

   Only `text` is required on a response; finalizeResponse() fills in the
   `links`/`suggestions` shape so handlers declare only what's non-default.
   Order matters: cheapest / most specific first, AI catch-all last. Adding
   an intent = write a function and slot it into RESPONDERS.
   ============================================ */

import { theoryData } from '@/data/theory';
import { problemsData } from '@/data/problems';
import {
  getAllFormulasFlat, formulasBySubject,
  getAllFormulas, getAllChemFormulas, getAllBioFormulas,
  getSubjectEmoji, getSubjectLabel
} from './subjects';
import { matchConcept } from './courseGraph';
import { extractLinks, buildConceptLinks, mergeLinks } from './context';
import { callGemini, geminiConfigured } from './gemini';
import {
  detectHelpIntent, detectListIntent, detectThanksIntent, detectSubjectIntent
} from './intents';
import { localFallback } from './fallback';
import type {
  AssistantResponse, Responder, ResponderResult
} from '@/types/domain';

const GREETING_RE = /^(?:привіт|hello|hi|hey|вітаю|добрий|доброго|good|здрастуй|здоров)/i;

// Normalize any responder's partial result into the full response contract.
export function finalizeResponse(partial: ResponderResult): AssistantResponse {
  return {
    text: partial.text,
    links: partial.links ?? [],
    suggestions: partial.suggestions ?? []
  };
}

// --- Instant responders (no API call) ---------------------------------------

function greeting(query: string, isUk: boolean): ResponderResult | null {
  if (!GREETING_RE.test(query)) return null;
  const allFormulas = getAllFormulasFlat();
  return {
    text: isUk
      ? `👋 Привіт! Я — **SciLearn AI** на базі Google Gemini. Я знаю всі ${allFormulas.length} формул, ${theoryData.length} теоретичних статей та ${problemsData.length} задач на платформі. Запитуйте що завгодно!`
      : `👋 Hi! I'm **SciLearn AI** powered by Google Gemini. I know all ${allFormulas.length} formulas, ${theoryData.length} theory articles, and ${problemsData.length} problems on the platform. Ask me anything!`,
    suggestions: isUk
      ? ['Поясни закон Ома', 'Як обчислити pH?', 'Що таке E=mc²?']
      : ["Explain Ohm's law", 'How to calculate pH?', 'What is E=mc²?']
  };
}

function help(query: string, isUk: boolean): ResponderResult | null {
  if (!detectHelpIntent(query)) return null;
  const allFormulas = getAllFormulasFlat();
  return {
    text: isUk
      ? `🤖 Ось що я вмію:\n\n• **Формули** — знайду будь-яку з ${allFormulas.length} формул та поясню її\n• **Теорія** — розкажу про теоретичні матеріали (${theoryData.length} статей)\n• **Задачі** — допоможу знайти приклади розв'язків (${problemsData.length} задач)\n• **Калькулятор** — підкажу, де обчислити значення\n\nПросто напишіть назву формули, теми або запитання!`
      : `🤖 Here's what I can do:\n\n• **Formulas** — find any of ${allFormulas.length} formulas and explain them\n• **Theory** — explain theoretical materials (${theoryData.length} articles)\n• **Problems** — help find example solutions (${problemsData.length} problems)\n• **Calculator** — point you to the right calculator\n\nJust type a formula name, topic, or question!`,
    suggestions: isUk
      ? ['Закон Ома', 'Що таке pH?', 'Задачі з біології']
      : ["Ohm's law", 'What is pH?', 'Biology problems']
  };
}

function thanks(query: string, isUk: boolean): ResponderResult | null {
  if (!detectThanksIntent(query)) return null;
  return {
    text: isUk
      ? '😊 Будь ласка! Якщо є ще питання — запитуйте, я завжди готовий допомогти!'
      : "😊 You're welcome! If you have more questions, feel free to ask!",
    suggestions: isUk
      ? ['Що таке E=mc²?', 'Формули хімії', 'Задачі з фізики']
      : ['What is E=mc²?', 'Chemistry formulas', 'Physics problems']
  };
}

function list(query: string, isUk: boolean): ResponderResult | null {
  if (!detectListIntent(query)) return null;

  const subj = detectSubjectIntent(query);
  if (subj) {
    const fBySubject = formulasBySubject(subj);
    const names = fBySubject.slice(0, 10).map(f => `• ${isUk ? f.name : f.nameEn}`).join('\n');
    return {
      text: `${getSubjectEmoji(subj)} **${getSubjectLabel(subj, isUk)}** — ${fBySubject.length} ${isUk ? 'формул' : 'formulas'}:\n\n${names}${fBySubject.length > 10 ? `\n\n...${isUk ? 'та ще' : 'and'} ${fBySubject.length - 10} ${isUk ? 'більше' : 'more'}` : ''}`,
      links: [{ type: 'subject', id: subj, label: isUk ? 'Переглянути всі' : 'View all' }]
    };
  }

  return {
    text: isUk
      ? `📊 На платформі доступно:\n\n• ⚛️ Фізика — ${getAllFormulas().length} формул\n• 🧪 Хімія — ${getAllChemFormulas().length} формул\n• 🧬 Біологія — ${getAllBioFormulas().length} формул\n• 📖 ${theoryData.length} теоретичних статей\n• 📝 ${problemsData.length} прикладів задач\n\nОберіть предмет для деталей!`
      : `📊 Available on the platform:\n\n• ⚛️ Physics — ${getAllFormulas().length} formulas\n• 🧪 Chemistry — ${getAllChemFormulas().length} formulas\n• 🧬 Biology — ${getAllBioFormulas().length} formulas\n• 📖 ${theoryData.length} theory articles\n• 📝 ${problemsData.length} problem examples\n\nPick a subject for details!`,
    suggestions: isUk
      ? ['Формули фізики', 'Формули хімії', 'Формули біології']
      : ['Physics formulas', 'Chemistry formulas', 'Biology formulas']
  };
}

function pureSubject(query: string, isUk: boolean): ResponderResult | null {
  const subj = detectSubjectIntent(query);
  if (!subj || query.length >= 15) return null;

  const fBySubject = formulasBySubject(subj);
  const topics = [...new Set(fBySubject.map(f => f.topic))].filter(Boolean);
  return {
    text: `${getSubjectEmoji(subj)} **${getSubjectLabel(subj, isUk)}**\n\n${isUk ? 'Доступно' : 'Available'}: ${fBySubject.length} ${isUk ? 'формул' : 'formulas'} ${isUk ? 'з' : 'in'} ${topics.length} ${isUk ? 'тем' : 'topics'}:\n${topics.map(t => `• ${t}`).join('\n')}\n\n${isUk ? 'Запитайте конкретну формулу або тему!' : 'Ask about a specific formula or topic!'}`,
    links: [{ type: 'subject', id: subj, label: isUk ? 'Відкрити предмет' : 'Open subject' }],
    suggestions: isUk
      ? [`Формули ${getSubjectLabel(subj, true).toLowerCase()}`]
      : [`${getSubjectLabel(subj, false)} formulas`]
  };
}

// --- Terminal responder: Gemini, then rich local fallback -------------------
// Always returns a response, so the chain never falls through.

async function aiOrFallback(query: string, isUk: boolean): Promise<ResponderResult> {
  // Navigation links: search hits first, then curated concept-graph links so
  // a topic like "стала Авогадро" still surfaces its connected materials
  // (mole, molarity, ideal-gas law) even with no direct search hit.
  const conceptMatch = matchConcept(query);
  let links = extractLinks(query, isUk);
  if (conceptMatch) {
    links = mergeLinks(links, buildConceptLinks(conceptMatch, isUk));
  }

  if (geminiConfigured()) {
    try {
      const text = await callGemini(query, isUk);
      return { text, links };
    } catch (err) {
      console.warn(
        'Gemini API failed, using local fallback:',
        err instanceof Error ? err.message : err
      );
    }
  }

  const fallback = localFallback(query, isUk);
  return { text: fallback.text, links, suggestions: fallback.suggestions || [] };
}

// Ordered chain. First responder to return non-null answers the query.
export const RESPONDERS: Responder[] = [
  { id: 'greeting', run: greeting },
  { id: 'help', run: help },
  { id: 'thanks', run: thanks },
  { id: 'list', run: list },
  { id: 'pure-subject', run: pureSubject },
  { id: 'ai', run: aiOrFallback } // terminal — never returns null
];
