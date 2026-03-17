import { ThemedText } from "@/components/common/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GameSettings, Language } from "../../types/game";

interface SetupProps {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onStartGame: () => void;
  chipBorderColor: string;
  chipBgActive: string;
  stepperBg: string;
}

export function GameSetup({ settings, setSettings, onStartGame }: SetupProps) {
  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const primaryRed = "#e74c3c"; // Brighter red for play button and add icon

  return (
    <View style={styles.container}>
      {/* Number of Groups */}
      <View style={styles.settingContainer}>
        <View style={styles.labelRow}>
          <Ionicons name="people" size={18} color={primaryRed} />
          <ThemedText style={styles.sectionLabel}>NUMBER OF GROUPS</ThemedText>
        </View>
        <View style={styles.chipRow}>
          {[2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.groupChip,
                settings.groupCount === num
                  ? {
                      borderColor: primaryRed,
                      backgroundColor: "rgba(211, 84, 0, 0.15)",
                    }
                  : { backgroundColor: "rgba(255, 255, 255, 0.05)" },
              ]}
              onPress={() => updateSetting("groupCount", num)}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  settings.groupCount === num && { color: "#fff" },
                ]}
              >
                {num}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Round Timer */}
      <View style={styles.settingContainer}>
        <View style={styles.labelRow}>
          <Ionicons name="timer-outline" size={18} color={primaryRed} />
          <ThemedText style={styles.sectionLabel}>ROUND TIMER</ThemedText>
        </View>
        <View style={styles.timerGrid}>
          {[
            { val: 30, label: "30s" },
            { val: 60, label: "1m" },
            { val: 90, label: "1.5m" },
            { val: 120, label: "2m" },
          ].map((time) => (
            <TouchableOpacity
              key={time.val}
              style={[
                styles.timerChip,
                settings.roundTimer === time.val
                  ? {
                      borderColor: primaryRed,
                      backgroundColor: "rgba(211, 84, 0, 0.15)",
                    }
                  : { backgroundColor: "rgba(255, 255, 255, 0.05)" },
              ]}
              onPress={() => updateSetting("roundTimer", time.val)}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  settings.roundTimer === time.val && { color: "#fff" },
                ]}
              >
                {time.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Language Selection */}
      <View style={styles.settingContainer}>
        <View style={styles.labelRow}>
          <Ionicons name="globe-outline" size={18} color={primaryRed} />
          <ThemedText style={styles.sectionLabel}>
            LANGUAGE SELECTION
          </ThemedText>
        </View>
        <View style={styles.chipRow}>
          {[
            { id: Language.English, label: "ENG", flag: "🇬🇧" },
            { id: Language.Hebrew, label: "HEB", flag: "🇮🇱" },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={[
                styles.langChip,
                settings.language === lang.id
                  ? {
                      borderColor: primaryRed,
                      backgroundColor: "rgba(211, 84, 0, 0.15)",
                    }
                  : { backgroundColor: "rgba(255, 255, 255, 0.05)" },
              ]}
              onPress={() => updateSetting("language", lang.id)}
            >
              <View style={styles.langInner}>
                <ThemedText style={styles.flagText}>{lang.flag}</ThemedText>
                <ThemedText
                  style={[
                    styles.chipText,
                    settings.language === lang.id && { color: "#fff" },
                  ]}
                >
                  {lang.label}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Target Points */}
      <View style={styles.settingContainer}>
        <View style={styles.labelRow}>
          <Ionicons name="trophy-outline" size={18} color={primaryRed} />
          <ThemedText style={styles.sectionLabel}>TARGET POINTS</ThemedText>
        </View>
        <View style={styles.stepperPill}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() =>
              updateSetting(
                "targetPoints",
                Math.max(50, settings.targetPoints - 10),
              )
            }
          >
            <Ionicons name="remove" size={24} color="#FFF" />
          </TouchableOpacity>
          <ThemedText style={styles.pointsText}>
            {settings.targetPoints}
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.stepperBtn,
              { backgroundColor: "rgba(231, 76, 60, 0.1)" },
            ]}
            onPress={() =>
              updateSetting(
                "targetPoints",
                Math.min(150, settings.targetPoints + 10),
              )
            }
          >
            <Ionicons name="add" size={24} color={primaryRed} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Last Word for All Toggle */}
      <View style={styles.settingContainer}>
        <View style={styles.labelRow}>
          <Ionicons name="flash-outline" size={18} color={primaryRed} />
          <ThemedText style={styles.sectionLabel}>LAST WORD FOR ALL</ThemedText>
        </View>
        <TouchableOpacity
          style={[
            styles.togglePill,
            settings.lastWordForAll
              ? {
                  backgroundColor: "rgba(231, 76, 60, 0.15)",
                  borderColor: primaryRed,
                }
              : { backgroundColor: "rgba(255, 255, 255, 0.05)" },
          ]}
          onPress={() =>
            updateSetting("lastWordForAll", !settings.lastWordForAll)
          }
        >
          <ThemedText
            style={[
              styles.chipText,
              settings.lastWordForAll && { color: "#fff" },
            ]}
          >
            {settings.lastWordForAll ? "ACTIVE" : "INACTIVE"}
          </ThemedText>
          <Ionicons
            name={
              settings.lastWordForAll ? "checkmark-circle" : "ellipse-outline"
            }
            size={24}
            color={settings.lastWordForAll ? primaryRed : "#6b829e"}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: primaryRed }]}
        onPress={onStartGame}
      >
        <Ionicons name="play" size={22} color="#fff" />
        <ThemedText style={styles.playButtonText}>START GAME</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 25,
    paddingTop: 10,
    marginBottom: 40,
  },
  settingContainer: {
    gap: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6b829e",
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: "row",
    gap: 12,
  },
  groupChip: {
    flex: 1,
    height: 70,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  timerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timerChip: {
    width: "48%",
    height: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  langChip: {
    flex: 1,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  langInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagText: {
    fontSize: 22,
  },
  chipText: {
    fontWeight: "900",
    fontSize: 18,
    color: "#6b829e",
  },
  stepperPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 18,
    padding: 8,
    width: "100%",
  },
  stepperBtn: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pointsText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFF",
  },
  playButton: {
    flexDirection: "row",
    height: 65,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  togglePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: "100%",
    borderWidth: 2,
    borderColor: "transparent",
  },
});
