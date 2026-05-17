import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useAccounts } from '../../../hooks/useAccounts';
import { useTransactions } from '../../../hooks/useTransactions';
import { useApp, useTheme } from '../../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../../utils/currency';

export default function AccountsScreen() {
  const { accounts, isLoading: accLoading, addAccount } = useAccounts();
  const { rawTransactions, isLoading: txLoading } = useTransactions();
  const { currency } = useApp();
  const colors = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'cash'|'checking'|'savings'|'credit'>('checking');
  const [startingBalance, setStartingBalance] = useState('');

  const calculateBalance = (acc: any) => {
    const accTxs = rawTransactions?.filter((t: any) => t.accountId === acc._id && !t.isDeleted) || [];
    const flow = accTxs.reduce((sum: number, t: any) => {
      if (t.type === 'income') return sum + Number(t.amount);
      if (t.type === 'expense') return sum - Number(t.amount);
      return sum;
    }, 0);
    return Number(acc.startingBalance || 0) + flow;
  };

  const handleCreate = async () => {
    if (!name || isNaN(Number(startingBalance))) {
      Alert.alert('Error', 'Please enter a valid name and numeric balance.');
      return;
    }
    try {
      await addAccount({
        name,
        type,
        startingBalance: Number(startingBalance),
        currency: currency.code,
      });
      setShowForm(false);
      setName('');
      setStartingBalance('');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to create account.');
    }
  };

  if (accLoading || txLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showForm ? (
        <View style={[styles.formCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>New Account</Text>
          <TextInput 
            style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
            placeholder="Account Name (e.g., Main Wallet)" 
            placeholderTextColor={colors.subtext}
            value={name} 
            onChangeText={setName} 
          />
          <TextInput 
            style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
            placeholder="Starting Balance" 
            placeholderTextColor={colors.subtext}
            value={startingBalance} 
            onChangeText={setStartingBalance} 
            keyboardType="decimal-pad" 
          />
          
          <View style={styles.typeSelector}>
            {['cash', 'checking', 'savings', 'credit'].map((t: any) => (
              <TouchableOpacity 
                key={t} 
                style={[styles.typeBtn, { backgroundColor: colors.surface }, type === t && { backgroundColor: colors.primary }]} 
                onPress={() => setType(t as any)}
              >
                <Text style={[styles.typeText, { color: colors.text }, type === t && { color: 'white' }]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
              <Text style={{ color: colors.danger }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleCreate}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.addCard, { borderColor: colors.primary }]} 
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={[styles.addText, { color: colors.primary }]}>Add Account</Text>
        </TouchableOpacity>
      )}

      <FlatList 
        data={accounts}
        keyExtractor={(item, index) => item._id || `account-${index}`}
        renderItem={({ item }) => (
          <View style={[styles.accountCard, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.accountName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.accountType, { color: colors.subtext }]}>{item.type.toUpperCase()}</Text>
            </View>
            <Text style={[styles.accountBalance, { color: colors.text }]}>
              {formatCurrency(calculateBalance(item), currency.code)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 12, padding: 16, marginBottom: 16 },
  addText: { marginLeft: 8, fontWeight: '600' },
  formCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  typeBtn: { flex: 1, padding: 8, borderRadius: 8, marginHorizontal: 4, alignItems: 'center' },
  typeText: { fontSize: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancelBtn: { padding: 12, marginRight: 16 },
  saveBtn: { padding: 12, borderRadius: 8, paddingHorizontal: 20 },
  accountCard: { padding: 16, borderRadius: 12, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  accountName: { fontSize: 16, fontWeight: 'bold' },
  accountType: { fontSize: 12 },
  accountBalance: { fontSize: 20, fontWeight: 'bold' }
});
