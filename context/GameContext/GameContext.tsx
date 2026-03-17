import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { GameSettings, GameState, Language } from "../../types/game";
import { GameContextType } from "./types";

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGameContext must be used within GameContext.Provider");
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const primaryRed = "#e74c3c";
  const chipBorderColor = isDark ? "#444" : "#ccc";
  const chipBgActive = primaryRed;

  const [settings, setSettings] = useState<GameSettings>({
    groupCount: 2,
    language: Language.English,
    roundTimer: 60,
    targetPoints: 90,
    lastWordForAll: true,
  });

  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [groupScores, setGroupScores] = useState<number[]>([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [lastWordWinner, setLastWordWinner] = useState<number | null>(null);

  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const startGame = () => {
    const data =
      settings.language === Language.English
        ? require("@/constants/wordBanks/eng.json")
        : require("@/constants/wordBanks/heb.json");
    let words = [...data.words].sort(() => Math.random() - 0.5);
    setCurrentWords(words);
    setCurrentWordIndex(0);
    setGroupScores(new Array(settings.groupCount).fill(0));
    setCurrentGroup(0);
    setLastWordWinner(null);
    setGameState(GameState.Ready);
  };

  const startTurn = () => {
    setGameState(GameState.Playing);
  };

  const endTurn = (finalScore: number) => {
    setGameState(GameState.TurnEnd);
    setGroupScores((prev) => {
      const newScores = [...prev];
      newScores[currentGroup] += finalScore;
      return newScores;
    });
  };

  const handleWordSwipe = (direction: "left" | "right", isUndo?: boolean) => {
    if (isUndo) {
      setCurrentWordIndex((idx) => idx - 1);
    } else {
      setCurrentWordIndex((idx) => idx + 1);
    }
  };

  const proceedToNextGroup = () => {
    const isRoundEnd = currentGroup === settings.groupCount - 1;
    const maxScore = Math.max(...groupScores);

    if (isRoundEnd && maxScore >= settings.targetPoints) {
      setGameState(GameState.GameOver);
    } else {
      setCurrentGroup((currentGroup + 1) % settings.groupCount);
      setGameState(GameState.Ready);
    }
  };

  const returnToSetup = () => {
    setGameState(GameState.Setup);
  };

  const assignLastWordPoint = (groupIndex: number | null) => {
    setLastWordWinner(groupIndex);
    if (groupIndex !== null) {
      setGroupScores((prev) => {
        const newScores = [...prev];
        newScores[groupIndex] += 1;
        return newScores;
      });
    }
  };

  const updateGroupScore = (diff: number) => {
    setGroupScores((prev) => {
      const newScores = [...prev];
      newScores[currentGroup] += diff;
      return newScores;
    });
  };

  const currentWord =
    currentWordIndex < currentWords.length
      ? currentWords[currentWordIndex]
      : "No more words!";

  const value: GameContextType = {
    settings,
    setSettings,
    gameState,
    currentGroup,
    groupScores,
    currentWord,
    currentWords,
    currentWordIndex,
    isDark,
    chipBorderColor,
    chipBgActive,
    onStartTurn: startTurn,
    onEndTurn: endTurn,
    onWordSwipe: handleWordSwipe,
    onUpdateGroupScore: updateGroupScore,
    onProceedToNextGroup: proceedToNextGroup,
    onReturnToSetup: returnToSetup,
    lastWordWinner,
    assignLastWordPoint,
    onStartGame: startGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
