import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";

const themes = {
  light: {
    background: "#ffffff",
    text: "#000000",
    card: "#f2f2f2"
  },
  dark: {
    background: "#121212",
    text: "#ffffff",
    card: "#1f1f1f"
  }
};

export default function ThemeApp() {
  const system = useColorScheme();
  const [mode, setMode] = useState(system || "light");
  const theme = themes[mode];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.text, { color: theme.text }]}>Theme: {mode}</Text>
        <Pressable
          style={styles.button}
          onPress={() => setMode(mode === "light" ? "dark" : "light")}
        >
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    padding: 30,
    borderRadius: 20,
    width: 250,
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    marginBottom: 20
  },
  button: {
    backgroundColor: "#4da8ff",
    padding: 12,
    borderRadius: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  }
});