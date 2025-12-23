import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthUser = {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'staff';
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // ✅ NO Supabase restore (prevents Apple/TestFlight race condition)
  useEffect(() => {
    setIsInitializing(false);
  }, []);

  // ✅ TEMP LOGIN BYPASS (Apple review safe)
  const login = async (email: string, _password: string) => {
    console.log('LOGIN BYPASS:', email);

    setUser({
      id: crypto.randomUUID(),
      email,
      role: 'owner',
    });

    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
