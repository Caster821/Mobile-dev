import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ data?: any; error: any }>;
  signUp: (email: string, pass: string, name?: string) => Promise<{ data?: any; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string }) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (!session) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(tabs)');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    console.log('Attempting sign in for:', email);
    const res = await supabase.auth.signInWithPassword({ 
      email, 
      password: pass 
    });
    if (res.error) console.error('Supabase Login Error:', res.error.message);
    return res;
  };

  const signUp = async (email: string, pass: string, name?: string) => {
    const res = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name: name || '',
        },
        emailRedirectTo: undefined,
      },
    });
    return res;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: { name?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: { name: updates.name },
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
