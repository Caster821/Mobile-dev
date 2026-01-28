import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface TagProps {
  text: string;
  variant?: Variant;
  onPress?: () => void;
}

const colors = {
  default: { bg: '#e0e0e0', text: '#666' },
  primary: { bg: '#007AFF', text: '#fff' },
  success: { bg: '#34C759', text: '#fff' },
  warning: { bg: '#FF9500', text: '#fff' },
  danger: { bg: '#FF3B30', text: '#fff' },
};

function Tag({ text, variant = 'default', onPress }: TagProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.tag,
        { backgroundColor: colors[variant].bg },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: colors[variant].text }]}>
        {text}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default Tag;
