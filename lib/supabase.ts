import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const AppAsyncStorageAdapter = {
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};

const supabaseUrl = 'https://ajrngkiaexmlaopevqsk.supabase.co';
const supabaseAnonKey = 'sb_publishable_rjZdjEG-w7KCtRG6IrgMjg_-KHfXuLV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AppAsyncStorageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
