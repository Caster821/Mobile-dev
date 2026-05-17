import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BudgetForm } from '../../../components/forms/BudgetForm';
import { insertBudget } from '../../../database/database';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const parseRouteParam = (value: string | string[] | undefined, fallback: number) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = parseInt(raw ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export default function CreateBudgetScreen() {
  const params = useLocalSearchParams<{ month?: string | string[]; year?: string | string[] }>();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const month = parseRouteParam(params.month, currentMonth);
  const year = parseRouteParam(params.year, currentYear);
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await insertBudget({
        userId: user?.id,
        categoryId: data.categoryId,
        amount: data.amount,
        month,
        year,
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
        month={month}
        year={year}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
});
