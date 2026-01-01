// Game utilities for level, difficulty, and scoring

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameLevel {
  level: number;
  difficulty: Difficulty;
  wordCount: number;
  gridSize?: number;
  timeLimit?: number;
  pointsPerWord: number;
  bonusPoints: number;
}

export function getLevelConfig(level: number, gameType: 'wordsearch' | 'quiz' | 'wordmatch' | 'flashcards'): GameLevel {
  if (gameType === 'wordsearch') {
    if (level <= 1) {
      return { level: 1, difficulty: 'easy', wordCount: 5, gridSize: 8, pointsPerWord: 50, bonusPoints: 100 };
    } else if (level <= 3) {
      return { level: 2, difficulty: 'easy', wordCount: 6, gridSize: 8, pointsPerWord: 60, bonusPoints: 120 };
    } else if (level <= 5) {
      return { level: 3, difficulty: 'medium', wordCount: 7, gridSize: 8, pointsPerWord: 70, bonusPoints: 150 };
    } else if (level <= 7) {
      return { level: 4, difficulty: 'medium', wordCount: 8, gridSize: 10, pointsPerWord: 80, bonusPoints: 180 };
    } else {
      return { level: 5, difficulty: 'hard', wordCount: 10, gridSize: 10, pointsPerWord: 100, bonusPoints: 200 };
    }
  } else if (gameType === 'quiz') {
    if (level <= 1) {
      return { level: 1, difficulty: 'easy', wordCount: 5, pointsPerWord: 10, bonusPoints: 50 };
    } else if (level <= 3) {
      return { level: 2, difficulty: 'easy', wordCount: 7, pointsPerWord: 15, bonusPoints: 70 };
    } else if (level <= 5) {
      return { level: 3, difficulty: 'medium', wordCount: 10, pointsPerWord: 20, bonusPoints: 100 };
    } else if (level <= 7) {
      return { level: 4, difficulty: 'medium', wordCount: 12, pointsPerWord: 25, bonusPoints: 130 };
    } else {
      return { level: 5, difficulty: 'hard', wordCount: 15, pointsPerWord: 30, bonusPoints: 150 };
    }
  } else if (gameType === 'wordmatch') {
    if (level <= 1) {
      return { level: 1, difficulty: 'easy', wordCount: 4, pointsPerWord: 10, bonusPoints: 40 };
    } else if (level <= 3) {
      return { level: 2, difficulty: 'easy', wordCount: 6, pointsPerWord: 15, bonusPoints: 60 };
    } else if (level <= 5) {
      return { level: 3, difficulty: 'medium', wordCount: 8, pointsPerWord: 20, bonusPoints: 80 };
    } else if (level <= 7) {
      return { level: 4, difficulty: 'medium', wordCount: 10, pointsPerWord: 25, bonusPoints: 100 };
    } else {
      return { level: 5, difficulty: 'hard', wordCount: 12, pointsPerWord: 30, bonusPoints: 120 };
    }
  } else { // flashcards
    if (level <= 1) {
      return { level: 1, difficulty: 'easy', wordCount: 8, pointsPerWord: 5, bonusPoints: 40 };
    } else if (level <= 3) {
      return { level: 2, difficulty: 'easy', wordCount: 10, pointsPerWord: 8, bonusPoints: 50 };
    } else if (level <= 5) {
      return { level: 3, difficulty: 'medium', wordCount: 12, pointsPerWord: 10, bonusPoints: 60 };
    } else if (level <= 7) {
      return { level: 4, difficulty: 'medium', wordCount: 15, pointsPerWord: 12, bonusPoints: 80 };
    } else {
      return { level: 5, difficulty: 'hard', wordCount: 20, pointsPerWord: 15, bonusPoints: 100 };
    }
  }
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-success/20 text-success border-success';
    case 'medium':
      return 'bg-warning/20 text-warning border-warning';
    case 'hard':
      return 'bg-destructive/20 text-destructive border-destructive';
  }
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}
