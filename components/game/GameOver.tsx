import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View, useColorScheme } from "react-native";

import { useGameContext } from "../../context/GameContext";

export function GameOver() {
  const { groupScores, onReturnToSetup } = useGameContext();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Create a ranked list of scores
  const rankedScores = groupScores
    .map((score, index) => ({ name: `Group ${index + 1}`, score, index }))
    .sort((a, b) => b.score - a.score);

  const topScore = rankedScores[0].score;
  const winners = rankedScores.filter((s) => s.score === topScore);
  const isDraw = winners.length > 1;

  const cardBg = isDark ? "#2A2A2A" : "#FFFFFF";
  const rowBgSecondary = isDark ? "rgba(255, 255, 255, 0.05)" : "#F5F5F7";
  const winnerColor = "#FFD700"; // Gold color for winner name
  const primaryRed = "#e74c3c"; // Primary color from mockup

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={[styles.trophyContainer, { backgroundColor: isDark ? "#443C22" : "#FFF4E0" }]}>
          <Ionicons name="trophy" size={50} color={winnerColor} />
        </View>
        <ThemedText style={styles.gameOverText}>GAME OVER</ThemedText>
        <View style={styles.winnerNameContainer}>
          <ThemedText style={[styles.winnerName, { color: winnerColor }]}>
            {isDraw ? "ITS A DRAW!" : winners[0].name.toUpperCase()}
          </ThemedText>
          {!isDraw && <ThemedText style={styles.winsText}>
            WINS!
          </ThemedText>}
        </View>
      </View>

      {/* Scoreboard Card */}
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <ThemedText style={styles.cardTitle}>Final Scoreboard</ThemedText>
        <View style={[styles.divider, { backgroundColor: isDark ? "#444" : "#EEE" }]} />

        <ScrollView style={styles.scoreboardContent} nestedScrollEnabled={true}>
          {rankedScores.map((item, index) => {
            const isWinner = item.score === topScore;
            return (
              <View
                key={item.index}
                style={[
                  styles.scoreRow,
                  isWinner
                    ? { backgroundColor: primaryRed, shadowColor: primaryRed }
                    : { backgroundColor: rowBgSecondary },
                ]}
              >
                <View style={styles.rowLeft}>
                  <ThemedText style={[styles.rank, isWinner && styles.whiteText]}>
                    {index + 1}.
                  </ThemedText>
                  <ThemedText style={[styles.groupName, isWinner && styles.whiteText]}>
                    {item.name}
                  </ThemedText>
                </View>
                <View style={styles.rowRight}>
                  <ThemedText style={[styles.scoreValue, isWinner && styles.whiteText]}>
                    {item.score}
                  </ThemedText>
                  <ThemedText style={[styles.ptsLabel, isWinner && styles.whiteText]}>
                    PTS
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.playAgainButton, { backgroundColor: primaryRed }]}
        onPress={onReturnToSetup}
      >
        <Ionicons name="refresh-outline" size={24} color="#FFF" style={{ marginRight: 10 }} />
        <ThemedText style={styles.playAgainText}>PLAY AGAIN</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  trophyContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  gameOverText: {
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "700",
    color: "#D32F2F",
    marginBottom: 5,
  },
  winnerNameContainer: {
    alignItems: "center",
  },
  winnerName: {
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    height: 50,
    textAlignVertical: "center",
  },
  winsText: {
    fontSize: 48,
    fontWeight: "900",
    height: 40,
    textAlignVertical: "center",
  },
  card: {
    width: "100%",
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginVertical: 30,
  },
  scoreboardContent: {
    maxHeight: 170,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    fontWeight: "900",
    marginRight: 12,
    opacity: 0.5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "700",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "900",
    marginRight: 4,
  },
  ptsLabel: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.6,
  },
  whiteText: {
    color: "#FFFFFF",
    opacity: 1,
  },
  playAgainButton: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playAgainText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
