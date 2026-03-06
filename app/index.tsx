import { View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Button 
        title="Exercise 1: Water Reminder" 
        onPress={() => router.push('/exercise1' as any)} 
      />
      <View style={{ height: 20 }} />
      <Button 
        title="Exercise 2: Step Counter" 
        onPress={() => router.push('/exercise2' as any)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});