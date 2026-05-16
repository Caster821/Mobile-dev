import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '../../context/AppContext';

interface Props {
  width?: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton = ({ width = '100%', height, borderRadius = 8, style }: Props) => {
  const colors = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        { width, height, borderRadius, backgroundColor: colors.surface, opacity },
        style
      ]} 
    />
  );
};

export const TransactionSkeleton = () => (
  <View style={styles.container}>
    <Skeleton width={48} height={48} borderRadius={24} />
    <View style={styles.details}>
      <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={12} />
    </View>
    <Skeleton width={80} height={20} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  }
});
