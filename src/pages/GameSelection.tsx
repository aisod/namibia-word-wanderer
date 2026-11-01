import { getLocalLanguage } from "@/data/languageCatalog";
import { lazy, Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
const FlashcardGame = lazy(() => import("@/components/FlashcardGame").then(m => ({ default: m.FlashcardGame })));
const WordMatchGame = lazy(() => import("@/components/WordMatchGame").then(m => ({ default: m.WordMatchGame })));
const QuizGame = lazy(() => import("@/components/QuizGame").then(m => ({ default: m.QuizGame })));
const WordSearchGame = lazy(() => import("@/components/WordSearchGame").then(m => ({ default: m.WordSearchGame })));
import { ArrowLeft, Layers, Link2, CircleHelp, Search } from "lucide-react";

type GameType = "flashcards" | "wordmatch" | "quiz" | "wordsearch" | null;

export default function GameSelection() {
  const navigate = useNavigate();
  const { languageId } = useParams();
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const course = getLocalLanguage(languageId);
  if (course && !course.isAvailable) return <div className="min-h-screen grid place-items-center p-6"><div className="text-center space-y-4">
    <h1 className="text-2xl font-semibold">{course.name} is in preparation</h1>
    <p>Vocabulary is being checked before these games are enabled.</p>
    <Button onClick={() => navigate("/")}>Choose another language</Button>
  </div></div>;

  if (activeGame === "flashcards") return <Suspense fallback={<p role="status">Loading game…</p>}><FlashcardGame languageId={languageId ?? "oshikwanyama"} onBack={() => setActiveGame(null)} /></Suspense>;
  if (activeGame === "wordmatch") return <Suspense fallback={<p role="status">Loading game…</p>}><WordMatchGame languageId={languageId ?? "oshikwanyama"} onBack={() => setActiveGame(null)} /></Suspense>;
  if (activeGame === "quiz") return <Suspense fallback={<p role="status">Loading game…</p>}><QuizGame languageId={languageId ?? "oshikwanyama"} onBack={() => setActiveGame(null)} /></Suspense>;
  if (activeGame === "wordsearch") return <Suspense fallback={<p role="status">Loading game…</p>}><WordSearchGame languageId={languageId ?? "oshikwanyama"} onBack={() => setActiveGame(null)} /></Suspense>;

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen py-6 sm:py-8 md:py-12 lg:py-20">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/heroimage.webp)' }}>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 px-4 sm:container sm:mx-auto">
          {/* Header */}
          <header className="sticky top-0 z-50 mb-6 sm:mb-8 md:mb-12 bg-black/30 backdrop-blur-md rounded-b-2xl border-b border-white/20">
            <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/language/${languageId}`)} 
                className="text-white hover:bg-white/20 min-h-[44px] min-w-[44px] p-2"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              <h2 className="font-display text-base sm:text-xl md:text-2xl lg:text-3xl text-white drop-shadow-lg text-center flex-1 px-2">
                Browse our collections of games
              </h2>
              <div className="w-[44px]"></div>
            </div>
          </header>

          <div className="max-w-4xl mx-auto">
            {/* Game Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <GameCard title="Flashcards" description="Learn vocabulary at your own pace with interactive flashcards. Flip to reveal translations!" icon={Layers} difficulty="Easy" color="orange" onClick={() => setActiveGame("flashcards")} />
              <GameCard title="Word Match" description="Test your memory by matching English words with their translations." icon={Link2} difficulty="Medium" color="pink" onClick={() => setActiveGame("wordmatch")} />
              <GameCard title="Quiz Challenge" description="Put your knowledge to the test! Answer questions before you run out of lives." icon={CircleHelp} difficulty="Hard" color="green" onClick={() => setActiveGame("quiz")} />
              <GameCard title="Word Search" description="Find hidden words in a grid of letters. Click letters in sequence to form words!" icon={Search} difficulty="Medium" color="blue" onClick={() => setActiveGame("wordsearch")} />
            </div>

            {/* Tips */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <h3 className="font-display text-base sm:text-lg text-white mb-2 sm:mb-3 drop-shadow-md">💡 Learning Tips</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-white/90 text-xs sm:text-sm drop-shadow-sm">
                <li>• Start with <strong className="text-white">Flashcards</strong> to familiarize yourself with new words</li>
                <li>• Try <strong className="text-white">Word Search</strong> to find words in a fun grid challenge</li>
                <li>• Move to <strong className="text-white">Word Match</strong> to test your recognition skills</li>
                <li>• Challenge yourself with the <strong className="text-white">Quiz</strong> when you're feeling confident!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

