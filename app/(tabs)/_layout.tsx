import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          headerRight: () => (
            <Pressable onPress={() => router.push('/modal')} style={{ marginRight: 15 }}>
              <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}