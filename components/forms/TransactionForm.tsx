import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AmountInput } from '../ui/AmountInput';
import { Transaction } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { Ionicons } from '@expo/vector-icons';
import { useApp, useTheme } from '../../context/AppContext';
import { TextInput } from 'react-native-gesture-handler';

interface Props {
  initialData?: Transaction;
  onSubmit: (data: Partial<Transaction>) => void;
  onDelete?: () => void;
  defaultType?: 'expense' | 'income' | 'transfer';
}

export const TransactionForm = ({ initialData, onSubmit, onDelete, defaultType = 'expense' }: Props) => {
  const { currencySymbol } = useApp();
  const colors = useTheme();
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>(initialData?.type || defaultType);
  const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
  const [note, setNote] = useState(initialData?.note || '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category_id || '');
  const [selectedAccount, setSelectedAccount] = useState(initialData?.account_id || '');

  const { categories } = useCategories(type !== 'transfer' ? type : undefined);
  const { accounts } = useAccounts();

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) setSelectedAccount(accounts[0].id);
  }, [accounts]);

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!selectedAccount) {
      Alert.alert('Missing Account', 'Please select an account.');
      return;
    }
    if (type !== 'transfer' && !selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }

    onSubmit({
      amount: Number(amount),
      type,
      note,
      category_id: type !== 'transfer' ? selectedCategory : null,
      account_id: selectedAccount,
      date: initialData?.date || Date.now(),
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        
        <View style={[styles.typeSelector, { backgroundColor: colors.surface }]}>
          <Pressable 
            style={[styles.typeBtn, type === 'expense' && { backgroundColor: colors.danger }]}
            onPress={() => setType('expense')}>
            <Text style={[styles.typeText, type === 'expense' && styles.activeText]}>Expense</Text>
          </Pressable>
          <Pressable 
            style={[styles.typeBtn, type === 'income' && { backgroundColor: colors.success }]}
            onPress={() => setType('income')}>
            <Text style={[styles.typeText, type === 'income' && styles.activeText]}>Income</Text>
          </Pressable>
        </View>

        <AmountInput 
          value={amount} 
          onChangeText={setAmount} 
          currencySymbol={currencySymbol} 
          isExpense={type === 'expense'} 
        />

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Account</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {accounts.map(acc => (
              <Pressable 
                key={acc.id} 
                style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }, selectedAccount === acc.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => setSelectedAccount(acc.id)}>
                <Text style={[styles.chipText, { color: colors.text }, selectedAccount === acc.id && styles.activeText]}>{acc.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {type !== 'transfer' && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
            <View style={styles.grid}>
              {categories.map(cat => (
                <Pressable 
                  key={cat.id} 
                  style={[styles.categoryItem, { backgroundColor: colors.card, borderColor: colors.border }, selectedCategory === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
                  onPress={() => setSelectedCategory(cat.id)}>
                  <View style={[styles.iconCircle, { backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icon as any} size={28} color={cat.color} />
                  </View>
                  <Text style={[styles.categoryText, { color: colors.subtext }]} numberOfLines={1}>{cat.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Note (Optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={colors.subtext}
          />
        </View>

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.primary, transform: [{ scale: pressed ? 0.97 : 1 }] }]} onPress={handleSubmit}>
          <Text style={styles.saveBtnText}>Save Transaction</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  typeSelector: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 24 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  typeText: { fontSize: 16, fontWeight: '600', color: '#888' },
  activeText: { color: '#fff' },
  section: { marginBottom: 32 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row' },
  chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, marginRight: 12, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  categoryItem: { width: '22%', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 16, borderWidth: 1 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 12, textAlign: 'center', fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
  footer: { padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, borderTopWidth: 1 },
  saveBtn: { padding: 18, borderRadius: 16, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
