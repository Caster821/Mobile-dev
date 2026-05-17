import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/context/AppContext';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  currencySymbol: string;
  isExpense?: boolean;
}

export const AmountInput = ({ value, onChangeText, currencySymbol, isExpense = true }: Props) => {
  const colors = useTheme();

  // Simple formatting for display (not for the input itself to avoid cursor jumps)
  const formattedValue = value ? Number(value).toLocaleString('en-US') : '0';

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={[styles.symbol, { color: isExpense ? colors.danger : colors.success }]}>
          {isExpense ? '-' : '+'}{currencySymbol} 
        </Text>
        <TextInput
          style={[styles.input, { color: isExpense ? colors.danger : colors.success }]}
          value={value}
          onChangeText={(text) => {
            // Only allow numbers and one decimal point
            const cleaned = text.replace(/[^0-9.]/g, '');
            const parts = cleaned.split('.');
            if (parts.length > 2) return;
            onChangeText(cleaned);
          }}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#ccc"
          autoFocus
        />
      </View>
      {value.length > 0 && (
        <Text style={[styles.formattedPreview, { color: colors.subtext }]}>
          {currencySymbol} {formattedValue}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 40,
    fontWeight: 'bold',
    marginRight: 4,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    minWidth: 100,
    textAlign: 'center',
  },
  formattedPreview: {
    fontSize: 18,
    marginTop: 8,
    fontWeight: '600',
  },
});
