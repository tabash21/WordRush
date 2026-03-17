import { useState } from "react";
import { GameSettings, GameState, Language } from "../types/game";

export function useGameLoop() {
  const [settings, setSettings] = useState<GameSettings>({
    groupCount: 2,
    language: Language.English,
    roundTimer: 60,
    targetPoints: 90,
  });

  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [groupScores, setGroupScores] = useState<number[]>([]);
  const [currentGroup, setCurrentGroup] = useState(0);

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

  const updateGroupScore = (diff: number) => {
    setGroupScores((prev) => {
      const newScores = [...prev];
      newScores[currentGroup] += diff;
      return newScores;
    });
  };

  return {
    settings,
    setSettings,
    gameState,
    groupScores,
    currentGroup,
    currentWords,
    currentWordIndex,
    startGame,
    startTurn,
    endTurn,
    handleWordSwipe,
    proceedToNextGroup,
    returnToSetup,
    updateGroupScore,
  };
}
