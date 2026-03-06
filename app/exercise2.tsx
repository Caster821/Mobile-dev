import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams } from 'expo-router';

export default function Exercise2() {
  const params = useLocalSearchParams();
  const isStatsMode = params.mode === 'stats';
  const paramSteps = params.steps ? Number(params.steps) : 0;

  const [currentSteps, setCurrentSteps] = useState(0);
  const [goal, setGoal] = useState(100);
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    const startTracking = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        subscription = Pedometer.watchStepCount(result => {
          setCurrentSteps(result.steps);
        });
      }
    };

    startTracking();
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (currentSteps >= goal && !hasNotified && goal > 0) {
      setHasNotified(true);
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Goal Reached! 🏆",
          body: `You hit ${currentSteps} steps.`,
          data: { url: `/exercise2?mode=stats&steps=${currentSteps}` },
        },
        trigger: null,
      });
    } else if (currentSteps < goal) {
      setHasNotified(false);
    }
  }, [currentSteps, goal, hasNotified]);

  if (isStatsMode) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>Goal Reached!</Text>
        <Text style={styles.stat}>{paramSteps} Steps</Text>
        <Text style={styles.subtext}>Great job hitting your daily target.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Counter</Text>
      <View style={styles.card}>
        <Text style={styles.bigNumber}>{currentSteps}</Text>
        <Text>Steps Taken</Text>
      </View>
      <Text style={styles.label}>Set Goal:</Text>
      <TextInput 
        style={styles.input}
        keyboardType="numeric"
        value={goal.toString()}
        onChangeText={(t) => setGoal(Number(t) || 0)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: 100,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  stat: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'green',
    marginVertical: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});