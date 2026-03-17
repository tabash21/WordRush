import { ThemedText } from "@/components/common/themed-text";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { useGameContext } from "../../context/GameContext";
import { useTurnContext } from "../../context/TurnContext";

export function GameTurnEnd() {
  const {
    settings,
    currentGroup,
    currentWordIndex,
    currentWords,
    onProceedToNextGroup,
    lastWordWinner,
  } = useGameContext();
  const { turnScore, swipeHistory, toggleSwipe, isLastWordMode } =
    useTurnContext();

  const startIndex = currentWordIndex - swipeHistory.length;

  const wordEntries = swipeHistory.map((swipe, i) => ({
    originalIndex: i,
    word: currentWords[startIndex + i],
    swipe,
  }));

  // Exclude the last word from the main list if it was a "Last Word" swipe
  const displayEntries = isLastWordMode
    ? wordEntries.slice(0, -1)
    : wordEntries;

  const correctWords = displayEntries.filter((e) => e.swipe === "right");
  const failedWords = displayEntries.filter((e) => e.swipe === "left");

  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <ThemedText style={styles.mainTitle}>Round Over!</ThemedText>
        <ThemedText style={styles.subTitle}>
          Team {currentGroup + 1}&apos;s Turn
        </ThemedText>
      </View>

      {/* Points Earned Card */}
      <View style={styles.pointsCard}>
        <ThemedText style={styles.pointsLabel}>POINTS EARNED</ThemedText>
        <ThemedText
          style={[
            styles.pointsValue,
            { color: turnScore >= 0 ? "#2ecc71" : "#e74c3c" },
          ]}
        >
          {turnScore > 0 ? `+${turnScore}` : turnScore}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.listsContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Word Section */}
        {settings.lastWordForAll &&
          isLastWordMode &&
          swipeHistory[swipeHistory.length - 1] === "right" && (
            <View style={styles.listSection}>
              <View style={styles.listHeader}>
                <MaterialCommunityIcons
                  name="trophy-variant"
                  size={20}
                  color="#FFD700"
                />
                <ThemedText style={styles.listTitle}>
                  Last Word Winner
                </ThemedText>
              </View>
              <View style={styles.lastWordWinnerStatusInfo}>
                {lastWordWinner !== null ? (
                  <View style={styles.winnerInfoPill}>
                    <MaterialCommunityIcons
                      name="star"
                      size={20}
                      color="#FFD700"
                    />
                    <ThemedText style={styles.winnerInfoText}>
                      TEAM {lastWordWinner + 1} EARNED THE POINT!
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText style={styles.noWinnerInfoText}>
                    NO TEAM GUESSED CORRECTLY
                  </ThemedText>
                )}
              </View>
            </View>
          )}
        {/* Correct Words */}
        {correctWords.length > 0 && (
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#2ecc71"
              />
              <ThemedText style={styles.listTitle}>
                Guessed Correctly ({correctWords.length})
              </ThemedText>
            </View>
            {correctWords.map((entry) => (
              <View
                key={entry.originalIndex}
                style={[styles.wordCard, styles.correctWordCard]}
              >
                <View style={styles.wordInfo}>
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color="#2ecc71"
                  />
                  <ThemedText style={[styles.wordText, styles.correctWordText]}>
                    {entry.word}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => toggleSwipe(entry.originalIndex)}
                  style={styles.toggleButton}
                  activeOpacity={0.6}
                >
                  <MaterialCommunityIcons
                    name="swap-horizontal"
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Failed Words */}
        {failedWords.length > 0 && (
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color="#e74c3c"
              />
              <ThemedText style={styles.listTitle}>
                Failed Words ({failedWords.length})
              </ThemedText>
            </View>
            {failedWords.map((entry) => (
              <View
                key={entry.originalIndex}
                style={[styles.wordCard, styles.failedWordCard]}
              >
                <View style={styles.wordInfo}>
                  <MaterialCommunityIcons
                    name="close"
                    size={16}
                    color="#e74c3c"
                  />
                  <ThemedText style={[styles.wordText, styles.failedWordText]}>
                    {entry.word}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => toggleSwipe(entry.originalIndex)}
                  style={styles.toggleButton}
                  activeOpacity={0.6}
                >
                  <MaterialCommunityIcons
                    name="swap-horizontal"
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={onProceedToNextGroup}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.nextButtonText}>
          NEXT TEAM&apos;S TURN
        </ThemedText>
        <MaterialIcons name="arrow-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#e74c3c",
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
    fontWeight: "600",
  },
  pointsCard: {
    backgroundColor: "#1e1e24",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 56,
    fontWeight: "900",
    height: 45,
    textAlign: "center",
    textAlignVertical: "center",
  },
  listsContainer: {
    flex: 1,
  },
  listSection: {
    marginBottom: 24,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  wordCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  wordInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  lastWordWinnerStatusInfo: {
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  winnerInfoPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  winnerInfoText: {
    fontWeight: "900",
    color: "#FFD700",
    fontSize: 14,
  },
  noWinnerInfoText: {
    color: "#888",
    fontWeight: "700",
    fontSize: 14,
  },
  groupPickBtn: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.2)",
    alignItems: "center",
  },
  groupPickBtnActive: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
  },
  groupPickText: {
    fontWeight: "800",
    fontSize: 12,
    color: "#888",
  },
  groupPickTextActive: {
    color: "#000",
  },
  correctWordCard: {
    backgroundColor: "rgba(46, 204, 113, 0.15)",
  },
  failedWordCard: {
    backgroundColor: "rgba(231, 76, 60, 0.15)",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "700",
  },
  correctWordText: {
    color: "#2ecc71",
  },
  failedWordText: {
    color: "#e74c3c",
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
