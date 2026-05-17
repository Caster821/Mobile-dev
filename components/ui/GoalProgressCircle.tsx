import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../context/AppContext';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  progress: number;
  icon: string;
  color: string;
  size?: number;
}

export const GoalProgressCircle = ({ progress, icon, color, size = 80 }: Props) => {
  const theme = useTheme();
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const svgProgress = 1 - progress;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          stroke={theme.surface}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * svgProgress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.iconContainer}>
        <CategoryIcon icon={icon as any} color={color} size={size * 0.3} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
