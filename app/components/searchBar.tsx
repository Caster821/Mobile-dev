import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (lat: number, lon: number, name: string) => void;
  colors: any;
}

export default function SearchBar({ onSearch, colors }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name } = data.results[0];
        onSearch(latitude, longitude, name);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      zIndex: 1000,
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    input: {
      flex: 1,
      height: 40,
      color: colors.text,
      fontSize: 16,
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a location..."
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="search" size={24} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
}