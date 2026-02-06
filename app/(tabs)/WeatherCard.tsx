import { View, Text, StyleSheet, Image } from "react-native";

export default function WeatherCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.city}>Dakar</Text>
      <Text style={styles.temp}>32°</Text>

      <View style={styles.conditionRow}>
        <Image
          source={{ uri: "https://openweathermap.org/img/wn/01d.png" }}
          style={styles.icon}
        />
        <Text style={styles.description}>Sunny</Text>
      </View>

      <View style={styles.highLowRow}>
        <Text style={styles.high}>H: 36°</Text>
        <Text style={styles.low}>L: 25°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#4da8ff",
    padding: 20,
    borderRadius: 20,
    width: 260,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  },
  city: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
  },
  temp: {
    fontSize: 70,
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    width: 50,
    height: 50
  },
  description: {
    fontSize: 18,
    color: "white",
    marginLeft: 8
  },
  highLowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  high: {
    color: "white",
    fontSize: 16
  },
  low: {
    color: "white",
    fontSize: 16
  }
});