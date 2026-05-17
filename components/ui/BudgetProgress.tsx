import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';
import { commonShadow } from '../../utils/theme';
import { formatCurrency } from '../../utils/currency';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  spent: number;
  limit: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  currencyCode: string;
  onDelete?: () => void;
}

export const BudgetProgress = ({ spent, limit, categoryName, categoryIcon, categoryColor, currencyCode, onDelete }: Props) => {
  const colors = useTheme();
  const percentage = (spent / limit) * 100;
  const isOverBudget = spent > limit;
  const isWarning = percentage >= 80 && !isOverBudget;
  
  let barColor = categoryColor;
  if (isOverBudget) barColor = colors.danger;
  else if (isWarning) barColor = colors.warning;

  const visualPercentage = Math.min(percentage, 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, commonShadow]}>
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <CategoryIcon icon={categoryIcon as any} color={categoryColor} size={20} />
          <Text style={[styles.categoryName, { color: colors.text }]}>{categoryName}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.amount, { color: colors.subtext }]}>
            {formatCurrency(spent, currencyCode)} / {formatCurrency(limit, currencyCode)}
          </Text>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={[styles.progressBarBackground, { backgroundColor: colors.surface }]}>
        <View style={[styles.progressBarFill, { width: `${visualPercentage}%`, backgroundColor: barColor }]} />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.percentageText, { color: barColor }]}>{percentage.toFixed(0)}% used</Text>
        {isOverBudget ? (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            Over by {formatCurrency(spent - limit, currencyCode)}
          </Text>
        ) : (
          <Text style={[styles.remainingText, { color: colors.subtext }]}>
            {formatCurrency(limit - spent, currencyCode)} remaining
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 2,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  remainingText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
