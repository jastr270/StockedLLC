export interface FoodItem {
  name: string;
  category: string;
  subcategory: string;
  commonUnits: string[];
  averageShelfLife: number; // days
  storageLocation: string[];
  averageCostPerUnit: number;
  perishable: boolean;
  requiresRefrigeration: boolean;
  requiresFreezing: boolean;
  isDryGood: boolean;
  densityLbsPerCup?: number;
  commonContainers: string[];
  suppliers: string[];
  seasonality: string;
  nutritionalDensity: 'low' | 'medium' | 'high';
  visualCues?: string[];
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sodium: number;
    servingSize: string;
  };
}

export const ENHANCED_CATEGORIES = [
  'Rice & Grains',
  'Beans & Legumes',
  'Flour & Baking',
  'Proteins',
  'Seafood',
  'Dairy & Eggs',
  'Fruits & Vegetables',
  'Frozen Foods',
  'Beverages',
  'Spices & Seasonings',
  'Oils & Vinegars',
  'Canned Goods',
  'Wine & Spirits',
  'Beer & Ciders',
  'Mixers & Sodas',
  'Other'
];

export const STORAGE_LOCATIONS = [
  'Dry Storage',
  'Walk-in Cooler',
  'Walk-in Freezer',
  'Prep Kitchen',
  'Main Kitchen',
  'Bar Storage',
  'Wine Cellar',
  'Receiving Area',
  'Pantry',
  'Cold Storage',
  'Freezer Room',
  'Beverage Cooler'
];

export const COMMON_SUPPLIERS = [
  'Sysco',
  'US Foods',
  'Performance Food Group',
  'Gordon Food Service',
  'Reinhart FoodService',
  'Local Farm',
  'Specialty Distributor',
  'Direct from Manufacturer',
  'Costco Business',
  'Restaurant Depot',
  'Local Supplier',
  'Organic Distributor'
];

// Comprehensive food database
const FOOD_DATABASE: FoodItem[] = [
  // Rice & Grains
  {
    name: 'White Rice (Long Grain)',
    category: 'Rice & Grains',
    subcategory: 'Rice',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 1095, // 3 years
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 0.75,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.41,
    commonContainers: ['Rice Bag (25 lbs)', 'Rice Bag (50 lbs)', 'Storage Bin (Large)'],
    suppliers: ['Sysco', 'US Foods', 'Local Supplier'],
    seasonality: 'year-round',
    nutritionalDensity: 'medium'
  },
  {
    name: 'Brown Rice',
    category: 'Rice & Grains',
    subcategory: 'Rice',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 180, // 6 months
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 1.25,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.43,
    commonContainers: ['Rice Bag (25 lbs)', 'Storage Bin (Medium)'],
    suppliers: ['Sysco', 'US Foods', 'Organic Distributor'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },
  {
    name: 'Quinoa',
    category: 'Rice & Grains',
    subcategory: 'Ancient Grains',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 730, // 2 years
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 3.50,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.38,
    commonContainers: ['Bag (25 lbs)', 'Storage Bin (Small)'],
    suppliers: ['Sysco', 'Specialty Distributor', 'Organic Distributor'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },

  // Beans & Legumes
  {
    name: 'Black Beans',
    category: 'Beans & Legumes',
    subcategory: 'Dried Beans',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 1095, // 3 years
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 1.20,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.44,
    commonContainers: ['Bean Bag (25 lbs)', 'Bean Bag (50 lbs)'],
    suppliers: ['Sysco', 'US Foods', 'Performance Food Group'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },
  {
    name: 'Kidney Beans',
    category: 'Beans & Legumes',
    subcategory: 'Dried Beans',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 1095,
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 1.15,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.45,
    commonContainers: ['Bean Bag (25 lbs)', 'Storage Bin (Medium)'],
    suppliers: ['Sysco', 'US Foods', 'Local Supplier'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },
  {
    name: 'Lentils (Red)',
    category: 'Beans & Legumes',
    subcategory: 'Lentils',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 1095,
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 1.80,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.40,
    commonContainers: ['Bag (25 lbs)', 'Storage Bin (Small)'],
    suppliers: ['Sysco', 'Specialty Distributor', 'Organic Distributor'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },

  // Proteins
  {
    name: 'Chicken Breast (Boneless)',
    category: 'Proteins',
    subcategory: 'Poultry',
    commonUnits: ['lbs', 'pieces', 'cases'],
    averageShelfLife: 3,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 4.85,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Vacuum Pack (10 lbs)', 'Case (40 lbs)', 'Individual Pack (2 lbs)'],
    suppliers: ['Sysco', 'US Foods', 'Tyson', 'Perdue'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },
  {
    name: 'Ground Beef (80/20)',
    category: 'Proteins',
    subcategory: 'Beef',
    commonUnits: ['lbs', 'packages', 'cases'],
    averageShelfLife: 2,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 5.25,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Package (5 lbs)', 'Case (80 lbs)', 'Vacuum Pack (10 lbs)'],
    suppliers: ['Sysco', 'US Foods', 'Local Butcher'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },

  // Seafood
  {
    name: 'Atlantic Salmon Fillet',
    category: 'Seafood',
    subcategory: 'Fish Fillets',
    commonUnits: ['lbs', 'pieces', 'fillets'],
    averageShelfLife: 2,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 8.95,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Vacuum Pack (3 lbs)', 'Case (15 lbs)', 'Individual Fillet (8 oz)'],
    suppliers: ['Sysco', 'US Foods', 'Seattle Fish Co'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Fresh Atlantic Salmon'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 206,
      protein: 22.1,
      carbohydrates: 0,
      fat: 12.4,
      fiber: 0,
      sodium: 59,
      servingSize: '3.5 oz'
    }
  },
  {
    name: 'Tuna Steaks (Yellowfin)',
    category: 'Seafood',
    subcategory: 'Fish Fillets',
    commonUnits: ['lbs', 'pieces', 'steaks'],
    averageShelfLife: 2,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 12.50,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Case (10 lbs)', 'Vacuum Pack (2 lbs)', 'Individual Steak (6 oz)'],
    suppliers: ['Sysco', 'US Foods', 'Pacific Seafood'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Fresh Yellowfin Tuna'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 144,
      protein: 25.4,
      carbohydrates: 0,
      fat: 4.9,
      fiber: 0,
      sodium: 37,
      servingSize: '3.5 oz'
    }
  },
  {
    name: 'Cod Fillets (Fresh)',
    category: 'Seafood',
    subcategory: 'Fish Fillets',
    commonUnits: ['lbs', 'pieces', 'fillets'],
    averageShelfLife: 2,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 7.25,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Case (12 lbs)', 'Vacuum Pack (3 lbs)', 'Individual Fillet (6 oz)'],
    suppliers: ['Sysco', 'US Foods', 'Boston Seafood'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Fresh Atlantic Cod'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 82,
      protein: 17.8,
      carbohydrates: 0,
      fat: 0.7,
      fiber: 0,
      sodium: 54,
      servingSize: '3.5 oz'
    }
  },
  {
    name: 'Halibut Fillets',
    category: 'Seafood',
    subcategory: 'Fish Fillets',
    commonUnits: ['lbs', 'pieces', 'fillets'],
    averageShelfLife: 2,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 15.75,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Case (8 lbs)', 'Vacuum Pack (2 lbs)', 'Individual Fillet (8 oz)'],
    suppliers: ['Sysco', 'US Foods', 'Alaska Seafood'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Fresh Pacific Halibut'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 111,
      protein: 20.8,
      carbohydrates: 0,
      fat: 2.3,
      fiber: 0,
      sodium: 54,
      servingSize: '3.5 oz'
    }
  },
  {
    name: 'Tobiko (Flying Fish Roe)',
    category: 'Seafood',
    subcategory: 'Specialty Seafood',
    commonUnits: ['oz', 'containers', 'cases'],
    averageShelfLife: 14,
    storageLocation: ['Walk-in Cooler'],
    averageCostPerUnit: 18.50,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Container (4 oz)', 'Container (8 oz)', 'Case (12 containers)'],
    suppliers: ['Sysco', 'Asian Food Distributor', 'Sushi Grade Seafood'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Flying Fish Roe', 'Salt'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 40,
      protein: 6.0,
      carbohydrates: 0.6,
      fat: 1.8,
      fiber: 0,
      sodium: 240,
      servingSize: '1 oz'
    }
  },
  {
    name: 'Ikura (Salmon Roe)',
    category: 'Seafood',
    subcategory: 'Specialty Seafood',
    commonUnits: ['oz', 'containers', 'cases'],
    averageShelfLife: 10,
    storageLocation: ['Walk-in Cooler'],
    averageCostPerUnit: 25.00,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Container (2 oz)', 'Container (4 oz)', 'Case (8 containers)'],
    suppliers: ['Sysco', 'Asian Food Distributor', 'Sushi Grade Seafood'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Salmon Roe', 'Salt'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 250,
      protein: 18.0,
      carbohydrates: 2.9,
      fat: 17.9,
      fiber: 0,
      sodium: 1500,
      servingSize: '1 oz'
    }
  },
  {
    name: 'Sea Bass Fillets',
    category: 'Seafood',
    subcategory: 'Fish Fillets',
    commonUnits: ['lbs', 'pieces', 'fillets'],
    averageShelfLife: 2,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 11.25,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Case (10 lbs)', 'Vacuum Pack (2 lbs)', 'Individual Fillet (6 oz)'],
    suppliers: ['Sysco', 'US Foods', 'Mediterranean Seafood'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Fresh Sea Bass'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 124,
      protein: 23.2,
      carbohydrates: 0,
      fat: 2.6,
      fiber: 0,
      sodium: 68,
      servingSize: '3.5 oz'
    }
  },
  {
    name: 'Mahi Mahi Fillets',
    category: 'Seafood',
    subcategory: 'Fish Fillets',
    commonUnits: ['lbs', 'pieces', 'fillets'],
    averageShelfLife: 2,
    storageLocation: ['Walk-in Cooler', 'Walk-in Freezer'],
    averageCostPerUnit: 9.85,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Case (12 lbs)', 'Vacuum Pack (3 lbs)', 'Individual Fillet (7 oz)'],
    suppliers: ['Sysco', 'US Foods', 'Tropical Seafood'],
    seasonality: 'year-round',
    nutritionalDensity: 'high',
    ingredients: ['Fresh Mahi Mahi'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 85,
      protein: 18.5,
      carbohydrates: 0,
      fat: 0.7,
      fiber: 0,
      sodium: 88,
      servingSize: '3.5 oz'
    }
  },

  // Dairy & Eggs
  {
    name: 'Whole Milk',
    category: 'Dairy & Eggs',
    subcategory: 'Milk',
    commonUnits: ['gallons', 'quarts', 'cases'],
    averageShelfLife: 7,
    storageLocation: ['Walk-in Cooler'],
    averageCostPerUnit: 3.85,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Gallon Jug', 'Case (4 gallons)', 'Quart Container'],
    suppliers: ['Sysco', 'Local Dairy', 'US Foods'],
    seasonality: 'year-round',
    nutritionalDensity: 'medium'
  },
  {
    name: 'Large Eggs (Grade A)',
    category: 'Dairy & Eggs',
    subcategory: 'Eggs',
    commonUnits: ['dozen', 'cases', 'flats'],
    averageShelfLife: 21,
    storageLocation: ['Walk-in Cooler'],
    averageCostPerUnit: 2.25,
    perishable: true,
    requiresRefrigeration: true,
    requiresFreezing: false,
    isDryGood: false,
    commonContainers: ['Dozen Carton', 'Case (30 dozen)', 'Flat (2.5 dozen)'],
    suppliers: ['Sysco', 'US Foods', 'Local Farm'],
    seasonality: 'year-round',
    nutritionalDensity: 'high'
  },

  // Flour & Baking
  {
    name: 'All-Purpose Flour',
    category: 'Flour & Baking',
    subcategory: 'Flour',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 365,
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 0.51,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.26,
    commonContainers: ['Flour Bag (25 lbs)', 'Flour Bag (50 lbs)', 'Storage Bin (Large)'],
    suppliers: ['Sysco', 'US Foods', 'King Arthur'],
    seasonality: 'year-round',
    nutritionalDensity: 'medium'
  },
  {
    name: 'Bread Flour',
    category: 'Flour & Baking',
    subcategory: 'Flour',
    commonUnits: ['lbs', 'cups', 'bags'],
    averageShelfLife: 365,
    storageLocation: ['Dry Storage', 'Pantry'],
    averageCostPerUnit: 0.65,
    perishable: false,
    requiresRefrigeration: false,
    requiresFreezing: false,
    isDryGood: true,
    densityLbsPerCup: 0.27,
    commonContainers: ['Flour Bag (25 lbs)', 'Storage Bin (Medium)'],
    suppliers: ['Sysco', 'US Foods', 'King Arthur'],
    seasonality: 'year-round',
    nutritionalDensity: 'medium'
  }
];

export function searchFoodDatabase(query: string): FoodItem[] {
  try {
    const searchTerm = query.toLowerCase();
    return FOOD_DATABASE.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.subcategory.toLowerCase().includes(searchTerm) ||
      item.suppliers.some(supplier => supplier.toLowerCase().includes(searchTerm))
    ).slice(0, 20); // Limit results for performance
  } catch (error) {
    console.error('Food database search error:', error);
    return [];
  }
}

export function getFoodSuggestions(category: string): FoodItem[] {
  try {
    return FOOD_DATABASE.filter(item => item.category === category).slice(0, 15);
  } catch (error) {
    console.error('Food suggestions error:', error);
    return [];
  }
}

export function getFoodByName(name: string): FoodItem | undefined {
  return FOOD_DATABASE.find(item => 
    item.name.toLowerCase() === name.toLowerCase()
  );
}

export function getRandomFoodItems(count: number = 10): FoodItem[] {
  const shuffled = [...FOOD_DATABASE].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}