import { LOCAL_LANGUAGES, getLocalLanguage } from "../data/languageCatalog";
export const SITE_URL = "https://play.aisod.tech";
export const SEO_IMAGE = `${SITE_URL}/app-icon-512.png`;
export const PUBLIC_PATHS = ["/", ...LOCAL_LANGUAGES.flatMap(l => ["language", "games", "words"].map(section => `/${section}/${l.slug}`))];
export function pageMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const match = /^\/(language|games|words)\/([^/]+)$/.exec(path);
  const language = match ? getLocalLanguage(match[2]) : undefined;
  const canonicalPath = language && match ? `/${match[1]}/${language.slug}` : path;
  let title = "NAMQULA | Learn African Languages Through Play";
  let description = "Learn Oshikwanyama, Oshindonga, Otjiherero, Khoekhoegowab, Chokwe and Rukwangali with vocabulary games. Play online or install for offline practice.";
  if (language && match) {
    const label = match[1] === "language" ? "Language, History & Culture" : match[1] === "words" ? "Words & Phrases" : "Vocabulary Games";
    title = `${language.name} ${label} | NAMQULA`;
    description = match[1] === "language" ? `Discover ${language.name}: its history, culture and where it is spoken. Explore ${language.wordCount} words and phrases, then learn through play with NAMQULA.` : match[1] === "words" ? `Explore ${language.wordCount} ${language.name} words and phrases with English meanings. Search by topic, practise flashcards and review words with NAMQULA.` : `Learn ${language.name} with flashcards, word matching, quizzes and word search. Practise ${language.wordCount} words and phrases online or save NAMQULA for offline play.`;
  }
  const indexable = path === "/" || !!language;
  if (!indexable) title = path === "/community" ? "Community | NAMQULA" : path.startsWith("/admin") ? "Administration | NAMQULA" : "Page Not Found | NAMQULA";
  const url = SITE_URL + canonicalPath;
  const data = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "AISOD", url: "https://aisod.tech" },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "NAMQULA", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` }, inLanguage: "en" },
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, inLanguage: "en", isPartOf: { "@id": `${SITE_URL}/#website` }, ...(language ? { about: { "@type": "Language", name: language.name }, breadcrumb: { "@id": `${url}#breadcrumb` } } : {}) },
    ...(language ? [{ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "NAMQULA", item: SITE_URL + "/" }, { "@type": "ListItem", position: 2, name: title.split(" | ")[0], item: url }] }] : []),
  ] };
  return { title, description, url, indexable, data, language, section: match?.[1] };
}
