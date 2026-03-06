import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2196F3',
        tabBarStyle: { height: 60, paddingBottom: 5 },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="biometrics"
        options={{
          title: 'Biometrics',
          tabBarIcon: ({ color }) => <Ionicons name="finger-print" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => <Ionicons name="camera" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="accelerometer"
        options={{
          title: 'Motion',
          tabBarIcon: ({ color }) => <Ionicons name="speedometer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'GPS',
          tabBarIcon: ({ color }) => <Ionicons name="location" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="battery"
        options={{
          title: 'Battery',
          tabBarIcon: ({ color }) => <Ionicons name="battery-charging" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="haptics"
        options={{
          title: 'Vibrate',
          tabBarIcon: ({ color }) => <Ionicons name="pulse" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}