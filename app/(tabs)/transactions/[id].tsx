import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TransactionForm } from '../../../components/forms/TransactionForm';
import { getTransaction, updateTransaction, deleteTransaction } from '../../../database/database';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/AppContext';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const colors = useTheme();
  
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!user || !id) return;
      try {
        const data = await getTransaction(id, user.id);
        setTransaction(data);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to fetch transaction details');
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id, user]);

  const handleSubmit = async (data: any) => {
    try {
      await updateTransaction({
        id,
        ...data
      });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update transaction on cloud');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        if (!user || !id) return;
        try {
          await deleteTransaction(id, user.id);
          router.back();
        } catch (e) {
          console.error(e);
          Alert.alert('Error', 'Failed to delete transaction from cloud');
        }
      }}
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Transaction not found</Text>
      </View>
    );
  }

  // Map database categories shape to what the form expects if needed
  const initialData = {
    ...transaction,
    categoryId: transaction.category_id,
    accountId: transaction.account_id,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TransactionForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
