import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';

const PROJECTS = [
  { id: '1', name: 'Website Redesign', status: 'In Progress' },
  { id: '2', name: 'Mobile App Launch', status: 'Pending' },
  { id: '3', name: 'Marketing Campaign', status: 'Completed' },
];

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Projects</Text>
      <FlatList
        data={PROJECTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/projects/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardStatus}>{item.status}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardStatus: { fontSize: 14, color: 'gray', marginTop: 4 }
});