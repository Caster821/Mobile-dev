import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart as ChartKitLineChart } from 'react-native-chart-kit';

interface Props {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
}

export const LineChart = ({ labels, incomeData, expenseData }: Props) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{ alignItems: 'center' }}>
      <ChartKitLineChart
        data={{
          labels,
          datasets: [
            {
              data: incomeData,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green
              strokeWidth: 2
            },
            {
              data: expenseData,
              color: (opacity = 1) => `rgba(255, 68, 68, ${opacity})`, // Red
              strokeWidth: 2
            }
          ],
          legend: ["Income", "Expenses"]
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: { r: "4" }
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 12 }}
      />
    </View>
  );
};
