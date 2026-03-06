import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Battery from 'expo-battery';
import { Ionicons } from '@expo/vector-icons';

export default function BatteryScreen() {
  const [level, setLevel] = useState<number | null>(null);
  const [state, setState] = useState<Battery.BatteryState | null>(null);

  useEffect(() => {
    const load = async () => {
      setLevel(await Battery.getBatteryLevelAsync());
      setState(await Battery.getBatteryStateAsync());
    };
    load();

    const sub1 = Battery.addBatteryLevelListener(({ batteryLevel }) => setLevel(batteryLevel));
    const sub2 = Battery.addBatteryStateListener(({ batteryState }) => setState(batteryState));

    return () => { sub1.remove(); sub2.remove(); };
  }, []);

  const getIcon = () => {
    if (state === Battery.BatteryState.CHARGING) return "battery-charging";
    if (level && level > 0.9) return "battery-full";
    if (level && level < 0.2) return "battery-dead";
    return "battery-half";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battery Monitor</Text>
      <View style={styles.card}>
        <Ionicons name={getIcon()} size={60} color={state === Battery.BatteryState.CHARGING ? "green" : "black"} />
        <Text style={styles.percentage}>
          {level !== null ? `${Math.round(level * 100)}%` : 'Loading...'}
        </Text>
        <Text style={styles.status}>
          Status: {state === Battery.BatteryState.CHARGING ? 'Charging' : 'Unplugged'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: 'white', 
    padding: 40, 
    borderRadius: 10, 
    elevation: 5, 
    alignItems: 'center' 
  },
  percentage: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    marginVertical: 10 
  },
  status: { 
    fontSize: 16, 
    color: 'gray' 
  },
});