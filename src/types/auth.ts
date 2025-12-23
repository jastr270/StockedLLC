// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { AuthSession, LoginCredentials, SignupData } from '../types/auth';

const STORAGE_KEY = 'inventory-auth-session';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        createSessionFromSupabase(data.session.user.email);
      }
      setIsInitializing(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ? (session as any) : null);
      setIsAuthenticated(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const createSessionFromSupabase = (email: string) => {
    const now = new Date();
    const demoSession: AuthSession = {
      user: {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        role: 'owner',
        teamId: crypto.randomUUID(),
        isActive: true,
        lastLogin: now,
        createdAt: now,
        permissions: []
      },
      team: {
        id: crypto.randomUUID(),
        name: 'Demo Restaurant',
        slug: 'demo-restaurant',
        description: 'Professional food inventory management',
        ownerId: crypto.randomUUID(),
        members: [],
        settings: {
          allowGuestAccess: false,
          sessionTimeout: 480,
          requireTwoFactor: false,
          allowMobileAccess: true,
          auditLogging: true,
          dataRetention: 90
        },
        subscription: {
          planId: 'professional',
          status: 'trial',
          nextBilling: new Date(),
          trialEnds: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          maxUsers: 10,
          maxItems: -1,
          features: ['unlimited_items', 'team_collaboration', 'pos_integrations', 'advanced_analytics'],
          billingCycle: 'monthly'
        },
        createdAt: now,
        isActive: true
      },
      accessToken: crypto.randomUUID(),
      refreshToken: crypto.randomUUID(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    };

    setSession(demoSession);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoSession));
  };

  const login = async (credentials: LoginCredentials) => {
    createSessionFromSupabase(credentials.email);
    return true;
  };

  const signup = async (signupData: SignupData) => {
    createSessionFromSupabase(signupData.email);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasPermission = (action: string) => {
    if (!session?.user) return false;
    if (session.user.role === 'owner') return true;
    return false;
  };

  return {
    session,
    user: session?.user || null,
    team: session?.team || null,
    isInitializing,
    isAuthenticated,
    login,
    signup,
    logout,
    hasPermission
  };
}
