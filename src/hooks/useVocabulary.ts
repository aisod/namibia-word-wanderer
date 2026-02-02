import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { VocabularyItem } from "@/lib/languageTypes";

/**
 * Fetches vocabulary for a language from the database.
 * Maps native_word to oshikwanyama for backward compatibility.
 */
export function useVocabulary(languageId: string | undefined) {
  return useQuery({
    queryKey: ["vocabulary", languageId],
    queryFn: async () => {
      if (!languageId) return [];

      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .eq("language_id", languageId);

      if (error) throw error;

      return (data ?? []).map(
        (row): VocabularyItem => ({
          id: row.id,
          english: row.english,
          oshikwanyama: row.native_word,
          category: row.category,
          difficulty: row.difficulty,
        })
      );
    },
    enabled: !!languageId,
    staleTime: 5 * 60 * 1000,
  });
}
