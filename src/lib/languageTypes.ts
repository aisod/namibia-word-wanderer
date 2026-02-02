/**
 * Shared types for language and vocabulary data.
 * Used by both static fallback and database-backed data.
 */

export interface VocabularyItem {
  id: string;
  english: string;
  oshikwanyama: string; // native translation (kept for backward compatibility)
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface LanguageInfo {
  name: string;
  nativeName: string;
  speakers: string;
  regions: string[];
  description: string;
  history: string;
  funFacts: string[];
  coverImage?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export type AppRole = "admin" | "moderator" | "language_register";
