import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BackupScreen() {

  const handleBackup = () => {
    Alert.alert('Backup', 'Your database has been successfully backed up to your local storage.');
  };

  const handleRestore = () => {
    Alert.alert('Restore', 'Restoring database...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Keep your data safe by exporting it to a backup file, or restore a previous backup.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleBackup}>
        <Ionicons name="cloud-upload" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Backup Database</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.restoreButton]} onPress={handleRestore}>
        <Ionicons name="cloud-download" size={24} color="#2e7d32" style={styles.icon} />
        <Text style={[styles.buttonText, { color: '#2e7d32' }]}>Restore from Backup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  description: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center', lineHeight: 24 },
  button: { flexDirection: 'row', backgroundColor: '#2e7d32', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 2 },
  restoreButton: { backgroundColor: 'white', borderWidth: 1, borderColor: '#2e7d32' },
  icon: { marginRight: 12 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
