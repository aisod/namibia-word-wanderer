import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Mic, MessageSquare, ArrowUpRight } from "lucide-react";
import { CorpusLink } from "@/components/CorpusLink";
export default function Community() {
  return <div className="content-page community-page">
    <Link className="text-link back-link" to="/"><ArrowLeft aria-hidden="true"/>Back to learning</Link>
    <header className="page-heading"><p className="eyebrow">Built with our communities</p><h1>Our languages.<br/>Our shared future.</h1><p>Every word carries knowledge. Help preserve it for the next generation through the AISOD Corpus of Language Data.</p></header>
    <div className="community-options">{[
      {icon:BookOpen,title:"Share language knowledge",text:"Contribute words, meanings and the context that makes them useful."},
      {icon:Mic,title:"Keep voices alive",text:"Share recordings and stories through the corpus’s contribution process."},
      {icon:MessageSquare,title:"Help improve the collection",text:"Suggest corrections and explain the variety or community a word belongs to."}
    ].map(({icon:Icon,title,text})=><section key={title}><Icon aria-hidden="true"/><h2>{title}</h2><p>{text}</p></section>)}</div>
    <CorpusLink/>
    <section className="community-note"><h2>One place to contribute</h2><p>Words, recordings and language corrections are contributed to the corpus rather than collected separately inside each game. Open the corpus online to use its available contribution and contact options.</p><a className="text-link" href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">Open AISOD Corpus<ArrowUpRight aria-hidden="true"/></a></section>
  </div>;
}

