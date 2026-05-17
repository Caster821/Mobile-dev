import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primary + 'CC']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).duration(1000)} style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet" size={60} color="white" />
          </View>
          <Text style={styles.title}>PennyWise</Text>
          <Text style={styles.subtitle}>Take control of your finances with smart tracking and insights.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: 'white' }]} 
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.outlineButton, { borderColor: 'white' }]} 
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={[styles.outlineButtonText, { color: 'white' }]}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.legal}>
            <Text style={styles.legalText}>By continuing, you agree to our</Text>
            <TouchableOpacity>
              <Text style={[styles.legalLink, { color: 'white' }]}> Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  footer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  outlineButton: {
    width: '100%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  outlineButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  legal: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  legalText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  legalLink: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
