import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function BiometricsScreen() {
  const [status, setStatus] = useState('Idle');

  const scanFingerprint = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      setStatus('Biometrics not supported');
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      setStatus('No biometrics enrolled');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      setStatus('Success: Identity Verified!');
    } else {
      setStatus('Error: Authentication Failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Scanner</Text>
      <View style={styles.card}>
        <Text style={styles.status}>{status}</Text>
        <Button title="Scan Fingerprint" onPress={scanFingerprint} />
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
    elevation: 5, 
    width: '80%' 
  },
  status: { 
    marginBottom: 20, 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#555' 
  },
});