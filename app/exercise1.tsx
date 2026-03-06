import { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams, router } from 'expo-router';

export default function Exercise1() {
  const params = useLocalSearchParams();
  const isReminderMode = params.mode === 'reminder';

  const [seconds, setSeconds] = useState(5);

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Drink Water!",
        body: "It is time to hydrate.",
        data: { url: "/exercise1?mode=reminder" },
      },
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: seconds,
        repeats: false 
      },
    });
    Alert.alert("Success", `Reminder set for ${seconds} seconds.`);
  };

  if (isReminderMode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>💧 Time to Drink!</Text>
        <Text style={styles.text}>Stay hydrated for better health.</Text>
        <Button title="Back to Timer" onPress={() => router.replace('/exercise1' as any)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Reminder</Text>
      <Button title="Notify in 5s (Test)" onPress={scheduleNotification} />
      <View style={{ height: 20 }} />
      <Button 
        title="Notify in 1 Hour" 
        onPress={() => { setSeconds(3600); scheduleNotification(); }} 
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});