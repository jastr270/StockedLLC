import React from 'react';
import { CreditCard, Calendar, DollarSign, Settings, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { User } from '../types/subscription';
import { plans } from '../utils/stripeConfig';
import { format } from 'date-fns';

interface BillingPortalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onCancelSubscription: () => void;
  onUpgrade: (planId: string) => void;
}

export function BillingPortal({ user, isOpen, onClose, onCancelSubscription, onUpgrade }: BillingPortalProps) {
  if (!isOpen || !user?.subscription) return null;

  const currentPlan = plans.find(p => p.id === user.subscription!.planId);
  const isTrialing = user.subscription.status === 'trialing';
  const isCanceled = user.subscription.cancelAtPeriodEnd;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-soft">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
              <p className="text-sm text-gray-600 font-medium">Manage your subscription and billing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Current Plan */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-900">{currentPlan?.name}</h3>
                <p className="text-blue-700 font-semibold">
                  {isTrialing ? 'Free Trial' : `$${currentPlan?.price}/${currentPlan?.interval}`}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                isTrialing ? 'bg-green-500 text-white' : 
                isCanceled ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {isTrialing ? 'TRIAL' : isCanceled ? 'CANCELING' : 'ACTIVE'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-semibold">
                  {isTrialing ? 'Trial ends:' : 'Next billing:'} {format(user.subscription.currentPeriodEnd, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-semibold">
                  Member since {format(user.createdAt, 'MMM yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Current Plan Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPlan?.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-emerald-800">Monthly Savings</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700">$1,247</p>
              <p className="text-sm text-emerald-600">Estimated cost reduction</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Items Tracked</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">
                {/* This would be the actual item count */}
                247
              </p>
              <p className="text-sm text-purple-600">
                {currentPlan?.maxItems === -1 ? 'Unlimited' : `of ${currentPlan?.maxItems} limit`}
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Time Saved</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">12.5h</p>
              <p className="text-sm text-amber-600">Per week vs manual tracking</p>
            </div>
          </div>

          {/* Upgrade Options */}
          {!isTrialing && currentPlan?.id !== 'enterprise' && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Upgrade Your Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.filter(p => p.price > (currentPlan?.price || 0)).map(plan => (
                  <div key={plan.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-bold text-gray-900">{plan.name}</h5>
                      <span className="text-lg font-bold text-purple-600">${plan.price}/mo</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                    <button
                      onClick={() => onUpgrade(plan.id)}
                      className="w-full px-4 py-2 gradient-primary text-white rounded-lg hover:scale-105 transition-all duration-300 font-semibold text-sm"
                    >
                      Upgrade to {plan.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation */}
          {!isTrialing && !isCanceled && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-800">Cancel Subscription</h4>
              </div>
              <p className="text-red-700 text-sm font-medium mb-4">
                Your subscription will remain active until {format(user.subscription.currentPeriodEnd, 'MMM dd, yyyy')}. 
                You'll lose access to premium features after this date.
              </p>
              <button
                onClick={onCancelSubscription}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 font-bold shadow-soft"
              >
                Cancel Subscription
              </button>
            </div>
          )}

          {isCanceled && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-amber-800">Subscription Canceled</h4>
              </div>
              <p className="text-amber-700 text-sm font-medium">
                Your subscription will end on {format(user.subscription.currentPeriodEnd, 'MMM dd, yyyy')}. 
                You can reactivate anytime before this date.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}