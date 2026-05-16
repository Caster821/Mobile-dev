import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { BudgetForm } from '../../../components/forms/BudgetForm';
import { insertBudget } from '../../../database/database';
import { Budget } from '../../../types';
import { useToast } from '../../../context/ToastContext';

export default function CreateBudgetScreen() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const { showToast } = useToast();

  const handleSubmit = async (data: Partial<Budget>) => {
    try {
      const budget: Budget = {
        id: Date.now().toString(),
        category_id: data.category_id!,
        amount: data.amount!,
        method: data.method!,
        month: data.month!,
        year: data.year!,
        rollover_previous: data.rollover_previous!,
        remaining_carried_over: data.remaining_carried_over!,
      };

      await insertBudget(budget);
      showToast('Budget created ✓', 'success');
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save budget');
    }
  };

  return (
    <View style={styles.container}>
      <BudgetForm 
        onSubmit={handleSubmit}
        month={currentMonth}
        year={currentYear}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
});
