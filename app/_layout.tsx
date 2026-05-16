import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { TransactionProvider } from '../context/TransactionContext';
import { useBiometricLock } from '../hooks/useBiometricLock';
import { View, Text } from 'react-native';

function Root() {
  const { unlocked, error } = useBiometricLock();

  if (error) {
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Authentication failed. Please restart app.</Text></View>;
  }
  if (!unlocked) {
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Locked...</Text></View>;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'PennyWise', headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from '../context/ToastContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <TransactionProvider>
          <ToastProvider>
            <Root />
          </ToastProvider>
        </TransactionProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
