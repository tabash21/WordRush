import { StyleSheet, View } from "react-native";
import { useGameContext } from "../../context/GameContext";
import { GameState } from "../../types/game";
import { GameOver } from "./GameOver";
import { GamePlaying } from "./GamePlaying";
import { GameReady } from "./GameReady";
import { GameTurnEnd } from "./GameTurnEnd";

export function GameTurn() {
  const { gameState } = useGameContext();
  return (
    <View style={styles.container}>
      {gameState === GameState.Ready && <GameReady />}

      {gameState === GameState.Playing && <GamePlaying />}

      {gameState === GameState.TurnEnd && <GameTurnEnd />}

      {gameState === GameState.GameOver && <GameOver />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
