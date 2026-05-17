import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { BudgetForm } from '../../../components/forms/BudgetForm';
import { insertBudget } from '../../../database/database';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export default function CreateBudgetScreen() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await insertBudget({
        userId: user?.id,
        categoryId: data.categoryId,
        amount: data.amount,
        month: data.month,
        year: data.year,
      });
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
