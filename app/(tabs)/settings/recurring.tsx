import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecurringScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recurring Transactions</Text>
      <Text style={styles.subtitle}>Manage your automated transactions here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
});
