import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { VocabularyItem, getRandomVocabulary, categories } from "@/data/oshikwanyamaData";
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Volume2 } from "lucide-react";

interface FlashcardGameProps {
  onBack: () => void;
}

export function FlashcardGame({ onBack }: FlashcardGameProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set());

  const startGame = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const vocab = getRandomVocabulary(10, categoryId === "all" ? undefined : categoryId);
    setCards(vocab);
    setCurrentIndex(0);
    setIsFlipped(false);
    setLearnedCards(new Set());
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const markAsLearned = () => {
    const newLearned = new Set(learnedCards);
    newLearned.add(cards[currentIndex].id);
    setLearnedCards(newLearned);
    handleNext();
  };

  const shuffleCards = () => {
    setCards([...cards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>

          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Flashcard Learning
            </h2>
            <p className="text-muted-foreground">
              Choose a category to start learning
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card
              onClick={() => startGame("all")}
              className="p-4 cursor-pointer game-card-hover hover:border-primary/50 border-2 border-transparent"
            >
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">All Words</h3>
              <p className="text-sm text-muted-foreground">Mixed categories</p>
            </Card>
            {categories.map((cat) => (
              <Card
                key={cat.id}
                onClick={() => startGame(cat.id)}
                className="p-4 cursor-pointer game-card-hover hover:border-primary/50 border-2 border-transparent"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.count} words</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              {currentIndex + 1} / {cards.length}
            </Badge>
            <Badge variant="outline" className="bg-success/20 text-success">
              {learnedCards.size} learned
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-8 h-2" />

        {/* Flashcard */}
        <div 
          className="perspective-1000 cursor-pointer mb-8"
          onClick={handleFlip}
        >
          <div className={cn(
            "relative w-full h-64 md:h-80 transition-transform duration-500 preserve-3d",
            isFlipped && "rotate-y-180"
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          >
            {/* Front */}
            <Card 
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-card to-secondary/20 backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">
                English
              </p>
              <h3 className="font-display text-3xl md:text-4xl text-foreground text-center">
                {currentCard?.english}
              </h3>
              <p className="text-sm text-muted-foreground mt-6">
                Tap to reveal
              </p>
            </Card>

            {/* Back */}
            <Card 
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-sunset-gold/10 backface-hidden"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">
                Oshikwanyama
              </p>
              <h3 className="font-display text-3xl md:text-4xl text-primary text-center">
                {currentCard?.oshikwanyama}
              </h3>
              <Badge variant="outline" className="mt-6 capitalize">
                {currentCard?.category}
              </Badge>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={shuffleCards}>
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
            <Button 
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={markAsLearned}
            >
              ✓ Got it!
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
