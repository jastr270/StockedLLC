import { loadStripe } from '@stripe/stripe-js';

// Safe Stripe initialization with proper error handling
export const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

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

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small restaurants getting started',
    price: 0,
    interval: 'month',
    features: [
      'Up to 10 inventory items',
      '1 team member',
      'Basic barcode scanning',
      'Mobile app access',
      'Email support'
    ],
    maxItems: 10,
    maxUsers: 1,
    stripePriceId: 'price_starter'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing restaurants with team collaboration',
    price: 19,
    interval: 'month',
    features: [
      'Unlimited inventory items',
      'Up to 10 team members',
      'AI-powered predictions',
      'POS system integrations (Toast, Clover, Square)',
      'Advanced analytics and reporting',
      'HACCP compliance tools',
      'Voice input and barcode scanning',
      'Team collaboration features',
      'Priority email support',
      'Mobile app with offline sync'
    ],
    maxItems: -1,
    maxUsers: 10,
    stripePriceId: 'price_professional',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For restaurant chains and large operations',
    price: 49,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Multi-location support',
      'Advanced POS integrations',
      'Custom reporting and analytics',
      'Dedicated account manager',
      'Phone support with SLA',
      'Custom training sessions',
      'API access for custom integrations',
      'White-label options'
    ],
    maxItems: -1,
    maxUsers: -1,
    stripePriceId: 'price_enterprise'
  }
];

export const createCheckoutSession = async (priceId: string, customerId?: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createPortalSession = async (customerId: string) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
      }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};