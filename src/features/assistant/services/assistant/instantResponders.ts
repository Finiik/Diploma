/* ============================================
   Instant responders — the no-API-call links in the chain.

   Each is (query, isUk) => partial response | null:
     - return null  → "not mine", let the next responder try
     - return {...}  → this is the answer

   This module owns only WHAT each instant intent says; the chain wiring,
   normalization and the terminal AI/fallback responder live in
   responders.ts.
   ============================================ */

import {
  platformStats,
  formulasBySubject,
  getSubjectEmoji,
  getSubjectLabel
} from './subjects';
import {
  detectHelpIntent,
  detectListIntent,
  detectThanksIntent,
  detectSubjectIntent
} from './intents';
import {
  SUBJECT_FORMULA_LIST_LIMIT,
  MAX_PURE_SUBJECT_QUERY_LENGTH
} from './constants';
import type { ResponderResult } from '@/features/assistant/types';

const GREETING_RE =
  /^(?:привіт|hello|hi|hey|вітаю|добрий|доброго|good|здрастуй|здоров)/i;

export function greeting(query: string, isUk: boolean): ResponderResult | null {
  if (!GREETING_RE.test(query)) return null;
  const s = platformStats();
  return {
    text: isUk
      ? `👋 Привіт! Я — **SciLearn AI** на базі Google Gemini. Я знаю всі ${s.formulas} формул, ${s.theory} теоретичних статей та ${s.problems} задач на платформі. Запитуйте що завгодно!`
      : `👋 Hi! I'm **SciLearn AI** powered by Google Gemini. I know all ${s.formulas} formulas, ${s.theory} theory articles, and ${s.problems} problems on the platform. Ask me anything!`,
    suggestions: isUk
      ? ['Поясни закон Ома', 'Як обчислити pH?', 'Що таке E=mc²?']
      : ["Explain Ohm's law", 'How to calculate pH?', 'What is E=mc²?']
  };
}

export function help(query: string, isUk: boolean): ResponderResult | null {
  if (!detectHelpIntent(query)) return null;
  const s = platformStats();
  return {
    text: isUk
      ? `🤖 Ось що я вмію:\n\n• **Формули** — знайду будь-яку з ${s.formulas} формул та поясню її\n• **Теорія** — розкажу про теоретичні матеріали (${s.theory} статей)\n• **Задачі** — допоможу знайти приклади розв'язків (${s.problems} задач)\n• **Калькулятор** — підкажу, де обчислити значення\n\nПросто напишіть назву формули, теми або запитання!`
      : `🤖 Here's what I can do:\n\n• **Formulas** — find any of ${s.formulas} formulas and explain them\n• **Theory** — explain theoretical materials (${s.theory} articles)\n• **Problems** — help find example solutions (${s.problems} problems)\n• **Calculator** — point you to the right calculator\n\nJust type a formula name, topic, or question!`,
    suggestions: isUk
      ? ['Закон Ома', 'Що таке pH?', 'Задачі з біології']
      : ["Ohm's law", 'What is pH?', 'Biology problems']
  };
}

export function thanks(query: string, isUk: boolean): ResponderResult | null {
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

export function list(query: string, isUk: boolean): ResponderResult | null {
  if (!detectListIntent(query)) return null;

  const subj = detectSubjectIntent(query);
  if (subj) {
    const fBySubject = formulasBySubject(subj);
    const names = fBySubject
      .slice(0, SUBJECT_FORMULA_LIST_LIMIT)
      .map((f) => `• ${isUk ? f.name : f.nameEn}`)
      .join('\n');
    return {
      text: `${getSubjectEmoji(subj)} **${getSubjectLabel(subj, isUk)}** — ${fBySubject.length} ${isUk ? 'формул' : 'formulas'}:\n\n${names}${fBySubject.length > SUBJECT_FORMULA_LIST_LIMIT ? `\n\n...${isUk ? 'та ще' : 'and'} ${fBySubject.length - SUBJECT_FORMULA_LIST_LIMIT} ${isUk ? 'більше' : 'more'}` : ''}`,
      links: [
        {
          type: 'subject',
          id: subj,
          label: isUk ? 'Переглянути всі' : 'View all'
        }
      ]
    };
  }

  const s = platformStats();
  return {
    text: isUk
      ? `📊 На платформі доступно:\n\n• ⚛️ Фізика — ${s.byKind.physics} формул\n• 🧪 Хімія — ${s.byKind.chemistry} формул\n• 🧬 Біологія — ${s.byKind.biology} формул\n• 📖 ${s.theory} теоретичних статей\n• 📝 ${s.problems} прикладів задач\n\nОберіть предмет для деталей!`
      : `📊 Available on the platform:\n\n• ⚛️ Physics — ${s.byKind.physics} formulas\n• 🧪 Chemistry — ${s.byKind.chemistry} formulas\n• 🧬 Biology — ${s.byKind.biology} formulas\n• 📖 ${s.theory} theory articles\n• 📝 ${s.problems} problem examples\n\nPick a subject for details!`,
    suggestions: isUk
      ? ['Формули фізики', 'Формули хімії', 'Формули біології']
      : ['Physics formulas', 'Chemistry formulas', 'Biology formulas']
  };
}

export function pureSubject(
  query: string,
  isUk: boolean
): ResponderResult | null {
  const subj = detectSubjectIntent(query);
  if (!subj || query.length >= MAX_PURE_SUBJECT_QUERY_LENGTH) return null;

  const fBySubject = formulasBySubject(subj);
  const topics = [...new Set(fBySubject.map((f) => f.topic))].filter(Boolean);
  return {
    text: `${getSubjectEmoji(subj)} **${getSubjectLabel(subj, isUk)}**\n\n${isUk ? 'Доступно' : 'Available'}: ${fBySubject.length} ${isUk ? 'формул' : 'formulas'} ${isUk ? 'з' : 'in'} ${topics.length} ${isUk ? 'тем' : 'topics'}:\n${topics.map((t) => `• ${t}`).join('\n')}\n\n${isUk ? 'Запитайте конкретну формулу або тему!' : 'Ask about a specific formula or topic!'}`,
    links: [
      {
        type: 'subject',
        id: subj,
        label: isUk ? 'Відкрити предмет' : 'Open subject'
      }
    ],
    suggestions: isUk
      ? [`Формули ${getSubjectLabel(subj, true).toLowerCase()}`]
      : [`${getSubjectLabel(subj, false)} formulas`]
  };
}
