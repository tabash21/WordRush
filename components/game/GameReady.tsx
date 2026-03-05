import { ThemedText } from "@/components/themed-text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useGameContext } from "../../context/GameContext";

export function GameReady() {
  const { currentGroup, groupScores, settings, onStartTurn } = useGameContext();
  const targetPoints = settings.targetPoints;
  return (
    <View style={styles.centerContent}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.teamTitle}>TEAM {currentGroup + 1}</ThemedText>
        <ThemedText style={styles.mainTitle}>Get Ready!</ThemedText>
      </View>

      <View style={styles.scoreboardCard}>
        <View style={styles.scoreboardHeader}>
          <ThemedText style={styles.scoreboardLabel}>SCOREBOARD</ThemedText>
          <ThemedText style={styles.targetLabel}>Target: {targetPoints}</ThemedText>
        </View>

        <ScrollView style={styles.scoreboardContent} nestedScrollEnabled={true}>
          {groupScores.map((score, index) => {
            const isActive = index === currentGroup;
            const progressPercentage = Math.min((score / targetPoints) * 100, 100);

            return (
              <View key={index} style={styles.teamRow}>
                <View style={styles.teamRowHeader}>
                  <ThemedText style={[styles.teamNameText, isActive && styles.activeTeamText]}>
                    Team {index + 1}
                  </ThemedText>
                  <ThemedText style={[styles.teamScoreText, isActive && styles.activeScoreText]}>
                    {score}/{targetPoints}
                  </ThemedText>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      isActive && styles.activeProgressBarFill,
                      { width: `${progressPercentage}%` },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.middleActionContainer}>
        <View style={styles.pulseGlow}>
          <TouchableOpacity
            style={styles.actionCircleButton}
            onPress={onStartTurn}
            activeOpacity={0.8}
          >
            <View style={styles.actionInnerCircle}>
              <MaterialCommunityIcons name="gesture-tap" size={56} color="#fff" />
              <ThemedText style={styles.actionButtonText}>TAP TO START</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.howToPlayCard}>
        <View style={styles.howToPlayIconBox}>
          <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#e74c3c" />
        </View>
        <View style={styles.howToPlayTextContainer}>
          <ThemedText style={styles.howToPlayTitle}>HOW TO PLAY</ThemedText>
          <ThemedText style={styles.howToPlayDescription}>
            Explain the words to your teammates{" "}
            <ThemedText style={styles.howToPlayHighlight}>
              without saying the word itself
            </ThemedText>{" "}
            or any part of it!
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    top: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#e74c3c",
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: "900",
    height: 40,
    textAlignVertical: "center",
    color: "#fff",
    letterSpacing: -1,
  },
  scoreboardCard: {
    width: "90%",
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  scoreboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreboardContent: {
    maxHeight: 120,
  },
  scoreboardLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6b829e",
    letterSpacing: 1,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#e74c3c",
  },
  teamRow: {
    marginBottom: 16,
  },
  teamRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  teamNameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#888",
  },
  teamScoreText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#dda800",
  },
  activeTeamText: {
    color: "#fff",
  },
  activeScoreText: {
    color: "#e74c3c",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#2c3e50",
    borderRadius: 4,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6b829e",
    borderRadius: 4,
  },
  activeProgressBarFill: {
    backgroundColor: "#e74c3c",
  },
  middleActionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  pulseGlow: {
    width: 260,
    height: 260,
    borderRadius: 140,
    backgroundColor: "rgba(231, 76, 60, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionCircleButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  actionInnerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
    letterSpacing: -1,
  },
  howToPlayCard: {
    width: "90%",
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  howToPlayIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(231, 76, 60, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  howToPlayTextContainer: {
    flex: 1,
  },
  howToPlayTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ccc",
    letterSpacing: 1,
    marginBottom: 4,
  },
  howToPlayDescription: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 20,
  },
  howToPlayHighlight: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
});
