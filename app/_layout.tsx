import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Layout() {
  useEffect(() => {
    const register = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
    };
    register();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      if (url) {
        // Fix: Cast 'url' to 'any' to satisfy TypeScript router types
        router.push(url as any);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="exercise1" options={{ title: 'Water Reminder' }} />
      <Stack.Screen name="exercise2" options={{ title: 'Step Counter' }} />
    </Stack>
  );
}