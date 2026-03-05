import { ThemedText } from "@/components/themed-text";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useGameContext } from "../../context/GameContext";

export function GameOver() {
  const { groupScores, chipBgActive, onReturnToSetup } = useGameContext();
  const winnerIndex = groupScores.indexOf(Math.max(...groupScores));

  return (
    <View style={styles.centerContent}>
      <ThemedText type="title" style={{ marginBottom: 40 }}>
        Game Over!
      </ThemedText>

      <View style={styles.scoringCard}>
        <ThemedText style={styles.winnerText}>🏆 Group {winnerIndex + 1} Wins!</ThemedText>

        <View style={styles.divider} />

        {groupScores.map((score, index) => (
          <View key={index} style={styles.row}>
            <ThemedText
              style={{
                fontSize: 20,
                color: index === winnerIndex ? "#f1c40f" : undefined,
                fontWeight: index === winnerIndex ? "bold" : "normal",
              }}
            >
              Group {index + 1}
            </ThemedText>
            <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>{score} pts</ThemedText>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: chipBgActive }]}
        onPress={onReturnToSetup}
      >
        <ThemedText style={styles.actionButtonText}>Back to Main Menu</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scoringCard: {
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    marginBottom: 40,
  },
  winnerText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f1c40f",
    textAlign: "center",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  actionButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
