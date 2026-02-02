import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LanguageInfo } from "@/lib/languageTypes";

/**
 * Fetches all languages from the database.
 * Returns empty array if DB fails (app can use static fallback).
 */
export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data ?? []).map(
        (row): LanguageInfo & { id: string; slug: string; coverImage: string | null; isAvailable: boolean } => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          nativeName: row.native_name ?? row.name,
          speakers: row.speakers ?? "",
          regions: row.regions ?? [],
          description: row.description ?? "",
          history: row.history ?? "",
          funFacts: row.fun_facts ?? [],
          coverImage: row.cover_image,
          isAvailable: row.is_available,
        })
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
