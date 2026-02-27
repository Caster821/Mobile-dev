import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/searchBar';
import { getWeatherData, WeatherData } from '../services/weatherService';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [region, setRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView>(null);
  const { theme, colors } = useTheme();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      
      fetchWeather(currentLocation.coords.latitude, currentLocation.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoadingWeather(true);
    try {
      const data = await getWeatherData(lat, lon);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleSearch = (lat: number, lon: number, name: string) => {
    const newRegion = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
    fetchWeather(lat, lon);
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    fetchWeather(latitude, longitude);
  };

  const openWeatherModal = () => {
    if (weatherData) {
      setModalVisible(true);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height * 0.6,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      color: colors.text,
      fontSize: 16,
      marginTop: 10,
    },
    weatherContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: colors.card,
      borderRadius: 15,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    weatherHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    weatherTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    viewForecastButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    viewForecastText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    currentWeather: {
      marginTop: 10,
    },
    temperature: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    weatherDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: Dimensions.get('window').height * 0.7,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 10,
    },
    closeButtonText: {
      fontSize: 18,
      color: colors.primary,
    },
    forecastItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    forecastDate: {
      fontSize: 16,
      color: colors.text,
    },
    forecastTemp: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
  });

  if (!location || !region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{errorMsg || 'Getting your location...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} colors={colors} />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Current Location"
          pinColor={colors.primary}
        />
      </MapView>

      {weatherData && !loadingWeather && (
        <TouchableOpacity style={styles.weatherContainer} onPress={openWeatherModal}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherTitle}>Current Weather</Text>
            <View style={styles.viewForecastButton}>
              <Text style={styles.viewForecastText}>7 Days</Text>
            </View>
          </View>
          <View style={styles.currentWeather}>
            <Text style={styles.temperature}>{Math.round(weatherData.current.temp)}°C</Text>
            <Text style={styles.weatherDescription}>Feels like: {Math.round(weatherData.current.feelsLike)}°C</Text>
            <Text style={styles.weatherDescription}>Humidity: {weatherData.current.humidity}%</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>7-Day Forecast</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {weatherData?.daily.map((day, index) => (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.forecastDate}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.forecastTemp}>
                    {Math.round(day.temp.min)}° / {Math.round(day.temp.max)}°
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}