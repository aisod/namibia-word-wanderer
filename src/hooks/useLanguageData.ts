import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguages } from "./useLanguages";
import { useVocabulary } from "./useVocabulary";
import { getLocalLanguage, resolveLanguageSlug } from "@/data/languageCatalog";
import { shuffle, uniqueVocabulary } from "@/lib/vocabularyUtils";
import { readPractice, wordPractice } from "@/lib/learningProgress";
import { CONTENT_RELEASE } from "@/data/contentRelease";
import type { VocabularyItem, CategoryInfo } from "@/lib/languageTypes";
const EMPTY: VocabularyItem[] = [];
const extraCategoryNames: Record<string,string>={school:"School & learning",time:"Days & time",travel:"Travel & places",phrases:"Useful phrases"};
const categoryNames: Record<string, string> = { people: "People", animals: "Animals", body: "Body", family: "People & family", nature: "Nature", food: "Food", numbers: "Numbers", verbs: "Actions", everyday: "Everyday words", qualities: "Describing things", pronouns: "Pronouns", greetings: "Greetings", household: "Home & cooking", clothing: "Clothing" };
export function useLanguageData(languageSlug: string | undefined) {
  const slug = resolveLanguageSlug(languageSlug);
  const local = getLocalLanguage(slug);
  const playableLocal = local?.isAvailable ? local : undefined;
  const { data: languages, isLoading: loadingLanguages, error: languageError } = useLanguages(!local);
  const language = local ?? languages?.find(l => l.slug === slug);
  const database = useVocabulary(local ? undefined : language?.id);
  const pack = useQuery({
    queryKey: ["language-pack", slug, CONTENT_RELEASE.release], enabled: !!playableLocal,
    queryFn: async ({ signal }) => {
      const response = await fetch(`/data/${local!.slug}.json`, { signal });
      if (!response.ok) throw new Error("Vocabulary could not be loaded. Please try again.");
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(v => typeof v.id === "string" && typeof v.english === "string" && typeof v.oshikwanyama === "string" && typeof v.category === "string")) throw new Error("Invalid vocabulary pack");
      return data as VocabularyItem[];
    }, staleTime: Infinity, gcTime: 24 * 60 * 60 * 1000, retry: 1,
  });
  const allVocabulary = useMemo(() => uniqueVocabulary((local ? pack.data : database.data) ?? EMPTY), [local, pack.data, database.data]);
  // Count the data already loaded; do not download the vocabulary a second time.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    allVocabulary.forEach(v => counts.set(v.category, (counts.get(v.category) ?? 0) + 1));
    return Array.from(counts, ([id, count]): CategoryInfo => ({ id, name: categoryNames[id] ?? extraCategoryNames[id] ?? id, icon: "📚", count }));
  }, [allVocabulary]);
  const getVocabularyByCategory = (id: string) => id === "all" ? allVocabulary : allVocabulary.filter(v => v.category === id);
  return { languageInfo: language ?? null, allVocabulary, categories, getVocabularyByCategory,
    getRandomVocabulary: (count: number, category?: string) => {
      const words=shuffle(category ? getVocabularyByCategory(category) : allVocabulary), practice=readPractice(slug??""), now=Date.now();
      const rank=(word: VocabularyItem)=>{const p=wordPractice(word,practice);return p ? p.due<=now ? 0 : 2 : 1;};
      return words.sort((a,b)=>rank(a)-rank(b)).slice(0,count);
    },
    getReviewVocabulary: (count: number, category?: string) => {
      const practice=readPractice(slug??""), now=Date.now();
      return shuffle(category ? getVocabularyByCategory(category) : allVocabulary).filter(w=>(wordPractice(w,practice)?.due??Infinity)<=now).slice(0,count);
    },
    isLoading: local ? pack.isLoading : loadingLanguages || (!!language && database.isLoading),
    error: local ? pack.error : languageError ?? database.error,
    retry: () => local ? pack.refetch() : database.refetch(),
    useFallback: false, languageId: language?.id,
  };
}
