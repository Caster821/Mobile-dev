import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

const StackLayout = () => {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  // 1. Hook to check if navigation is ready
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // 2. Add safe guard: Don't navigate if the root state isn't loaded
    if (!rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, rootNavigationState]);

  // 3. Show a loader while navigation mounts (optional but recommended)
  if (!rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* This works now because we created app/(auth)/_layout.tsx */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'New Project' }} />
      <Stack.Screen name="projects" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops' }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}