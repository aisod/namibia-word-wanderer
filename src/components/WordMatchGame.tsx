import { shuffle } from "@/lib/vocabularyUtils";
import { recordPractice } from "@/lib/learningProgress";
import { VocabularyStatus } from "./VocabularyStatus";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguageData } from "@/hooks/useLanguageData";
import { ArrowLeft, Trophy, Star, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { getLevelConfig, getDifficultyColor, getDifficultyLabel } from "@/utils/gameUtils";

interface WordMatchGameProps {
  languageId: string;
  onBack: () => void;
}

interface MatchPair {
  id: string;
  english: string;
  oshikwanyama: string;
}

export function WordMatchGame({ languageId, onBack }: WordMatchGameProps) {
  const { getRandomVocabulary, allVocabulary, isLoading, error, retry, languageInfo } = useLanguageData(languageId);
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
  const [feedback, setFeedback] = useState("Tap one word on each side.");

  const matchLock = useRef(false);
  const clearTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(clearTimer.current), []);

  const levelConfig = getLevelConfig(level, 'wordmatch');

  const startGame = () => {
    clearTimeout(clearTimer.current);
    matchLock.current = false;
    const vocab = getRandomVocabulary(Math.min(levelConfig.wordCount, 6));
    const gamePairs = vocab.map(v => ({
      id: v.id,
      english: v.english,
      oshikwanyama: v.oshikwanyama,
    }));
    
    setPairs(gamePairs);
    setEnglishWords(shuffle(gamePairs.map(p => p.english)));
    setOshiWords(shuffle(gamePairs.map(p => p.oshikwanyama)));
    setMatchedPairs(new Set());
    setSelectedEnglish(null);
    setSelectedOshi(null);
    setScore(0);
    setStreak(0);
    setAttempts(0);
    setLevelComplete(false);
    setFeedback("Tap one word on each side.");
  };

  useEffect(() => {
    if (!isLoading) startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, isLoading]);

  const resolveMatch = (english: string, native: string) => {
    if (matchLock.current) return;
    matchLock.current = true;
    const pair = pairs.find(p => p.english === english && p.oshikwanyama === native);
    const practised=allVocabulary.find(w=>w.english===english);
    if(practised)recordPractice(languageId,practised,!!pair);
    setAttempts(prev => prev + 1);
    if (pair && !matchedPairs.has(pair.id)) {
      const next = new Set(matchedPairs); next.add(pair.id);
      setMatchedPairs(next);
      setFeedback(`Matched: ${pair.english} = ${pair.oshikwanyama}`);
      setScore(prev => prev + levelConfig.pointsPerWord * (streak + 1));
      setStreak(prev => prev + 1);
      if (next.size === pairs.length) setLevelComplete(true);
    } else {
      setFeedback("Not a match yet. Choose another pair.");
      setStreak(0);
    }
    clearTimer.current = setTimeout(() => {
      setSelectedEnglish(null); setSelectedOshi(null); matchLock.current = false;
    }, 500);
  };
  const chooseEnglish = (word: string) => {
    if (matchLock.current || isEnglishMatched(word)) return;
    setSelectedEnglish(word); if (selectedOshi) resolveMatch(word, selectedOshi);
  };
  const chooseNative = (word: string) => {
    if (matchLock.current || isOshiMatched(word)) return;
    setSelectedOshi(word); if (selectedEnglish) resolveMatch(selectedEnglish, word);
  };

  const isEnglishMatched = (word: string) => {
    const pair = pairs.find(p => p.english === word);
    return pair ? matchedPairs.has(pair.id) : false;
  };

  const isOshiMatched = (word: string) => {
    const pair = pairs.find(p => p.oshikwanyama === word);
    return pair ? matchedPairs.has(pair.id) : false;
  };

  const progress = pairs.length > 0 ? (matchedPairs.size / pairs.length) * 100 : 0;

  if (!isLoading && (error || allVocabulary.length < 1)) return <VocabularyStatus error={error} onRetry={retry} onBack={onBack} />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading vocabulary...</p>
      </div>
    );
  }

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
    <div className="game-screen match-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="game-header">
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

        <div className="game-title">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
            Word Match
          </h2>
          <p className="text-muted-foreground">
            Tap an English word, then its {languageInfo?.name} match.
          </p>
        </div>

        {/* Progress */}
        <div className="match-progress"><span>{matchedPairs.size} of {pairs.length} pairs matched</span><Progress value={progress} className="h-1.5" /></div>
        <p className="match-feedback" role="status" aria-live="polite">{feedback}</p>

        <div className="match-board" aria-label="Match English and native words">
          <section aria-label="English words"><h3>English</h3><div className="match-column">
            {englishWords.map(word => <button type="button" key={word} data-match-side="english" data-word={word}
              aria-label={`English: ${word}${isEnglishMatched(word) ? ", matched" : ""}`} aria-pressed={selectedEnglish === word} disabled={isEnglishMatched(word)}
              onClick={() => chooseEnglish(word)} className={cn("match-tile", isEnglishMatched(word) && "is-matched", selectedEnglish === word && !isEnglishMatched(word) && "is-selected")}>
              <span>{word}</span>{isEnglishMatched(word) && <span className="match-check" aria-hidden="true">✓</span>}
            </button>)}
          </div></section>
          <section aria-label={`${languageInfo?.name} words`}><h3>{languageInfo?.name}</h3><div className="match-column">
            {oshiWords.map(word => <button type="button" key={word} data-match-side="native" data-word={word}
              aria-label={`${languageInfo?.name}: ${word}${isOshiMatched(word) ? ", matched" : ""}`} aria-pressed={selectedOshi === word} disabled={isOshiMatched(word)}
              onClick={() => chooseNative(word)} className={cn("match-tile", isOshiMatched(word) && "is-matched", selectedOshi === word && !isOshiMatched(word) && "is-selected")}>
              <span>{word}</span>{isOshiMatched(word) && <span className="match-check" aria-hidden="true">✓</span>}
            </button>)}
          </div></section>
        </div>
      </div>
    </div>
  );
}
