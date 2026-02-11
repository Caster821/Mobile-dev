import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ProManager</Text>
      <Button title="Sign In" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' }
});