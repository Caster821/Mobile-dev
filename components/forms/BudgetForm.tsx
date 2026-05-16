import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AmountInput } from '../ui/AmountInput';
import { Budget } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  initialData?: Budget;
  onSubmit: (data: Partial<Budget>) => void;
  onDelete?: () => void;
  month: number;
  year: number;
}

export const BudgetForm = ({ initialData, onSubmit, onDelete, month, year }: Props) => {
  const { currencySymbol } = useApp();
  const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category_id || '');

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
      category_id: selectedCategory,
      amount: Number(amount),
      method: 'standard',
      month,
      year,
      rollover_previous: 0,
      remaining_carried_over: 0,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AmountInput 
        value={amount} 
        onChangeText={setAmount} 
        currencySymbol={currencySymbol} 
        isExpense={false} 
      />

      <View style={styles.section}>
        <Text style={styles.label}>Category to Budget</Text>
        <View style={styles.grid}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryItem, selectedCategory === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
              onPress={() => setSelectedCategory(cat.id)}>
              <Ionicons name={cat.icon as any} size={24} color={cat.color} />
              <Text style={styles.categoryText} numberOfLines={1}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
        <Text style={styles.saveBtnText}>Save Budget</Text>
      </TouchableOpacity>

      {initialData && onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteBtnText}>Delete Budget</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryItem: { width: '22%', alignItems: 'center', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  categoryText: { fontSize: 12, marginTop: 4, textAlign: 'center', color: '#555' },
  saveBtn: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { marginTop: 16, padding: 16, alignItems: 'center' },
  deleteBtnText: { color: '#ff4444', fontSize: 16, fontWeight: '600' },
});
