import { useState, useEffect } from 'react';
import { POSIntegration, SalesData, MenuSync, AutoReorderRule, POS_PROVIDERS } from '../types/integrations';
import { InventoryItem } from '../types/inventory';

const STORAGE_KEY = 'food-inventory-pos-integrations';

export function usePOSIntegrations() {
  const [integrations, setIntegrations] = useState<POSIntegration[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuSync[]>([]);
  const [autoReorderRules, setAutoReorderRules] = useState<AutoReorderRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, []);

  useEffect(() => {
    if (integrations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        integrations,
        salesData,
        menuItems,
        autoReorderRules
      }));
    }
  }, [integrations, salesData, menuItems, autoReorderRules]);

  const loadIntegrations = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setIntegrations(data.integrations || []);
        setSalesData(data.salesData || []);
        setMenuItems(data.menuItems || []);
        setAutoReorderRules(data.autoReorderRules || []);
      } catch (error) {
        console.error('Failed to load POS integrations:', error);
      }
    }
    setIsLoading(false);
  };

  const connectPOS = async (posType: string, apiKey: string, webhookUrl?: string): Promise<boolean> => {
    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newIntegration: POSIntegration = {
        id: crypto.randomUUID(),
        name: POS_PROVIDERS.find(p => p.id === posType)?.name || posType,
        type: posType as any,
        status: 'connected',
        apiKey,
        webhookUrl,
        lastSync: new Date(),
        syncFrequency: 'realtime',
        features: [
          { name: 'Inventory Sync', enabled: true, description: 'Sync inventory levels with POS' },
          { name: 'Sales Data', enabled: true, description: 'Import sales data for analytics' },
          { name: 'Menu Integration', enabled: true, description: 'Link menu items to inventory' },
          { name: 'Auto Reorder', enabled: false, description: 'Automatically reorder low stock items' }
        ],
        settings: {
          autoSync: true,
          syncInventory: true,
          syncSales: true,
          syncMenu: true,
          autoReorder: false,
          reorderThreshold: 20,
          notifyOnLowStock: true,
          updatePricing: false
        }
      };

      setIntegrations(prev => [...prev, newIntegration]);
      
      // Simulate initial data sync
      if (posType === 'toast') {
        simulateToastSync();
      } else if (posType === 'clover') {
        simulateCloverSync();
      } else if (posType === 'square') {
        simulateSquareSync();
      }

      return true;
    } catch (error) {
      console.error('POS connection failed:', error);
      return false;
    }
  };

  const disconnectPOS = (integrationId: string) => {
    setIntegrations(prev => prev.filter(i => i.id !== integrationId));
  };

  const updateIntegrationSettings = (integrationId: string, settings: Partial<POSSettings>) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, settings: { ...integration.settings, ...settings } }
        : integration
    ));
  };

  const syncPOSData = async (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: 'syncing' }
        : integration
    ));

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: 'connected', lastSync: new Date() }
        : integration
    ));
  };

  const simulateToastSync = () => {
    // Simulate Toast POS sales data
    const mockSales: SalesData[] = [
      {
        itemId: 'toast-item-1',
        itemName: 'Grilled Salmon',
        quantitySold: 24,
        revenue: 432.00,
        timestamp: new Date(),
        orderId: 'toast-order-123'
      },
      {
        itemId: 'toast-item-2',
        itemName: 'Chicken Breast Entree',
        quantitySold: 18,
        revenue: 324.00,
        timestamp: new Date(),
        orderId: 'toast-order-124'
      }
    ];

    setSalesData(prev => [...prev, ...mockSales]);

    // Simulate menu sync
    const mockMenu: MenuSync[] = [
      {
        menuItemId: 'menu-salmon',
        menuItemName: 'Grilled Salmon',
        category: 'Entrees',
        price: 18.00,
        isAvailable: true,
        ingredients: [
          { inventoryItemId: 'salmon-001', inventoryItemName: 'Atlantic Salmon Fillet', quantityNeeded: 0.5, unit: 'lbs', isOptional: false },
          { inventoryItemId: 'oil-001', inventoryItemName: 'Olive Oil', quantityNeeded: 1, unit: 'tbsp', isOptional: false }
        ]
      }
    ];

    setMenuItems(prev => [...prev, ...mockMenu]);
  };

  const simulateCloverSync = () => {
    const mockSales: SalesData[] = [
      {
        itemId: 'clover-item-1',
        itemName: 'Caesar Salad',
        quantitySold: 15,
        revenue: 180.00,
        timestamp: new Date(),
        orderId: 'clover-order-456'
      }
    ];

    setSalesData(prev => [...prev, ...mockSales]);
  };

  const simulateSquareSync = () => {
    const mockSales: SalesData[] = [
      {
        itemId: 'square-item-1',
        itemName: 'Margherita Pizza',
        quantitySold: 12,
        revenue: 168.00,
        timestamp: new Date(),
        orderId: 'square-order-789'
      }
    ];

    setSalesData(prev => [...prev, ...mockSales]);
  };

  const processInventoryDeduction = (sales: SalesData[], inventoryItems: InventoryItem[]) => {
    // This would automatically deduct inventory based on sales
    const deductions: { itemId: string; quantityUsed: number }[] = [];

    sales.forEach(sale => {
      // Find matching inventory item
      const inventoryItem = inventoryItems.find(item => 
        item.name.toLowerCase().includes(sale.itemName.toLowerCase()) ||
        sale.itemName.toLowerCase().includes(item.name.toLowerCase())
      );

      if (inventoryItem) {
        deductions.push({
          itemId: inventoryItem.id,
          quantityUsed: sale.quantitySold * 0.1 // Estimate usage per sale
        });
      }
    });

    return deductions;
  };

  const checkAutoReorderTriggers = (inventoryItems: InventoryItem[]) => {
    const triggeredRules: AutoReorderRule[] = [];

    autoReorderRules.forEach(rule => {
      if (!rule.isActive) return;

      const item = inventoryItems.find(i => i.id === rule.itemId);
      if (item && item.quantity <= rule.triggerLevel) {
        triggeredRules.push(rule);
      }
    });

    return triggeredRules;
  };

  const createAutoReorderRule = (itemId: string, supplierId: string, triggerLevel: number, reorderQuantity: number) => {
    const newRule: AutoReorderRule = {
      id: crypto.randomUUID(),
      itemId,
      supplierId,
      triggerLevel,
      reorderQuantity,
      isActive: true
    };

    setAutoReorderRules(prev => [...prev, newRule]);
    return newRule;
  };

  const getIntegrationStats = () => {
    const connectedCount = integrations.filter(i => i.status === 'connected').length;
    const totalSales = salesData.reduce((sum, sale) => sum + sale.revenue, 0);
    const todaySales = salesData.filter(sale => {
      const today = new Date();
      const saleDate = new Date(sale.timestamp);
      return saleDate.toDateString() === today.toDateString();
    }).length;

    return {
      connectedIntegrations: connectedCount,
      totalRevenue: totalSales,
      todaySales,
      menuItemsLinked: menuItems.length,
      activeRules: autoReorderRules.filter(r => r.isActive).length
    };
  };

  return {
    integrations,
    salesData,
    menuItems,
    autoReorderRules,
    isLoading,
    connectPOS,
    disconnectPOS,
    updateIntegrationSettings,
    syncPOSData,
    processInventoryDeduction,
    checkAutoReorderTriggers,
    createAutoReorderRule,
    getIntegrationStats
  };
}