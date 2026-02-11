import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Project #${id}` }} />
      <Text style={styles.title}>Project Details</Text>
      <Text style={styles.text}>Viewing details for ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  text: { fontSize: 16, marginTop: 10 }
});