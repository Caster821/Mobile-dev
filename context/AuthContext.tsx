import React, { createContext, useContext, useState } from 'react';

type AuthType = {
  user: string | null;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthType>({ user: null, signIn: () => {}, signOut: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const signIn = () => setUser('Demo User');
  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}