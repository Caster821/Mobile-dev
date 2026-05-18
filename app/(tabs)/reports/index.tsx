import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getTransactions, getCategories } from '../../../database/database';
import { formatCurrency } from '../../../utils/currency';

import { PieChart, LineChart } from 'react-native-gifted-charts';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { user } = useAuth();
  const { currency, colors } = useApp();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const txs = await getTransactions(user.id);
      const cats = await getCategories(user.id, 'expense');
      setTransactions(txs);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const spendingByCat = categories.map(cat => {
    const total = transactions
      .filter(tx => tx.categoryId === cat._id && tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { ...cat, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const pieData = spendingByCat.map((item) => ({
    value: item.total,
    color: item.color,
    name: item.name,
  }));

  const now = new Date();
  const monthlyData: number[] = [];
  const months: string[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthName = date.toLocaleString('default', { month: 'short' });

    const monthlyTotal = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === month && txDate.getFullYear() === year && tx.type === 'expense';
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    monthlyData.push(monthlyTotal);
    months.push(monthName);
  }

  const totalSpending = spendingByCat.reduce((s, c) => s + c.total, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Header — matches green header from screenshots */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Total Spending summary card */}
        <View style={[styles.card, styles.summaryCard, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Total Spending</Text>
          <Text style={[styles.summaryAmount, { color: colors.danger }]}>
            {formatCurrency(totalSpending, currency.code)}
          </Text>
        </View>

        {/* Spending by Category */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending by Category</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {spendingByCat.length > 0 ? (
            <View style={styles.pieRow}>
              <PieChart
                data={pieData}
                radius={80}
                textColor={colors.text}
                textSize={10}
              />
              <View style={styles.legend}>
                {spendingByCat.slice(0, 5).map((cat, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.legendText, { color: colors.subtext }]} numberOfLines={1}>
                      {cat.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No spending data available</Text>
          )}
        </View>

        {/* Monthly Trend */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Trend</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {monthlyData.some(val => val > 0) ? (
            <LineChart
              data={monthlyData.map((value, index) => ({ value, label: months[index] }))}
              height={180}
              width={width - 80}
              color={colors.primary}
              thickness={3}
              backgroundColor={colors.surface}
              showVerticalLines={false}
              isAnimated={true}
              hideDataPoints={false}
              dataPointsColor={colors.primary}
              xAxisLabelTextStyle={{ color: colors.subtext, fontSize: 10 }}
              yAxisTextStyle={{ color: colors.subtext, fontSize: 10 }}
              yAxisColor="transparent"
              xAxisColor={colors.subtext + '44'}
              noOfSections={4}
            />
          ) : (
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No spending data for the past 6 months</Text>
          )}
        </View>

        {/* Top Categories */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Categories</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {spendingByCat.length > 0 ? (
            spendingByCat.slice(0, 3).map((cat, index) => (
              <View
                key={cat._id}
                style={[
                  styles.catRow,
                  index < 2 && { borderBottomWidth: 1, borderBottomColor: colors.background }
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                </View>
                <View style={styles.catInfo}>
                  <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
                  <Text style={[styles.catRank, { color: colors.subtext }]}>
                    #{index + 1} Top Expense
                  </Text>
                </View>
                <Text style={[styles.catAmount, { color: colors.danger }]}>
                  -{formatCurrency(cat.total, currency.code)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No category data available</Text>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  summaryLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 14,
    fontWeight: '600',
  },
  catRank: {
    fontSize: 11,
    marginTop: 2,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
});