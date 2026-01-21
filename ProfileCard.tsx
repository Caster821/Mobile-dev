import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProfileCard() {
  const user = {
    name: "DAUSTIAN",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Mobile developer | React Native enthusiast",
    followers: 1234,
    following: 567
  };
  
  return (
    <View style={styles.screenContainer}>
      <View style={styles.card}>
        {/* 1. Circular Avatar */}
        <Image source={{ uri: user.avatar }} style={styles.avatar} />

        {/* 2. Name and Bio */}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>

        {/* 3. Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{user.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          
          {/* This was causing the error - now fixed in styles below */}
          <View style={styles.statBorder} /> 
          
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{user.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* 4. Follow Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns the border vertically
    justifyContent: 'space-around', // Better spacing
    width: '80%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  // *** THIS IS THE MISSING STYLE ***
  statBorder: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});