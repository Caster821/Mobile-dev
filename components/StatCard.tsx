import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  change?: number; 
}

function StatCard({ value, label, icon, change }: StatCardProps) {
  const isPositive = typeof change === 'number' && change >= 0;

  return (
    <View style={styles.card}>
      {icon && <Text style={styles.icon}>{icon}</Text>}

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>

      {typeof change === 'number' && (
        <Text
          style={[
            styles.change,
            isPositive ? styles.positive : styles.negative,
          ]}
        >
          {isPositive ? '+' : ''}
          {change}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  icon: {
    fontSize: 28,
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  change: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
});

export default StatCard;