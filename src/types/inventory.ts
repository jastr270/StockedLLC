export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  quantityInCases?: number;
  unitsPerCase?: number;
  unit: string;
  supplier: string;
  costPerUnit: number;
  costPerCase?: number;
  totalValue: number;
  minimumStock: number;
  minimumStockCases?: number;
  location: string;
  specificLocation?: string;
  expirationDate?: Date;
  containerType: string;
  weightPerContainer: number;
  totalWeightLbs: number;
  trackByCases?: boolean;
  isDryGood: boolean;
  densityLbsPerCup?: number;
  createdAt: number;
  updatedAt: number;
  
  // Advanced tracking
  beginningInventory?: number;
  lastInventoryReset?: Date;
  inventoryGapPercentage?: number;
  
  // Hidden inventory tracking
  isHidden?: boolean;
  hiddenBehind?: string;
  stackPosition?: 'front' | 'middle' | 'back';
  lastSeenDate?: Date;
  
  // Quality control
  lastQualityCheck?: Date;
  qualityRating?: number;
  temperatureLog?: TemperatureReading[];
  
  // Barcode and product info
  barcode?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
}

export interface AddItemFormData {
  name: string;
  description: string;
  quantity: number;
  quantityInCases?: number;
  unitsPerCase?: number;
  unit: string;
  category: string;
  supplier: string;
  costPerUnit: number;
  costPerCase?: number;
  minimumStock: number;
  minimumStockCases?: number;
  location: string;
  containerType: string;
  weightPerContainer: number;
  trackByCases?: boolean;
  isDryGood: boolean;
  densityLbsPerCup?: number;
  expirationDate?: Date;
}

export interface ScanResult {
  totalCount: number;
  detectedItems: DetectedItem[];
  confidence: number;
  processingTime: number;
}

export interface DetectedItem {
  containerType: string;
  estimatedWeight: number;
  estimatedVolume?: number;
  isDryGood: boolean;
  grainType?: string;
  recognizedFood?: {
    name: string;
    category: string;
    confidence: number;
    visualCues: string[];
  };
}

export interface LocationMemory {
  id: string;
  locationName: string;
  specificArea: string;
  hiddenItems: HiddenItem[];
  visibleItems: string[]; // Item IDs
  lastScanned: Date;
  notes: string;
}

export interface HiddenItem {
  itemId: string;
  itemName: string;
  quantity: number;
  hiddenBehind: string;
  stackLevel: number;
  lastUpdated: Date;
  confidence: number;
}

export interface TemperatureReading {
  temperature: number;
  timestamp: Date;
  location: string;
  recordedBy: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
  servingSize: string;
}