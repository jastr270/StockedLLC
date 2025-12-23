import React from 'react';
import { Clock, Crown, Zap } from 'lucide-react';

interface TrialBannerProps {
  daysRemaining: number;
  onUpgrade: () => void;
  isTrialActive: boolean;
}

export function TrialBanner({ daysRemaining, onUpgrade, isTrialActive }: TrialBannerProps) {
  if (!isTrialActive) return null;

  const urgencyLevel = daysRemaining <= 2 ? 'critical' : daysRemaining <= 4 ? 'warning' : 'normal';

  return (
    <div className={`glass-effect rounded-2xl shadow-elegant p-6 mb-8 border ${
      urgencyLevel === 'critical' 
        ? 'border-red-300 bg-gradient-to-r from-red-100/20 to-pink-100/20' 
        : urgencyLevel === 'warning'
        ? 'border-amber-300 bg-gradient-to-r from-amber-100/20 to-orange-100/20'
        : 'border-purple-300 bg-gradient-to-r from-purple-100/20 to-indigo-100/20'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl shadow-soft ${
            urgencyLevel === 'critical' 
              ? 'bg-gradient-to-br from-red-100 to-pink-100' 
              : urgencyLevel === 'warning'
              ? 'bg-gradient-to-br from-amber-100 to-orange-100'
              : 'bg-gradient-to-br from-purple-100 to-indigo-100'
          }`}>
            <Clock className={`w-6 h-6 ${
              urgencyLevel === 'critical' ? 'text-red-600' : 
              urgencyLevel === 'warning' ? 'text-amber-600' : 'text-purple-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {urgencyLevel === 'critical' ? 'Trial Ending Soon!' : 
               urgencyLevel === 'warning' ? 'Trial Expires Soon' : 'Free Trial Active'}
            </h3>
            <p className="text-white/80 font-semibold">
              {daysRemaining === 1 
                ? 'Last day of your free trial' 
                : `${daysRemaining} days remaining in your trial`
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={onUpgrade}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-soft hover:shadow-elegant hover:scale-105 flex items-center gap-2 ${
            urgencyLevel === 'critical' 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : urgencyLevel === 'warning'
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'gradient-primary text-white'
          }`}
        >
          <Crown className="w-5 h-5" />
          {urgencyLevel === 'critical' ? 'Upgrade Now' : 'Upgrade Plan'}
        </button>
      </div>
    </div>
  );
}