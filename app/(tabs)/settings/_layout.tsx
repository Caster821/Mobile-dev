import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="accounts" options={{ title: 'Manage Accounts' }} />
      <Stack.Screen name="categories" options={{ title: 'Manage Categories' }} />
      <Stack.Screen name="recurring" options={{ title: 'Recurring Transactions' }} />
      <Stack.Screen name="account" options={{ title: 'Account' }} />
      <Stack.Screen name="backup" options={{ title: 'Backup & Restore' }} />
    </Stack>
  );
}
