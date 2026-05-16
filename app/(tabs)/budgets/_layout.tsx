import { Stack } from 'expo-router';

export default function BudgetsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Budgets' }} />
    </Stack>
  );
}
