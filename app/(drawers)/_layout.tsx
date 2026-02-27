import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useTheme } from '../context/ThemeContext';

export default function DrawerLayout() {
  const { theme } = useTheme();
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
        },
        headerTintColor: theme === 'dark' ? '#fff' : '#000',
        drawerStyle: {
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
        },
        drawerActiveTintColor: theme === 'dark' ? '#fff' : '#000',
        drawerInactiveTintColor: theme === 'dark' ? '#aaa' : '#666',
      }}>
        <Drawer.Screen name="index" options={{ title: 'Home' }} />
        <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}