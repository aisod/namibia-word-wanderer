import type { VocabularyItem } from "./languageTypes";
export const normalizeAnswer = (s: string) => s.normalize("NFC").trim().toLocaleLowerCase();
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
// Matching and reverse quizzes require a one-to-one set of prompts and answers.
export function uniqueVocabulary(items: VocabularyItem[]): VocabularyItem[] {
  const english = new Set<string>(); const native = new Set<string>();
  return items.filter(item => {
    const en = normalizeAnswer(item.english); const word = normalizeAnswer(item.oshikwanyama);
    if (!en || !word || english.has(en) || native.has(word)) return false;
    english.add(en); native.add(word); return true;
  });
}
// Retain tone marks and click letters. Never transliterate a learner’s target word.
export function gridLetters(word: string): string[] {
  return Array.from(word.normalize("NFC").toLocaleUpperCase()).filter(c => /[\p{L}\p{M}ǀǁǃǂ]/u.test(c));
}
export function makeOptions(word: VocabularyItem, vocabulary: VocabularyItem[], toNative: boolean): string[] {
  const answer = toNative ? word.oshikwanyama : word.english;
  const choices = shuffle(vocabulary).map(w => toNative ? w.oshikwanyama : w.english)
    .filter(s => normalizeAnswer(s) !== normalizeAnswer(answer));
  return shuffle([answer, ...Array.from(new Set(choices)).slice(0, 3)]);
}
