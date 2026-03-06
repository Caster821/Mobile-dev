import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function AccelerometerScreen() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);

  const toggle = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    } else {
      setSubscription(Accelerometer.addListener(setData));
      Accelerometer.setUpdateInterval(100);
    }
  };

  useEffect(() => {
    return () => subscription && subscription.remove();
  }, [subscription]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accelerometer</Text>
      <View style={styles.card}>
        <Text style={styles.value}>X: {data.x.toFixed(2)}</Text>
        <Text style={styles.value}>Y: {data.y.toFixed(2)}</Text>
        <Text style={styles.value}>Z: {data.z.toFixed(2)}</Text>
        <View style={{ marginTop: 20 }}>
          <Button title={subscription ? "Stop" : "Start"} onPress={toggle} color={subscription ? "red" : "#2196F3"} />
        </View>
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
    padding: 30, 
    borderRadius: 10, 
    elevation: 5, width: '80%', 
    alignItems: 'center' 
  },
  value: { 
    fontSize: 24, 
    marginVertical: 5, 
    fontFamily: 'monospace' 
  },
});