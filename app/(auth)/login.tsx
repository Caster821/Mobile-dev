import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    
    setLoading(true);
    console.log("Login button pressed, email:", email);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        Alert.alert("Login Failed", error.message || "Invalid credentials");
      } else {
        console.log("Login successful, user:", data?.user?.email);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Login catch block:", error);
      Alert.alert("Login Failed", error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PennyWise</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.registerLink}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2e7d32", padding: 20, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 50 },
  title: { fontSize: 42, fontWeight: "bold", color: "white", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "rgba(255,255,255,0.8)" },
  form: { backgroundColor: "white", borderRadius: 20, padding: 24 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 15 },
  loginButton: { backgroundColor: "#2e7d32", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  loginButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  registerLink: { textAlign: "center", marginTop: 20, color: "#2e7d32" },
});
