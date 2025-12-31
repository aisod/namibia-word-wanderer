import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { VocabularyItem, getRandomVocabulary, allVocabulary } from "@/data/oshikwanyamaData";
import { ArrowLeft, Trophy, Heart, Zap, RefreshCw, CheckCircle, XCircle } from "lucide-react";

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const generateQuestions = () => {
    const vocab = getRandomVocabulary(10);
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
    setGameComplete(false);
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 10);
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
      setGameComplete(true);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  if (gameOver || gameComplete) {
    const isWin = gameComplete && lives > 0;
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center glass-card">
          <div className={cn(
            "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center",
            isWin ? "bg-gradient-to-br from-sunset-gold to-sunset-orange celebration" : "bg-destructive/20"
          )}>
            {isWin ? (
              <Trophy className="w-10 h-10 text-primary-foreground" />
            ) : (
              <XCircle className="w-10 h-10 text-destructive" />
            )}
          </div>
          
          <h2 className="font-display text-3xl text-foreground mb-2">
            {isWin ? "Well Done!" : "Game Over"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isWin 
              ? `You completed the quiz with ${lives} ${lives === 1 ? 'life' : 'lives'} remaining!`
              : "Don't worry, practice makes perfect!"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">{currentIndex + (isAnswered && selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0)}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={generateQuestions} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="font-medium">
              <Zap className="w-3 h-3 mr-1 text-sunset-gold" />
              {score}
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
