import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGameContext, useTurnContext } from "../../context/GameContext";

export function GamePlaying() {
  const { settings, currentWord, isDark, chipBorderColor } = useGameContext();
  const { timeLeft, turnScore, pan, panResponderHandlers, undoSwipe, swipeHistory } =
    useTurnContext();

  const roundTimer = settings.roundTimer;
  const canUndo = swipeHistory.length > 0;
  // Interpolate side swipe to create dynamic border colors indicating the action
  const dynamicBorderColor = pan.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ["rgba(231, 76, 60, 1)", chipBorderColor, "rgba(46, 204, 113, 1)"],
    extrapolate: "clamp",
  });

  const dynamicShadowOpacity = pan.x.interpolate({
    inputRange: [-100, -50, 0, 50, 100],
    outputRange: [0.8, 0.4, 0.1, 0.4, 0.8],
    extrapolate: "clamp",
  });

  const dynamicShadowColor = pan.x.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["#e74c3c", "#000", "#2ecc71"],
  });

  const insets = useSafeAreaInsets();

  // Calculate elapsed time progression 0 to 100 scale
  const timePassedPercentage = ((roundTimer - timeLeft) / roundTimer) * 100;

  const progressAnim = useRef(new Animated.Value(timePassedPercentage)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: ((roundTimer - timeLeft) / roundTimer) * 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, roundTimer]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.centerContent}>
      {/* Linear progress bar at the very top */}
      <View style={[styles.progressBarContainer, { top: insets.top }]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
              backgroundColor: "#e74c3c",
            },
          ]}
        />
      </View>
      <View style={[styles.header, { top: insets.top + 20 }]}>
        <View style={styles.headerBlock}>
          <ThemedText style={styles.headerLabel}>TIME LEFT</ThemedText>
          <View style={styles.headerValRow}>
            <MaterialIcons name="timer" size={22} color="#e74c3c" />
            <ThemedText style={styles.headerVal}>{timeLeft}s</ThemedText>
          </View>
        </View>

        <View style={[styles.headerBlock, { alignItems: "flex-end" }]}>
          <ThemedText style={styles.headerLabel}>POINTS</ThemedText>
          <View style={styles.headerValRow}>
            <ThemedText style={styles.headerVal}>{turnScore}</ThemedText>
            <MaterialIcons name="star" size={22} color="#f1c40f" />
          </View>
        </View>
      </View>

      <Animated.View
        {...panResponderHandlers}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "#222" : "#fdfdfd",
            borderColor: dynamicBorderColor,
            shadowOpacity: dynamicShadowOpacity,
            shadowColor: dynamicShadowColor as any,
          },
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}
      >
        <ThemeTextContainer word={currentWord} />
      </Animated.View>

      <View style={styles.swipeHints}>
        <View style={styles.hintBox}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(231, 76, 60, 0.15)" }]}>
            <MaterialIcons name="arrow-back" size={32} color="#e74c3c" />
          </View>
          <ThemedText style={[styles.hintSub, { color: "#e74c3c", marginTop: 8 }]}>Skip</ThemedText>
        </View>
        <View style={[styles.hintBox, { alignItems: "center" }]}>{/* spacer */}</View>
        <View style={[styles.hintBox, { alignItems: "flex-end" }]}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(46, 204, 113, 0.15)" }]}>
            <MaterialIcons name="arrow-forward" size={32} color="#2ecc71" />
          </View>
          <ThemedText style={[styles.hintSub, { color: "#2ecc71", marginTop: 8 }]}>
            Success
          </ThemedText>
        </View>
      </View>

      <View style={styles.undoContainer}>
        {canUndo && (
          <TouchableOpacity onPress={undoSwipe} style={styles.undoButton}>
            <IconSymbol size={24} name="arrow.uturn.backward" color={isDark ? "#fff" : "#000"} />
            <ThemedText style={{ marginLeft: 8, fontWeight: "600" }}>Undo Swipe</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Inner view for properly padding and wrapping the text inside the card avoiding Animated interference
function ThemeTextContainer({ word }: { word: string }) {
  return (
    <View style={styles.cardTextContainer}>
      <ThemedText
        style={styles.cardText}
        adjustsFontSizeToFit
        numberOfLines={3}
        minimumFontScale={0.3}
      >
        {word}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  progressBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
    zIndex: 20,
  },
  progressBar: {
    height: "100%",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    paddingHorizontal: 30,
    zIndex: 10,
  },
  headerBlock: {
    alignItems: "flex-start",
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerValRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerVal: {
    fontSize: 26,
    fontWeight: "900",
  },
  card: {
    width: "75%",
    aspectRatio: 3 / 4,
    borderWidth: 4,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  cardTextContainer: {
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  cardText: {
    fontSize: 35,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
    height: 50,
  },
  swipeHints: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 80,
    paddingHorizontal: 40,
    zIndex: 10,
  },
  hintBox: {
    alignItems: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  hintSub: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  undoContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  undoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    borderRadius: 20,
  },
});
