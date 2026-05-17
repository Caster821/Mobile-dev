import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp, useTheme } from '../context/AppContext';
import { CURRENCIES } from '../utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/ui/GlassCard';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, currency, setCurrency, colors } = useApp();

  const handleSignOut = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: signOut }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
          <GlassCard style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>
                  {user?.email?.[0].toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={[styles.email, { color: colors.text }]}>{user?.email}</Text>
                <Text style={[styles.uid, { color: colors.subtext }]}>ID: {user?.id.slice(0, 8)}...</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <View style={styles.settingLabel}>
              <Ionicons name="moon" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={theme === 'dark'} 
              onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>

          <Text style={[styles.subLabel, { color: colors.subtext, marginTop: 16 }]}>Primary Currency</Text>
          <View style={styles.currencyGrid}>
            {Object.values(CURRENCIES).map((c) => (
              <TouchableOpacity 
                key={c.code}
                style={[
                  styles.currencyBtn, 
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  currency.code === c.code && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setCurrency(c.code)}
              >
                <Text style={[styles.currencyCode, { color: colors.text }, currency.code === c.code && { color: 'white' }]}>
                  {c.code}
                </Text>
                <Text style={[styles.currencySymbol, { color: colors.subtext }, currency.code === c.code && { color: 'white' }]}>
                  {c.symbol}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <TouchableOpacity style={[styles.dangerBtn, { borderColor: colors.danger }]} onPress={handleSignOut}>
            <Ionicons name="log-out" size={20} color={colors.danger} />
            <Text style={[styles.dangerBtnText, { color: colors.danger }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.subtext }}>PennyWise v1.0.0</Text>
          <Text style={{ color: colors.subtext }}>Made with ❤️ for smart finances</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  profileCard: { padding: 16 },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 16, fontWeight: '600' },
  uid: { fontSize: 12, marginTop: 2 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16 },
  settingLabel: { flexDirection: 'row', alignItems: 'center' },
  settingText: { fontSize: 16, marginLeft: 12 },
  subLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  currencyBtn: { width: '31%', padding: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  currencyCode: { fontSize: 14, fontWeight: 'bold' },
  currencySymbol: { fontSize: 12, marginTop: 2 },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 8 },
  dangerBtnText: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  footer: { alignItems: 'center', marginTop: 20, paddingBottom: 40 },
});
