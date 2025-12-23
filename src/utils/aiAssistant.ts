import { AIMessage, AIInsight, AI_CAPABILITIES } from '../types/ai';
import { InventoryItem } from '../types/inventory';

export class AIAssistant {
  private static instance: AIAssistant;

  static getInstance(): AIAssistant {
    if (!AIAssistant.instance) {
      AIAssistant.instance = new AIAssistant();
    }
    return AIAssistant.instance;
  }

  async processMessage(message: string, context: {
    items: InventoryItem[];
    userRole: string;
    teamName: string;
  }): Promise<AIMessage> {
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const response = this.generateResponse(message, context);
    
      return {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        context: {
          inventoryCount: context.items.length,
          lowStockItems: context.items.filter(i => i.quantity <= i.minimumStock).map(i => i.name),
          expiringItems: context.items.filter(i => {
            if (!i.expirationDate) return false;
            const daysUntilExpiry = Math.ceil((new Date(i.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 7;
          }).map(i => i.name)
        }
      };
    } catch (error) {
      console.error('AI processing error:', error);
      return {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: "I'm experiencing some technical difficulties. Please try your question again, or contact support if the issue persists.",
        timestamp: new Date()
      };
    }
  }

  private generateResponse(message: string, context: any): string {
    const lowerMessage = message.toLowerCase();
    
    // Inventory queries
    if (lowerMessage.includes('how much') || lowerMessage.includes('how many')) {
      if (lowerMessage.includes('rice')) {
        const riceItems = context.items.filter((item: InventoryItem) => 
          item.name.toLowerCase().includes('rice')
        );
        if (riceItems.length > 0) {
          const totalRice = riceItems.reduce((sum: number, item: InventoryItem) => sum + item.totalWeightLbs, 0);
          return `You currently have **${totalRice.toFixed(1)} lbs** of rice in inventory across ${riceItems.length} different types:\n\n${riceItems.map(item => `• **${item.name}**: ${item.quantity} ${item.unit} (${item.totalWeightLbs.toFixed(1)} lbs) in ${item.location}`).join('\n')}\n\nWould you like me to help you track usage patterns or set up reorder alerts?`;
        }
        return "I don't see any rice items in your current inventory. Would you like me to help you add some rice products?";
      }
      
      if (lowerMessage.includes('total') || lowerMessage.includes('inventory')) {
        const totalValue = context.items.reduce((sum: number, item: InventoryItem) => sum + (item.quantity * item.costPerUnit), 0);
        const totalWeight = context.items.reduce((sum: number, item: InventoryItem) => sum + item.totalWeightLbs, 0);
        return `Your **${context.teamName}** inventory summary:\n\n📦 **${context.items.length} total items**\n💰 **$${totalValue.toFixed(2)} total value**\n⚖️ **${totalWeight.toFixed(1)} lbs total weight**\n\nTop categories:\n${this.getTopCategories(context.items).map(cat => `• ${cat.name}: ${cat.count} items`).join('\n')}`;
      }
    }

    // Low stock queries
    if (lowerMessage.includes('low stock') || lowerMessage.includes('running low') || lowerMessage.includes('need to order')) {
      const lowStockItems = context.items.filter((item: InventoryItem) => item.quantity <= item.minimumStock);
      if (lowStockItems.length === 0) {
        return "🎉 Great news! All your inventory items are above minimum stock levels. Your inventory management is on point!";
      }
      return `⚠️ You have **${lowStockItems.length} items** that need attention:\n\n${lowStockItems.map(item => `• **${item.name}**: ${item.quantity} left (min: ${item.minimumStock}) - ${item.supplier}`).join('\n')}\n\nWould you like me to help you create purchase orders or set up auto-reorder rules?`;
    }

    // Expiration queries
    if (lowerMessage.includes('expir') || lowerMessage.includes('spoil') || lowerMessage.includes('fresh')) {
      const expiringItems = context.items.filter((item: InventoryItem) => {
        if (!item.expirationDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 14;
      });
      
      if (expiringItems.length === 0) {
        return "✅ All your perishable items are fresh! No items expiring in the next 2 weeks.";
      }
      
      return `📅 **${expiringItems.length} items** expiring soon:\n\n${expiringItems.map(item => {
        const daysLeft = Math.ceil((new Date(item.expirationDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return `• **${item.name}**: ${daysLeft <= 0 ? 'EXPIRED' : `${daysLeft} days left`} - ${item.quantity} ${item.unit}`;
      }).join('\n')}\n\nI recommend using these items first or marking them for quick sale.`;
    }

    // POS integration help
    if (lowerMessage.includes('pos') || lowerMessage.includes('toast') || lowerMessage.includes('clover') || lowerMessage.includes('square')) {
      return `🔗 **POS Integration Help**\n\nI can help you connect with these restaurant systems:\n\n• **Toast POS** - Real-time sales sync\n• **Clover** - Payment and inventory integration\n• **Square** - All-in-one restaurant solution\n• **OpenTable** - Reservation system integration\n\n**Setup Steps:**\n1. Get your API key from your POS dashboard\n2. Click the POS button in the main menu\n3. Select your system and enter credentials\n4. Enable automatic inventory deduction\n\nWhich POS system are you using? I can provide specific setup instructions.`;
    }

    // Team management
    if (lowerMessage.includes('team') || lowerMessage.includes('user') || lowerMessage.includes('staff') || lowerMessage.includes('permission')) {
      return `👥 **Team Management Help**\n\nYour current role: **${context.userRole}**\n\n**Available Roles:**\n• **Owner** - Full access to everything\n• **Manager** - Inventory + team management\n• **Staff** - Add and update inventory\n• **Viewer** - Read-only access\n\n**Quick Actions:**\n• Add team member: Click Team → Add Member\n• Change roles: Team → Select member → Change role\n• View activity: Team → Activity tab\n\nNeed help with specific permissions or team setup?`;
    }

    // Cost optimization
    if (lowerMessage.includes('cost') || lowerMessage.includes('save') || lowerMessage.includes('money') || lowerMessage.includes('budget')) {
      const totalValue = context.items.reduce((sum: number, item: InventoryItem) => sum + (item.quantity * item.costPerUnit), 0);
      const highValueItems = context.items.filter((item: InventoryItem) => (item.quantity * item.costPerUnit) > 100).length;
      
      return `💰 **Cost Optimization Insights**\n\nCurrent inventory value: **$${totalValue.toFixed(2)}**\n\n**Savings Opportunities:**\n• Bulk purchasing: Save 15-25% on large orders\n• Supplier negotiation: Review contracts quarterly\n• Waste reduction: Use FIFO rotation\n• Auto-reordering: Prevent emergency purchases\n\n**High-value items:** ${highValueItems} items over $100\n\nWould you like me to analyze specific categories or set up cost alerts?`;
    }

    // HACCP and quality
    if (lowerMessage.includes('haccp') || lowerMessage.includes('quality') || lowerMessage.includes('safety') || lowerMessage.includes('inspection')) {
      return `🛡️ **HACCP & Food Safety**\n\n**Quality Control Features:**\n• Temperature monitoring and logging\n• Visual, smell, and texture inspections\n• Compliance reporting for health inspections\n• Corrective action tracking\n\n**Quick HACCP Checklist:**\n✅ Check temperatures daily\n✅ Rotate stock (FIFO)\n✅ Monitor expiration dates\n✅ Document all inspections\n✅ Train team on procedures\n\nClick the HACCP button to start a quality inspection or view compliance reports.`;
    }

    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return `🤖 **I'm here to help with your inventory management!**\n\n**Popular Questions:**\n• "How much rice do I have?" - Get quantity and location info\n• "What's running low?" - See items needing reorder\n• "Show me expiring items" - Check freshness status\n• "How do I connect Toast POS?" - Integration setup\n• "Add team member" - User management help\n\n**Quick Tips:**\n• Use voice commands for hands-free operation\n• Scan barcodes for instant product info\n• Set up auto-reorder rules to prevent stockouts\n• Check analytics for usage patterns\n\nWhat specific area would you like help with?`;
    }

    // Default response with context
    const lowStockCount = context.items.filter((item: InventoryItem) => item.quantity <= item.minimumStock).length;
    const expiringCount = context.items.filter((item: InventoryItem) => {
      if (!item.expirationDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7;
    }).length;

    return `I understand you're asking about "${message}". Let me help you with that!\n\n**Current Status:**\n• ${context.items.length} items in inventory\n• ${lowStockCount} items need reordering\n• ${expiringCount} items expiring soon\n\n**I can help you with:**\n• Inventory tracking and management\n• POS system integrations\n• Team collaboration setup\n• Cost optimization strategies\n• HACCP compliance\n• Analytics and reporting\n\nCould you be more specific about what you'd like to know or do?`;
  }

  private getTopCategories(items: InventoryItem[]) {
    const categories = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }

  generateInsights(items: InventoryItem[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Low stock insights
    const lowStockItems = items.filter(item => item.quantity <= item.minimumStock);
    if (lowStockItems.length > 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'alert',
        title: `${lowStockItems.length} items need reordering`,
        description: `Items running low: ${lowStockItems.slice(0, 3).map(i => i.name).join(', ')}${lowStockItems.length > 3 ? '...' : ''}`,
        priority: lowStockItems.length > 5 ? 'critical' : 'high',
        actionable: true,
        createdAt: new Date(),
        category: 'inventory'
      });
    }

    // Expiration insights
    const expiringItems = items.filter(item => {
      if (!item.expirationDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    });

    if (expiringItems.length > 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'alert',
        title: `${expiringItems.length} items expiring soon`,
        description: `Use these items first: ${expiringItems.slice(0, 2).map(i => i.name).join(', ')}`,
        priority: 'high',
        actionable: true,
        createdAt: new Date(),
        category: 'quality'
      });
    }

    // Cost optimization insights
    const highValueItems = items.filter(item => (item.quantity * item.costPerUnit) > 500);
    if (highValueItems.length > 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'optimization',
        title: 'High-value inventory detected',
        description: `${highValueItems.length} items worth $500+ each. Consider bulk purchasing discounts.`,
        priority: 'medium',
        actionable: true,
        createdAt: new Date(),
        category: 'optimization'
      });
    }

    return insights;
  }

  getQuickActions(items: InventoryItem[]) {
    return [
      { label: 'What\'s running low?', icon: '📉', query: 'What items are running low and need to be reordered?' },
      { label: 'Show expiring items', icon: '📅', query: 'What items are expiring soon?' },
      { label: 'Total inventory value', icon: '💰', query: 'What is my total inventory value?' },
      { label: 'Add team member', icon: '👥', query: 'How do I add a new team member?' },
      { label: 'Connect POS system', icon: '🔗', query: 'How do I connect my Toast POS system?' },
      { label: 'HACCP inspection', icon: '🛡️', query: 'How do I perform a HACCP quality inspection?' }
    ];
  }
}

export const aiAssistant = AIAssistant.getInstance();