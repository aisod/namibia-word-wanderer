import type { LanguageInfo } from "@/lib/languageTypes";
export interface CatalogLanguage extends LanguageInfo {
  id: string; slug: string; coverImage: string; isAvailable: boolean; wordCount: number;
}
export const LOCAL_LANGUAGES: CatalogLanguage[] = [
  { id: "local-kua", slug: "oshikwanyama", name: "Oshikwanyama", nativeName: "Oshiwambo · Oshikwanyama", speakers: "", regions: ["Namibia", "Angola"], coverImage: "/oshiwambo.png", isAvailable: true, wordCount: 111,
    description: "Practise Oshikwanyama with a separate source-backed vocabulary pack adapted from Hai ti! — A Beginner’s Guide to Oshikwanyama.",
    history: "Oshikwanyama and Oshindonga are distinct written varieties of Oshiwambo. Their word lists and learning progress belong to separate courses.",
    funFacts: ["This course keeps complete forms and the source’s spelling.", "Family words can depend on whose relative is being described."] },
  { id: "local-ndo", slug: "oshindonga", name: "Oshindonga", nativeName: "Oshiwambo · Oshindonga", speakers: "", regions: ["Northern Namibia"], coverImage: "/oshiwambo.png", isAvailable: true, wordCount: 96,
    description: "Learn Oshindonga, one of the written varieties of Oshiwambo. This starter pack uses selected entries from AISOD’s local English–Oshindonga dictionary.",
    history: "Oshindonga and Oshikwanyama are distinct written varieties. This course labels its source variety explicitly.", funFacts: ["This starter pack has source links for every entry.", "Dictionary words can have different meanings in different contexts."] },
  { id: "local-her", slug: "otjiherero", name: "Otjiherero", nativeName: "Otjiherero", speakers: "", regions: ["Namibia"], coverImage: "/herero.jpg", isAvailable: true, wordCount: 12,
    description: "An introductory vocabulary pack using the Herero sections of English Wiktionary. This is a small starter set, not a complete course.", history: "More words, examples and recordings can be added as they are reviewed.", funFacts: ["Noun prefixes carry grammatical information.", "Source-backed entries remain open to speaker corrections."] },
  { id: "local-naq", slug: "khoekhoegowab", name: "Khoekhoegowab", nativeName: "Khoekhoegowab", speakers: "", regions: ["Namibia"], coverImage: "/khoikhoi.jpg", isAvailable: true, wordCount: 44,
    description: "A starter vocabulary pack adapted from Wiktionary’s Khoekhoe Swadesh list. Click letters and vowel marks are preserved.", history: "The pack selects standalone forms and excludes the list’s abbreviated noun endings and optional-letter notation.", funFacts: ["ǀ, ǁ, ǃ and ǂ are letters, not punctuation.", "Vowel marks are part of the spelling."] },
  { id: "local-cjk", slug: "chokwe", name: "Chokwe", nativeName: "Chokwe", speakers: "", regions: ["Angola", "DR Congo", "Zambia"], coverImage: "/placeholder.svg", isAvailable: true, wordCount: 24,
    description: "A small Chokwe starter pack drawn from published noun-class and orthography examples. Tone marks and vowel length are retained.", history: "This starter set has source links for each entry. More vocabulary can be added through speaker review.", funFacts: [] },
  { id: "local-kwn", slug: "rukwangali", name: "Rukwangali", nativeName: "Rukwangali", speakers: "", regions: ["Namibia", "Angola"], coverImage: "/placeholder.svg", isAvailable: true, wordCount: 24,
    description: "A small Rukwangali starter pack adapted from Counting animals, translated by Djaupyu Siteketa. Plural animals and number-agreement contexts stay explicit.", history: "This starter set has source links for each entry. More vocabulary can be added through speaker review.", funFacts: [] },
];
export const resolveLanguageSlug = (slug?: string) => slug === "kwangari" || slug === "kwangali" ? "rukwangali" : slug;
export const getLocalLanguage = (slug?: string) => LOCAL_LANGUAGES.find(l => l.slug === resolveLanguageSlug(slug));
