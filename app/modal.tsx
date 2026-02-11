import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Modal() {
  const router = useRouter();
  const isPresented = router.canGoBack();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Project</Text>
      <Text style={styles.subtitle}>Form inputs would go here...</Text>
      {isPresented && <Button title="Close" onPress={() => router.back()} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'gray', marginVertical: 20 }
});