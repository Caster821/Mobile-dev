import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color }) => <Ionicons name="cloud-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <Ionicons name="images-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="WeatherCard"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}