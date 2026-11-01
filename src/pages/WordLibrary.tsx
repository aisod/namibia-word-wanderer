import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useLanguageData } from "@/hooks/useLanguageData";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { practiceSummary, wordPractice } from "@/lib/learningProgress";
import { CONTENT_RELEASE } from "@/data/contentRelease";
import { getLocalLanguage } from "@/data/languageCatalog";
export default function WordLibrary() {
  const {languageId="oshikwanyama"}=useParams();
  const course=getLocalLanguage(languageId), slug=course?.slug??languageId;
  const {allVocabulary,categories,isLoading,error,retry}=useLanguageData(slug);
  const practice=useLearningProgress(slug);
  const [query,setQuery]=useState(""),[category,setCategory]=useState("all"),[dueOnly,setDueOnly]=useState(false),[limit,setLimit]=useState(24);
  const [copyStatus,setCopyStatus]=useState("");
  const summary=practiceSummary(allVocabulary,practice),now=Date.now();
  const matches=useMemo(()=>allVocabulary.filter(word=>{
    const q=query.normalize("NFC").trim().toLocaleLowerCase();
    return (category==="all"||word.category===category) && (!q||`${word.english} ${word.oshikwanyama}`.normalize("NFC").toLocaleLowerCase().includes(q)) && (!dueOnly||(wordPractice(word,practice)?.due??Infinity)<=now);
  }),[allVocabulary,query,category,dueOnly,practice,now]);
  if(!course)return <div className="content-page"><h1>Choose a language</h1><Link to="/#languages">Language library</Link></div>;
  return <div className="content-page word-library">
    <Link className="text-link back-link" to={`/games/${slug}`}><ArrowLeft aria-hidden="true"/>Back to {course.name}</Link>
    <header className="page-heading"><p className="eyebrow">Explore. Practise. Remember.</p><h1>{course.name} words & phrases</h1><p>Explore your AISOD Corpus collection.</p></header>
    <div className="study-summary"><span><strong>{allVocabulary.length}</strong> entries</span><span><strong>{summary.practised}</strong> practised</span><span><strong>{summary.due}</strong> due for review</span></div>
    <p className="study-note">Your practice progress is saved on this device.</p>
    <div className="word-tools"><label><span>Find a word</span><div className="word-search-input"><Search aria-hidden="true"/><input type="search" value={query} placeholder="Search either language" onChange={e=>{setQuery(e.target.value);setLimit(24);}}/></div></label><label><span>Topic</span><select value={category} onChange={e=>{setCategory(e.target.value);setLimit(24);}}><option value="all">All topics</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name} ({c.count})</option>)}</select></label></div>
    <div className="study-actions"><label className="review-filter"><input type="checkbox" checked={dueOnly} onChange={e=>{setDueOnly(e.target.checked);setLimit(24);}}/>Due for review</label><Link className="primary-action" to={`/games/${slug}?mode=flashcards&category=${encodeURIComponent(category)}${dueOnly?"&review=due":""}`}>{dueOnly?"Review words":"Practise topic"}<ArrowRight aria-hidden="true"/></Link></div>
    {isLoading?<p role="status">Loading your collection…</p>:error?<p role="alert">The collection could not load. <button className="text-link" onClick={()=>retry()}>Try again</button></p>:<><p role="status">{matches.length} {matches.length===1?"entry":"entries"}{dueOnly?" due for review":" found"}</p><div className="word-collection">{matches.slice(0,limit).map(word=>{
      const saved=wordPractice(word,practice);
      return <article key={word.id}><small>{categories.find(c=>c.id===word.category)?.name??word.category}</small><h2>{word.oshikwanyama}</h2><p>{word.english}</p>{word.usageNote&&<p className="word-usage">{word.usageNote}</p>}<span className="word-practice-status">{saved?`${saved.attempts} practice ${saved.attempts===1?"attempt":"attempts"} · ${saved.due<=now?"Ready to review":"Review later"}`:"New to your practice"}</span><button className="word-correction" onClick={async()=>{try{await navigator.clipboard.writeText(`NAMQULA correction\nLanguage: ${course.name}\nEntry: ${word.id}\n${word.oshikwanyama} = ${word.english}\nSuggested correction: `);setCopyStatus(`Copied ${word.oshikwanyama}. Add your correction when contributing to AISOD Corpus.`);}catch{setCopyStatus(`Copy this entry for AISOD Corpus: ${word.id} · ${word.oshikwanyama} = ${word.english}`);}}}>Copy entry for a corpus correction</button></article>;
    })}</div>{!matches.length&&<p>{dueOnly?"No words are due in this selection. Try another topic or explore new words.":"No words match. Try another spelling or topic."}</p>}{matches.length>limit&&<button className="primary-action" onClick={()=>setLimit(n=>n+24)}>Show more words</button>}</>}
    {copyStatus&&<p role="status" className="correction-status">{copyStatus} <a className="text-link" href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">Open AISOD Corpus</a></p>}
    <details className="collection-details"><summary>About this collection</summary><p>Updated 2 November 2026 · {course.wordCount} playable entries. Spellings and meanings have been checked against recorded references; community and speaker review continues through AISOD Corpus.</p><p>A word needs repeated practice; marking “Got it” once does not mean you have mastered it. Your results and review dates stay in this browser, without an account.</p><p>These counts describe the collection available in NAMQULA, rather than the size of the whole corpus. The collection is a published snapshot, not a live feed.</p><a className="text-link" href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">AISOD Corpus of Language Data and all its contributors</a><small>Collection version: {CONTENT_RELEASE.release}</small></details>
  </div>;
}
