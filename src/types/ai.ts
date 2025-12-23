export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    inventoryCount?: number;
    lowStockItems?: string[];
    expiringItems?: string[];
    recentActions?: string[];
  };
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  category: 'general' | 'inventory' | 'analytics' | 'pos' | 'quality' | 'team';
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  category: string;
  examples: string[];
  icon: string;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'optimization' | 'prediction';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
  createdAt: Date;
  category: string;
}

export const AI_CAPABILITIES: AICapability[] = [
  {
    id: 'inventory-help',
    name: 'Inventory Management',
    description: 'Get help with adding items, tracking stock, and managing suppliers',
    category: 'Inventory',
    examples: [
      'How do I add a new rice supplier?',
      'What items are running low?',
      'How much rice do I have in storage?',
      'When should I reorder flour?'
    ],
    icon: '📦'
  },
  {
    id: 'analytics-insights',
    name: 'Analytics & Insights',
    description: 'Understand your inventory trends and get optimization recommendations',
    category: 'Analytics',
    examples: [
      'Which items are my fastest moving?',
      'What are my food costs this month?',
      'Show me expiration trends',
      'How can I reduce waste?'
    ],
    icon: '📊'
  },
  {
    id: 'pos-integration',
    name: 'POS Integration Help',
    description: 'Setup and troubleshoot restaurant POS system connections',
    category: 'Integrations',
    examples: [
      'How do I connect Toast POS?',
      'Why isn\'t my sales data syncing?',
      'Setup auto-reorder rules',
      'Link menu items to inventory'
    ],
    icon: '🔗'
  },
  {
    id: 'quality-compliance',
    name: 'Quality & Compliance',
    description: 'HACCP compliance, food safety, and quality control guidance',
    category: 'Quality',
    examples: [
      'How do I do a HACCP inspection?',
      'What temperature should salmon be stored at?',
      'Setup quality control alerts',
      'Food safety best practices'
    ],
    icon: '🛡️'
  },
  {
    id: 'team-management',
    name: 'Team & Permissions',
    description: 'Manage team members, roles, and access permissions',
    category: 'Team',
    examples: [
      'How do I add a new team member?',
      'What permissions does a manager have?',
      'Setup role-based access',
      'Invite staff to the system'
    ],
    icon: '👥'
  },
  {
    id: 'optimization',
    name: 'Cost Optimization',
    description: 'Reduce costs, prevent waste, and optimize purchasing',
    category: 'Optimization',
    examples: [
      'How can I reduce food costs?',
      'Optimize my reorder quantities',
      'Prevent food waste',
      'Best suppliers for bulk buying'
    ],
    icon: '💰'
  }
];