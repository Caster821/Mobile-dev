import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useBudgets } from '../../../hooks/useBudgets';
import { useCategories } from '../../../hooks/useCategories';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BudgetProgress } from '../../../components/ui/BudgetProgress';
import { useApp, useTheme } from '../../../context/AppContext';
import { commonShadow } from '../../../utils/theme';
import { formatCurrency } from '../../../utils/currency';

export default function BudgetsScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { budgets, isLoading, refresh, deleteBudget } = useBudgets(month, year);
  const { categories } = useCategories('expense');
  const { currency } = useApp();
  const colors = useTheme();

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleDeleteBudget = (budgetId: string, categoryName: string) => {
    Alert.alert(
      'Delete Budget',
      `Remove the budget for ${categoryName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBudget(budgetId);
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to delete budget');
            }
          },
        },
      ]
    );
  };

  const totalSummary = useMemo(() => {
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    return { totalBudgeted, totalSpent };
  }, [budgets]);

  if (isLoading && budgets.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.monthSelector, { backgroundColor: colors.card }]}>
        <Pressable onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.monthText, { color: colors.text }]}>{monthLabel}</Text>
        <Pressable onPress={() => changeMonth(1)} style={styles.arrowBtn}>
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card }, commonShadow]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Budgeted</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(totalSummary.totalBudgeted, currency.code)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Spent</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(totalSummary.totalSpent, currency.code)}</Text>
        </View>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item, index) => item._id || item.id || `${item.categoryId}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const category = categories.find((c: any) => c._id === item.categoryId);
          const categoryName = category?.name || 'Unknown';
          return (
            <Pressable onPress={() => item._id && router.push(`/(tabs)/budgets/edit?id=${item._id}&month=${month}&year=${year}`)}>
              <BudgetProgress 
                spent={item.spent}
                limit={item.amount}
                categoryName={categoryName}
                categoryIcon={category?.icon || 'help'}
                categoryColor={category?.color || colors.primary}
                currencyCode={currency.code}
                onDelete={item._id ? () => handleDeleteBudget(item._id, categoryName) : undefined}
              />
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No budgets set for this month</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push(`/(tabs)/budgets/create?month=${month}&year=${year}`)}
            >
              <Text style={styles.createBtnText}>Add Budget</Text>
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginTop: 40 },
  arrowBtn: { padding: 8 },
  monthText: { fontSize: 18, fontWeight: 'bold' },
  summaryCard: { flexDirection: 'row', margin: 16, padding: 20, borderRadius: 16, alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: 'bold' },
  divider: { width: 1, height: 40, marginHorizontal: 20 },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16, textAlign: 'center' },
  createBtn: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  createBtnText: { color: 'white', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});
