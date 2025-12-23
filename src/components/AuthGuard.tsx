import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from './LoginForm';
import { LoadingState } from './LoadingStates';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    console.log('AuthGuard:', { isInitializing, isAuthenticated });
  }, [isInitializing, isAuthenticated]);

  if (isInitializing) {
    return <LoadingState type="auth" message="Initializing session..." />;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
