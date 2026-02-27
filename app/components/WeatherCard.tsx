import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WeatherData } from '../services/weatherService';
import { useTheme } from '../context/ThemeContext';

interface WeatherCardProps {
  weatherData: WeatherData;
  onPress: () => void;
}

export default function WeatherCard({ weatherData, onPress }: WeatherCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 15,
      padding: 15,
      marginHorizontal: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    forecastButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    forecastButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    currentWeather: {
      marginTop: 5,
    },
    temperature: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    detail: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 5,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Weather</Text>
        <View style={styles.forecastButton}>
          <Text style={styles.forecastButtonText}>7 Days</Text>
        </View>
      </View>
      <View style={styles.currentWeather}>
        <Text style={styles.temperature}>{Math.round(weatherData.current.temp)}°C</Text>
        <Text style={styles.detail}>Feels like: {Math.round(weatherData.current.feelsLike)}°C</Text>
        <Text style={styles.detail}>Humidity: {weatherData.current.humidity}%</Text>
      </View>
    </TouchableOpacity>
  );
}