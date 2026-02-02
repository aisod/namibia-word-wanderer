import { useMemo } from "react";
import { useLanguages } from "./useLanguages";
import { useVocabulary } from "./useVocabulary";
import { useCategories } from "./useCategories";
import {
  oshikwanyamaInfo,
  allVocabulary,
  categories as staticCategories,
  getVocabularyByCategory,
  getRandomVocabulary as getStaticRandomVocabulary,
} from "@/data/oshikwanyamaData";
import type { LanguageInfo, VocabularyItem, CategoryInfo } from "@/lib/languageTypes";

/**
 * Unified language data hook.
 * Fetches from database; falls back to static oshikwanyamaData when DB is empty or fails.
 */
export function useLanguageData(languageSlug: string | undefined) {
  const { data: languages, isLoading: loadingLangs } = useLanguages();
  const language = useMemo(
    () => languages?.find((l) => l.slug === languageSlug),
    [languages, languageSlug]
  );
  const languageId = language?.id;

  const { data: vocabulary = [], isLoading: loadingVocab } = useVocabulary(languageId);
  const { data: categories = [], isLoading: loadingCats } = useCategories(languageId);

  const useFallback = !languageId || vocabulary.length === 0;

  const languageInfo: LanguageInfo | null = useMemo(() => {
    if (!languageSlug) return null;
    if (language && !useFallback) {
      return {
        name: language.name,
        nativeName: language.nativeName,
        speakers: language.speakers,
        regions: language.regions,
        description: language.description,
        history: language.history,
        funFacts: language.funFacts,
        coverImage: language.coverImage ?? "/oshiwambo.png",
      };
    }
    if (languageSlug === "oshikwanyama") return { ...oshikwanyamaInfo, coverImage: "/oshiwambo.png" };
    return null;
  }, [language, languageSlug, useFallback]);

  const allVocab: VocabularyItem[] = useMemo(() => {
    if (useFallback && languageSlug === "oshikwanyama") return allVocabulary;
    return vocabulary;
  }, [vocabulary, useFallback, languageSlug]);

  const cats: CategoryInfo[] = useMemo(() => {
    if (useFallback && languageSlug === "oshikwanyama") return staticCategories;
    return categories;
  }, [categories, useFallback, languageSlug]);

  const getVocabularyByCat = (categoryId: string): VocabularyItem[] => {
    if (useFallback && languageSlug === "oshikwanyama") return getVocabularyByCategory(categoryId);
    return categoryId === "all"
      ? allVocab
      : allVocab.filter((v) => v.category === categoryId);
  };

  const getRandomVocabulary = (count: number, category?: string): VocabularyItem[] => {
    if (useFallback && languageSlug === "oshikwanyama") {
      return getStaticRandomVocabulary(count, category);
    }
    const source = category ? getVocabularyByCat(category) : allVocab;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  return {
    languageInfo,
    allVocabulary: allVocab,
    categories: cats,
    getVocabularyByCategory: getVocabularyByCat,
    getRandomVocabulary,
    isLoading: loadingLangs || loadingVocab || loadingCats,
    useFallback,
    languageId,
  };
}
