import { Stack } from 'expo-router';

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Transactions' }} />
      <Stack.Screen name="add" options={{ title: 'Add Transaction', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Edit Transaction' }} />
    </Stack>
  );
}
