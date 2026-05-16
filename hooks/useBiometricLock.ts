import React, { useState, useEffect } from 'react';
import { authenticateWithBiometrics } from '../utils/secureStore';
import { View, Text, StyleSheet } from 'react-native';

export function useBiometricLock() {
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = async () => {
      try {
        const success = await authenticateWithBiometrics();
        setUnlocked(success);
        setError(!success);
      } catch (e) {
        setUnlocked(true); // Fail open if device doesn't support it
      }
    };
    auth();
  }, []);

  return { unlocked, error };
}
