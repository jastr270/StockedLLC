import React from 'react';
import { Lock, Crown, Zap } from 'lucide-react';

interface FeatureGateProps {
  feature: string;
  canAccess: boolean;
  userRole: string;
  onUpgrade?: () => void;
  children: React.ReactNode;
}

export function FeatureGate({ feature, canAccess, userRole, onUpgrade, children }: FeatureGateProps) {
  if (canAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 shadow-elegant text-center max-w-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Permission Required</h3>
          <p className="text-gray-600 text-sm font-medium mb-4">
            This feature requires {feature} permissions. Your current role ({userRole}) doesn't have access.
          </p>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft flex items-center justify-center gap-2 mx-auto"
            >
              <Crown className="w-4 h-4" />
              Contact Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}