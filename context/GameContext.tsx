import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native";
import { GameSettings, GameState } from "../types/game";

// ==========================================
// 1. GAME CONTEXT (Cross-turn global state)
// ==========================================

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
  onStartTurn: () => void;
  onProceedToNextGroup: () => void;
  onReturnToSetup: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameContext must be used within GameContext.Provider");
  return context;
}

// ==========================================
// 2. TURN CONTEXT (Fast ephemeral UI state)
// ==========================================

export interface TurnContextType {
  timeLeft: number;
  turnScore: number;
  swipeHistory: ("left" | "right")[];
  pan: Animated.ValueXY;
  panResponderHandlers: any;
  undoSwipe: () => void;
  toggleSwipe: (index: number) => void;
}

export const TurnContext = createContext<TurnContextType | undefined>(undefined);

export function useTurnContext() {
  const context = useContext(TurnContext);
  if (!context) throw new Error("useTurnContext must be used within TurnProvider");
  return context;
}

interface TurnProviderProps {
  children: ReactNode;
  gameState: GameState;
  roundTimer: number;
  onTurnEnd: (score: number) => void;
  onWordSwipe: (dir: "left" | "right", isUndo?: boolean) => void;
  onToggleSwipe?: (diff: number) => void;
}

export function TurnProvider({
  children,
  gameState,
  roundTimer,
  onTurnEnd,
  onWordSwipe,
  onToggleSwipe,
}: TurnProviderProps) {
  const [turnScore, setTurnScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const turnScoreRef = useRef(0);
  const [swipeHistory, setSwipeHistory] = useState<("left" | "right")[]>([]);

  const pan = useRef(new Animated.ValueXY()).current;

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setTurnScore((s) => s + 1);
      turnScoreRef.current += 1;
    } else {
      setTurnScore((s) => s - 1);
      turnScoreRef.current -= 1;
    }
    setSwipeHistory((prev) => [...prev, direction]);
    pan.setValue({ x: 0, y: 0 });
    onWordSwipe(direction, false);
  };

  const panResponderHandlers = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 100) handleSwipe("right");
        else if (gestureState.dx < -100) handleSwipe("left");
        else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current.panHandlers;

  useEffect(() => {
    if (gameState === GameState.Playing) {
      setTurnScore(0);
      turnScoreRef.current = 0;
      setTimeLeft(roundTimer);
      setSwipeHistory([]);
      pan.setValue({ x: 0, y: 0 });
    }
  }, [gameState, roundTimer, pan]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState === GameState.Playing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimeout(() => onTurnEnd(turnScoreRef.current), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, onTurnEnd]);

  const undoSwipe = () => {
    if (swipeHistory.length === 0) return;
    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    if (lastSwipe === "right") {
      setTurnScore((s) => s - 1);
      turnScoreRef.current -= 1;
    } else {
      setTurnScore((s) => s + 1);
      turnScoreRef.current += 1;
    }
    pan.setValue({ x: 0, y: 0 });
    onWordSwipe(lastSwipe, true);
  };

  const toggleSwipe = (index: number) => {
    setSwipeHistory((prev) => {
      const newHistory = [...prev];
      const oldSwipe = newHistory[index];
      const newSwipe = oldSwipe === "right" ? "left" : "right";
      newHistory[index] = newSwipe;

      const scoreDiff = newSwipe === "right" ? 2 : -2;
      setTurnScore((s) => s + scoreDiff);
      turnScoreRef.current += scoreDiff;
      onToggleSwipe?.(scoreDiff);

      return newHistory;
    });
  };

  return (
    <TurnContext.Provider
      value={{
        timeLeft,
        turnScore,
        swipeHistory,
        pan,
        panResponderHandlers,
        undoSwipe,
        toggleSwipe,
      }}
    >
      {children}
    </TurnContext.Provider>
  );
}
