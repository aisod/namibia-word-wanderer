import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CategoryInfo } from "@/lib/languageTypes";

/**
 * Fetches categories for a language from the database.
 */
export function useCategories(languageId: string | undefined) {
  return useQuery({
    queryKey: ["categories", languageId],
    queryFn: async () => {
      if (!languageId) return [];

      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("language_id", languageId)
        .order("sort_order", { ascending: true });

      if (catError) throw catError;

      const { data: vocabCounts, error: countError } = await supabase
        .from("vocabulary")
        .select("category")
        .eq("language_id", languageId);

      if (countError) throw countError;

      const countByCategory: Record<string, number> = {};
      (vocabCounts ?? []).forEach((v) => {
        countByCategory[v.category] = (countByCategory[v.category] ?? 0) + 1;
      });

      return (categoriesData ?? []).map(
        (row): CategoryInfo => ({
          id: row.slug,
          name: row.name,
          icon: row.icon ?? "📚",
          count: countByCategory[row.slug] ?? 0,
        })
      );
    },
    enabled: !!languageId,
    staleTime: 5 * 60 * 1000,
  });
}
