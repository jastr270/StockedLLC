import { useState, useEffect } from 'react';
import { User, Subscription } from '../types/subscription';
import { plans } from '../utils/stripeConfig';

const STORAGE_KEY = 'food-inventory-user-data';

export function useSubscription() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        const userWithDates = {
          ...userData,
          createdAt: new Date(userData.createdAt),
          subscription: userData.subscription ? {
            ...userData.subscription,
            trialStart: new Date(userData.subscription.trialStart),
            trialEnd: new Date(userData.subscription.trialEnd),
            currentPeriodStart: new Date(userData.subscription.currentPeriodStart),
            currentPeriodEnd: new Date(userData.subscription.currentPeriodEnd)
          } : undefined
        };
        setUser(userWithDates);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const startTrial = (email: string, name: string) => {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      trialUsed: true,
      createdAt: now,
      subscription: {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        status: 'trialing',
        planId: 'professional',
        planName: 'Professional Trial',
        trialStart: now,
        trialEnd,
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        cancelAtPeriodEnd: false
      }
    };

    setUser(newUser);
    return newUser;
  };

  const upgradeSubscription = async (planId: string, stripeSubscriptionId: string, stripeCustomerId: string) => {
    if (!user) return;

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const updatedSubscription: Subscription = {
      ...user.subscription!,
      status: 'active',
      planId: plan.id,
      planName: plan.name,
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      stripeSubscriptionId,
      stripeCustomerId
    };

    setUser({
      ...user,
      subscription: updatedSubscription
    });
  };

  const cancelSubscription = () => {
    if (!user?.subscription) return;

    setUser({
      ...user,
      subscription: {
        ...user.subscription,
        cancelAtPeriodEnd: true
      }
    });
  };

  const isTrialActive = () => {
    if (!user?.subscription) return false;
    return user.subscription.status === 'trialing' && new Date() < user.subscription.trialEnd;
  };

  const isSubscriptionActive = () => {
    if (!user?.subscription) return false;
    return user.subscription.status === 'active' || isTrialActive();
  };

  const getDaysRemaining = () => {
    if (!user?.subscription) return 0;
    const now = new Date();
    const endDate = user.subscription.status === 'trialing' 
      ? user.subscription.trialEnd 
      : user.subscription.currentPeriodEnd;
    return Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const canAccessFeature = (feature: string) => {
    if (!user?.subscription) return false;
    
    const plan = plans.find(p => p.id === user.subscription!.planId);
    if (!plan) return false;

    // During trial, allow all professional features
    if (isTrialActive()) {
      return plans.find(p => p.id === 'professional')?.features.includes(feature) || false;
    }

    return plan.features.includes(feature);
  };

  const getItemLimit = () => {
    if (!user?.subscription) return 10; // Free limit
    
    const plan = plans.find(p => p.id === user.subscription!.planId);
    return plan?.maxItems || 10;
  };

  return {
    user,
    isLoading,
    startTrial,
    upgradeSubscription,
    cancelSubscription,
    isTrialActive: isTrialActive(),
    isSubscriptionActive: isSubscriptionActive(),
    daysRemaining: getDaysRemaining(),
    canAccessFeature,
    getItemLimit
  };
}