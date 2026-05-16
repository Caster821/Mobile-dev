import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const BIOMETRIC_KEY = 'pennywise_biometric_enabled';

export const enableBiometricLock = async (enabled: boolean) => {
  if (enabled) {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!hasHardware || !isEnrolled) {
      throw new Error('Biometric authentication not available or not enrolled');
    }
    
    await SecureStore.setItemAsync(BIOMETRIC_KEY, 'true');
  } else {
    await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
  }
};

export const isBiometricEnabled = async (): Promise<boolean> => {
  const result = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  return result === 'true';
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  const enabled = await isBiometricEnabled();
  if (!enabled) return true;
  
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access PennyWise',
    fallbackLabel: 'Use Passcode',
  });
  
  return result.success;
};
