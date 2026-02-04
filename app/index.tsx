import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

import WeatherCard from "../components/WeatherCard";
import Gallery from "../components/Gallery";
import ThemeApp from "../components/ThemeApp";

export default function Index() {
  const [screen, setScreen] = useState<"weather" | "gallery" | "theme">("weather");

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Pressable style={styles.btn} onPress={() => setScreen("weather")}>
          <Text style={styles.btnText}>Weather</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={() => setScreen("gallery")}>
          <Text style={styles.btnText}>Gallery</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={() => setScreen("theme")}>
          <Text style={styles.btnText}>Theme</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {screen === "weather" && <WeatherCard />}
        {screen === "gallery" && <Gallery />}
        {screen === "theme" && <ThemeApp />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#222"
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#4da8ff"
  },
  btnText: {
    color: "white",
    fontWeight: "bold"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});