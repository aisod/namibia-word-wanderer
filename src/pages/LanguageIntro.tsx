import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Globe, MapPin, Sparkles } from "lucide-react";
import { useLanguageData } from "@/hooks/useLanguageData";
import { getLocalLanguage } from "@/data/languageCatalog";
import { CorpusLink } from "@/components/CorpusLink";

export default function LanguageIntro() {
  const { languageId } = useParams();
  const { languageInfo, categories, isLoading, error, retry } = useLanguageData(languageId);
  const local = getLocalLanguage(languageId);
  if (!languageInfo) return <div className="content-page"><Link className="text-link" to="/">Back to languages</Link><h1>{isLoading ? "Loading language…" : "Language not found"}</h1></div>;
  const paragraphs = (text: string) => text.split("\n\n").map((p, i) => <p key={i}>{p}</p>);
  return <article className="content-page language-profile">
    <Link className="text-link back-link" to="/#languages"><ArrowLeft aria-hidden="true"/>Language library</Link>
    <header className="profile-hero">
      <p className="eyebrow">{languageInfo.family ?? "Language and heritage"}</p>
      <h1>{languageInfo.name}</h1><p className="profile-native">{languageInfo.nativeName}</p>
      <div className="profile-countries"><MapPin aria-hidden="true"/><span>{languageInfo.regions.join(" · ")}</span></div>
      <Link className="primary-action" to={`/games/${local?.slug ?? languageId}`}>Play in {languageInfo.name}<ArrowRight aria-hidden="true"/></Link>
      <a className="quiet-link" href="#language-story">Explore the language</a>
    </header>
    <div className="profile-reading" id="language-story">
      <section><div className="profile-section-title"><BookOpen aria-hidden="true"/><h2>About the language</h2></div>{paragraphs(languageInfo.description)}</section>
      <section><div className="profile-section-title"><Globe aria-hidden="true"/><h2>History & culture</h2></div>{paragraphs(languageInfo.history)}</section>
      <section><div className="profile-section-title"><MapPin aria-hidden="true"/><h2>Where it’s spoken</h2></div>{languageInfo.geography && <p>{languageInfo.geography}</p>}<ul className="country-list">{languageInfo.regions.map(region=><li key={region}>{region}</li>)}</ul></section>
      {languageInfo.funFacts.length > 0 && <section><div className="profile-section-title"><Sparkles aria-hidden="true"/><h2>Language & everyday life</h2></div><ul className="language-facts">{languageInfo.funFacts.map(fact=><li key={fact}>{fact}</li>)}</ul></section>}
    </div>
    <section className="course-preview"><p className="eyebrow">Learn by doing</p><h2>Your {languageInfo.name} practice</h2><p>Explore {local?.wordCount ?? "the available"} words and phrases through flashcards, matching, quizzes and word search.</p><Link className="text-link" to={`/words/${local?.slug??languageId}`}>Browse the word collection<ArrowRight aria-hidden="true"/></Link>
      {isLoading ? <p role="status">Loading vocabulary categories…</p> : error ? <p>Vocabulary is unavailable right now. <button className="text-link" onClick={()=>retry()}>Try again</button></p> : <div className="category-chips">{categories.map(cat=><span key={cat.id}>{cat.name}<small>{cat.count} {cat.count===1?"word":"words"}</small></span>)}</div>}
      <Link className="primary-action" to={`/games/${local?.slug ?? languageId}`}>Choose a game<ArrowRight aria-hidden="true"/></Link>
    </section>
    <CorpusLink/>
  </article>;
}

