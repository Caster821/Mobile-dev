import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useGoals } from '../../../hooks/useGoals';
import { useApp, useTheme } from '../../../context/AppContext';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GoalProgressCircle } from '../../../components/ui/GoalProgressCircle';
import { commonShadow } from '../../../utils/theme';
import { formatCurrency } from '../../../utils/currency';

export default function GoalsScreen() {
  const { goals, loading, refresh } = useGoals();
  const { currencyCode } = useApp();
  const colors = useTheme();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const getDeadlineText = (deadline: number | null) => {
    if (!deadline) return null;
    const now = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: colors.danger };
    if (diffDays === 0) return { text: 'Due today', color: colors.warning };
    return { text: `${diffDays} days left`, color: colors.subtext };
  };

  const handleContribute = (goalId: string) => {
    Alert.prompt(
      "Contribute to Goal",
      "Enter amount to add to this goal:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Contribute", 
          onPress: (amount?: string) => {
            // In a real app, this would create a transaction and update the goal
            // For now, let's just show a toast-like alert
            Alert.alert("Success", `Contributed ${amount} to goal!`);
            refresh();
          }
        }
      ],
      "plain-text",
      "",
      "decimal-pad"
    );
  };

  if (loading && goals.length === 0) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const progress = item.target_amount > 0 ? item.current_amount / item.target_amount : 0;
          const deadline = getDeadlineText(item.deadline);
          
          return (
            <View style={[styles.card, { backgroundColor: colors.card }, commonShadow]}>
              <View style={styles.cardMain}>
                <GoalProgressCircle 
                  progress={progress} 
                  icon={item.icon || 'flag'} 
                  color={item.color || colors.primary} 
                />
                <View style={styles.details}>
                  <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.amount, { color: colors.subtext }]}>
                    {formatCurrency(item.current_amount, currencyCode)} of {formatCurrency(item.target_amount, currencyCode)}
                  </Text>
                  {deadline && (
                    <Text style={[styles.deadline, { color: deadline.color }]}>{deadline.text}</Text>
                  )}
                </View>
                <Pressable 
                  style={({ pressed }) => [styles.contributeBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}
                  onPress={() => handleContribute(item.id)}
                >
                  <Ionicons name="add" size={24} color="white" />
                </Pressable>
              </View>
              
              <View style={[styles.progressBarBg, { backgroundColor: colors.surface }]}>
                <View style={[styles.progressBarFill, { backgroundColor: item.color || colors.primary, width: `${Math.min(progress * 100, 100)}%` }]} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No savings goals yet</Text>
            <Pressable style={[styles.ctaButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/(tabs)/goals/create')}>
              <Text style={styles.ctaText}>Set a Goal</Text>
            </Pressable>
          </View>
        }
      />

      <Pressable 
        style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, transform: [{ scale: pressed ? 0.95 : 1 }] }, commonShadow]}
        onPress={() => router.push('/(tabs)/goals/create')}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  details: { flex: 1, marginLeft: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  amount: { fontSize: 14, marginTop: 4 },
  deadline: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  contributeBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  progressBarBg: { height: 6, borderRadius: 3, marginTop: 16, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, marginTop: 16, marginBottom: 20 },
  ctaButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  ctaText: { color: 'white', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
});
