import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_TASK_NAME = 'HYDRATION_REMINDER_TASK';
const STORAGE_KEY_HOURS = 'WORKING_HOURS_SETTINGS';
const STORAGE_KEY_ACTIVE = 'REMINDER_IS_ACTIVE';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getWorkHours = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_HOURS);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const workHours = await getWorkHours();
    if (!workHours) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const startDate = new Date(workHours.start);
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();

    const endDate = new Date(workHours.end);
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hydration Alert",
          body: "Time to drink water!",
          sound: true,
        },
        trigger: null,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export default function Index() {
  const [startTime, setStartTime] = useState<Date>(new Date(new Date().setHours(9, 0, 0, 0)));
  const [endTime, setEndTime] = useState<Date>(new Date(new Date().setHours(17, 0, 0, 0)));
  const [isEnabled, setIsEnabled] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedHours = await AsyncStorage.getItem(STORAGE_KEY_HOURS);
      const storedActive = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE);

      if (storedHours) {
        const parsed = JSON.parse(storedHours);
        setStartTime(new Date(parsed.start));
        setEndTime(new Date(parsed.end));
      }
      if (storedActive) {
        setIsEnabled(JSON.parse(storedActive));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = async (start: Date, end: Date) => {
    const data = {
      start: start.toISOString(),
      end: end.toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY_HOURS, JSON.stringify(data));
  };

  const requestPermissions = async () => {
    const { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus !== 'granted') {
      return false;
    }

    const bgStatus = await BackgroundFetch.getStatusAsync();
    if (bgStatus === BackgroundFetch.BackgroundFetchStatus.Restricted || bgStatus === BackgroundFetch.BackgroundFetchStatus.Denied) {
      return false;
    }
    return true;
  };

  const toggleSwitch = async () => {
    const newState = !isEnabled;
    
    if (newState) {
      const hasPerms = await requestPermissions();
      if (!hasPerms) {
        Alert.alert("Permissions Missing", "Please enable notifications and background refresh in settings.");
        return;
      }

      await saveSettings(startTime, endTime);
      
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
          minimumInterval: 60 * 3,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        
        setIsEnabled(true);
        await AsyncStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(true));
      } catch (e) {
        Alert.alert("Error", "Failed to register background task.");
      }
    } else {
      try {
        await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
        setIsEnabled(false);
        await AsyncStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(false));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartTime(selectedDate);
      if (isEnabled) saveSettings(selectedDate, endTime);
    }
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndTime(selectedDate);
      if (isEnabled) saveSettings(startTime, selectedDate);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hydration Reminder</Text>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Working Hours</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Start Time:</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.timeDisplay}>{formatTime(startTime)}</Text>
          </TouchableOpacity>
        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={onStartTimeChange}
          />
        )}

        <View style={styles.row}>
          <Text style={styles.label}>End Time:</Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.timeDisplay}>{formatTime(endTime)}</Text>
          </TouchableOpacity>
        </View>
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={onEndTimeChange}
          />
        )}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Active</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#2196F3" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  card: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
  timeDisplay: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '500',
  }
});