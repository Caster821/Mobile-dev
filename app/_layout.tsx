import { Stack } from 'expo-router';
import { ThemeProvider } from './context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}