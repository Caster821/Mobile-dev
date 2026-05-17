import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

interface Action {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}

interface Props {
  actions: Action[];
}

export const AnimatedFAB = ({ actions }: Props) => {
  const [open, setOpen] = useState(false);
  const colors = useTheme();
  const animation = React.useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70 * (index + 1)],
        });

        const opacity = animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.actionContainer,
              { transform: [{ translateY }], opacity },
            ]}
          >
            <Text style={[styles.label, { color: colors.text }]}>{action.label}</Text>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: action.color }]}
              onPress={() => {
                action.onPress();
                toggleMenu();
              }}
            >
              <Ionicons name={action.icon as any} size={24} color="white" />
            </Pressable>
          </Animated.View>
        );
      })}

      <Pressable
        style={[styles.mainBtn, { backgroundColor: colors.primary }]}
        onPress={toggleMenu}
      >
        <Animated.View style={{ transform: [{ rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg']
        }) }] }}>
          <Ionicons name="add" size={32} color="white" />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    alignItems: 'flex-end',
  },
  mainBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  actionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  label: {
    marginRight: 12,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
