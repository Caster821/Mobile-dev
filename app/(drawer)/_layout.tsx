import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ headerTitle: 'My App' }}>
        
        <Drawer.Screen 
          name="index" 
          options={{ 
            drawerLabel: 'Home', 
            title: 'Home' 
          }} 
        />
        
        <Drawer.Screen 
          name="settings" 
          options={{ 
            drawerLabel: 'Settings', 
            title: 'Settings' 
          }} 
        />

        <Drawer.Screen 
          name="profile"
          options={{ 
            drawerLabel: 'Profile', 
            title: 'Profile' 
          }} 
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}