import ParallaxScrollView from "@/components/common/parallax-scroll-view";
import { Game } from "@/components/game/Game";
import { GameSetup } from "@/components/game/GameSetup";
import { useGameContext } from "@/context/GameContext";
import { GameState } from "@/types/game";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const { settings, gameState, onStartGame, setSettings } = useGameContext();

  if (gameState !== GameState.Setup) {
    return <Game />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image source={require("@/assets/images/wordRush.png")} style={styles.reactLogo} />
      }
    >
      <GameSetup settings={settings} setSettings={setSettings} onStartGame={onStartGame} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
