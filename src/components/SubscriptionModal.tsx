import React, { useState } from 'react';
import { Crown, Check, X, Zap, Shield, TrendingUp, Users, Star } from 'lucide-react';
import { plans } from '../utils/stripeConfig';
import { stripePromise } from '../utils/stripeConfig';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: (email: string, name: string) => void;
  onUpgrade: (planId: string) => void;
  isTrialActive: boolean;
  daysRemaining: number;
}

export function SubscriptionModal({ 
  isOpen, 
  onClose, 
  onStartTrial, 
  onUpgrade, 
  isTrialActive, 
  daysRemaining 
}: SubscriptionModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onStartTrial(email, name);
      onClose();
    }
  };

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        // Fallback to demo upgrade if Stripe not configured
        console.log('Stripe not configured, using demo upgrade');
        setTimeout(() => {
          onUpgrade(planId);
          setIsProcessing(false);
          onClose();
        }, 1000);
        return;
      }

      // In a real implementation, you'd call your backend to create a Stripe checkout session
      // For demo purposes, we'll simulate the upgrade
      setTimeout(() => {
        onUpgrade(planId);
        setIsProcessing(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      // Fallback to demo upgrade on any error
      onUpgrade(planId);
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl shadow-soft">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isTrialActive ? 'Upgrade Your Plan' : 'Start Your Free Trial'}
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                {isTrialActive 
                  ? `${daysRemaining} days remaining in your trial`
                  : 'Get 7 days free access to all professional features'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {!isTrialActive ? (
            /* Trial Signup Form */
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-elegant">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your 7-Day Free Trial</h3>
                <p className="text-gray-600 font-medium">
                  Get full access to all professional features. No credit card required.
                </p>
              </div>

              <form onSubmit={handleStartTrial} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
                  <h4 className="font-bold text-purple-900 mb-3">Trial Includes:</h4>
                  <div className="space-y-2">
                    {plans.find(p => p.id === 'professional')?.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-800 font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Start 7-Day Free Trial
                </button>

                <p className="text-xs text-gray-500 text-center font-medium">
                  No credit card required. Cancel anytime during trial.
                </p>
              </form>
            </div>
          ) : (
            /* Pricing Plans */
            <div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h3>
                <p className="text-gray-600 font-medium">
                  Your trial ends in {daysRemaining} days. Upgrade now to continue using all features.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className={`relative rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 hover:scale-105 ${
                    plan.popular 
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-elegant' 
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-soft">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <p className="text-gray-600 text-sm font-medium mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 font-semibold">/{plan.interval}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isProcessing}
                      className={`w-full px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-soft hover:shadow-elegant ${
                        plan.popular
                          ? 'gradient-primary text-white hover:scale-105'
                          : 'border-2 border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-700'
                      }`}
                    >
                      {isProcessing ? 'Processing...' : `Choose ${plan.name}`}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">30-Day Money Back Guarantee</span>
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    Not satisfied? Get a full refund within 30 days, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}