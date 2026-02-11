import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Project Details',
          headerBackTitle: 'Dashboard',
          headerTintColor: '#007AFF'
        }} 
      />
    </Stack>
  );
}