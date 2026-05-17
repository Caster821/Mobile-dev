import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Animated, Text, StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/AppContext';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'warning', action?: { label: string; onPress: () => void }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'warning'>('success');
  const [action, setAction] = useState<{ label: string; onPress: () => void } | undefined>(undefined);
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = useTheme();

  const showToast = useCallback((msg: string, t: 'success' | 'error' | 'warning' = 'success', act?: { label: string; onPress: () => void }) => {
    setMessage(msg);
    setType(t);
    setAction(act);
    
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(act ? 5000 : 2000),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [opacity]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return colors.success;
      case 'error': return colors.danger;
      case 'warning': return colors.warning;
      default: return colors.primary;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View style={[
        styles.toastContainer, 
        { opacity, backgroundColor: getBackgroundColor() }
      ]}>
        <View style={styles.content}>
          <Text style={styles.toastText}>{message}</Text>
          {action && (
            <TouchableOpacity onPress={() => {
              action.onPress();
              opacity.setValue(0);
            }} style={styles.actionBtn}>
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toastText: { color: 'white', fontWeight: 'bold', fontSize: 14, flex: 1 },
  actionBtn: { marginLeft: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  actionText: { color: 'white', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' }
});
