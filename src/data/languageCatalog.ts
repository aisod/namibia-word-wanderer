import type { LanguageInfo } from "@/lib/languageTypes";
import { CONTENT_RELEASE } from "./contentRelease";
export interface CatalogLanguage extends LanguageInfo {
  id: string; slug: string; coverImage: string; isAvailable: boolean; wordCount: number;
}
import { LANGUAGE_PROFILES } from "./languageProfiles";
const languageDefinitions: CatalogLanguage[] = [
  { id: "local-kua", slug: "oshikwanyama", name: "Oshikwanyama", nativeName: "Oshiwambo · Oshikwanyama", speakers: "", coverImage: "/oshiwambo.png", isAvailable: true, wordCount: 111,
    ...LANGUAGE_PROFILES.oshikwanyama },
  { id: "local-ndo", slug: "oshindonga", name: "Oshindonga", nativeName: "Oshiwambo · Oshindonga", speakers: "", coverImage: "/oshiwambo.png", isAvailable: true, wordCount: 96,
    ...LANGUAGE_PROFILES.oshindonga },
  { id: "local-her", slug: "otjiherero", name: "Otjiherero", nativeName: "Otjiherero", speakers: "", coverImage: "/herero.jpg", isAvailable: true, wordCount: 12,
    ...LANGUAGE_PROFILES.otjiherero },
  { id: "local-naq", slug: "khoekhoegowab", name: "Khoekhoegowab", nativeName: "Khoekhoegowab", speakers: "", coverImage: "/khoikhoi.jpg", isAvailable: true, wordCount: 44,
    ...LANGUAGE_PROFILES.khoekhoegowab },
  { id: "local-cjk", slug: "chokwe", name: "Chokwe", nativeName: "Chokwe", speakers: "", coverImage: "", isAvailable: true, wordCount: 24,
    ...LANGUAGE_PROFILES.chokwe },
  { id: "local-kwn", slug: "rukwangali", name: "Rukwangali", nativeName: "Rukwangali", speakers: "", coverImage: "", isAvailable: true, wordCount: 24,
    ...LANGUAGE_PROFILES.rukwangali },
];
export const LOCAL_LANGUAGES = languageDefinitions.map(language => ({ ...language, wordCount: CONTENT_RELEASE.packs[language.slug as keyof typeof CONTENT_RELEASE.packs] }));
export const resolveLanguageSlug = (slug?: string) => slug === "kwangari" || slug === "kwangali" ? "rukwangali" : slug;
export const getLocalLanguage = (slug?: string) => LOCAL_LANGUAGES.find(l => l.slug === resolveLanguageSlug(slug));
