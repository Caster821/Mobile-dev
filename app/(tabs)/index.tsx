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
import { navigateToEditTransaction } from '../../utils/navigation';
import { router } from 'expo-router';
// Remplacement du SVG par le package pure JS :
import CircularProgress from 'react-native-circular-progress-indicator';

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.primary, colors.primary + '80']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.userName}>{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} style={styles.profileBtn}>
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
            
            {/* ANCIEN BLOC SVG REMPLACÉ ICI */}
            <View style={styles.chartContainer}>
              <CircularProgress
                value={Math.round(spendingProgress * 100)}
                radius={75}
                activeStrokeColor={colors.danger}
                inActiveStrokeColor={colors.surface}
                activeStrokeWidth={12}
                inActiveStrokeWidth={12}
                showProgressValue={false} // Désactivé car vous gérez le texte personnalisé au centre
              />
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
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={{ color: colors.primary }}>See All</Text>
            </TouchableOpacity>
          </View>
          {rawTransactions.slice(0, 5).map((tx) => (
            <TouchableOpacity 
              key={tx._id}
              onPress={() => navigateToEditTransaction(tx)}
            >
              {/* Reste du rendu de votre cellule de transaction ici */}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Conservez vos styles identiques au bas du fichier
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 60, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  userName: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  profileBtn: { padding: 4 },
  nwCard: { padding: 20, marginTop: 10 },
  nwLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  nwAmount: { color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  overviewGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartContainer: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
  chartCenter: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  chartPercent: { fontSize: 22, fontWeight: 'bold' },
  chartLabel: { fontSize: 12, marginTop: 2 },
  statsContainer: { flex: 1, marginLeft: 20, gap: 15 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#718096' },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  trendContainer: { padding: 20, borderRadius: 16 },
  trendChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, paddingTop: 10 },
  trendBarContainer: { alignItems: 'center', gap: 8 },
  trendBar: { width: 12, borderRadius: 6 },
  trendLabel: { fontSize: 11 }
});
