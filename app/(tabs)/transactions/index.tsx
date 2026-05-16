import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable, Animated } from 'react-native';
import { useTransactions } from '../../../hooks/useTransactions';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TransactionCard } from '../../../components/ui/TransactionCard';
import { useApp, useTheme } from '../../../context/AppContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { deleteTransaction } from '../../../database/database';
import { commonShadow } from '../../../utils/theme';
import { TransactionSkeleton } from '../../../components/ui/Skeleton';

export default function TransactionsScreen() {
  const { transactions, loading, refresh } = useTransactions();
  const { currencyCode } = useApp();
  const colors = useTheme();
  const [filter, setFilter] = useState<'All' | 'Expense' | 'Income'>('All');

  const getFilteredData = () => {
    let raw = transactions;
    if (filter === 'Expense') {
      return {
        today: raw.today.filter((t: any) => t.type === 'expense'),
        yesterday: raw.yesterday.filter((t: any) => t.type === 'expense'),
        thisWeek: raw.thisWeek.filter((t: any) => t.type === 'expense'),
        older: raw.older.filter((t: any) => t.type === 'expense'),
      };
    }
    if (filter === 'Income') {
      return {
        today: raw.today.filter((t: any) => t.type === 'income'),
        yesterday: raw.yesterday.filter((t: any) => t.type === 'income'),
        thisWeek: raw.thisWeek.filter((t: any) => t.type === 'income'),
        older: raw.older.filter((t: any) => t.type === 'income'),
      };
    }
    return raw;
  };

  const filtered = getFilteredData();

  const sections = [
    { title: 'Today', data: filtered.today || [] },
    { title: 'Yesterday', data: filtered.yesterday || [] },
    { title: 'This Week', data: filtered.thisWeek || [] },
    { title: 'Older', data: filtered.older || [] },
  ].filter(section => section.data.length > 0);

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    refresh();
  };

  const renderRightActions = (progress: any, dragX: any, id: string) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <Pressable style={[styles.deleteAction, { backgroundColor: colors.danger }]} onPress={() => handleDelete(id)}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={24} color="white" />
        </Animated.View>
      </Pressable>
    );
  };

  if (loading) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={styles.filterBar}>
        {['All', 'Expense', 'Income'].map(f => (
          <Pressable 
            key={f} 
            style={[styles.filterChip, filter === f && { backgroundColor: colors.primary }]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[styles.filterText, filter === f ? { color: 'white' } : { color: colors.subtext }]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionTitle, { color: colors.subtext }]}>{title.toUpperCase()}</Text>
        )}
        renderItem={({ item: t }) => (
          <Swipeable renderRightActions={(p, d) => renderRightActions(p, d, t.id)}>
            <Pressable onPress={() => router.push(`/(tabs)/transactions/${t.id}`)}>
              <TransactionCard 
                transaction={t}
                categoryName={t.categoryName}
                categoryIcon={t.categoryIcon}
                categoryColor={t.categoryColor}
                currencyCode={currencyCode}
              />
            </Pressable>
          </Swipeable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No transactions found</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      
      <Pressable 
        style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, transform: [{ scale: pressed ? 0.95 : 1 }] }, commonShadow]}
        onPress={() => router.push('/(tabs)/transactions/add')}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: { flexDirection: 'row', padding: 16, paddingBottom: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 8 },
  filterText: { fontWeight: '600', fontSize: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, marginTop: 16, fontWeight: '500' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginHorizontal: 24, marginTop: 16, marginBottom: 4, letterSpacing: 1 },
  deleteAction: { justifyContent: 'center', alignItems: 'flex-end', paddingRight: 24, marginVertical: 6, marginRight: 16, borderRadius: 16, flex: 1, marginLeft: -50, paddingLeft: 50 },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
});
