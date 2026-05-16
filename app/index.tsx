import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, ActionSheetIOS, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getNetWorth, getTransactions, getDashboardData } from '../database/database';
import { useApp, useTheme } from '../context/AppContext';
import { TransactionCard } from '../components/ui/TransactionCard';
import { checkAndGenerateRecurringTransactions } from '../utils/recurringTasks';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { formatCurrency } from '../utils/currency';
import { commonShadow } from '../utils/theme';

export default function DashboardScreen() {
  const [netWorth, setNetWorth] = useState(0);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const { currencyCode } = useApp();
  const colors = useTheme();

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
      checkAndGenerateRecurringTransactions();
      return () => {};
    }, [])
  );

  const loadDashboardData = async () => {
    try {
        const total = await getNetWorth();
        setNetWorth(total);

        const now = new Date();
        const data = await getDashboardData(now.getMonth() + 1, now.getFullYear());
        setMonthIncome(data.income);
        setMonthExpense(data.expense);

        const transactions = await getTransactions();
        setRecentTransactions(transactions.slice(0, 5));
    } catch (e) {
        console.error(e);
    }
  };

  const showActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Add Expense', 'Add Income', 'Transfer'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) router.push('/(tabs)/transactions/add?type=expense');
          else if (buttonIndex === 2) router.push('/(tabs)/transactions/add?type=income');
          else if (buttonIndex === 3) router.push('/(tabs)/transactions/add?type=transfer');
        }
      );
    } else {
      Alert.alert('Add Transaction', 'Select type', [
        { text: 'Add Expense', onPress: () => router.push('/(tabs)/transactions/add?type=expense') },
        { text: 'Add Income', onPress: () => router.push('/(tabs)/transactions/add?type=income') },
        { text: 'Transfer', onPress: () => router.push('/(tabs)/transactions/add?type=transfer') },
        { text: 'Cancel', style: 'cancel' }
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={[styles.heroCard, commonShadow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.heroSubtitle}>Net Worth</Text>
          <AnimatedNumber 
            value={netWorth} 
            formatter={(val) => formatCurrency(val, currencyCode)} 
            style={styles.heroTitle} 
          />
        </LinearGradient>

        <View style={styles.row}>
          <View style={[styles.statCard, { backgroundColor: colors.card }, commonShadow]}>
            <View style={styles.statHeader}>
              <Ionicons name="arrow-down-circle" size={24} color={colors.success} />
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Income</Text>
            </View>
            <AnimatedNumber 
              value={monthIncome} 
              formatter={(val) => formatCurrency(val, currencyCode)} 
              style={[styles.statAmount, { color: colors.text }]} 
            />
          </View>
          <View style={styles.spacing} />
          <View style={[styles.statCard, { backgroundColor: colors.card }, commonShadow]}>
            <View style={styles.statHeader}>
              <Ionicons name="arrow-up-circle" size={24} color={colors.danger} />
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Expenses</Text>
            </View>
            <AnimatedNumber 
              value={monthExpense} 
              formatter={(val) => formatCurrency(val, currencyCode)} 
              style={[styles.statAmount, { color: colors.text }]} 
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <Pressable onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </Pressable>
        </View>

        {recentTransactions.map(t => (
          <Pressable key={t.id} onPress={() => router.push(`/(tabs)/transactions/${t.id}`)}>
            <TransactionCard 
              transaction={t}
              categoryName={t.categoryName}
              categoryIcon={t.categoryIcon}
              categoryColor={t.categoryColor}
              currencyCode={currencyCode}
            />
          </Pressable>
        ))}

        {recentTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No recent transactions.</Text>
            <Pressable style={[styles.ctaButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/(tabs)/transactions/add?type=expense')}>
              <Text style={styles.ctaText}>Add your first transaction</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Pressable 
        style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, transform: [{ scale: pressed ? 0.95 : 1 }] }, commonShadow]}
        onPress={showActionSheet}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 48 },
  heroCard: { padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 8, fontWeight: '500', textTransform: 'uppercase' },
  heroTitle: { color: 'white', fontSize: 40, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginBottom: 32 },
  spacing: { width: 16 },
  statCard: { flex: 1, padding: 16, borderRadius: 16 },
  statHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 14, marginLeft: 8, fontWeight: '600' },
  statAmount: { fontSize: 20, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 16, fontSize: 16 },
  ctaButton: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  ctaText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
