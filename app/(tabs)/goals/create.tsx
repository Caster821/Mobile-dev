import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useGoals } from '../../../hooks/useGoals';
import { useApp } from '../../../context/AppContext';

export default function CreateGoalScreen() {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const { currency } = useApp();
  const { addGoal } = useGoals();

  const handleSave = async () => {
    if (!name || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid name and target amount.');
      return;
    }

    try {
      await addGoal({
        name,
        targetAmount: Number(targetAmount),
      });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save savings goal.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Goal Name</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="e.g. Vacation Fund" 
      />

      <Text style={styles.label}>Target Amount ({currency.symbol})</Text>
      <TextInput 
        style={styles.input} 
        value={targetAmount} 
        onChangeText={setTargetAmount} 
        keyboardType="decimal-pad" 
        placeholder="1000.00" 
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Create Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', paddingTop: 60 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  saveBtn: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
