import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AmountInput } from '../ui/AmountInput';
import { Budget } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useApp, useTheme } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  initialData?: Budget;
  onSubmit: (data: any) => void;
  onDelete?: () => void;
  month: number;
  year: number;
}

export const BudgetForm = ({ initialData, onSubmit, onDelete, month, year }: Props) => {
  const { currency } = useApp();
  const colors = useTheme();
  const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.categoryId || '');

  const { categories } = useCategories('expense');

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category for this budget.');
      return;
    }

    onSubmit({
      categoryId: selectedCategory,
      amount: Number(amount),
      month,
      year,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <AmountInput 
        value={amount} 
        onChangeText={setAmount} 
        currencySymbol={currency.symbol} 
        isExpense={false} 
      />

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Category to Budget</Text>
        <View style={styles.grid}>
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat._id || cat.id}
              style={[styles.categoryItem, { backgroundColor: colors.card, borderColor: colors.border }, (selectedCategory === cat._id || selectedCategory === cat.id) && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
              onPress={() => setSelectedCategory(cat._id || cat.id)}>
              <Ionicons name={cat.icon as any} size={24} color={cat.color} />
              <Text style={[styles.categoryText, { color: colors.subtext }]} numberOfLines={1}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={styles.saveBtnText}>Save Budget</Text>
      </TouchableOpacity>

      {initialData && onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Delete Budget</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 32 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryItem: { width: '22%', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1 },
  categoryText: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  saveBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { marginTop: 16, padding: 16, alignItems: 'center' },
  deleteBtnText: { fontSize: 16, fontWeight: '600' },
});
