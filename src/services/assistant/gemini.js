/* ============================================
   Gemini client — calls the API with platform content as context
   ============================================ */

import { theoryData } from '../../data/theory';
import { problemsData } from '../../data/problems';
import { buildPlatformContext, findRelevantContent } from './context';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Whether a usable API key is configured (vs. missing/placeholder).
export function geminiConfigured() {
  return Boolean(GEMINI_API_KEY) && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';
}

// Call Gemini API
export async function callGemini(userMessage, isUk) {
  const { formulaList, theoryList, problemList, topicOutline, totalFormulas } = buildPlatformContext(isUk);
  const relevantContent = findRelevantContent(userMessage, isUk);

  const lang = isUk ? 'Ukrainian' : 'English';

  const systemPrompt = `You are SciLearn AI — a friendly, knowledgeable science tutor for a learning platform covering Physics, Chemistry and Biology.

HOW TO ANSWER:
1. ALWAYS respond in ${lang}.
2. Answer the student's ACTUAL question first, directly and clearly, using your own knowledge.
3. For broad or conceptual questions (e.g. "what is physics?", "why does X happen?", "what is energy?"), give a clear GENERAL explanation in plain language, framed by the scope the platform actually teaches (see COURSE TOPIC MAP). Do NOT jump to a single specific formula unless the student explicitly asked for one.
4. Bring up a specific platform formula/topic/problem ONLY when it genuinely helps answer THIS question. When you do, name it and say the student can open it on the platform. Never force an unrelated formula into the answer. If a "CONNECTED PLATFORM MATERIALS" block is provided below, the question is about a concept the course covers across those materials — build the explanation by SYNTHESIZING them: explain how they relate, ground every claim in what those materials show (don't pad with facts the platform doesn't cover), and point the student to each one so they see the bigger picture.
5. Keep it concise: 3-6 sentences for simple questions, a little more for explanations. Move from the general idea to specifics, not the other way around.
6. Write formulas in LaTeX wrapped in $$...$$. Show calculation steps clearly when solving a problem.
7. Be encouraging and educational. Use at most 1-2 emoji. Use **bold** for emphasis; do NOT use markdown headers (#).
8. If something isn't on the platform, still answer from your knowledge.

The COURSE TOPIC MAP below is the exact scope this platform teaches — treat it as the boundary of "what the course covers". The catalog after it is the platform's library — use it ONLY to point students to relevant materials, NOT as the source of your answer and NOT something to recite.

COURSE TOPIC MAP (subjects → topics → subtopics the platform actually teaches):
${topicOutline}

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
