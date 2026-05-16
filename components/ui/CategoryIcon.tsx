import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
}

export const CategoryIcon = ({ icon, color, size = 24 }: Props) => {
  return (
    <View style={[styles.container, { backgroundColor: color + '20', width: size * 2, height: size * 2, borderRadius: size }]}>
      <Ionicons name={icon} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
