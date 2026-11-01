import { LOCAL_LANGUAGES } from "@/data/languageCatalog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogLanguage } from "@/data/languageCatalog";

/**
 * Fetches all languages from the database.
 * Returns empty array if DB fails (app can use static fallback).
 */
export function useLanguages(enabled = true) {
  return useQuery({
    queryKey: ["languages"],
    enabled,
    initialData: LOCAL_LANGUAGES,
    retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      const remote = (data ?? []).filter(row => !["oshikwanyama", ...LOCAL_LANGUAGES.map(l => l.slug)].includes(row.slug)).map(
        (row): CatalogLanguage => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          nativeName: row.native_name ?? row.name,
          speakers: row.speakers ?? "",
          regions: row.regions ?? [],
          description: row.description ?? "",
          history: row.history ?? "",
          funFacts: row.fun_facts ?? [],
          coverImage: row.cover_image ?? "/oshiwambo.png",
          wordCount: 0,
          isAvailable: row.is_available,
        })
      );
      return [...LOCAL_LANGUAGES, ...remote];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

