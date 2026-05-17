import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp(email, password, name);
      if (error) {
        Alert.alert("Registration Failed", error.message || "Please try again");
      } else {

        const { error: loginError } = await signIn(email, password);
        if (loginError) {
          Alert.alert("Registration Successful", "Account created successfully. Please login.", [
            { text: "OK", onPress: () => router.replace("/(auth)/login") }
          ]);
        } else {
          router.replace("/(tabs)");
        }
      }
    } catch (error: any) {
      console.error("Register Failed:", error);
      Alert.alert("Registration Failed", error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PennyWise</Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#999"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.registerButtonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginLink}>Already have an account? Login</Text>
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
  registerButton: { backgroundColor: "#2e7d32", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  registerButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  loginLink: { textAlign: "center", marginTop: 20, color: "#2e7d32" },
});
