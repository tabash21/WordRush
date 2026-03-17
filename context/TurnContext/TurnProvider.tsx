import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Animated, PanResponder } from "react-native";
import { GameState } from "../../types/game";
import { TurnContextType } from "./types";
import { useGameContext } from "../GameContext";

export const TurnContext = createContext<TurnContextType | undefined>(undefined);

export interface TurnProviderProps {
  children: ReactNode;
}

export function TurnProvider({ children }: TurnProviderProps) {
  const {
    gameState,
    settings,
    onEndTurn,
    onWordSwipe,
    onUpdateGroupScore,
  } = useGameContext();

  const { roundTimer, lastWordForAll } = settings;
  const [turnScore, setTurnScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLastWordMode, setIsLastWordMode] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const turnScoreRef = useRef(0);
  const [swipeHistory, setSwipeHistory] = useState<("left" | "right")[]>([]);

  const pan = useRef(new Animated.ValueXY()).current;

  const handleSwipe = (direction: "left" | "right") => {
    onWordSwipe(direction, false);
    
    setSwipeHistory((prev) => [...prev, direction]);
    
    if (direction === "right") {
      if (!isLastWordMode) {
        setTurnScore((s) => s + 1);
        turnScoreRef.current += 1;
      }
    } else {
      setTurnScore((s) => s - 1);
      turnScoreRef.current -= 1;
    }

    if (isLastWordMode) {
      if (direction === "right") {
        setShowWinnerModal(true);
      } else {
        setTimeout(() => onEndTurn(turnScoreRef.current), 50);
      }
    }
    
    pan.setValue({ x: 0, y: 0 });
  };

  const handleSwipeRef = useRef(handleSwipe);
  handleSwipeRef.current = handleSwipe;

  const panResponderHandlers = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 100) handleSwipeRef.current("right");
        else if (gestureState.dx < -100) handleSwipeRef.current("left");
        else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current.panHandlers;

  useEffect(() => {
    if (gameState === GameState.Ready || gameState === GameState.Playing) {
      if (gameState === GameState.Ready) {
        setTurnScore(0);
        turnScoreRef.current = 0;
        setTimeLeft(roundTimer);
        setSwipeHistory([]);
        pan.setValue({ x: 0, y: 0 });
        setIsLastWordMode(false);
        setShowWinnerModal(false);
      }
    }
  }, [gameState, roundTimer, pan]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState === GameState.Playing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (lastWordForAll) {
              setIsLastWordMode(true);
              return 0;
            } else {
              setTimeout(() => onEndTurn(turnScoreRef.current), 0);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, onEndTurn, lastWordForAll]);

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
      onUpdateGroupScore(scoreDiff);

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
        isLastWordMode,
        onTurnEnd: () => onEndTurn(turnScoreRef.current),
        showWinnerModal,
        setShowWinnerModal,
      }}
    >
      {children}
    </TurnContext.Provider>
  );
}

export function useTurnContext() {
  const context = useContext(TurnContext);
  if (!context) throw new Error("useTurnContext must be used within TurnProvider");
  return context;
}