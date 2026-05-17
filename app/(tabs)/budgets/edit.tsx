import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BudgetForm } from '../../../components/forms/BudgetForm';
import { getBudget, updateBudget, deleteBudget } from '../../../database/database';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/AppContext';
import { Budget } from '../../../types';

const parseRouteParam = (value: string | string[] | undefined, fallback: number) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = parseInt(raw ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export default function EditBudgetScreen() {
  const params = useLocalSearchParams<{ id?: string; month?: string; year?: string }>();
  const currentDate = new Date();
  const month = parseRouteParam(params.month, currentDate.getMonth() + 1);
  const year = parseRouteParam(params.year, currentDate.getFullYear());
  const { user } = useAuth();
  const { showToast } = useToast();
  const colors = useTheme();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user || !params.id) return;
      try {
        const data = await getBudget(params.id, user.id);
        setBudget(data);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to load budget');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, user]);

  const handleSubmit = async (data: any) => {
    if (!user || !budget) return;
    try {
      await updateBudget({
        _id: budget._id,
        userId: user.id,
        categoryId: data.categoryId,
        amount: data.amount,
        month,
        year,
      });
      showToast('Budget updated ✓', 'success');
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update budget');
    }
  };

  const handleDelete = () => {
    if (!user || !budget) return;
    Alert.alert('Delete Budget', 'Are you sure you want to delete this budget?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBudget(budget._id, user.id);
            showToast('Budget deleted', 'success');
            router.back();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete budget');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!budget) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <View style={styles.container}>
      <BudgetForm
        initialData={budget}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        month={month}
        year={year}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
