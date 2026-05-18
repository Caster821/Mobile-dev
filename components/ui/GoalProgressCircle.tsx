import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
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
  const center = size / 2;

  // Création du chemin de progression (arc de cercle)
  const path = Skia.Path.Make();
  path.addArc({ x: strokeWidth / 2, y: strokeWidth / 2, width: size - strokeWidth, height: size - strokeWidth }, -90, progress * 360);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas style={{ width: size, height: size }}>
        {/* Cercle d'arrière-plan */}
        <Circle cx={center} cy={center} r={radius} color={theme.surface} style="stroke" strokeWidth={strokeWidth} />
        {/* Cercle de progression */}
        <Path path={path} color={color} style="stroke" strokeWidth={strokeWidth} strokeCap="round" />
      </Canvas>
      <View style={styles.iconContainer}>
        <CategoryIcon icon={icon as any} color={color} size={size * 0.3} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  iconContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
});
