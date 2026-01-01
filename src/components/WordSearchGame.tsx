import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { VocabularyItem, getRandomVocabulary, allVocabulary } from "@/data/oshikwanyamaData";
import { ArrowLeft, Trophy, Search, RefreshCw, CheckCircle, Zap, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getLevelConfig, getDifficultyColor, getDifficultyLabel, type Difficulty } from "@/utils/gameUtils";

interface WordSearchGameProps {
  onBack: () => void;
}

interface WordPosition {
  word: VocabularyItem;
  positions: Array<{ row: number; col: number }>;
  direction: 'horizontal' | 'vertical';
  found: boolean;
}

export function WordSearchGame({ onBack }: WordSearchGameProps) {
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<WordPosition[]>([]);
  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null); // Track which word is being selected
  const [score, setScore] = useState(0);
  const [timeStarted, setTimeStarted] = useState<number>(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const levelConfig = getLevelConfig(level, 'wordsearch');
  const GRID_SIZE = levelConfig.gridSize || 8;

  // Generate random letters
  const getRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  };

  // Initialize empty grid (with spaces, not random letters)
  const initializeGrid = () => {
    return Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ' ')
    );
  };
  
  // Fill remaining empty cells with random letters
  const fillEmptyCells = (grid: string[][]) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === ' ' || !grid[row][col]) {
          grid[row][col] = getRandomLetter();
        }
      }
    }
  };

  // Place word in grid - returns positions array or null
  const placeWord = (grid: string[][], word: string, direction: 'horizontal' | 'vertical'): Array<{ row: number; col: number }> | null => {
    const wordUpper = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (wordUpper.length === 0 || wordUpper.length > GRID_SIZE) return null;

    const maxAttempts = 100;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let startRow: number, startCol: number;
      const positions: Array<{ row: number; col: number }> = [];

      if (direction === 'horizontal') {
        startRow = Math.floor(Math.random() * GRID_SIZE);
        startCol = Math.floor(Math.random() * (GRID_SIZE - wordUpper.length + 1));
        
        // Check if can place
        let canPlace = true;
        for (let i = 0; i < wordUpper.length; i++) {
          const cell = grid[startRow][startCol + i];
          if (cell && cell !== wordUpper[i] && cell !== ' ') {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < wordUpper.length; i++) {
            positions.push({ row: startRow, col: startCol + i });
            grid[startRow][startCol + i] = wordUpper[i];
          }
          return positions;
        }
      } else if (direction === 'vertical') {
        startRow = Math.floor(Math.random() * (GRID_SIZE - wordUpper.length + 1));
        startCol = Math.floor(Math.random() * GRID_SIZE);
        
        let canPlace = true;
        for (let i = 0; i < wordUpper.length; i++) {
          const cell = grid[startRow + i][startCol];
          if (cell && cell !== wordUpper[i] && cell !== ' ') {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < wordUpper.length; i++) {
            positions.push({ row: startRow + i, col: startCol });
            grid[startRow + i][startCol] = wordUpper[i];
          }
          return positions;
        }
      }
    }
    return null;
  };

  const startGame = () => {
    // Get words from Oshikwanyama vocabulary data using the same function as other games
    // Get a larger pool first, then filter by word length for grid placement
    const maxWordLength = GRID_SIZE; // Allow words up to grid size
    const targetCount = levelConfig.wordCount;
    
    // Get a larger pool of words from the game data (3x the target for better filtering)
    const vocabularyPool = getRandomVocabulary(Math.min(allVocabulary.length, targetCount * 3));
    
    // Filter words - Oshikwanyama words must fit in the grid
    let suitableWords = vocabularyPool.filter(v => {
      const oshiLen = v.oshikwanyama.replace(/[^A-Z]/gi, '').length;
      // Oshikwanyama word must fit in the grid (at least 3 characters, max grid size)
      return oshiLen >= 3 && oshiLen <= maxWordLength;
    });

    // If we don't have enough suitable words from the random pool, fall back to all vocabulary
    if (suitableWords.length < targetCount) {
      const fallbackSuitable = allVocabulary.filter(v => {
        const oshiLen = v.oshikwanyama.replace(/[^A-Z]/gi, '').length;
        return oshiLen >= 3 && oshiLen <= maxWordLength;
      });
      // Shuffle and combine with what we have
      const shuffled = [...fallbackSuitable].sort(() => Math.random() - 0.5);
      suitableWords = shuffled;
    }
    
    if (suitableWords.length === 0) {
      console.error('No suitable words found for word search');
      setWords([]);
      return;
    }

    // Get more words than needed to increase chances of placement
    const shuffled = [...suitableWords].sort(() => Math.random() - 0.5);
    const vocab = shuffled.slice(0, Math.min(targetCount * 2, suitableWords.length));

    let attempts = 0;
    let bestWords: WordPosition[] = [];
    let bestGrid: string[][] | null = null;
    const minWords = Math.min(3, targetCount);

    // Try to place words, regenerate grid if needed
    while (attempts < 20) {
      const newGrid = initializeGrid();
      const newWords: WordPosition[] = [];
      
      // Try to place each word - use Oshikwanyama words in the grid
      for (const item of vocab) {
        if (newWords.length >= targetCount) break;
        
        // Try Oshikwanyama word first (this is what players will search for)
        let positions = placeWord(newGrid, item.oshikwanyama, 'horizontal');
        let direction: 'horizontal' | 'vertical' | null = positions ? 'horizontal' : null;
        
        if (!positions) {
          positions = placeWord(newGrid, item.oshikwanyama, 'vertical');
          direction = positions ? 'vertical' : null;
        }
        
        if (positions && direction) {
          newWords.push({ 
            word: item, 
            positions, 
            direction, 
            found: false 
          });
        }
      }

      // Fill remaining empty cells with random letters before comparing
      fillEmptyCells(newGrid);
      
      // Keep track of best result
      if (newWords.length > bestWords.length) {
        bestWords = newWords;
        bestGrid = newGrid;
      }

      // Accept if we got enough words
      if (newWords.length >= targetCount) {
        bestWords = newWords;
        bestGrid = newGrid;
        break;
      }
      
      attempts++;
    }

    // Fill remaining empty cells in best grid if we have one
    if (bestGrid) {
      fillEmptyCells(bestGrid);
    }

    // Ensure we have at least some words, or try with fewer words
    if (bestWords.length === 0 && vocab.length > 0) {
      // Last resort: try with smaller subset
      const smallerVocab = shuffled.slice(0, Math.min(5, shuffled.length));
      const fallbackGrid = initializeGrid();
      const fallbackWords: WordPosition[] = [];
      
      for (const item of smallerVocab) {
        // Use Oshikwanyama words in the grid
        let positions = placeWord(fallbackGrid, item.oshikwanyama, 'horizontal');
        let direction: 'horizontal' | 'vertical' = positions ? 'horizontal' : 'vertical';
        
        if (!positions) {
          positions = placeWord(fallbackGrid, item.oshikwanyama, 'vertical');
          direction = 'vertical';
        }
        
        if (positions) {
          fallbackWords.push({ 
            word: item, 
            positions, 
            direction, 
            found: false 
          });
        }
      }
      
      if (fallbackWords.length > 0) {
        // Fill remaining empty cells with random letters
        fillEmptyCells(fallbackGrid);
        bestWords = fallbackWords;
        bestGrid = fallbackGrid;
      }
    }

    if (!bestGrid || bestWords.length === 0) {
      console.error('Failed to generate word search grid');
      setWords([]);
      return;
    }

    setGrid(bestGrid);
    setWords(bestWords);
    setSelectedCells([]);
    setFoundWords(new Set());
    setScore(0);
    setTimeStarted(Date.now());
    setGameComplete(false);
    setLevelComplete(false);
  };

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleCellClick = (row: number, col: number) => {
    if (isCellInFoundWord(row, col)) return;
    
    setSelectedCells(prev => {
      const newSelection = [...prev, { row, col }];
      
      // Check if selected cells form a word (minimum 3 letters)
      if (newSelection.length >= 3) {
        // Check against all words
        words.forEach((wordPos) => {
          if (foundWords.has(wordPos.word.id)) return;
          
          // Check if selection matches word positions (forward or reverse)
          const wordPositionsStr = wordPos.positions.map(p => `${p.row},${p.col}`).sort().join('|');
          const selectedStr = newSelection.map(p => `${p.row},${p.col}`).sort().join('|');
          const selectedReverseStr = [...newSelection].reverse().map(p => `${p.row},${p.col}`).sort().join('|');
          
          if (wordPositionsStr === selectedStr || wordPositionsStr === selectedReverseStr) {
            // Found a word!
            const newFound = new Set([...foundWords, wordPos.word.id]);
            setFoundWords(newFound);
            setScore(prev => prev + levelConfig.pointsPerWord);
            setSelectedWordId(null);
            
            // Show popup with English meaning
            toast({
              title: `🎉 ${wordPos.word.oshikwanyama} Found!`,
              description: `English: ${wordPos.word.english}`,
              duration: 3000,
            });

            // Check if level complete
            if (newFound.size >= words.length) {
              setLevelComplete(true);
            }
            
            return [];
          }
        });
      }
      
      // Update selected word ID for color coding
      if (newSelection.length > 0) {
        const wordId = getSelectedWordId(row, col);
        setSelectedWordId(wordId);
      }
      
      return newSelection;
    });
  };

  const clearSelection = () => {
    setSelectedCells([]);
    setSelectedWordId(null);
  };

  useEffect(() => {
    if (selectedCells.length > 0) {
      const timer = setTimeout(() => {
        clearSelection();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedCells]);

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellInFoundWord = (row: number, col: number) => {
    return words.some(wordPos => 
      foundWords.has(wordPos.word.id) && 
      wordPos.positions.some(p => p.row === row && p.col === col)
    );
  };

  // Get which found word a cell belongs to
  const getFoundWordId = (row: number, col: number): string | null => {
    for (const wordPos of words) {
      if (foundWords.has(wordPos.word.id) && 
          wordPos.positions.some(p => p.row === row && p.col === col)) {
        return wordPos.word.id;
      }
    }
    return null;
  };

  // Color array for different words (used for both selected and found)
  const wordColors = [
    { selected: 'bg-blue-500/30 text-blue-700 border-blue-500 ring-blue-500', found: 'bg-blue-500 text-white border-blue-600 shadow-md' },
    { selected: 'bg-purple-500/30 text-purple-700 border-purple-500 ring-purple-500', found: 'bg-purple-500 text-white border-purple-600 shadow-md' },
    { selected: 'bg-pink-500/30 text-pink-700 border-pink-500 ring-pink-500', found: 'bg-pink-500 text-white border-pink-600 shadow-md' },
    { selected: 'bg-orange-500/30 text-orange-700 border-orange-500 ring-orange-500', found: 'bg-orange-500 text-white border-orange-600 shadow-md' },
    { selected: 'bg-cyan-500/30 text-cyan-700 border-cyan-500 ring-cyan-500', found: 'bg-cyan-500 text-white border-cyan-600 shadow-md' },
    { selected: 'bg-indigo-500/30 text-indigo-700 border-indigo-500 ring-indigo-500', found: 'bg-indigo-500 text-white border-indigo-600 shadow-md' },
    { selected: 'bg-teal-500/30 text-teal-700 border-teal-500 ring-teal-500', found: 'bg-teal-500 text-white border-teal-600 shadow-md' },
    { selected: 'bg-rose-500/30 text-rose-700 border-rose-500 ring-rose-500', found: 'bg-rose-500 text-white border-rose-600 shadow-md' },
  ];

  const getColorForWordId = (wordId: string, isFound: boolean = false): string => {
    const index = words.findIndex(w => w.word.id === wordId);
    const colorSet = wordColors[index % wordColors.length];
    return isFound ? colorSet.found : colorSet.selected;
  };

  // Get found word color for a cell
  const getFoundWordColor = (row: number, col: number): string | null => {
    for (const wordPos of words) {
      if (foundWords.has(wordPos.word.id) && 
          wordPos.positions.some(p => p.row === row && p.col === col)) {
        return getColorForWordId(wordPos.word.id, true);
      }
    }
    return null;
  };

  // Get which word the currently selected cells belong to (if any)
  const getSelectedWordId = (row: number, col: number): string | null => {
    if (selectedCells.length === 0) return null;
    
    // Check if this cell is part of any word's positions
    for (const wordPos of words) {
      if (foundWords.has(wordPos.word.id)) continue;
      
      // Check if all selected cells are part of this word's positions
      const selectedPositions = selectedCells.map(p => `${p.row},${p.col}`).sort();
      const wordPositions = wordPos.positions.map(p => `${p.row},${p.col}`).sort();
      const wordPositionsReverse = wordPos.positions.slice().reverse().map(p => `${p.row},${p.col}`).sort();
      
      // Check if selected cells match word positions (forward or reverse)
      if (selectedPositions.join('|') === wordPositions.join('|') || 
          selectedPositions.join('|') === wordPositionsReverse.join('|')) {
        return wordPos.word.id;
      }
    }
    return null;
  };

  const progress = words.length > 0 ? (foundWords.size / words.length) * 100 : 0;

  // Level complete screen
  if (levelComplete) {
    const levelBonus = levelConfig.bonusPoints;
    const levelScore = score + levelBonus; // Score already includes all words found
    
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
            Great job! Ready for the next challenge?
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

  if (gameComplete) {
    return null; // Should not reach here with level system
  }

  return (
    <div className="min-h-screen p-3 md:p-4 lg:p-8">
      <div className="max-w-2xl md:max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
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
            <Badge variant="outline" className="bg-success/20 text-success">
              {foundWords.size} / {words.length} found
            </Badge>
          </div>
        </div>

        <div className="text-center mb-4 md:mb-6">
          <h2 className="font-display text-xl md:text-3xl text-foreground mb-2">
            Word Search
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Find the hidden Oshikwanyama words by tapping letters in sequence
          </p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-4 md:mb-6 h-2" />

        {/* Word List - Compact display with only Oshikwanyama words */}
        {words.length > 0 ? (
          <Card className="p-3 md:p-4 mb-4 md:mb-6 bg-secondary/30">
            <h3 className="font-semibold mb-3 text-center text-sm md:text-base">Words to Find:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {words.map((wordPos) => {
                const isSelected = selectedWordId === wordPos.word.id;
                const isFound = foundWords.has(wordPos.word.id);
                return (
                  <div
                    key={wordPos.word.id}
                    className={cn(
                      "px-3 py-1.5 md:px-4 md:py-2 rounded-lg border-2 transition-all duration-200 text-center",
                      isFound
                        ? (() => {
                            const index = words.findIndex(w => w.word.id === wordPos.word.id);
                            const foundColorClasses = [
                              "bg-blue-500/20 border-blue-500 text-blue-700 line-through",
                              "bg-purple-500/20 border-purple-500 text-purple-700 line-through",
                              "bg-pink-500/20 border-pink-500 text-pink-700 line-through",
                              "bg-orange-500/20 border-orange-500 text-orange-700 line-through",
                              "bg-cyan-500/20 border-cyan-500 text-cyan-700 line-through",
                              "bg-indigo-500/20 border-indigo-500 text-indigo-700 line-through",
                              "bg-teal-500/20 border-teal-500 text-teal-700 line-through",
                              "bg-rose-500/20 border-rose-500 text-rose-700 line-through",
                            ];
                            return foundColorClasses[index % foundColorClasses.length];
                          })()
                        : isSelected
                        ? getColorForWordId(wordPos.word.id) + " ring-2"
                        : "bg-card border-border/50 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-bold text-sm md:text-base",
                        isFound && "line-through"
                      )}>
                        {wordPos.word.oshikwanyama}
                      </span>
                      {isFound && (() => {
                        const index = words.findIndex(w => w.word.id === wordPos.word.id);
                        const checkmarkColors = [
                          "text-blue-600",
                          "text-purple-600",
                          "text-pink-600",
                          "text-orange-600",
                          "text-cyan-600",
                          "text-indigo-600",
                          "text-teal-600",
                          "text-rose-600",
                        ];
                        const colorClass = checkmarkColors[index % checkmarkColors.length];
                        return <CheckCircle className={cn("w-4 h-4 flex-shrink-0", colorClass)} />;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="p-4 mb-4 text-center">
            <p className="text-muted-foreground">Loading words...</p>
            <Button onClick={startGame} className="mt-4">
              Retry
            </Button>
          </Card>
        )}

        {/* Grid */}
        {words.length > 0 && (
          <Card className="p-3 md:p-6 mb-6">
            <div className="grid gap-1 md:gap-2 justify-center max-w-full mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={cn(
                      "aspect-square w-full min-h-[36px] md:min-h-[44px] text-sm md:text-base font-bold rounded transition-all duration-200",
                      "hover:scale-105 active:scale-95 touch-manipulation",
                      (() => {
                        if (isCellInFoundWord(rowIndex, colIndex)) {
                          const foundColor = getFoundWordColor(rowIndex, colIndex);
                          return foundColor || "bg-success text-white border-2 border-success shadow-md";
                        }
                        if (isCellSelected(rowIndex, colIndex)) {
                          const wordId = getSelectedWordId(rowIndex, colIndex);
                          if (wordId) {
                            return getColorForWordId(wordId) + " ring-2";
                          }
                          return "bg-primary/30 text-primary border-2 border-primary ring-2 ring-primary";
                        }
                        return "bg-secondary/50 hover:bg-secondary border border-border";
                      })()
                    )}
                    disabled={isCellInFoundWord(rowIndex, colIndex)}
                  >
                    {cell}
                  </button>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Instructions */}
          <Card className="p-3 md:p-4 bg-primary/5 border-primary/20">
          <p className="text-xs md:text-sm text-center text-muted-foreground">
            💡 Tap letters in order to form Oshikwanyama words. Words can be horizontal or vertical.
          </p>
        </Card>
      </div>
    </div>
  );
}
