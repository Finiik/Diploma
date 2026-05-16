import { useState } from 'react';

/** Anything filterable by subject + numeric difficulty (theory & problems). */
export interface Filterable {
  subject: string;
  difficulty: number;
}

/**
 * Owns the subject + difficulty filter state and applies the predicate that
 * Theory and Problems each used to hand-roll. `'all'` means no constraint;
 * difficulty filter values are the stringified levels (`'1'..'3'`).
 */
export function useContentFilters<T extends Filterable>(items: T[]) {
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const filtered = items.filter(
    it =>
      (subject === 'all' || it.subject === subject) &&
      (difficulty === 'all' || it.difficulty === Number(difficulty))
  );

  return { subject, setSubject, difficulty, setDifficulty, filtered };
}
