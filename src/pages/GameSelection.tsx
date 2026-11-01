import { lazy, Suspense } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layers, Link2, CircleHelp, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { getLocalLanguage } from "@/data/languageCatalog";
const FlashcardGame = lazy(() => import("@/components/FlashcardGame").then(m => ({ default: m.FlashcardGame })));
const WordMatchGame = lazy(() => import("@/components/WordMatchGame").then(m => ({ default: m.WordMatchGame })));
const QuizGame = lazy(() => import("@/components/QuizGame").then(m => ({ default: m.QuizGame })));
const WordSearchGame = lazy(() => import("@/components/WordSearchGame").then(m => ({ default: m.WordSearchGame })));
const games = [
  {id:"flashcards",title:"Flashcards",icon:Layers,description:"Meet a word, reveal its meaning, then try to remember.",hint:"Learn at your pace"},
  {id:"wordmatch",title:"Word Match",icon:Link2,description:"Connect words across two sides. Find every pair.",hint:"Build recognition"},
  {id:"quiz",title:"Quiz",icon:CircleHelp,description:"Choose the right meaning and see how you did.",hint:"Test your recall"},
  {id:"wordsearch",title:"Word Search",icon:Search,description:"Find hidden words by tapping their letters in order.",hint:"Explore the spelling"},
];
export default function GameSelection() {
  const { languageId = "oshikwanyama" } = useParams();
  const [params, setParams] = useSearchParams();
  const course = getLocalLanguage(languageId);
  const mode = params.get("mode");
  const onBack = () => setParams({});
  const active = mode==="flashcards"?<FlashcardGame languageId={languageId} onBack={onBack}/>:mode==="wordmatch"?<WordMatchGame languageId={languageId} onBack={onBack}/>:mode==="quiz"?<QuizGame languageId={languageId} onBack={onBack}/>:mode==="wordsearch"?<WordSearchGame languageId={languageId} onBack={onBack}/>:null;
  if (active) return <Suspense fallback={<p role="status" className="game-screen">Getting your game ready…</p>}>{active}</Suspense>;
  if (!course) return <div className="content-page"><h1>Choose a language to play</h1><Link className="primary-action" to="/">Language library</Link></div>;
  return <div className="content-page game-library">
    <Link className="text-link back-link" to="/#languages"><ArrowLeft aria-hidden="true"/>Language library</Link>
    <header className="page-heading"><p className="eyebrow">A little practice goes a long way</p><h1>Play in {course.name}</h1><p>Choose a game. Learn a few words. Come back for more.</p></header>
    <div className="game-choices">{games.map(({id,title,icon:Icon,description,hint})=><button className={`game-choice game-choice-${id}`} key={id} onClick={()=>setParams({mode:id})}><Icon aria-hidden="true"/><span className="game-choice-hint">{hint}</span><h2>{title}</h2><p>{description}</p><span className="game-choice-play">Play<ArrowRight aria-hidden="true"/></span></button>)}</div>
    <Link className="language-context-link" to={`/language/${course.slug}`}><span>Discover {course.name}<small>Language, history & culture</small></span><ArrowRight aria-hidden="true"/></Link>
    <p className="game-corpus-note">Powered by <a href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">AISOD Corpus and its contributors</a></p>
  </div>;
}

