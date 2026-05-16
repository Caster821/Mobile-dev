import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TransactionForm } from '../../../components/forms/TransactionForm';
import { openDatabase, updateTransaction, deleteTransaction } from '../../../database/database';
import { Transaction } from '../../../types';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      const db = await openDatabase();
      const res = await db.getAllAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', [id]);
      if (res.length > 0) setTransaction(res[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (data: Partial<Transaction>) => {
    if (!transaction) return;
    try {
      const updated: Transaction = {
        ...transaction,
        amount: data.amount!,
        type: data.type as any,
        category_id: data.category_id || null,
        account_id: data.account_id!,
        note: data.note || null,
      };

      await updateTransaction(updated);
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update transaction');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteTransaction(id);
          router.back();
        } catch (e) {
          console.error(e);
          Alert.alert('Error', 'Failed to delete transaction');
        }
      }}
    ]);
  };

  if (!transaction) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TransactionForm 
        initialData={transaction}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center' },
});
