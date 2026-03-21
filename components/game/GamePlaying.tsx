import { ThemedText } from "@/components/common/themed-text";
import { MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGameContext } from "../../context/GameContext";
import { useTurnContext } from "../../context/TurnContext";

const TICK_SOUND = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";
const END_SOUND = "https://actions.google.com/sounds/v1/emergency/emergency_siren_short_burst.ogg";

export function GamePlaying() {
  const { settings, currentWord, assignLastWordPoint } = useGameContext();
  const {
    timeLeft,
    turnScore,
    pan,
    panResponderHandlers,
    undoSwipe,
    swipeHistory,
    isLastWordMode,
    onTurnEnd,
    showWinnerModal,
    setShowWinnerModal,
  } = useTurnContext();

  const tickPlayer = useAudioPlayer(TICK_SOUND);
  const endPlayer = useAudioPlayer(END_SOUND);

  const hintPulse = useRef(new Animated.Value(0.4)).current;

  const roundTimer = settings.roundTimer;
  const canUndo = swipeHistory.length > 0;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const chipBorderColor = isDark ? "#444" : "#ccc";
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

  // Scale and opacity for hints to show they react to swiping
  const leftHintScale = pan.x.interpolate({
    inputRange: [-150, -50, 0],
    outputRange: [1.3, 1.1, 1],
    extrapolate: "clamp",
  });

  const rightHintScale = pan.x.interpolate({
    inputRange: [0, 50, 150],
    outputRange: [1, 1.1, 1.3],
    extrapolate: "clamp",
  });

  const leftHintOpacity = pan.x.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  const rightHintOpacity = pan.x.interpolate({
    inputRange: [0, 100],
    outputRange: [0.5, 1],
    extrapolate: "clamp",
  });

  const insets = useSafeAreaInsets();

  // Calculate elapsed time progression 0 to 100 scale
  const timePassedPercentage = ((roundTimer - timeLeft) / roundTimer) * 100;

  const progressAnim = useRef(new Animated.Value(timePassedPercentage)).current;

  // Handle timer-based logic (progress animation, ticking sound, and end signal)
  useEffect(() => {
    // 1. Progress Bar Animation
    Animated.timing(progressAnim, {
      toValue: ((roundTimer - timeLeft) / roundTimer) * 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // 2. Audio: Tick sound for last 3 seconds
    if (timeLeft <= 3 && timeLeft > 0) {
      tickPlayer.play();
      tickPlayer.seekTo(0);
    }

    // 3. Audio & Haptics: Round end signal
    if (isLastWordMode && timeLeft === 0) {
      Vibration.vibrate(500);
      endPlayer.play();
    }
  }, [timeLeft, roundTimer, isLastWordMode]);

  useEffect(() => {
    if (!canUndo) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(hintPulse, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [canUndo]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.centerContent]}>
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
            backgroundColor: isLastWordMode
              ? "rgba(255, 25, 25, 0.55)"
              : isDark
                ? "#222"
                : "#fdfdfd",
            borderColor: dynamicBorderColor,
            shadowOpacity: dynamicShadowOpacity,
          },
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}
      >
        {isLastWordMode && (
          <View style={styles.lastWordBadge}>
            <ThemedText style={styles.lastWordBadgeText}>LAST WORD!</ThemedText>
          </View>
        )}
        <ThemeTextContainer word={currentWord} />
      </Animated.View>

      <View style={styles.swipeHints}>
        <Animated.View
          style={[
            styles.hintBox,
            { opacity: leftHintOpacity, transform: [{ scale: leftHintScale }] },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: "rgba(231, 76, 60, 0.15)" }]}>
            <MaterialIcons name="keyboard-double-arrow-left" size={32} color="#e74c3c" />
          </View>
          <ThemedText
            style={{
              fontSize: 10,
              fontWeight: "900",
              color: "#e74c3c",
              opacity: 0.8,
            }}
          >
            SKIP
          </ThemedText>
        </Animated.View>

        <View style={[styles.hintBox, { alignItems: "center" }]}>{/* spacer */}</View>

        <Animated.View
          style={[
            styles.hintBox,
            {
              opacity: rightHintOpacity,
              transform: [{ scale: rightHintScale }],
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: "rgba(46, 204, 113, 0.15)" }]}>
            <MaterialIcons name="keyboard-double-arrow-right" size={32} color="#2ecc71" />
          </View>
          <ThemedText
            style={{
              fontSize: 10,
              fontWeight: "900",
              color: "#2ecc71",
              opacity: 0.8,
            }}
          >
            SUCCESS
          </ThemedText>
        </Animated.View>
      </View>

      <View style={styles.undoContainer}>
        {isLastWordMode ? (
          <View style={styles.lastWordInstructions}>
            <ThemedText style={styles.instructionText}>ALL TEAMS CAN GUESS!</ThemedText>
            <ThemedText style={styles.instructionSubText}>Swipe when someone wins</ThemedText>
          </View>
        ) : canUndo ? (
          <TouchableOpacity onPress={undoSwipe} style={styles.undoButton}>
            <ThemedText style={{ fontWeight: "600" }}>Undo Swipe</ThemedText>
          </TouchableOpacity>
        ) : (
          <Animated.View style={{ opacity: hintPulse }}>
            <ThemedText style={styles.swipeHintText}>{"« Swipe Left or Right »"}</ThemedText>
          </Animated.View>
        )}
      </View>

      <Modal
        visible={showWinnerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWinnerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="emoji-events"
              size={48}
              color="#FFD700"
              style={{ marginBottom: 10 }}
            />
            <ThemedText style={styles.modalTitle}>Last Word Winner!</ThemedText>
            <ThemedText style={styles.modalSubTitle}>Who guessed it correctly?</ThemedText>

            <View style={styles.winnerGrid}>
              {Array.from({ length: settings.groupCount }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    assignLastWordPoint(i);
                    setShowWinnerModal(false);
                    onTurnEnd();
                  }}
                  style={styles.winnerBtn}
                >
                  <ThemedText style={styles.winnerBtnText}>TEAM {i + 1}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => {
                assignLastWordPoint(null);
                setShowWinnerModal(false);
                onTurnEnd();
              }}
              style={styles.noWinnerBtn}
            >
              <ThemedText style={styles.noWinnerBtnText}>NO ONE</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: "100%",
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
    bottom: 10,
    width: "100%",
    alignItems: "center",
  },
  undoButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    borderRadius: 20,
  },
  swipeHintText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  lastWordBackground: {
    backgroundColor: "rgba(211, 47, 47, 0.1)",
  },
  lastWordBadge: {
    position: "absolute",
    top: -15,
    backgroundColor: "#FFD700",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  lastWordBadgeText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 12,
  },
  lastWordInstructions: {
    alignItems: "center",
    gap: 4,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#e74c3c",
  },
  instructionSubText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1e1e24",
    width: "90%",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 5,
  },
  modalSubTitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 24,
    fontWeight: "600",
  },
  winnerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    width: "100%",
  },
  winnerBtn: {
    backgroundColor: "rgba(231, 76, 60, 0.15)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    minWidth: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.3)",
  },
  winnerBtnText: {
    fontWeight: "800",
    color: "#e74c3c",
  },
  noWinnerBtn: {
    marginTop: 20,
    paddingVertical: 10,
  },
  noWinnerBtnText: {
    color: "#888",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
