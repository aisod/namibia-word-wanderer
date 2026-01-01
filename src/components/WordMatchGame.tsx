import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { VocabularyItem, getRandomVocabulary } from "@/data/oshikwanyamaData";
import { ArrowLeft, Trophy, Star, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getLevelConfig, getDifficultyColor, getDifficultyLabel } from "@/utils/gameUtils";

interface WordMatchGameProps {
  onBack: () => void;
}

interface MatchPair {
  id: string;
  english: string;
  oshikwanyama: string;
}

export function WordMatchGame({ onBack }: WordMatchGameProps) {
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [englishWords, setEnglishWords] = useState<string[]>([]);
  const [oshiWords, setOshiWords] = useState<string[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [selectedOshi, setSelectedOshi] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);

  const levelConfig = getLevelConfig(level, 'wordmatch');

  const startGame = () => {
    const vocab = getRandomVocabulary(levelConfig.wordCount);
    const gamePairs = vocab.map(v => ({
      id: v.id,
      english: v.english,
      oshikwanyama: v.oshikwanyama,
    }));
    
    setPairs(gamePairs);
    setEnglishWords([...gamePairs.map(p => p.english)].sort(() => Math.random() - 0.5));
    setOshiWords([...gamePairs.map(p => p.oshikwanyama)].sort(() => Math.random() - 0.5));
    setMatchedPairs(new Set());
    setSelectedEnglish(null);
    setSelectedOshi(null);
    setScore(0);
    setStreak(0);
    setAttempts(0);
    setLevelComplete(false);
  };

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    if (selectedEnglish && selectedOshi) {
      const pair = pairs.find(p => p.english === selectedEnglish && p.oshikwanyama === selectedOshi);
      
      setAttempts(prev => prev + 1);
      
      if (pair) {
        // Correct match!
        const newMatched = new Set(matchedPairs);
        newMatched.add(pair.id);
        setMatchedPairs(newMatched);
        setScore(prev => prev + (levelConfig.pointsPerWord * (streak + 1)));
        setStreak(prev => prev + 1);
        
        toast({
          title: "🎉 Correct!",
          description: `${pair.english} = ${pair.oshikwanyama}`,
          duration: 1500,
        });

        if (newMatched.size === pairs.length) {
          setLevelComplete(true);
        }
      } else {
        // Wrong match
        setStreak(0);
        toast({
          title: "❌ Try again!",
          description: "That's not a match",
          variant: "destructive",
          duration: 1500,
        });
      }

      setTimeout(() => {
        setSelectedEnglish(null);
        setSelectedOshi(null);
      }, 500);
    }
  }, [selectedEnglish, selectedOshi, pairs, matchedPairs, streak, levelConfig.pointsPerWord]);

  const isEnglishMatched = (word: string) => {
    const pair = pairs.find(p => p.english === word);
    return pair ? matchedPairs.has(pair.id) : false;
  };

  const isOshiMatched = (word: string) => {
    const pair = pairs.find(p => p.oshikwanyama === word);
    return pair ? matchedPairs.has(pair.id) : false;
  };

  const progress = pairs.length > 0 ? (matchedPairs.size / pairs.length) * 100 : 0;

  // Level complete screen
  if (levelComplete) {
    const accuracy = attempts > 0 ? Math.round((pairs.length / attempts) * 100) : 100;
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
            You matched all the words!
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
              <p className="text-lg font-bold text-primary">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
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
              }} 
              className="w-full" 
              size="lg"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Next Level ({level + 1})
            </Button>
            <Button variant="outline" onClick={startGame}>
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
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
            {streak > 1 && (
              <Badge className="bg-sunset-gold text-foreground animate-bounce-subtle">
                <Star className="w-3 h-3 mr-1" />
                {streak}x Streak!
              </Badge>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
            Word Match
          </h2>
          <p className="text-muted-foreground">
            Match the English words with their Oshikwanyama translations
          </p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-8 h-2" />

        {/* Game Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* English Column */}
          <div>
            <h3 className="font-display text-lg text-center mb-4 text-muted-foreground">
              English
            </h3>
            <div className="space-y-3">
              {englishWords.map((word) => (
                <Card
                  key={word}
                  onClick={() => !isEnglishMatched(word) && setSelectedEnglish(word)}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-200 text-center font-medium",
                    isEnglishMatched(word) && "bg-success/20 border-success opacity-60 cursor-default",
                    selectedEnglish === word && !isEnglishMatched(word) && "border-primary bg-primary/10 ring-2 ring-primary",
                    !isEnglishMatched(word) && selectedEnglish !== word && "hover:border-primary/50"
                  )}
                >
                  {word}
                </Card>
              ))}
            </div>
          </div>

          {/* Oshikwanyama Column */}
          <div>
            <h3 className="font-display text-lg text-center mb-4 text-muted-foreground">
              Oshikwanyama
            </h3>
            <div className="space-y-3">
              {oshiWords.map((word) => (
                <Card
                  key={word}
                  onClick={() => !isOshiMatched(word) && setSelectedOshi(word)}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-200 text-center font-medium",
                    isOshiMatched(word) && "bg-success/20 border-success opacity-60 cursor-default",
                    selectedOshi === word && !isOshiMatched(word) && "border-accent bg-accent/10 ring-2 ring-accent",
                    !isOshiMatched(word) && selectedOshi !== word && "hover:border-accent/50"
                  )}
                >
                  {word}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
