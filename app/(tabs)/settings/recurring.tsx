import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecurring } from '../../../hooks/useRecurring';
import { useCategories } from '../../../hooks/useCategories';
import { useAccounts } from '../../../hooks/useAccounts';
import { useApp, useTheme } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/currency';
import { AmountInput } from '../../../components/ui/AmountInput';

const FREQUENCIES = ['daily', 'weekly', 'biweekly', 'monthly', 'yearly'] as const;

export default function RecurringScreen() {
  const colors = useTheme();
  const { currency } = useApp();
  const { rules, isLoading, refresh, addRule, deleteRule } = useRecurring();
  const { categories: expenseCategories } = useCategories('expense');
  const { categories: incomeCategories } = useCategories('income');
  const { accounts } = useAccounts();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [frequency, setFrequency] = useState<typeof FREQUENCIES[number]>('monthly');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const resetForm = () => {
    setAmount('');
    setCategoryId('');
    setAccountId(accounts[0]?._id || '');
    setFrequency('monthly');
    setType('expense');
  };

  const handleAdd = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount.');
      return;
    }
    if (!categoryId) {
      Alert.alert('Error', 'Select a category.');
      return;
    }
    if (!accountId) {
      Alert.alert('Error', 'Select an account.');
      return;
    }
    try {
      await addRule({
        type,
        amount: Number(amount),
        categoryId,
        accountId,
        frequency,
        interval: 1,
        startDate: Date.now(),
      });
      setModalVisible(false);
      resetForm();
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e.message || 'Failed to create recurring rule.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Recurring', 'Remove this recurring transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRule(id);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete recurring rule.');
          }
        },
      },
    ]);
  };

  const activeCategories = type === 'expense' ? expenseCategories : incomeCategories;

  if (isLoading && rules.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.primary }]}
        onPress={() => {
          resetForm();
          if (accounts[0]) setAccountId(accounts[0]._id);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={22} color="white" />
        <Text style={styles.addBtnText}>Add Recurring</Text>
      </TouchableOpacity>

      <FlatList
        data={rules}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subtext }]}>No recurring transactions yet.</Text>
        }
        renderItem={({ item }) => {
          const cat = [...expenseCategories, ...incomeCategories].find((c) => c._id === item.categoryId);
          return (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardLeft}>
                <Ionicons
                  name={item.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={28}
                  color={item.type === 'income' ? colors.success : colors.danger}
                />
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {cat?.name || 'Category'} · {item.frequency}
                  </Text>
                  <Text style={[styles.cardSub, { color: colors.subtext }]}>
                    {formatCurrency(item.amount, currency.code)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={22} color={colors.danger} />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Recurring</Text>

              <View style={[styles.typeRow, { backgroundColor: colors.surface }]}>
                {(['expense', 'income'] as const).map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.typeChip, type === t && { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setType(t);
                      setCategoryId('');
                    }}
                  >
                    <Text style={[styles.typeChipText, type === t && { color: 'white' }]}>{t}</Text>
                  </Pressable>
                ))}
              </View>

              <AmountInput
                value={amount}
                onChangeText={setAmount}
                currencySymbol={currency.symbol}
                isExpense={type === 'expense'}
              />

              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={styles.chipRow}>
                {activeCategories.map((cat) => (
                  <Pressable
                    key={cat._id}
                    style={[
                      styles.chip,
                      { borderColor: colors.border },
                      categoryId === cat._id && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    onPress={() => setCategoryId(cat._id)}
                  >
                    <Text style={[styles.chipText, { color: colors.text }, categoryId === cat._id && { color: 'white' }]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Account</Text>
              <View style={styles.chipRow}>
                {accounts.map((acc) => (
                  <Pressable
                    key={acc._id}
                    style={[
                      styles.chip,
                      { borderColor: colors.border },
                      accountId === acc._id && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    onPress={() => setAccountId(acc._id)}
                  >
                    <Text style={[styles.chipText, { color: colors.text }, accountId === acc._id && { color: 'white' }]}>
                      {acc.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
              <View style={styles.chipRow}>
                {FREQUENCIES.map((f) => (
                  <Pressable
                    key={f}
                    style={[
                      styles.chip,
                      { borderColor: colors.border },
                      frequency === f && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    onPress={() => setFrequency(f)}
                  >
                    <Text style={[styles.chipText, { color: colors.text }, frequency === f && { color: 'white' }]}>
                      {f}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: colors.subtext }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, marginBottom: 16, gap: 8 },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 10 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardInfo: { marginLeft: 12, flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 2 },
  deleteBtn: { padding: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  typeRow: { flexDirection: 'row', borderRadius: 10, padding: 4, marginBottom: 16 },
  typeChip: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 8 },
  typeChipText: { fontWeight: '600', textTransform: 'capitalize' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 20, marginBottom: 8 },
  cancelBtn: { padding: 14 },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  saveBtnText: { color: 'white', fontWeight: 'bold' },
});
