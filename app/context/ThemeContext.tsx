import React, { createContext, useState, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  card: string;
  border: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors: ThemeColors = {
  background: '#fff',
  text: '#000',
  textSecondary: '#666',
  primary: '#007AFF',
  card: '#f5f5f5',
  border: '#ddd',
};

const darkColors: ThemeColors = {
  background: '#1a1a1a',
  text: '#fff',
  textSecondary: '#aaa',
  primary: '#0A84FF',
  card: '#2c2c2c',
  border: '#444',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}