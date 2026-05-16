import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextProps } from 'react-native';

interface Props extends TextProps {
  value: number;
  formatter: (val: number) => string;
  duration?: number;
}

export const AnimatedNumber = ({ value, formatter, duration = 1000, style, ...rest }: Props) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false, // cannot animate text content natively easily
    }).start();

    const listener = animatedValue.addListener((v) => {
      setDisplayValue(v.value);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value]);

  return <Text style={style} {...rest}>{formatter(displayValue)}</Text>;
};
