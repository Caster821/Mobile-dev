import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Polyline, Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1,
          distanceInterval: 1,
        },
        (newLocation: Location.LocationObject) => {
          const { latitude, longitude } = newLocation.coords;
          const newCoordinate: LatLng = { latitude, longitude };

          setLocation(newCoordinate);
          setRouteCoordinates((prevRoute) => [...prevRoute, newCoordinate]);
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#000"
            strokeWidth={6}
          />
          <Marker coordinate={location} title="Current Location" />
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>{errorMsg || 'Acquiring GPS Signal...'}</Text>
        </View>
      )}
      
      {location && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Lat: {location.latitude.toFixed(5)} | Lon: {location.longitude.toFixed(5)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});