import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { GameCard } from "@/components/GameCard";
import { FlashcardGame } from "@/components/FlashcardGame";
import { WordMatchGame } from "@/components/WordMatchGame";
import { QuizGame } from "@/components/QuizGame";
import { ArrowLeft, CreditCard, Puzzle, HelpCircle, Sparkles } from "lucide-react";

type GameType = "flashcards" | "wordmatch" | "quiz" | null;

export default function GameSelection() {
  const navigate = useNavigate();
  const { languageId } = useParams();
  const [activeGame, setActiveGame] = useState<GameType>(null);

  // Render active game
  if (activeGame === "flashcards") {
    return <FlashcardGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "wordmatch") {
    return <WordMatchGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "quiz") {
    return <QuizGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="min-h-screen pattern-tribal">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/language/${languageId}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Logo size="sm" />
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Oshikwanyama</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-foreground mb-4">
                Choose Your Game
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Select a game mode to start learning vocabulary in a fun and interactive way
              </p>
            </div>

            {/* Game Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GameCard
                title="Flashcards"
                description="Learn vocabulary at your own pace with interactive flashcards. Flip to reveal translations!"
                icon={CreditCard}
                difficulty="Easy"
                color="orange"
                onClick={() => setActiveGame("flashcards")}
              />

              <GameCard
                title="Word Match"
                description="Test your memory by matching English words with their Oshikwanyama translations."
                icon={Puzzle}
                difficulty="Medium"
                color="pink"
                onClick={() => setActiveGame("wordmatch")}
              />

              <GameCard
                title="Quiz Challenge"
                description="Put your knowledge to the test! Answer questions before you run out of lives."
                icon={HelpCircle}
                difficulty="Hard"
                color="green"
                onClick={() => setActiveGame("quiz")}
              />
            </div>

            {/* Tips */}
            <div className="mt-12 p-6 rounded-2xl bg-secondary/30 border border-border/50">
              <h3 className="font-display text-lg text-foreground mb-3">💡 Learning Tips</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Start with <strong>Flashcards</strong> to familiarize yourself with new words</li>
                <li>• Move to <strong>Word Match</strong> to test your recognition skills</li>
                <li>• Challenge yourself with the <strong>Quiz</strong> when you're feeling confident!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
