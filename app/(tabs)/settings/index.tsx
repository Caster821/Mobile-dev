import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, TextInput, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp, useTheme } from '../../../context/AppContext';
import { CURRENCY_CODES } from '../../../utils/currency';
import { useAuth } from '../../../context/AuthContext';
import { isBiometricEnabled, enableBiometricLock } from '../../../utils/secureStore';
import { commonShadow } from '../../../utils/theme';
import * as Sharing from 'expo-sharing';
import { getTransactions } from '../../../database/database';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, currency, setCurrency, colors } = useApp();
  const themeColors = useTheme();
  const [biometric, setBiometric] = useState(false);

  useEffect(() => {
    isBiometricEnabled().then(setBiometric);
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    try {
      await enableBiometricLock(value);
      setBiometric(value);
    } catch (e) {
      console.error(e);
      setBiometric(false);
      Alert.alert("Error", "Biometric authentication not supported on this device.");
    }
  };

  const exportToCSV = async () => {
    if (!user) return;
    try {
      const transactions = await getTransactions(user.id);
      let csv = 'ID,Date,Type,Amount,Category,Note\n';
      transactions.forEach(t => {
        csv += `${t.id},${new Date(t.date).toISOString()},${t.type},${t.amount},${t.categoryName || ''},"${t.note || ''}"\n`;
      });

      // Placeholder for actual file sharing since we need a file path
      // In a real device this would use FileSystem
      Alert.alert("Export", "CSV Export generated successfully!");
      if (await Sharing.isAvailableAsync()) {
        // Here you would share the file
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to export data.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => signOut() }
      ]
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionTitle, { color: themeColors.subtext }]}>{title.toUpperCase()}</Text>
  );

  const SettingRow = ({ icon, title, value, onPress, last = false }: any) => (
    <Pressable 
      style={({ pressed }) => [
        styles.row, 
        { borderBottomColor: themeColors.border, opacity: pressed ? 0.7 : 1 },
        last && { borderBottomWidth: 0 }
      ]} 
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBadge, { backgroundColor: themeColors.surface }]}>
          <Ionicons name={icon} size={20} color={themeColors.primary} />
        </View>
        <Text style={[styles.rowText, { color: themeColors.text }]}>{title}</Text>
      </View>
      {value ? (
        <View style={styles.rowRight}>
          <Text style={[styles.rowValue, { color: themeColors.subtext }]}>{value}</Text>
          <Ionicons name="chevron-forward" size={18} color={themeColors.border} />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={themeColors.border} />
      )}
    </Pressable>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      <View style={styles.section}>
        <SectionHeader title="Account" />
        <View style={[styles.card, { backgroundColor: themeColors.card }, commonShadow]}>
          <SettingRow
            icon="person-circle"
            title="Profile"
            value={user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
            onPress={() => router.push('/(tabs)/settings/account')}
          />
          <SettingRow
            icon="log-out"
            title="Logout"
            onPress={handleLogout}
            last
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Preferences" />
        <View style={[styles.card, { backgroundColor: themeColors.card }, commonShadow]}>
          <SettingRow 
            icon="color-palette" 
            title="Theme" 
            value={theme.charAt(0).toUpperCase() + theme.slice(1)} 
            onPress={() => {
              const themes: any = ['light', 'dark', 'sepia', 'auto'];
              const next = themes[(themes.indexOf(theme) + 1) % themes.length];
              setTheme(next);
            }} 
          />
          <SettingRow 
            icon="cash" 
            title="Currency" 
            value={currency.code} 
            onPress={() => {
              const next = CURRENCY_CODES[(CURRENCY_CODES.indexOf(currency.code) + 1) % CURRENCY_CODES.length];
              setCurrency(next);
            }} 
          />
          <SettingRow 
            icon="pricetag" 
            title="Categories" 
            onPress={() => router.push('/(tabs)/settings/categories')} 
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Security" />
        <View style={[styles.card, { backgroundColor: themeColors.card }, commonShadow]}>
          <View style={[styles.row, { borderBottomColor: themeColors.border }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBadge, { backgroundColor: themeColors.surface }]}>
                <Ionicons name="finger-print" size={20} color={themeColors.primary} />
              </View>
              <Text style={[styles.rowText, { color: themeColors.text }]}>Biometric Lock</Text>
            </View>
            <Switch 
              value={biometric} 
              onValueChange={handleBiometricToggle}
              trackColor={{ false: themeColors.border, true: themeColors.accent }}
              thumbColor="white"
            />
          </View>
          <SettingRow 
            icon="sync" 
            title="Recurring Transactions" 
            onPress={() => router.push('/(tabs)/settings/recurring')} 
            last 
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Data" />
        <View style={[styles.card, { backgroundColor: themeColors.card }, commonShadow]}>
          <SettingRow 
            icon="share-social" 
            title="Export to CSV" 
            onPress={exportToCSV} 
          />
          <SettingRow 
            icon="cloud-download" 
            title="Backup & Restore" 
            onPress={() => router.push('/(tabs)/settings/backup')} 
            last 
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: themeColors.subtext }]}>PennyWise v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginLeft: 8, marginBottom: 8, letterSpacing: 1 },
  card: { borderRadius: 16, overflow: 'hidden' },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderBottomWidth: 1 
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowText: { fontSize: 16, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 14, marginRight: 8 },
  footer: { marginTop: 40, marginBottom: 40, alignItems: 'center' },
  version: { fontSize: 12 },
});
