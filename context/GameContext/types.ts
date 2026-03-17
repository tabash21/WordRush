import { GameSettings, GameState } from "../../types/game";

export interface GameContextType {
  settings: GameSettings;
  gameState: GameState;
  currentGroup: number;
  groupScores: number[];
  currentWord: string;
  currentWords: string[];
  currentWordIndex: number;
  isDark: boolean;
  chipBorderColor: string;
  chipBgActive: string;
  setSettings: (settings: GameSettings | ((prev: GameSettings) => GameSettings)) => void;
  onEndTurn: (finalScore: number) => void;
  onWordSwipe: (direction: "left" | "right", isUndo?: boolean) => void;
  onUpdateGroupScore: (diff: number) => void;
  onStartGame: () => void;
  onStartTurn: () => void;
  onProceedToNextGroup: () => void;
  onReturnToSetup: () => void;
  lastWordWinner: number | null;
  assignLastWordPoint: (groupIndex: number | null) => void;
}
