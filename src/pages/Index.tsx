import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Gamepad2, Layers, Link2, CircleHelp, Search } from "lucide-react";
import { LOCAL_LANGUAGES, getLocalLanguage } from "@/data/languageCatalog";
function lastLanguage() { try { return getLocalLanguage(localStorage.getItem("namqula-last-language")??"oshikwanyama")??LOCAL_LANGUAGES[0]; } catch { return LOCAL_LANGUAGES[0]; } }
export default function Index() {
  const recent=lastLanguage();
  useEffect(() => { if (window.location.hash === "#languages") document.getElementById("languages")?.scrollIntoView(); }, []);
  return <div className="learning-home">
    <section className="welcome-panel">
      <div><p className="eyebrow">A little practice. A new connection.</p><h1>Make language part<br className="desktop-break"/> of your everyday.</h1><p>Explore words from six African languages. Pick a language, then learn through play.</p>
      <Link className="primary-action" to={`/games/${recent.slug}`}>Play {recent.name}<ArrowRight aria-hidden="true"/></Link>
      <Link className="quiet-link" to={`/language/${recent.slug}`}>About this language</Link></div>
      <div className="welcome-art" aria-hidden="true"><span>HELLO</span><strong>Ongaipi</strong><span>Learn. Match. Remember.</span></div>
    </section>
    <div className="library-summary"><span><BookOpen/>{LOCAL_LANGUAGES.length} languages</span><span>{LOCAL_LANGUAGES.reduce((n,l)=>n+l.wordCount,0)} words to practise</span><span><Gamepad2/>4 ways to practise</span></div>
    <section id="languages" aria-labelledby="language-heading"><div className="section-heading"><div><p className="eyebrow">Find your next connection</p><h2 id="language-heading">Your language library</h2></div><p>All levels welcome</p></div>
      <div className="language-library">{LOCAL_LANGUAGES.map((language,i)=><article className={`course-tile course-color-${i%6}`} key={language.slug}><Link className="course-main-link" to={`/games/${language.slug}`}>
        <div className="course-top"><span className="course-monogram" aria-hidden="true">{language.name.slice(0,2)}</span><span className="course-count">{language.wordCount} words</span></div>
        <h3>{language.name}</h3><p>{language.nativeName}</p><span className="course-action">Start playing <ArrowRight aria-hidden="true"/></span>
      </Link><Link className="course-about-link" to={`/language/${language.slug}`}>History & culture</Link></article>)}</div>
    </section>
    <section className="practice-section" aria-labelledby="practice-heading"><div className="section-heading"><div><p className="eyebrow">Choose how you learn</p><h2 id="practice-heading">A game for every mood</h2></div></div><div className="practice-grid">{[{name:"Flashcards",icon:Layers,description:"Meet a word. Flip it. Try to recall it."},{name:"Word Match",icon:Link2,description:"Pair words with their translations."},{name:"Quiz",icon:CircleHelp,description:"Test what you remember."},{name:"Word Search",icon:Search,description:"Find words, one letter at a time."}].map(({name,icon:Icon,description})=><article key={name}><Icon aria-hidden="true"/><h3>{name}</h3><p>{description}</p></article>)}</div></section>
    <footer className="learning-footer"><span>Built by AISOD · Learning together</span><Link to="/community">Meet the community</Link><a href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">AISOD Corpus and its contributors</a></footer>
  </div>;
}
