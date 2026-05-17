import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useGoals } from '../../../hooks/useGoals';
import { useApp, useTheme } from '../../../context/AppContext';
import { router, useFocusEffect } from 'expo-router';
import { navigateToEditGoal } from '../../../utils/navigation';
import { Ionicons } from '@expo/vector-icons';
import { GoalProgressCircle } from '../../../components/ui/GoalProgressCircle';
import { commonShadow } from '../../../utils/theme';
import { formatCurrency } from '../../../utils/currency';
import { SavingsGoal } from '../../../types';

export default function GoalsScreen() {
  const { goals, isLoading, refresh, contributeToGoal, deleteGoal } = useGoals();
  const { currency } = useApp();
  const colors = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDeadlineText = (deadline?: string | null) => {
    if (!deadline) return null;
    const now = new Date();
    const target = new Date(deadline);
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: colors.danger };
    if (diffDays === 0) return { text: 'Due today', color: colors.warning };
    return { text: `${diffDays} days left`, color: colors.subtext };
  };

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleDeleteGoal = (goal: SavingsGoal) => {
    Alert.alert(
      'Delete Goal',
      `Remove "${goal.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(goal._id);
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to delete goal');
            }
          },
        },
      ]
    );
  };

  const handleContribute = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setContributeAmount('');
    setModalVisible(true);
  };

  const handleSubmitContribution = async () => {
    if (!selectedGoal) return;
    
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await contributeToGoal(selectedGoal, amount);
      setModalVisible(false);
      setContributeAmount('');
      Alert.alert('Success', `Added ${formatCurrency(amount, currency.code)} to ${selectedGoal.name}`);
    } catch (error) {
      console.error('Failed to contribute:', error);
      Alert.alert('Error', 'Failed to add contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && goals.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Savings Goals</Text>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item, index) => item._id || `goal-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No savings goals yet.</Text>
            <TouchableOpacity 
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/goals/create')}
            >
              <Text style={styles.createBtnText}>Create Your First Goal</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const current = Number(item.currentAmount || 0);
          const target = Number(item.targetAmount || 1);
          const progress = target > 0 ? current / target : 0;
          const deadline = getDeadlineText(item.deadline);
          const isCompleted = current >= target;
          
          return (
            <Pressable
              style={[styles.card, { backgroundColor: colors.card }, commonShadow]}
              onPress={() => navigateToEditGoal(item._id)}
            >
              <View style={styles.cardMain}>
                <GoalProgressCircle 
                  progress={progress} 
                  icon={item.icon || 'flag'}
                  color={isCompleted ? colors.success : (item.color || colors.primary)}
                />
                <View style={styles.details}>
                  <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.amount, { color: colors.subtext }]}>
                    {formatCurrency(current, currency.code)} of {formatCurrency(target, currency.code)}
                  </Text>
                  {isCompleted && (
                    <Text style={[styles.completed, { color: colors.success }]}>✓ Completed!</Text>
                  )}
                  {!isCompleted && deadline && (
                    <Text style={[styles.deadline, { color: deadline.color }]}>{deadline.text}</Text>
                  )}
                </View>
                <View style={styles.goalActions}>
                  {!isCompleted && (
                    <Pressable 
                      style={({ pressed }) => [styles.contributeBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}
                      onPress={(e) => {
                      e.stopPropagation();
                      handleContribute(item);
                    }}
                    >
                      <Ionicons name="add" size={24} color="white" />
                    </Pressable>
                  )}
                  <Pressable
                    style={({ pressed }) => [styles.deleteBtn, { opacity: pressed ? 0.8 : 1 }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteGoal(item);
                    }}
                  >
                    <Ionicons name="trash-outline" size={22} color={colors.danger} />
                  </Pressable>
                </View>
                {isCompleted && (
                  <View style={[styles.completedBadge, { backgroundColor: colors.success }]}>
                    <Ionicons name="checkmark" size={24} color="white" />
                  </View>
                )}
              </View>
            </Pressable>
          );
        }}
      />
      
      <TouchableOpacity 
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/goals/create')}
            >
              <Text style={styles.createBtnText}>Add a Goal</Text>
            </TouchableOpacity>

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Add to {selectedGoal?.name}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.subtext} />
              </Pressable>
            </View>

            <Text style={[styles.modalLabel, { color: colors.subtext }]}>
              Current: {formatCurrency(selectedGoal?.currentAmount || 0, currency.code)}
            </Text>
            <Text style={[styles.modalLabel, { color: colors.subtext }]}>
              Target: {formatCurrency(selectedGoal?.targetAmount || 0, currency.code)}
            </Text>
            <Text style={[styles.modalLabel, { color: colors.subtext }]}>
              Remaining: {formatCurrency((selectedGoal?.targetAmount || 0) - (selectedGoal?.currentAmount || 0), currency.code)}
            </Text>

            <TextInput
              style={[styles.amountInput, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.border 
              }]}
              placeholder="Enter amount"
              placeholderTextColor={colors.subtext}
              keyboardType="decimal-pad"
              value={contributeAmount}
              onChangeText={setContributeAmount}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.subtext }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmitContribution}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Adding...' : 'Add Contribution'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  listContent: { padding: 16, paddingBottom: 100 },
  card: { padding: 16, borderRadius: 16, marginBottom: 16 },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  details: { flex: 1, marginLeft: 16 },
  title: { fontSize: 16, fontWeight: 'bold' },
  amount: { fontSize: 14, marginTop: 4 },
  deadline: { fontSize: 12, marginTop: 4 },
  completed: { fontSize: 12, marginTop: 4, fontWeight: 'bold' },
  goalActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contributeBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  completedBadge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 16, fontSize: 16 },
  createBtn: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, alignItems: 'center'},
  createBtnText: { color: 'white', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalLabel: { fontSize: 14, marginBottom: 8 },
  amountInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 18, marginVertical: 16, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { borderWidth: 1 },
  submitButton: { marginLeft: 12 },
  cancelButtonText: { fontWeight: '500' },
  submitButtonText: { color: 'white', fontWeight: 'bold' },
});