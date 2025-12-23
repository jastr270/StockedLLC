export interface Subscription {
  id: string;
  userId: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  planId: string;
  planName: string;
  trialStart: Date;
  trialEnd: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  maxItems: number;
  maxUsers: number;
  stripePriceId: string;
  popular?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscription?: Subscription;
  trialUsed: boolean;
  createdAt: Date;
}