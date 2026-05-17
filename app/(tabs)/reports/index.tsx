import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useApp, useTheme } from '../../../context/AppContext';
import { getTransactions, getCategories } from '../../../database/database';
import { formatCurrency } from '../../../utils/currency';
// @ts-ignore - react-native-svg-charts lacks type definitions
import { PieChart, LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../../components/ui/GlassCard';

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

  // Spending by Category
  const spendingByCat = categories.map(cat => {
    const total = transactions
      .filter(tx => tx.categoryId === cat._id && tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { ...cat, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const pieData = spendingByCat.map((item, index) => ({
    value: item.total,
    svg: { fill: item.color },
    key: `pie-${index}`,
  }));

  // Monthly Trend (last 6 months)
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Spending Reports</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Total Spending</Text>
          <Text style={[styles.totalAmount, { color: colors.danger }]}>
            {formatCurrency(spendingByCat.reduce((s, c) => s + c.total, 0), currency.code)}
          </Text>
        </GlassCard>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending by Category</Text>
          <View style={styles.chartRow}>
            <PieChart style={{ height: 200, flex: 1 }} data={pieData} />
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
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Trend</Text>
          <View style={{ height: 200, flexDirection: 'row', padding: 20 }}>
            <YAxis
              data={monthlyData}
              contentInset={{ top: 20, bottom: 20 }}
              svg={{ fill: colors.subtext, fontSize: 10 }}
              numberOfTicks={5}
                formatLabel={(value: number) => `${value / 1000}k`}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <LineChart
                style={{ flex: 1 }}
                data={monthlyData}
                svg={{ stroke: colors.primary, strokeWidth: 3 }}
                contentInset={{ top: 20, bottom: 20 }}
              >
                <Grid />
              </LineChart>
              <XAxis
                style={{ marginHorizontal: -10 }}
                data={monthlyData}
                formatLabel={(value: number, index: number) => months[index]}
                contentInset={{ left: 10, right: 10 }}
                svg={{ fontSize: 10, fill: colors.subtext }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Categories</Text>
          {spendingByCat.slice(0, 3).map((cat, index) => (
            <View key={cat._id} style={[styles.topCatItem, { backgroundColor: colors.surface }]}>
              <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                <Ionicons name={cat.icon as any} size={24} color={cat.color} />
              </View>
              <View style={styles.catInfo}>
                <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
                <Text style={[styles.catCount, { color: colors.subtext }]}>{index + 1}st Rank</Text>
              </View>
              <Text style={[styles.catAmount, { color: colors.text }]}>
                {formatCurrency(cat.total, currency.code)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 50, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  content: { flex: 1, padding: 16 },
  summaryCard: { padding: 16, alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 14, marginBottom: 6 },
  totalAmount: { fontSize: 28, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  chartRow: { flexDirection: 'row', alignItems: 'center' },
  legend: { flex: 1, marginLeft: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 11 },
  topCatItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  catInfo: { flex: 1 },
  catName: { fontSize: 14, fontWeight: 'bold' },
  catCount: { fontSize: 11 },
  catAmount: { fontSize: 14, fontWeight: 'bold' },
});
