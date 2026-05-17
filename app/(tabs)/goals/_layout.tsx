import { Stack } from 'expo-router';

export default function GoalsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Goals' }} />
      <Stack.Screen name="create" options={{ title: 'Create Goal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Edit Goal' }} />
    </Stack>
  );
}
