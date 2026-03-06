import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Tracker</Text>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : location ? (
          <View>
            <Text style={styles.text}>Lat: {location.coords.latitude}</Text>
            <Text style={styles.text}>Lon: {location.coords.longitude}</Text>
          </View>
        ) : (
          <Text style={styles.text}>No location data</Text>
        )}
        <View style={{ marginTop: 20 }}>
          <Button title="Get Location" onPress={getLocation} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: 'white', 
    padding: 30, 
    borderRadius: 10, 
    elevation: 5, 
    width: '80%', 
    alignItems: 'center' 
  },
  text: { 
    fontSize: 18, 
    marginVertical: 5 
  },
  error: { 
    color: 'red', 
    textAlign: 'center' 
  }
});