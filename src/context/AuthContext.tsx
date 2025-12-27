import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

type AuthUser = { id: string; email: string; role: 'owner' | 'admin' | 'staff' };

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setUser({ id: data.session.user.id, email: data.session.user.email, role: 'owner' });
      }
      setIsInitializing(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setAuthError(error.message);
        return false;
      }

      if (!data.user?.email) {
        setAuthError('No user returned from Supabase.');
        return false;
      }

      setUser({ id: data.user.id, email: data.user.email, role: 'owner' });
      return true;
    } catch (e: any) {
      // This catches “Failed to fetch” / network / CORS / dead project issues
      setAuthError(e?.message || 'Network error');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isInitializing, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
