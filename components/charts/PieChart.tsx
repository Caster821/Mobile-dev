import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart as ChartKitPieChart } from 'react-native-chart-kit';

interface DataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface Props {
  data: DataItem[];
}

export const PieChart = ({ data }: Props) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{ alignItems: 'center' }}>
      <ChartKitPieChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute
      />
    </View>
  );
};
