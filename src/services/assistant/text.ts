/* ============================================
   Text / NLP utilities for the assistant
   Intent stripping, tolerant concept matching, fuzzy search.
   ============================================ */

import { search } from '../search';
import type { SearchHit } from '../../types/domain';

// Intent words to strip before searching
export const INTENT_WORDS_UK = [
  'що таке', 'що це', 'поясни', 'розкажи про', 'як працює', 'як обчислити',
  'як порахувати', 'як знайти', 'формула для', 'закон', 'рівняння', 'визначення',
  'опиши', 'допоможи з', 'розв\'яжи', 'як розв\'язати', 'покажи', 'знайди',
  'скільки', 'яка', 'який', 'яке', 'чому'
];

export const INTENT_WORDS_EN = [
  'what is', 'what are', 'explain', 'tell me about', 'how does', 'how to calculate',
  'how to compute', 'how to find', 'formula for', 'law of', 'equation for', 'define',
  'describe', 'help with', 'solve', 'how to solve', 'show me', 'find',
  'how much', 'how many', 'why', 'what'
];

// Strip intent words to get the core search query
export function extractSearchQuery(query: string): string {
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
export function smartSearch(query: string): SearchHit[] {
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

// Normalize for tolerant concept matching: lowercase, drop punctuation and
// apostrophes, fold ё→е, collapse whitespace.
export function normalizeConcept(s: string): string {
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
export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur: number[] = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[n];
}

export function similarity(a: string, b: string): number {
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - levenshtein(a, b) / max;
}

// Leading discourse fillers that bury the real subject ("А що таке…",
// "Ну поясни…"). Stripped before intent words so "А що таке стала Авогадро"
// reduces to "стала авогадро".
export const FILLER_WORDS = [
  'а', 'і', 'й', 'та', 'ну', 'от', 'ось', 'тож', 'отже', 'тобто',
  'well', 'so', 'and', 'hmm', 'ок', 'окей', 'ok', 'okay', 'hey', 'гей'
];

// Reduce a query to its bare subject for concept matching: strip a leading
// run of fillers and intent phrases (looped, anywhere a prefix matches), so
// the typo-tolerant comparison sees just the topic.
export function conceptCore(query: string): string {
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
