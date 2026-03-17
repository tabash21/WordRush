import ParallaxScrollView from "@/components/common/parallax-scroll-view";
import { ThemedView } from "@/components/common/themed-view";
import { GameSetup } from "@/components/game/GameSetup";
import { GameTurn } from "@/components/game/GameTurn";
import { GameContext, GameProvider, useGameContext } from "@/context/GameContext";
import { TurnProvider } from "@/context/TurnContext";
import { GameState } from "@/types/game";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Alert, StyleSheet } from "react-native";

function GameContent() {
  const {
    settings,
    gameState,
    onStartGame,
    onReturnToSetup,
    setSettings,
    chipBorderColor,
    chipBgActive,
    isDark,
  } = useGameContext();
  
  const navigation = useNavigation() as any;

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e: any) => {
      if (gameState !== GameState.Setup) {
        e.preventDefault();
        Alert.alert(
          "Quit Game?",
          "Are you sure you want to quit the current game? All progress will be lost.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Quit",
              style: "destructive",
              onPress: () => onReturnToSetup(),
            },
          ],
        );
      }
    });
    return unsubscribe;
  }, [navigation, gameState, onReturnToSetup]);

  if (gameState !== GameState.Setup) {
    return (
      <ThemedView style={styles.gameContainer}>
        <TurnProvider>
          <GameTurn />
        </TurnProvider>
      </ThemedView>
    );
  }

  const stepperBg = isDark ? "#333" : "#e0e0e0";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/aliRush-logo.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <GameSetup
        settings={settings}
        setSettings={setSettings}
        onStartGame={onStartGame}
        chipBorderColor={chipBorderColor}
        chipBgActive={chipBgActive}
        stepperBg={stepperBg}
      />
    </ParallaxScrollView>
  );
}

export default function HomeScreen() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
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
  gameContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
