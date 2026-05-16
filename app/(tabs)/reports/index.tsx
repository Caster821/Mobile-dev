import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { PieChart } from '../../../components/charts/PieChart';
import { LineChart } from '../../../components/charts/LineChart';
import { getTransactions, getCategories } from '../../../database/database';
import { Transaction, Category } from '../../../types';
import { useApp, useTheme } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/currency';
import { commonShadow } from '../../../utils/theme';

export default function ReportsScreen() {
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState<any[]>([]);
  const [lineLabels, setLineLabels] = useState<string[]>([]);
  const [lineIncome, setLineIncome] = useState<number[]>([]);
  const [lineExpense, setLineExpense] = useState<number[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const { currencyCode } = useApp();
  const colors = useTheme();

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const transactions = await getTransactions();
      const categories = await getCategories('expense');
      
      const catMap = new Map<string, Category>();
      categories.forEach(c => catMap.set(c.id, c));

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Spending by category this month
      const expenseMap: Record<string, number> = {};
      let totalSpentThisMonth = 0;
      transactions.forEach(t => {
        if (t.type === 'expense' && t.is_deleted === 0) {
          const d = new Date(t.date);
          if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.category_id) {
            expenseMap[t.category_id] = (expenseMap[t.category_id] || 0) + t.amount;
            totalSpentThisMonth += t.amount;
          }
        }
      });

      const pie = Object.keys(expenseMap).map(catId => {
        const cat = catMap.get(catId);
        const amount = expenseMap[catId];
        return {
          name: cat?.name || 'Unknown',
          population: amount,
          color: cat?.color || '#ccc',
          legendFontColor: colors.text,
          legendFontSize: 12,
          percentage: (amount / totalSpentThisMonth) * 100
        };
      }).sort((a, b) => b.population - a.population);
      
      setPieData(pie);
      setTopCategories(pie.slice(0, 3));

      // Last 6 months trends
      const labels: string[] = [];
      const incData: number[] = [0, 0, 0, 0, 0, 0];
      const expData: number[] = [0, 0, 0, 0, 0, 0];

      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        labels.push(d.toLocaleString('default', { month: 'short' }));
      }

      transactions.forEach(t => {
        if (t.is_deleted === 1) return;
        const d = new Date(t.date);
        const monthDiff = (currentYear - d.getFullYear()) * 12 + (currentMonth - d.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
          const index = 5 - monthDiff;
          if (t.type === 'income') incData[index] += t.amount;
          if (t.type === 'expense') expData[index] += t.amount;
        }
      });

      setLineLabels(labels);
      setLineIncome(incData);
      setLineExpense(expData);

    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) return <View style={[styles.container, { backgroundColor: colors.background }]} />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card }, commonShadow]}>
        <Text style={[styles.title, { color: colors.text }]}>Spending by Category</Text>
        {pieData.length > 0 ? (
          <>
            <PieChart data={pieData} />
            <View style={styles.legend}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendText, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.legendValue, { color: colors.subtext }]}>
                    {formatCurrency(item.population, currencyCode)} ({item.percentage.toFixed(1)}%)
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>No expenses this month.</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }, commonShadow]}>
        <Text style={[styles.title, { color: colors.text }]}>Income vs Expenses</Text>
        <LineChart labels={lineLabels} incomeData={lineIncome} expenseData={lineExpense} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }, commonShadow]}>
        <Text style={[styles.title, { color: colors.text }]}>Top Categories</Text>
        {topCategories.map((cat, i) => (
          <View key={i} style={styles.topCatItem}>
            <View style={styles.topCatHeader}>
              <Text style={[styles.topCatName, { color: colors.text }]}>{cat.name}</Text>
              <Text style={[styles.topCatAmount, { color: colors.text }]}>{formatCurrency(cat.population, currencyCode)}</Text>
            </View>
            <View style={[styles.barBg, { backgroundColor: colors.surface }]}>
              <View style={[styles.barFill, { backgroundColor: cat.color, width: `${cat.percentage}%` }]} />
            </View>
          </View>
        ))}
        {topCategories.length === 0 && <Text style={[styles.emptyText, { color: colors.subtext }]}>No data available</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { borderRadius: 16, padding: 20, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  legend: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { flex: 1, fontSize: 14 },
  legendValue: { fontSize: 14 },
  emptyText: { textAlign: 'center', marginVertical: 20 },
  topCatItem: { marginBottom: 16 },
  topCatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  topCatName: { fontWeight: '600' },
  topCatAmount: { fontWeight: 'bold' },
  barBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
});
