import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function HapticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haptics Engine</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Impact Styles</Text>
        <View style={styles.btnGroup}>
          <Button title="Light" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
          <View style={{height: 10}} />
          <Button title="Medium" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
          <View style={{height: 10}} />
          <Button title="Heavy" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Notifications</Text>
        <View style={styles.btnGroup}>
          <Button title="Success" color="green" onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)} />
          <View style={{height: 10}} />
          <Button title="Error" color="red" onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    elevation: 3, 
    width: '80%', 
    marginBottom: 20 
  },
  label: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  btnGroup: { 
    width: '100%' 
  }
});