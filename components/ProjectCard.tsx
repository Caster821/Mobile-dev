import React, { forwardRef } from 'react';
import { Pressable, Text, StyleSheet, View, PressableProps, ViewStyle, StyleProp } from 'react-native';

interface ProjectCardProps extends Omit<PressableProps, 'style'> {
  name: string;
  status: string;
  // We explicitly type style to handle both object and function patterns
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean; hovered?: boolean; focused?: boolean }) => StyleProp<ViewStyle>);
}

export const ProjectCard = forwardRef<React.ElementRef<typeof Pressable>, ProjectCardProps>(
  ({ name, status, style, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...props}
        style={(state) => {
          // 'state' contains { pressed, hovered, focused }
          const { pressed } = state; 
          
          return [
            styles.container,
            pressed && styles.pressed,
            // If the parent passed a function for style, we pass the FULL state object
            typeof style === 'function' ? style(state) : style, 
          ];
        }}
      >
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>{name}</Text>
          <View style={[styles.badge, getStatusStyle(status)]}>
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        </View>
        <Text style={styles.subText}>Tap to view project details</Text>
      </Pressable>
    );
  }
);

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Completed': return { backgroundColor: '#E3F9E5' }; 
    case 'In Progress': return { backgroundColor: '#FFF4DE' }; 
    default: return { backgroundColor: '#F1F5F9' }; 
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  subText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
});