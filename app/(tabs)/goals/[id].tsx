import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useGoals } from '../../../hooks/useGoals';
import { useApp, useTheme } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { getGoal } from '../../../database/database';

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { currency } = useApp();
  const colors = useTheme();
  const { updateGoal, deleteGoal } = useGoals();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user || !id) return;
      try {
        const goal = await getGoal(id, user.id);
        setName(goal.name);
        setTargetAmount(goal.targetAmount.toString());
        setCurrentAmount((goal.currentAmount || 0).toString());
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to load goal');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleSave = async () => {
    if (!name || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid name and target amount.');
      return;
    }
    try {
      await updateGoal({
        _id: id,
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
      });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update goal.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGoal(id!);
            router.back();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete goal');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Goal Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Vacation Fund"
        placeholderTextColor={colors.subtext}
      />

      <Text style={[styles.label, { color: colors.text }]}>Target Amount ({currency.symbol})</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        value={targetAmount}
        onChangeText={setTargetAmount}
        keyboardType="decimal-pad"
      />

      <Text style={[styles.label, { color: colors.text }]}>Current Amount ({currency.symbol})</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        value={currentAmount}
        onChangeText={setCurrentAmount}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Delete Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, fontSize: 16 },
  saveBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { padding: 16, alignItems: 'center', marginTop: 12 },
  deleteBtnText: { fontSize: 16, fontWeight: '600' },
});
