import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
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

  const { budgets, transactions, loading, refresh } = useBudgets(month, year);
  const { categories } = useCategories('expense');
  const { currencyCode } = useApp();
  const colors = useTheme();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [month, year])
  );

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const summary = useMemo(() => {
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    const categorySpentMap: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.category_id) {
        categorySpentMap[t.category_id] = (categorySpentMap[t.category_id] || 0) + t.amount;
      }
    });
    const totalSpent = Object.values(categorySpentMap).reduce((sum, val) => sum + val, 0);
    return { totalBudgeted, totalSpent, categorySpentMap };
  }, [budgets, transactions]);

  const remainingDays = useMemo(() => {
    const lastDay = new Date(year, month, 0).getDate();
    return lastDay - currentDate.getDate();
  }, [currentDate]);

  if (loading && budgets.length === 0) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
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
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(summary.totalBudgeted, currencyCode)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Spent</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(summary.totalSpent, currencyCode)}</Text>
        </View>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const category = categories.find(c => c.id === item.category_id);
          const spent = summary.categorySpentMap[item.category_id] || 0;
          return (
            <BudgetProgress 
              spent={spent}
              limit={item.amount}
              categoryName={category?.name || 'Unknown'}
              categoryIcon={category?.icon || 'help'}
              categoryColor={category?.color || '#ccc'}
              currencyCode={currencyCode}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No budgets set for this month</Text>
            <Pressable style={[styles.ctaButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/(tabs)/budgets/create')}>
              <Text style={styles.ctaText}>Add Budget</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <Pressable 
        style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, transform: [{ scale: pressed ? 0.95 : 1 }] }, commonShadow]}
        onPress={() => router.push('/(tabs)/budgets/create')}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  monthText: { fontSize: 18, fontWeight: 'bold' },
  arrowBtn: { padding: 4 },
  summaryCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: 'bold' },
  divider: { width: 1, height: '100%', marginHorizontal: 10 },
  listContent: { paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, marginTop: 16, marginBottom: 20 },
  ctaButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  ctaText: { color: 'white', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
});
