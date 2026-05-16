export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  subtext: string;
  danger: string;
  warning: string;
  success: string;
  border: string;
}

export const lightTheme: ThemeColors = {
  primary: '#1B5E20',
  accent: '#43A047',
  background: '#F8FAF8',
  surface: '#F8FAF8',
  card: '#FFFFFF',
  text: '#111111',
  subtext: '#666666',
  danger: '#C62828',
  warning: '#F57F17',
  success: '#4CAF50',
  border: '#EEEEEE',
};

export const darkTheme: ThemeColors = {
  primary: '#1B5E20',
  accent: '#43A047',
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  text: '#FFFFFF',
  subtext: '#9E9E9E',
  danger: '#EF5350',
  warning: '#FFB300',
  success: '#81C784',
  border: '#333333',
};

export const sepiaTheme: ThemeColors = {
  primary: '#5D4037',
  accent: '#8D6E63',
  background: '#F5ECD7',
  surface: '#EDE0C4',
  card: '#FAF6ED',
  text: '#3E2723',
  subtext: '#5D4037',
  danger: '#C62828',
  warning: '#F57F17',
  success: '#388E3C',
  border: '#D7CCC8',
};

export const commonShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};
