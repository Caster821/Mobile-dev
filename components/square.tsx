import React from 'react';
import { StyleSheet, View } from 'react-native';

const square = () => {
  return <View style={styles.square} />;
};

const styles = StyleSheet.create({
  square: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
  },
});

export default square;