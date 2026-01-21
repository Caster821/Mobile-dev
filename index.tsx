import React from 'react';
import { View, StyleSheet } from 'react-native';
// This path goes up two levels (../../) to find the components folder
import ProfileCard from '../../components/ProfileCard'; 

export default function HomeScreen() {
  return (
    // We wrap it in a View just to be safe, but ProfileCard handles its own layout
    <View style={styles.container}>
      <ProfileCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the component takes up the full screen space
  },
});