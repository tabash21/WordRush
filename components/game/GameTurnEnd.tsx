import { ThemedText } from "@/components/themed-text";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { useGameContext, useTurnContext } from "../../context/GameContext";

export function GameTurnEnd() {
  const { currentGroup, currentWordIndex, currentWords, onProceedToNextGroup } = useGameContext();
  const { turnScore, swipeHistory } = useTurnContext();

  const startIndex = currentWordIndex - swipeHistory.length;
  const correctWords: string[] = [];
  const failedWords: string[] = [];

  swipeHistory.forEach((swipe, i) => {
    const word = currentWords[startIndex + i];
    if (word) {
      if (swipe === "right") correctWords.push(word);
      else failedWords.push(word);
    }
  });
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <ThemedText style={styles.mainTitle}>Round Over!</ThemedText>
        <ThemedText style={styles.subTitle}>Team {currentGroup + 1}'s Turn</ThemedText>
      </View>

      {/* Points Earned Card */}
      <View style={styles.pointsCard}>
        <ThemedText style={styles.pointsLabel}>POINTS EARNED</ThemedText>
        <ThemedText style={[styles.pointsValue, { color: turnScore >= 0 ? "#2ecc71" : "#e74c3c" }]}>
          {turnScore > 0 ? `+${turnScore}` : turnScore}
        </ThemedText>
      </View>

      <ScrollView style={styles.listsContainer} showsVerticalScrollIndicator={false}>
        {/* Correct Words */}
        {correctWords.length > 0 && (
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#2ecc71" />
              <ThemedText style={styles.listTitle}>
                Guessed Correctly ({correctWords.length})
              </ThemedText>
            </View>
            {correctWords.map((word, index) => (
              <View key={index} style={[styles.wordCard, styles.correctWordCard]}>
                <ThemedText style={[styles.wordText, styles.correctWordText]}>{word}</ThemedText>
                <MaterialCommunityIcons name="check" size={16} color="#2ecc71" />
              </View>
            ))}
          </View>
        )}

        {/* Failed Words */}
        {failedWords.length > 0 && (
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#e74c3c" />
              <ThemedText style={styles.listTitle}>Failed Words ({failedWords.length})</ThemedText>
            </View>
            {failedWords.map((word, index) => (
              <View key={index} style={[styles.wordCard, styles.failedWordCard]}>
                <ThemedText style={[styles.wordText, styles.failedWordText]}>{word}</ThemedText>
                <MaterialCommunityIcons name="close" size={16} color="#e74c3c" />
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
        <ThemedText style={styles.nextButtonText}>NEXT TEAM'S TURN</ThemedText>
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
    backgroundColor: "#1e1e24", // dark navy/grey matches screenshot
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
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
