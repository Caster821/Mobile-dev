import { Stack } from 'expo-router';

export default function BudgetsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Budgets' }} />
      <Stack.Screen name="create" options={{ title: 'Add Budget' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Budget' }} />
    </Stack>
  );
}
