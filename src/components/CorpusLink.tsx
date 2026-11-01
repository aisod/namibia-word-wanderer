import { ArrowUpRight, BookOpen } from "lucide-react";
export function CorpusLink() {
  return <section className="corpus-panel" aria-labelledby="corpus-heading"><BookOpen aria-hidden="true"/><div><p className="eyebrow">Language lives through people</p><h2 id="corpus-heading">Help grow the AISOD Corpus</h2><p>Share words, recordings, stories and corrections with the AISOD Corpus of Language Data. Contributions belong in the corpus, where they can support NAMQULA and the wider AISOD language ecosystem.</p><a className="text-link" href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">Visit the corpus <ArrowUpRight aria-hidden="true"/></a><small>With thanks to all corpus contributors.</small></div></section>;
}
