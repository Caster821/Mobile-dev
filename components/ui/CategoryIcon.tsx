import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: any;
  color: string;
  size?: number;
}

const isEmoji = (icon: string) => {
  if (!icon) return false;
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(icon);
};

export const CategoryIcon = ({ icon, color, size = 24 }: Props) => {

  if (isEmoji(icon)) {
    return (
      <View style={[styles.container, { backgroundColor: color + '20', width: size * 2, height: size * 2, borderRadius: size }]}>
        <Text style={{ fontSize: size }}>{icon}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: color + '20', width: size * 2, height: size * 2, borderRadius: size }]}>
      <Ionicons name={icon as any} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
