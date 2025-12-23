import { useState, useEffect } from 'react';
import { InventoryItem, AddItemFormData, ScanResult } from '../types/inventory';

const STORAGE_KEY = 'food-inventory-data';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const loadInventory = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          expirationDate: item.expirationDate ? new Date(item.expirationDate) : undefined,
          lastInventoryReset: item.lastInventoryReset ? new Date(item.lastInventoryReset) : undefined,
          lastSeenDate: item.lastSeenDate ? new Date(item.lastSeenDate) : undefined,
          lastQualityCheck: item.lastQualityCheck ? new Date(item.lastQualityCheck) : undefined
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Failed to load inventory:', error);
        createSampleData();
      }
    } else {
      createSampleData();
    }
    setIsLoading(false);
  };

  const createSampleData = () => {
    const sampleItems: InventoryItem[] = [
      {
        id: '1',
        name: 'White Rice (Long Grain)',
        description: 'Premium quality long grain white rice',
        category: 'Rice & Grains',
        quantity: 8,
        unit: 'bags',
        supplier: 'Sysco',
        costPerUnit: 18.50,
        totalValue: 148.00,
        minimumStock: 3,
        location: 'Dry Storage',
        containerType: 'Rice Bag (25 lbs)',
        weightPerContainer: 25.0,
        totalWeightLbs: 200.0,
        isDryGood: true,
        densityLbsPerCup: 0.41,
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        beginningInventory: 12,
        inventoryGapPercentage: 33.3,
        lastInventoryReset: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Black Beans (Organic)',
        description: 'Certified organic black beans',
        category: 'Beans & Legumes',
        quantity: 5,
        unit: 'bags',
        supplier: 'Performance Food Group',
        costPerUnit: 22.00,
        totalValue: 110.00,
        minimumStock: 2,
        location: 'Dry Storage',
        containerType: 'Bean Bag (25 lbs)',
        weightPerContainer: 25.0,
        totalWeightLbs: 125.0,
        isDryGood: true,
        densityLbsPerCup: 0.44,
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        beginningInventory: 8,
        inventoryGapPercentage: 37.5
      },
      {
        id: '3',
        name: 'Atlantic Salmon Fillet',
        description: 'Fresh Atlantic salmon, sushi grade',
        category: 'Seafood',
        quantity: 12,
        unit: 'lbs',
        supplier: 'Seattle Fish Co',
        costPerUnit: 8.95,
        totalValue: 107.40,
        minimumStock: 5,
        location: 'Walk-in Cooler',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        containerType: 'Vacuum Pack (3 lbs)',
        weightPerContainer: 3.0,
        totalWeightLbs: 12.0,
        isDryGood: false,
        createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        ingredients: ['Fresh Atlantic Salmon'],
        allergens: ['Fish']
      },
      {
        id: '4',
        name: 'All-Purpose Flour',
        description: 'Enriched all-purpose flour for baking',
        category: 'Flour & Baking',
        quantity: 3,
        unit: 'bags',
        supplier: 'US Foods',
        costPerUnit: 12.75,
        totalValue: 38.25,
        minimumStock: 2,
        location: 'Dry Storage',
        containerType: 'Flour Bag (25 lbs)',
        weightPerContainer: 25.0,
        totalWeightLbs: 75.0,
        isDryGood: true,
        densityLbsPerCup: 0.26,
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        beginningInventory: 6,
        inventoryGapPercentage: 50.0
      },
      {
        id: '5',
        name: 'Chicken Breast (Boneless)',
        description: 'Fresh boneless chicken breast',
        category: 'Proteins',
        quantity: 1,
        unit: 'cases',
        supplier: 'Tyson',
        costPerUnit: 48.50,
        totalValue: 48.50,
        minimumStock: 2,
        location: 'Walk-in Cooler',
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        containerType: 'Vacuum Pack (10 lbs)',
        weightPerContainer: 10.0,
        totalWeightLbs: 10.0,
        isDryGood: false,
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now()
      }
    ];
    setItems(sampleItems);
  };

  const addItem = (formData: AddItemFormData) => {
    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      ...formData,
      totalValue: formData.quantity * formData.costPerUnit,
      totalWeightLbs: formData.quantity * formData.weightPerContainer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      beginningInventory: formData.quantity,
      lastInventoryReset: new Date(),
      inventoryGapPercentage: 0
    };

    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates, updatedAt: Date.now() };
        
        // Recalculate derived values
        updatedItem.totalValue = updatedItem.quantity * updatedItem.costPerUnit;
        updatedItem.totalWeightLbs = updatedItem.quantity * updatedItem.weightPerContainer;
        
        // Update inventory gap if quantity changed
        if (updates.quantity !== undefined && updatedItem.beginningInventory) {
          const gap = ((updatedItem.beginningInventory - updatedItem.quantity) / updatedItem.beginningInventory) * 100;
          updatedItem.inventoryGapPercentage = Math.max(0, gap);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addFromScan = (scanResult: ScanResult) => {
    const newItems: InventoryItem[] = scanResult.detectedItems.map((detected, index) => ({
      id: crypto.randomUUID(),
      name: detected.recognizedFood?.name || `${detected.containerType} ${index + 1}`,
      description: detected.recognizedFood ? `Detected: ${detected.recognizedFood.visualCues.join(', ')}` : 'Scanned item',
      category: detected.recognizedFood?.category || 'Other',
      quantity: 1,
      unit: detected.isDryGood ? 'bags' : 'lbs',
      supplier: 'Unknown',
      costPerUnit: 0,
      totalValue: 0,
      minimumStock: 1,
      location: 'Receiving Area',
      containerType: detected.containerType,
      weightPerContainer: detected.estimatedWeight,
      totalWeightLbs: detected.estimatedWeight,
      isDryGood: detected.isDryGood,
      densityLbsPerCup: detected.isDryGood ? 0.35 : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      beginningInventory: 1,
      inventoryGapPercentage: 0
    }));

    setItems(prev => [...prev, ...newItems]);
  };

  const addFromBarcode = (barcode: string, productInfo: any) => {
    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      name: productInfo.name || 'Unknown Product',
      description: `Scanned product: ${barcode}`,
      category: productInfo.category || 'Other',
      quantity: productInfo.trackByCases ? 0 : 1,
      quantityInCases: productInfo.trackByCases ? 1 : undefined,
      unitsPerCase: productInfo.unitsPerCase || 24,
      unit: productInfo.trackByCases ? 'cases' : 'each',
      supplier: productInfo.supplier || 'Unknown',
      costPerUnit: productInfo.trackByCases ? productInfo.costPerCase || 0 : productInfo.costPerUnit,
      costPerCase: productInfo.costPerCase,
      totalValue: productInfo.trackByCases ? (productInfo.costPerCase || 0) : productInfo.costPerUnit,
      minimumStock: 1,
      minimumStockCases: productInfo.trackByCases ? 1 : undefined,
      location: 'Receiving Area',
      containerType: productInfo.containerType || 'Unknown',
      weightPerContainer: productInfo.weightPerContainer || 1,
      totalWeightLbs: productInfo.weightPerContainer || 1,
      trackByCases: productInfo.trackByCases || false,
      isDryGood: productInfo.isDryGood || false,
      densityLbsPerCup: productInfo.densityLbsPerCup,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      barcode,
      ingredients: productInfo.ingredients || [],
      allergens: productInfo.allergens || [],
      nutritionalInfo: productInfo.nutritionalInfo,
      beginningInventory: productInfo.trackByCases ? 0 : 1,
      inventoryGapPercentage: 0
    };

    setItems(prev => [...prev, newItem]);
  };

  const importItems = (importedItems: InventoryItem[]) => {
    const itemsWithMetadata = importedItems.map(item => ({
      ...item,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      beginningInventory: item.quantity,
      inventoryGapPercentage: 0,
      lastInventoryReset: new Date()
    }));
    setItems(prev => [...prev, ...itemsWithMetadata]);
  };

  const resetBeginningInventory = (itemId?: string) => {
    if (itemId) {
      // Reset single item
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              beginningInventory: item.quantity,
              inventoryGapPercentage: 0,
              lastInventoryReset: new Date(),
              updatedAt: Date.now()
            }
          : item
      ));
    } else {
      // Reset all items
      setItems(prev => prev.map(item => ({
        ...item,
        beginningInventory: item.quantity,
        inventoryGapPercentage: 0,
        lastInventoryReset: new Date(),
        updatedAt: Date.now()
      })));
    }
  };

  const getInventoryGapStats = () => {
    const itemsWithGaps = items.filter(item => item.inventoryGapPercentage !== undefined);
    const averageGap = itemsWithGaps.length > 0 
      ? itemsWithGaps.reduce((sum, item) => sum + (item.inventoryGapPercentage || 0), 0) / itemsWithGaps.length
      : 0;
    
    const highGapItems = itemsWithGaps.filter(item => (item.inventoryGapPercentage || 0) > 50);

    return {
      averageGap,
      highGapItems: highGapItems.length,
      totalItemsTracked: itemsWithGaps.length,
      criticalGapItems: itemsWithGaps.filter(item => (item.inventoryGapPercentage || 0) > 75)
    };
  };

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    addFromScan,
    addFromBarcode,
    importItems,
    resetBeginningInventory,
    getInventoryGapStats
  };
}