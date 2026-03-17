import { ReactNode } from "react";
import { Animated } from "react-native";
import { GameState } from "../../types/game";

export interface TurnContextType {
  timeLeft: number;
  turnScore: number;
  swipeHistory: ("left" | "right")[];
  pan: Animated.ValueXY;
  panResponderHandlers: any;
  undoSwipe: () => void;
  toggleSwipe: (index: number) => void;
  isLastWordMode: boolean;
  onTurnEnd: () => void;
  showWinnerModal: boolean;
  setShowWinnerModal: (show: boolean) => void;
}
