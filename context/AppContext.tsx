import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeColors, lightTheme, darkTheme, sepiaTheme } from '../utils/theme';
import { CURRENCIES, CurrencyConfig } from '../utils/currency';

export type ThemeType = 'light' | 'dark' | 'sepia' | 'auto';

interface AppContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
  currency: CurrencyConfig;
  setCurrency: (code: string) => void;
  weekStartDay: 'monday' | 'sunday';
  setWeekStartDay: (day: 'monday' | 'sunday') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('auto');
  const [currency, setCurrencyState] = useState<CurrencyConfig>(CURRENCIES.XAF);
  const [weekStartDay, setWeekStartDayState] = useState<'monday' | 'sunday'>('monday');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedCurrencyCode = await AsyncStorage.getItem('currencyCode');
      const savedWeekStart = await AsyncStorage.getItem('weekStartDay');
      
      if (savedTheme) setThemeState(savedTheme as ThemeType);
      if (savedCurrencyCode && CURRENCIES[savedCurrencyCode]) {
        setCurrencyState(CURRENCIES[savedCurrencyCode]);
      }
      if (savedWeekStart) setWeekStartDayState(savedWeekStart as 'monday' | 'sunday');
    } catch (e) {
      console.error('Failed to load preferences', e);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const setCurrency = async (code: string) => {
    if (CURRENCIES[code]) {
      setCurrencyState(CURRENCIES[code]);
      await AsyncStorage.setItem('currencyCode', code);
    }
  };

  const setWeekStartDay = async (day: 'monday' | 'sunday') => {
    setWeekStartDayState(day);
    await AsyncStorage.setItem('weekStartDay', day);
  };

  let activeColors: ThemeColors = lightTheme;
  if (theme === 'dark' || (theme === 'auto' && systemScheme === 'dark')) {
    activeColors = darkTheme;
  } else if (theme === 'sepia') {
    activeColors = sepiaTheme;
  }

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      colors: activeColors,
      currency,
      setCurrency,
      weekStartDay,
      setWeekStartDay,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const useTheme = () => {
  const { colors } = useApp();
  return colors;
};
