import { GameSetup } from "@/components/game/GameSetup";
import { GameTurn } from "@/components/game/GameTurn";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { GameContext, TurnProvider } from "@/context/GameContext";
import { useGameLoop } from "@/hooks/useGameLoop";
import { GameState } from "@/types/game";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Alert, StyleSheet, useColorScheme } from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const chipBorderColor = isDark ? "#444" : "#ccc";
  const chipBgActive = isDark ? "#2e78b7" : "#0a7ea4";
  const stepperBg = isDark ? "#333" : "#e0e0e0";

  const {
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
  } = useGameLoop();

  const navigation = useNavigation() as any;

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e: any) => {
      if (gameState !== GameState.Setup) {
        // Prevent default action
        e.preventDefault();

        Alert.alert(
          "Quit Game?",
          "Are you sure you want to quit the current game? All progress will be lost.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Quit",
              style: "destructive",
              onPress: () => returnToSetup(),
            },
          ],
        );
      }
    });

    return unsubscribe;
  }, [navigation, gameState, returnToSetup]);

  if (gameState !== GameState.Setup) {
    const currentWord =
      currentWordIndex < currentWords.length ? currentWords[currentWordIndex] : "No more words!";

    return (
      <ThemedView style={styles.gameContainer}>
        <GameContext.Provider
          value={{
            settings,
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
            onProceedToNextGroup: proceedToNextGroup,
            onReturnToSetup: returnToSetup,
          }}
        >
          <TurnProvider
            gameState={gameState}
            roundTimer={settings.roundTimer}
            onTurnEnd={endTurn}
            onWordSwipe={handleWordSwipe}
          >
            <GameTurn />
          </TurnProvider>
        </GameContext.Provider>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image source={require("@/assets/images/aliRush-logo.jpg")} style={styles.reactLogo} />
      }
    >
      <GameSetup
        settings={settings}
        setSettings={setSettings}
        onStartGame={startGame}
        chipBorderColor={chipBorderColor}
        chipBgActive={chipBgActive}
        stepperBg={stepperBg}
      />
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
  gameContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
