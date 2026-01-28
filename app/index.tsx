import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

import Avatar from '../components/Avatar';
import Tag from '../components/Tag';
import StatCard from '../components/StatCard';
import RecipeList from '../screens/RecipeList';

type Screen = 'menu' | 'avatar' | 'tag' | 'stat' | 'recipe';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');

  if (screen === 'avatar') {
    return (
      <View style={styles.page}>
        <Avatar
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          size={100}
        />
        <BackButton onPress={() => setScreen('menu')} />
      </View>
    );
  }

  if (screen === 'tag') {
    return (
      <View style={styles.page}>
        <Tag text="Default" />
        <Tag text="Primary" variant="primary" />
        <Tag text="Success" variant="success" />
        <Tag text="Warning" variant="warning" />
        <Tag text="Danger" variant="danger" />
        <BackButton onPress={() => setScreen('menu')} />
      </View>
    );
  }

if (screen === 'stat') {
  return (
    <View style={styles.page}>
      <StatCard
        value="2,847"
        label="Total Users"
        icon="👥"
        change={12.5}
      />
      <BackButton onPress={() => setScreen('menu')} />
    </View>
  );
}

  if (screen === 'recipe') {
  return <RecipeList onBack={() => setScreen('menu')} />;
}

  return (
    <ScrollView contentContainerStyle={styles.menu}>
      <Text style={styles.title}>📱 React Native Exercises</Text>

      <MenuButton text="Exercise 1 — Avatar" onPress={() => setScreen('avatar')} />
      <MenuButton text="Exercise 2 — Tag" onPress={() => setScreen('tag')} />
      <MenuButton text="Exercise 3 — Stat Card" onPress={() => setScreen('stat')} />
      <MenuButton text="Exercise 4 — Recipe App" onPress={() => setScreen('recipe')} />
    </ScrollView>
  );
}

function MenuButton({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={[styles.button, { marginTop: 24 }]} onPress={onPress}>
      <Text style={styles.buttonText}>⬅ Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  page: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
