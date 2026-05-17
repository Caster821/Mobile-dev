import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { getDashboardData, getNetWorth } from '../../database/database';
import { useApp, useTheme } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currency';
import { GlassCard } from '../../components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedFAB } from '../../components/ui/AnimatedFAB';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const { currency } = useApp();
  const colors = useTheme();
  
  const { rawTransactions, isLoading: txLoading, refresh: refreshTx } = useTransactions();
  const { accounts, isLoading: accLoading, refresh: refreshAcc } = useAccounts();
  
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [netWorth, setNetWorth] = useState(0);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user) return;
      setLoadingSummary(true);
      try {
        const [data, balance] = await Promise.all([
          getDashboardData(user.id, month, year),
          getNetWorth(user.id),
        ]);
        setSummary(data);
        setNetWorth(balance);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [user, month, year, rawTransactions, accounts]);

  const onRefresh = async () => {
    await Promise.all([refreshTx(), refreshAcc()]);
  };

  const spendingProgress = summary.income > 0 ? Math.min(summary.expense / summary.income, 1) : (summary.expense > 0 ? 1 : 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.primary, colors.primary + '80']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.userName}>{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.profileBtn}>
            <Ionicons name="person-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.nwCard}>
          <Text style={styles.nwLabel}>Total Balance</Text>
          <Text style={styles.nwAmount}>{formatCurrency(netWorth, currency.code)}</Text>
        </GlassCard>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={txLoading || accLoading} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.chartContainer}>
              <Svg width={150} height={150}>
                <Circle cx="75" cy="75" r={radius} stroke={colors.surface} strokeWidth="12" fill="none" />
                <Circle
                   cx="75" cy="75" r={radius}
                   stroke={colors.danger}
                   strokeWidth="12"
                   fill="none"
                   strokeDasharray={circumference}
                   strokeDashoffset={circumference * (1 - spendingProgress)}
                   strokeLinecap="round"
                   transform="rotate(-90 75 75)"
                />
              </Svg>
              <View style={styles.chartCenter}>
                <Text style={[styles.chartPercent, { color: colors.text }]}>
                  {Math.round(spendingProgress * 100)}%
                </Text>
                <Text style={[styles.chartLabel, { color: colors.subtext }]}>Spent</Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#48BB7820' }]}>
                  <Ionicons name="arrow-down" size={20} color="#48BB78" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={[styles.statValue, { color: '#48BB78' }]}>
                    {formatCurrency(summary.income, currency.code)}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#F5656520' }]}>
                  <Ionicons name="arrow-up" size={20} color="#F56565" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Expense</Text>
                  <Text style={[styles.statValue, { color: '#F56565' }]}>
                    {formatCurrency(summary.expense, currency.code)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Trend</Text>
          <View style={[styles.trendContainer, { backgroundColor: colors.card }]}>
            {(() => {
              const now = new Date();
              const monthlyData: number[] = [];
              const months: string[] = [];

              for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const month = date.getMonth();
                const year = date.getFullYear();
                const monthName = date.toLocaleString('default', { month: 'short' });

                const monthlyTotal = rawTransactions
                  .filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate.getMonth() === month && txDate.getFullYear() === year && tx.type === 'expense';
                  })
                  .reduce((sum, tx) => sum + tx.amount, 0);

                monthlyData.push(monthlyTotal);
                months.push(monthName);
              }

              const maxVal = Math.max(...monthlyData, 1);

              return (
                <View style={styles.trendChart}>
                  {monthlyData.map((value, index) => {
                    const height = (value / maxVal) * 80;
                    return (
                      <View key={index} style={styles.trendBarContainer}>
                        <View
                          style={[
                            styles.trendBar,
                            { height, backgroundColor: colors.primary }
                          ]}
                        />
                        <Text style={[styles.trendLabel, { color: colors.subtext }]}>{months[index]}</Text>
                      </View>
                    );
                  })}
                </View>
              );
            })()}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={{ color: colors.primary }}>See All</Text>
            </TouchableOpacity>
          </View>
          {rawTransactions.slice(0, 5).map((tx) => (
            <TouchableOpacity 
              key={tx._id} 
              onPress={() => router.push(`/transactions/${tx._id}`)}
              style={[styles.txItem, { backgroundColor: colors.card }]}
            >
              <View style={[styles.txIcon, { backgroundColor: tx.categories?.color || colors.surface }]}>
                <Ionicons name={tx.categories?.icon || 'receipt'} size={20} color="white" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.txName, { color: colors.text }]}>{tx.categories?.name || 'Uncategorized'}</Text>
                <Text style={styles.txDate}>{new Date(tx.date).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#48BB78' : '#F56565' }]}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency.code)}
              </Text>
            </TouchableOpacity>
          ))}
          {rawTransactions.length === 0 && !txLoading && (
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No transactions yet</Text>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 50, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeText: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  userName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  nwCard: { padding: 16 },
  nwLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  nwAmount: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  overviewGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartContainer: { width: 130, height: 130, justifyContent: 'center', alignItems: 'center' },
  chartCenter: { position: 'absolute', alignItems: 'center' },
  chartPercent: { fontSize: 20, fontWeight: 'bold' },
  chartLabel: { fontSize: 11 },
  statsContainer: { flex: 1, marginLeft: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  statLabel: { fontSize: 11, color: '#888' },
  statValue: { fontSize: 14, fontWeight: 'bold' },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, marginBottom: 10 },
  txIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  txName: { fontSize: 14, fontWeight: '600' },
  txDate: { fontSize: 11, color: '#888' },
  txAmount: { fontSize: 14, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 13 },
  trendContainer: { padding: 16, borderRadius: 12 },
  trendChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  trendBarContainer: { alignItems: 'center', flex: 1 },
  trendBar: { width: 16, borderRadius: 3, marginBottom: 6 },
  trendLabel: { fontSize: 9 },
});
