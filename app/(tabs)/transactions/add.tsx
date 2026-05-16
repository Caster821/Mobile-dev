import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TransactionForm } from '../../../components/forms/TransactionForm';
import { insertTransaction } from '../../../database/database';
import { Transaction } from '../../../types';
import { useToast } from '../../../context/ToastContext';

export default function AddTransactionScreen() {
  const { type } = useLocalSearchParams<{ type: 'expense' | 'income' | 'transfer' }>();
  const { showToast } = useToast();

  const handleSubmit = async (data: Partial<Transaction>) => {
    try {
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: data.amount!,
        type: data.type as any,
        category_id: data.category_id || null,
        account_id: data.account_id!,
        date: data.date!,
        note: data.note || null,
        receipt_uri: null,
        recurring_id: null,
        tags: null,
        is_deleted: 0,
        created_at: Date.now(),
      };

      await insertTransaction(transaction);
      showToast('Transaction added ✓', 'success');
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  return (
    <View style={styles.container}>
      <TransactionForm 
        defaultType={type || 'expense'} 
        onSubmit={handleSubmit} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
});
