import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { VocabularyItem, getRandomVocabulary, categories } from "@/data/oshikwanyamaData";
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Trophy, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { getLevelConfig, getDifficultyColor, getDifficultyLabel } from "@/utils/gameUtils";

interface FlashcardGameProps {
  onBack: () => void;
}

export function FlashcardGame({ onBack }: FlashcardGameProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [cards, setCards] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set());
  const [levelComplete, setLevelComplete] = useState(false);

  const levelConfig = getLevelConfig(level, 'flashcards');

  const startGame = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const vocab = getRandomVocabulary(levelConfig.wordCount, categoryId === "all" ? undefined : categoryId);
    setCards(vocab);
    setCurrentIndex(0);
    setIsFlipped(false);
    setLearnedCards(new Set());
    setLevelComplete(false);
  };

  useEffect(() => {
    if (selectedCategory) {
      const vocab = getRandomVocabulary(levelConfig.wordCount, selectedCategory === "all" ? undefined : selectedCategory);
      setCards(vocab);
      setCurrentIndex(0);
      setIsFlipped(false);
      setLearnedCards(new Set());
      setLevelComplete(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, selectedCategory]);

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
    
    // Check if all cards are learned
    if (newLearned.size >= cards.length) {
      setLevelComplete(true);
    } else {
      handleNext();
    }
  };

  const shuffleCards = () => {
    setCards([...cards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Level complete screen
  if (levelComplete && selectedCategory) {
    const score = learnedCards.size * levelConfig.pointsPerWord;
    const levelBonus = levelConfig.bonusPoints;
    const levelScore = score + levelBonus;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center glass-card">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-sunset-gold to-sunset-orange flex items-center justify-center celebration">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h2 className="font-display text-3xl text-foreground mb-2">
            Level {level} Complete! 🎉
          </h2>
          <p className="text-muted-foreground mb-6">
            You've learned all the flashcards!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{levelScore}</p>
              <p className="text-sm text-muted-foreground">Level Score</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{totalScore + levelScore}</p>
              <p className="text-sm text-muted-foreground">Total Score</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-primary/10">
              <p className="text-lg font-bold text-primary">{cards.length}</p>
              <p className="text-sm text-muted-foreground">Cards Learned</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10">
              <p className="text-lg font-bold text-primary">+{levelBonus}</p>
              <p className="text-sm text-muted-foreground">Bonus</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => {
                setLevel(prev => prev + 1);
                setTotalScore(prev => prev + levelScore);
                startGame(selectedCategory);
              }} 
              className="w-full" 
              size="lg"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Next Level ({level + 1})
            </Button>
            <Button variant="outline" onClick={() => startGame(selectedCategory)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Level
            </Button>
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Choose Different Category
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
  const progress = cards.length > 0 ? ((learnedCards.size) / cards.length) * 100 : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("font-medium", getDifficultyColor(levelConfig.difficulty))}>
              {getDifficultyLabel(levelConfig.difficulty)}
            </Badge>
            <Badge variant="outline" className="font-medium">
              Level {level}
            </Badge>
            <Badge variant="secondary" className="font-medium">
              <Zap className="w-3 h-3 mr-1" />
              Total: {totalScore + (learnedCards.size * levelConfig.pointsPerWord)}
            </Badge>
            <Badge variant="outline" className="bg-success/20 text-success">
              {learnedCards.size} / {cards.length} learned
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
              disabled={learnedCards.has(cards[currentIndex]?.id)}
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
