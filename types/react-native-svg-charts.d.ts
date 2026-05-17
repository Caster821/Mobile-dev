declare module 'react-native-gifted-charts' {
  import { ComponentType, ReactNode } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  export interface ChartSvgProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    fontSize?: number;
  }

  export interface PieChartDataItem {
    value: number;
    svg?: ChartSvgProps;
    key?: string;
    arc?: { outerRadius?: string | number };
  }

  export interface PieChartProps {
    style?: StyleProp<ViewStyle>;
    data: PieChartDataItem[];
    innerRadius?: number | string;
    outerRadius?: number | string;
  }

  export interface LineChartProps {
    style?: StyleProp<ViewStyle>;
    data: number[];
    svg?: ChartSvgProps;
    contentInset?: { top?: number; bottom?: number; left?: number; right?: number };
    children?: ReactNode;
  }

  export interface AxisProps {
    style?: StyleProp<ViewStyle>;
    data: number[];
    contentInset?: { top?: number; bottom?: number; left?: number; right?: number };
    svg?: ChartSvgProps;
    numberOfTicks?: number;
    formatLabel?: (value: number, index: number) => string;
  }

  export interface GridProps {
    direction?: 'HORIZONTAL' | 'VERTICAL' | 'BOTH';
  }

  export const PieChart: ComponentType<PieChartProps>;
  export const LineChart: ComponentType<LineChartProps>;
  export const YAxis: ComponentType<AxisProps>;
  export const XAxis: ComponentType<AxisProps>;
  export const Grid: ComponentType<GridProps>;
}
