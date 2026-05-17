import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Modal } from 'react-native';
import { AmountInput } from '../ui/AmountInput';
import { Transaction } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { Ionicons } from '@expo/vector-icons';
import { useApp, useTheme } from '@/context/AppContext';
import { TextInput } from 'react-native-gesture-handler';
import { insertCategory } from '../../database/database';
import { useAuth } from '../../context/AuthContext';

const ICONS = [
  'fast-food', 'car', 'home', 'bulb', 'medical', 'film', 'cart', 'book',
  'cut', 'shirt', 'gift', 'airplane', 'shield-checkmark', 'receipt', 'pin',
  'cash', 'desktop', 'business', 'trending-up', 'ribbon'
];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#FDCB6E', '#81ECEC', '#FF9F43', '#A8E6CF', '#FF8B94', '#667EEA',
  '#B8E1FF', '#E2E8F0', '#A0AEC0', '#48BB78', '#ED8936', '#9F7AEA',
  '#38B2AC', '#F687B3'
];

let DateTimePicker: any;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  // Fallback handled in render
}

interface Props {
  initialData?: Transaction;
  onSubmit: (data: any) => void;
  onDelete?: () => void;
  defaultType?: 'expense' | 'income' | 'transfer';
}

export const TransactionForm = ({ initialData, onSubmit, onDelete, defaultType = 'expense' }: Props) => {
  const { currency } = useApp();
  const colors = useTheme();
  const { user } = useAuth();
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>(initialData?.type || defaultType);
  const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
  const [note, setNote] = useState(initialData?.note || '');
  const [selectedCategory, setSelectedCategory] = useState(initialData?.categoryId || '');
  const [selectedAccount, setSelectedAccount] = useState(initialData?.accountId || '');
  const [date, setDate] = useState(new Date(initialData?.date || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: ICONS[0], color: COLORS[0] });

  const { categories, refresh: refreshCategories } = useCategories(type !== 'transfer' ? type : undefined);
  const { accounts } = useAccounts();

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]._id);
    }
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
      categoryId: type !== 'transfer' ? selectedCategory : undefined,
      accountId: selectedAccount,
      date: date.getTime(),
    });
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    try {
      const result = await insertCategory({
        user_id: user?.id,
        name: newCategory.name,
        icon: newCategory.icon,
        color: newCategory.color,
        type: type as 'expense' | 'income',
      });
      setSelectedCategory(result._id);
      setShowCategoryModal(false);
      setNewCategory({ name: '', icon: ICONS[0], color: COLORS[0] });
      refreshCategories();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to add category');
    }
  };

  useEffect(() => {
    if ((showDatePicker || showTimePicker) && !DateTimePicker) {
      Alert.alert("Module Missing", "Native date picker is not available in your current build. Using today's date.");
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  }, [showDatePicker, showTimePicker]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
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
          <Pressable 
            style={[styles.typeBtn, type === 'transfer' && { backgroundColor: colors.primary }]}
            onPress={() => setType('transfer')}>
            <Text style={[styles.typeText, type === 'transfer' && styles.activeText]}>Transfer</Text>
          </Pressable>
        </View>

        <AmountInput 
          value={amount} 
          onChangeText={setAmount} 
          currencySymbol={currency.symbol} 
          isExpense={type === 'expense'} 
        />

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Date & Time</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity 
              style={[styles.dateTimeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} 
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={{ color: colors.text, marginLeft: 8 }}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.dateTimeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} 
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={{ color: colors.text, marginLeft: 8 }}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {(showDatePicker || showTimePicker) && DateTimePicker && (
          <DateTimePicker
            value={date}
            mode={showDatePicker ? 'date' : 'time'}
            is24Hour={true}
            onChange={showDatePicker ? onDateChange : onTimeChange}
          />
        )}
        <View style={styles.section}>

          <Text style={[styles.label, { color: colors.text }]}>Account</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {accounts.map((acc: any, index: number) => (
              <Pressable
                key={acc.id || acc._id || `${acc.name}-${index}`}
                style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }, (selectedAccount === acc.id || selectedAccount === acc._id) && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => (acc.id || acc._id) && setSelectedAccount(acc.id || acc._id)}>
                <Text style={[styles.chipText, { color: colors.text }, (selectedAccount === acc.id || selectedAccount === acc._id) && styles.activeText]}>{acc.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {type !== 'transfer' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(true)}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.grid}>
              {categories.map((cat: any, index: number) => (
                <Pressable
                  key={cat._id || `${cat.name}-${index}`}
                  style={[styles.categoryItem, { backgroundColor: colors.card, borderColor: colors.border }, selectedCategory === cat._id && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
                  onPress={() => cat._id && setSelectedCategory(cat._id)}>
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

        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: colors.primary }]} 
          onPress={handleSubmit}
        >
          <Text style={styles.saveBtnText}>Save Transaction</Text>
        </TouchableOpacity>

        {initialData && onDelete && (
          <TouchableOpacity
            style={[styles.deleteBtn]}
            onPress={onDelete}
          >
            <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Delete Transaction</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Category</Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Category Name"
              placeholderTextColor={colors.subtext}
              value={newCategory.name}
              onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
            />

            <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
            <View style={styles.iconGrid}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconOption, newCategory.icon === icon && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                  onPress={() => setNewCategory({ ...newCategory, icon })}
                >
                  <Ionicons name={icon as any} size={24} color={newCategory.icon === icon ? colors.primary : colors.subtext} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }, newCategory.color === color && styles.selectedColor]}
                  onPress={() => setNewCategory({ ...newCategory, color })}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleAddCategory}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 60 },
  typeSelector: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 24 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  typeText: { fontSize: 16, fontWeight: '600', color: '#888' },
  activeText: { color: '#fff' },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 18, fontWeight: 'bold' },
  dateTimeRow: { flexDirection: 'row', gap: 12 },
  dateTimeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
  row: { flexDirection: 'row' },
  chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, marginRight: 12, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  categoryItem: { width: '22%', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 16, borderWidth: 1 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 12, textAlign: 'center', fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
  saveBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { padding: 16, alignItems: 'center', marginTop: 12 },
  deleteBtnText: { fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxWidth: 400, borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  iconOption: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginBottom: 12, borderWidth: 1 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  colorOption: { width: 40, height: 40, borderRadius: 20, marginRight: 12, marginBottom: 12 },
  selectedColor: { borderWidth: 3, borderColor: '#000' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f0f0f0', marginRight: 8 },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#333' },
  saveButton: { marginLeft: 8 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
