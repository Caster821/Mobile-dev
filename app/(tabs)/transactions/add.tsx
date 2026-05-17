import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TransactionForm } from '../../../components/forms/TransactionForm';
import { useTransactions } from '../../../hooks/useTransactions';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/AppContext';

export default function AddTransactionScreen() {
  const { type } = useLocalSearchParams<{ type: 'expense' | 'income' | 'transfer' }>();
  const { showToast } = useToast();
  const { addTransaction } = useTransactions();
  const colors = useTheme();

  const handleSubmit = async (data: any) => {
    try {
      await addTransaction(data);
      showToast('Transaction added ✓', 'success');
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save transaction to cloud');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TransactionForm 
        defaultType={type || 'expense'} 
        onSubmit={handleSubmit} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
