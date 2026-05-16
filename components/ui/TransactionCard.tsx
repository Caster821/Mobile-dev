import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { useTheme } from '../../context/AppContext';
import { commonShadow } from '../../utils/theme';

interface Props {
  transaction: Transaction;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  currencyCode: string;
}

const getTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diffHours = (now - timestamp) / (1000 * 60 * 60);
  if (diffHours < 24) {
    if (diffHours < 1) return 'Just now';
    return `${Math.floor(diffHours)}h ago`;
  }
  if (diffHours < 48) return 'Yesterday';
  return new Date(timestamp).toLocaleDateString();
};

export const TransactionCard = ({ transaction, categoryName = 'Unknown', categoryIcon = 'help', categoryColor = '#ccc', currencyCode }: Props) => {
  const isExpense = transaction.type === 'expense';
  const colors = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card }, commonShadow]}>
      <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
        <Ionicons name={categoryIcon as any} size={24} color={categoryColor} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.note, { color: colors.text }]} numberOfLines={1}>{transaction.note || categoryName}</Text>
        <Text style={[styles.category, { color: colors.subtext }]}>{categoryName} • {getTimeAgo(transaction.date)}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isExpense ? colors.danger : colors.success }]}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, currencyCode)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  note: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
