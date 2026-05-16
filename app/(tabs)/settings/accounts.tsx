import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getAccounts, getTransactions, insertAccount } from '../../../database/database';
import { Account, Transaction } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { currencySymbol } = useApp();

  // Create Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'cash'|'checking'|'savings'|'credit'>('checking');
  const [startingBalance, setStartingBalance] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const accs = await getAccounts();
      const txs = await getTransactions();
      setAccounts(accs);
      setTransactions(txs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!name || isNaN(Number(startingBalance))) {
      Alert.alert('Error', 'Please enter a valid name and numeric balance.');
      return;
    }
    try {
      await insertAccount({
        id: Date.now().toString(),
        name,
        type,
        starting_balance: Number(startingBalance),
        currency: 'USD',
        created_at: Date.now(),
      });
      setShowForm(false);
      setName('');
      setStartingBalance('');
      loadData();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to create account.');
    }
  };

  // Calculate actual balance: starting_balance + sum of income - sum of expenses
  const calculateBalance = (acc: Account) => {
    const accTxs = transactions.filter(t => t.account_id === acc.id && t.is_deleted === 0);
    const flow = accTxs.reduce((sum, t) => {
      if (t.type === 'income') return sum + t.amount;
      if (t.type === 'expense') return sum - t.amount;
      return sum;
    }, 0);
    return acc.starting_balance + flow;
  };

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      {showForm ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>New Account</Text>
          <TextInput style={styles.input} placeholder="Account Name (e.g., Bank of America)" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Starting Balance (e.g., 1000)" value={startingBalance} onChangeText={setStartingBalance} keyboardType="decimal-pad" />
          
          <View style={styles.typeSelector}>
            {['cash', 'checking', 'savings', 'credit'].map(t => (
              <TouchableOpacity key={t} style={[styles.typeBtn, type === t && styles.typeBtnActive]} onPress={() => setType(t as any)}>
                <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={accounts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const bal = calculateBalance(item);
              return (
                <View style={styles.accountCard}>
                  <View>
                    <Text style={styles.accountName}>{item.name}</Text>
                    <Text style={styles.accountType}>{item.type.toUpperCase()}</Text>
                  </View>
                  <Text style={[styles.accountBalance, { color: bal < 0 ? '#ff4444' : '#2e7d32' }]}>
                    {currencySymbol}{bal.toFixed(2)}
                  </Text>
                </View>
              );
            }}
          />
          <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  accountCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12, elevation: 2 },
  accountName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  accountType: { fontSize: 12, color: '#888', marginTop: 4 },
  accountBalance: { fontSize: 18, fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2e7d32', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  
  formCard: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  typeBtnActive: { backgroundColor: '#2e7d32' },
  typeText: { color: '#333' },
  typeTextActive: { color: 'white' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { padding: 12 },
  cancelBtnText: { color: '#888', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, paddingHorizontal: 24 },
  saveBtnText: { color: 'white', fontWeight: 'bold' },
});
