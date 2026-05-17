import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useCategories } from '../../../hooks/useCategories';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/AppContext';
import { insertCategory } from '../../../database/database';
import { useAuth } from '../../../context/AuthContext';

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

export default function CategoriesScreen() {
  const { categories, isLoading, refresh, deleteCategory } = useCategories();
  const { user } = useAuth();
  const colors = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: ICONS[0], color: COLORS[0], type: 'expense' as 'expense' | 'income' });

  if (isLoading) return <View style={[styles.container, { backgroundColor: colors.background }]}><Text>Loading...</Text></View>;

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const sections = [
    { title: 'EXPENSE', data: expenseCategories },
    { title: 'INCOME', data: incomeCategories },
  ].filter(section => section.data.length > 0);

  const handleDeleteCategory = (category: { _id: string; name: string; isDefault?: boolean }) => {
    if (category.isDefault) {
      Alert.alert('Cannot Delete', 'Default categories cannot be deleted.');
      return;
    }
    Alert.alert(
      'Delete Category',
      `Remove "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category._id);
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    try {
      await insertCategory({
        userId: user?.id,
        name: newCategory.name,
        icon: newCategory.icon,
        color: newCategory.color,
        type: newCategory.type,
      });
      setModalVisible(false);
      setNewCategory({ name: '', icon: ICONS[0], color: COLORS[0], type: 'expense' });
      refresh();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to add category');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item._id || `${item.name}-${index}`}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardLeft}>
              <CategoryIcon icon={item.icon as any} color={item.color} size={20} />
              <View style={styles.textContainer}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              </View>
            </View>
            {!item.isDefault && (
              <TouchableOpacity onPress={() => handleDeleteCategory(item)} style={styles.deleteIcon}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
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

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, newCategory.type === 'expense' && { backgroundColor: colors.danger }]}
                onPress={() => setNewCategory({ ...newCategory, type: 'expense' })}
              >
                <Text style={[styles.typeBtnText, newCategory.type === 'expense' && { color: 'white' }]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, newCategory.type === 'income' && { backgroundColor: colors.success }]}
                onPress={() => setNewCategory({ ...newCategory, type: 'income' })}
              >
                <Text style={[styles.typeBtnText, newCategory.type === 'income' && { color: 'white' }]}>Income</Text>
              </TouchableOpacity>
            </View>

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
                onPress={() => setModalVisible(false)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 12, elevation: 1 },
  deleteIcon: { padding: 8 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { marginLeft: 16 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  type: { fontSize: 12, color: '#888', marginTop: 2 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, margin: 16, borderRadius: 12 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  sectionHeader: { paddingVertical: 10, marginTop: 10, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  listContent: { paddingBottom: 20 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxWidth: 400, borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16 },
  typeSelector: { flexDirection: 'row', marginBottom: 20 },
  typeBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  typeBtnText: { fontSize: 14, fontWeight: '600' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
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
