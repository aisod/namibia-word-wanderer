import type { VocabularyItem } from "./languageTypes";

export interface WordPractice { attempts: number; correct: number; lastPractised: number; due: number; interval: number; fingerprint: string; }
export type Practice = Record<string, WordPractice>;
const KEY = "namqula-practice-v1";
export const PROGRESS_EVENT = "namqula-practice-changed";
const fingerprint = (word: VocabularyItem) => `${word.english}\n${word.oshikwanyama}`.normalize("NFC");
export function readPractice(language: string): Practice {
  try {
    const saved = JSON.parse(localStorage.getItem(`${KEY}:${language}`) ?? "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([,value]) => {
      const v=value as WordPractice;
      return v && Number.isInteger(v.attempts) && v.attempts>0 && Number.isInteger(v.correct) && v.correct>=0 && v.correct<=v.attempts && Number.isFinite(v.due) && Number.isFinite(v.lastPractised) && Number.isFinite(v.interval) && typeof v.fingerprint==="string";
    })) as Practice;
  } catch { return {}; }
}
export function wordPractice(word: VocabularyItem, practice: Practice) {
  const entry=practice[word.id];
  return entry?.fingerprint===fingerprint(word) ? entry : undefined;
}
export function recordPractice(language: string, word: VocabularyItem, correct: boolean, kind: "recognition" | "self" | "spelling" = "recognition", now = Date.now()) {
  const data=readPractice(language), old=wordPractice(word,data);
  // Self-marking is a review signal, never a permanent mastery certificate.
  const interval=correct ? kind!=="recognition" ? 1 : Math.min(14, Math.max(1,(old?.interval??0)*2+1)) : 0;
  data[word.id]={attempts:(old?.attempts??0)+1,correct:(old?.correct??0)+(correct?1:0),lastPractised:now,due:now+(correct?interval*86400000:300000),interval,fingerprint:fingerprint(word)};
  try { localStorage.setItem(`${KEY}:${language}`,JSON.stringify(data)); window.dispatchEvent(new Event(PROGRESS_EVENT)); return true; } catch { return false; }
}
export function practiceSummary(words: VocabularyItem[], practice: Practice, now=Date.now()) {
  const saved=words.map(w=>wordPractice(w,practice)).filter((p): p is WordPractice=>!!p);
  return { practised:saved.length, due:saved.filter(p=>p.due<=now).length, attempts:saved.reduce((n,p)=>n+p.attempts,0) };
}
