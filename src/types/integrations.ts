export interface POSIntegration {
  id: string;
  name: string;
  type: 'toast' | 'clover' | 'square' | 'resy' | 'opentable' | 'micros' | 'aloha' | 'lightspeed';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  apiKey?: string;
  webhookUrl?: string;
  lastSync?: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  features: POSFeature[];
  settings: POSSettings;
}

export interface POSFeature {
  name: string;
  enabled: boolean;
  description: string;
}

export interface POSSettings {
  autoSync: boolean;
  syncInventory: boolean;
  syncSales: boolean;
  syncMenu: boolean;
  autoReorder: boolean;
  reorderThreshold: number;
  notifyOnLowStock: boolean;
  updatePricing: boolean;
}

export interface SalesData {
  itemId: string;
  itemName: string;
  quantitySold: number;
  revenue: number;
  timestamp: Date;
  orderId: string;
  locationId?: string;
}

export interface MenuSync {
  menuItemId: string;
  menuItemName: string;
  ingredients: MenuIngredient[];
  category: string;
  price: number;
  isAvailable: boolean;
}

export interface MenuIngredient {
  inventoryItemId: string;
  inventoryItemName: string;
  quantityNeeded: number;
  unit: string;
  isOptional: boolean;
}

export interface AutoReorderRule {
  id: string;
  itemId: string;
  supplierId: string;
  triggerLevel: number;
  reorderQuantity: number;
  isActive: boolean;
  lastTriggered?: Date;
}

export const POS_PROVIDERS = [
  {
    id: 'toast',
    name: 'Toast POS',
    description: 'Leading restaurant POS system',
    logo: '🍞',
    features: ['Real-time sales sync', 'Menu integration', 'Auto inventory deduction', 'Analytics'],
    setupUrl: 'https://pos.toasttab.com/api',
    documentation: 'https://doc.toasttab.com/'
  },
  {
    id: 'clover',
    name: 'Clover',
    description: 'First Data POS platform',
    logo: '🍀',
    features: ['Inventory sync', 'Sales reporting', 'Payment processing', 'Customer data'],
    setupUrl: 'https://api.clover.com',
    documentation: 'https://docs.clover.com/'
  },
  {
    id: 'square',
    name: 'Square for Restaurants',
    description: 'All-in-one restaurant solution',
    logo: '⬜',
    features: ['Menu management', 'Inventory tracking', 'Staff management', 'Analytics'],
    setupUrl: 'https://connect.squareup.com',
    documentation: 'https://developer.squareup.com/'
  },
  {
    id: 'resy',
    name: 'Resy POS',
    description: 'Premium restaurant management',
    logo: '🍽️',
    features: ['Reservation sync', 'Table management', 'Guest preferences', 'Revenue tracking'],
    setupUrl: 'https://api.resy.com',
    documentation: 'https://developers.resy.com/'
  },
  {
    id: 'opentable',
    name: 'OpenTable',
    description: 'Restaurant reservation platform',
    logo: '📅',
    features: ['Reservation data', 'Guest management', 'Table turnover', 'Revenue insights'],
    setupUrl: 'https://platform.opentable.com',
    documentation: 'https://platform.opentable.com/docs'
  },
  {
    id: 'micros',
    name: 'Oracle MICROS',
    description: 'Enterprise restaurant platform',
    logo: '🏢',
    features: ['Enterprise integration', 'Multi-location', 'Advanced reporting', 'Compliance'],
    setupUrl: 'https://api.oracle.com/micros',
    documentation: 'https://docs.oracle.com/en/industries/hospitality/'
  }
];