import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { VocabularyItem, getRandomVocabulary, allVocabulary } from "@/data/oshikwanyamaData";
import { ArrowLeft, Trophy, Heart, Zap, RefreshCw, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { getLevelConfig, getDifficultyColor, getDifficultyLabel } from "@/utils/gameUtils";

interface QuizGameProps {
  onBack: () => void;
}

interface Question {
  word: VocabularyItem;
  options: string[];
  correctAnswer: string;
  isEnglishToOshi: boolean;
}

export function QuizGame({ onBack }: QuizGameProps) {
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const levelConfig = getLevelConfig(level, 'quiz');

  const generateQuestions = () => {
    const vocab = getRandomVocabulary(levelConfig.wordCount);
    const quizQuestions: Question[] = vocab.map((word) => {
      const isEnglishToOshi = Math.random() > 0.5;
      const correctAnswer = isEnglishToOshi ? word.oshikwanyama : word.english;
      
      // Get 3 wrong options
      const otherWords = allVocabulary.filter(w => w.id !== word.id);
      const shuffled = otherWords.sort(() => Math.random() - 0.5);
      const wrongOptions = shuffled
        .slice(0, 3)
        .map(w => isEnglishToOshi ? w.oshikwanyama : w.english);
      
      const options = [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5);

      return {
        word,
        options,
        correctAnswer,
        isEnglishToOshi,
      };
    });

    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setLevelComplete(false);
  };

  useEffect(() => {
    generateQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + levelConfig.pointsPerWord);
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives === 0) {
          setTimeout(() => setGameOver(true), 1000);
        }
        return newLives;
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Level complete
      if (lives > 0) {
        setLevelComplete(true);
      }
    }
  };

  // Level complete screen
  if (levelComplete && lives > 0) {
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
            Excellent work! You completed with {lives} {lives === 1 ? 'life' : 'lives'} remaining!
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

          <div className="p-4 rounded-xl bg-primary/10 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Bonus</p>
            <p className="text-lg font-bold text-primary">+{levelBonus} points</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => {
                setLevel(prev => prev + 1);
                setTotalScore(prev => prev + levelScore);
              }} 
              className="w-full" 
              size="lg"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Next Level ({level + 1})
            </Button>
            <Button variant="outline" onClick={generateQuestions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Level
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center glass-card">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          
          <h2 className="font-display text-3xl text-foreground mb-2">
            Game Over
          </h2>
          <p className="text-muted-foreground mb-6">
            Don't worry, practice makes perfect!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{currentIndex}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={generateQuestions} className="w-full" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!questions[currentIndex]) return null;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
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
              Total: {totalScore + score}
            </Badge>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    "w-5 h-5 transition-all",
                    i < lives ? "text-destructive fill-destructive" : "text-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-8 h-2" />

        {/* Question Card */}
        <Card className="p-6 md:p-8 mb-8 text-center bg-gradient-to-br from-card to-secondary/20">
          <Badge variant="outline" className="mb-4">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
          
          <p className="text-sm text-muted-foreground mb-3">
            {currentQuestion.isEnglishToOshi 
              ? "What is the Oshikwanyama word for..."
              : "What does this mean in English..."}
          </p>
          
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            {currentQuestion.isEnglishToOshi 
              ? currentQuestion.word.english
              : currentQuestion.word.oshikwanyama}
          </h2>
        </Card>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <Card
              key={option}
              onClick={() => handleAnswer(option)}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 text-center font-medium",
                !isAnswered && "hover:border-primary/50 hover:bg-primary/5",
                isAnswered && option === currentQuestion.correctAnswer && "bg-success/20 border-success",
                isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && "bg-destructive/20 border-destructive",
                isAnswered && option !== currentQuestion.correctAnswer && option !== selectedAnswer && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isAnswered && option === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Next Button */}
        {isAnswered && lives > 0 && (
          <Button onClick={handleNext} className="w-full" size="lg">
            {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </div>
    </div>
  );
}
