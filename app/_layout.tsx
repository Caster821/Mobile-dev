import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '../context/AppContext';
import { TransactionProvider } from '../context/TransactionContext';
import { ToastProvider } from '../context/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <AuthProvider>
          <AppProvider>
            <TransactionProvider>
              <ToastProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </ToastProvider>
            </TransactionProvider>
          </AppProvider>
        </AuthProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
