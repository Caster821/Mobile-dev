import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTransactions } from '../../../hooks/useTransactions';
import { router, useFocusEffect } from 'expo-router';
import { useCategories } from '../../../hooks/useCategories';
import { Ionicons } from '@expo/vector-icons';
import { TransactionCard } from '../../../components/ui/TransactionCard';
import { useApp, useTheme } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { commonShadow } from '../../../utils/theme';

export default function TransactionsScreen() {
  const { currency } = useApp();
  const colors = useTheme();
  const { showToast } = useToast();
  const { transactions, isLoading, deleteTransaction, refresh } = useTransactions();
  const { categories } = useCategories();
  const [filter, setFilter] = useState<'All' | 'Expense' | 'Income'>('All');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

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

  const handleDelete = async (txId: any) => {
    try {
      await deleteTransaction(txId);
      showToast("Transaction deleted", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to delete transaction", "error");
    }
  };

  const renderRightActions = (progress: any, dragX: any, txId: any) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <Pressable style={[styles.deleteAction, { backgroundColor: colors.danger }]} onPress={() => handleDelete(txId)}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={24} color="white" />
        </Animated.View>
      </Pressable>
    );
  };

  if (isLoading && sections.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/transactions/add')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addBtnText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        {['All', 'Expense', 'Income'].map(f => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface }]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[styles.filterText, filter === f ? { color: 'white' } : { color: colors.subtext }]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item._id || `transaction-${index}`}
        renderItem={({ item }) => {
          const category = categories.find(
            (c) => c._id === item.categoryId || c._id === item.categories?._id
          ) || item.categories;
          return (
            <Swipeable renderRightActions={(p, d) => renderRightActions(p, d, item._id)}>
              <Pressable onPress={() => router.push(`/transactions/${item._id}`)}>
                <TransactionCard
                  transaction={item}
                  categoryName={category?.name}
                  categoryIcon={category?.icon}
                  categoryColor={category?.color}
                  currencyCode={currency.code}
                />
              </Pressable>
            </Swipeable>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  filterBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    ...commonShadow,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingVertical: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  deleteAction: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 4,
    marginRight: 8,
  },
});
