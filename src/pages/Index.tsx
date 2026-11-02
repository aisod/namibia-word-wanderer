import { useEffect } from "react";

import { Link } from "react-router-dom";

import { ArrowRight, BookOpen, Gamepad2, Layers, Link2, CircleHelp, Search } from "lucide-react";

import { LOCAL_LANGUAGES, getLocalLanguage } from "@/data/languageCatalog";

import { CONTENT_RELEASE } from "@/data/contentRelease";

function lastLanguage() { try { return getLocalLanguage(localStorage.getItem("namqula-last-language")??"oshikwanyama")??LOCAL_LANGUAGES[0]; } catch { return LOCAL_LANGUAGES[0]; } }

export default function Index() {

  const recent=lastLanguage();

  const added=Object.values(CONTENT_RELEASE.packs).reduce((n,count)=>n+count,0)-Object.values(CONTENT_RELEASE.previousPacks).reduce((n,count)=>n+count,0);

  useEffect(() => { if (window.location.hash === "#languages") document.getElementById("languages")?.scrollIntoView(); }, []);

  return <div className="learning-home">

    <section className="welcome-panel">

      <div><p className="eyebrow">A little practice. A new connection.</p><h1>Make language part<br className="desktop-break"/> of your everyday.</h1><p>Explore words from six African languages. Pick a language, then learn through play.</p>

      <Link className="primary-action" to={`/games/${recent.slug}`}>Play {recent.name}<ArrowRight aria-hidden="true"/></Link>

      <Link className="quiet-link" to={`/language/${recent.slug}`}>About this language</Link></div>

      <div className="welcome-art" aria-hidden="true"><span>HELLO</span><strong>Ongaipi</strong><span>Learn. Match. Remember.</span></div>

    </section>

    <div className="library-summary"><span><BookOpen/>{LOCAL_LANGUAGES.length} languages</span><span>{LOCAL_LANGUAGES.reduce((n,l)=>n+l.wordCount,0)} words & phrases</span><span><Gamepad2/>4 ways to practise</span></div>

    <section className="collection-update"><div><p className="eyebrow">Our growing language collection</p><h2>More words. More everyday connections.</h2><p>{added} entries added in this release: family, school, food, travel, time and more. Explore the words, then make them part of your practice.</p><small>Updated 2 November 2026 · From AISOD Corpus of Language Data and all its contributors.</small></div><a className="text-link" href="#languages">Explore the collections<ArrowRight aria-hidden="true"/></a></section>

    <section id="languages" aria-labelledby="language-heading"><div className="section-heading"><div><p className="eyebrow">Find your next connection</p><h2 id="language-heading">Your language library</h2></div><p>All levels welcome</p></div>

      <div className="language-library">{LOCAL_LANGUAGES.map((language,i)=><article className={`course-tile course-color-${i%6}`} key={language.slug}><Link className="course-main-link" to={`/games/${language.slug}`}>

        <div className="course-top"><span className="course-monogram" aria-hidden="true">{language.name.slice(0,2)}</span><span className="course-count">{language.wordCount} entries</span></div>

        <h3>{language.name}</h3><p>{language.nativeName}</p><span className="course-action">Start playing <ArrowRight aria-hidden="true"/></span>

      </Link><div className="course-library-links"><Link className="course-about-link" to={`/words/${language.slug}`}>Browse words <small>+{language.wordCount-CONTENT_RELEASE.previousPacks[language.slug as keyof typeof CONTENT_RELEASE.previousPacks]}</small></Link><Link className="course-about-link" to={`/language/${language.slug}`}>History & culture</Link></div></article>)}</div>

    </section>

    <section className="practice-section" aria-labelledby="practice-heading"><div className="section-heading"><div><p className="eyebrow">Choose how you learn</p><h2 id="practice-heading">A game for every mood</h2></div></div><div className="practice-grid">{[{name:"Flashcards",icon:Layers,description:"Meet a word. Flip it. Try to recall it."},{name:"Word Match",icon:Link2,description:"Pair words with their translations."},{name:"Quiz",icon:CircleHelp,description:"Test what you remember."},{name:"Word Search",icon:Search,description:"Find words, one letter at a time."}].map(({name,icon:Icon,description})=><article key={name}><Icon aria-hidden="true"/><h3>{name}</h3><p>{description}</p></article>)}</div></section>

    <section className="collection-details" aria-labelledby="questions-heading"><h2 id="questions-heading">Before you start</h2>

      <details><summary>Can I play NAMQULA without internet?</summary><p>Yes. Open NAMQULA online first and wait for “Ready for offline play”. Then the saved vocabulary and games work without internet. Community pages and new downloads need a connection.</p></details>

      <details><summary>Which Oshiwambo varieties can I learn?</summary><p>Oshikwanyama and Oshindonga have separate collections, so you can explore their vocabulary and written forms individually.</p></details>

      <details><summary>Where does the language content come from?</summary><p>NAMQULA is powered by AISOD Corpus of Language Data and all its contributors. Its growing collections help preserve language and cultural knowledge. Use the correction action beside a word to copy the entry for the corpus.</p></details>

      <details><summary>Will my practice progress be saved?</summary><p>Your practice and review dates are saved in this browser on this device. Clearing app storage removes that progress. Account synchronization is not available yet.</p></details>

    </section>

    <footer className="learning-footer"><span>Built by AISOD · Learning together</span><Link to="/community">Meet the community</Link><a href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">AISOD Corpus and its contributors</a></footer>

  </div>;

}

