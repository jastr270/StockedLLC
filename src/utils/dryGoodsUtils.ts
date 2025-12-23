// Dry goods density data (lbs per cup)
export const DRY_GOODS_DENSITY = {
  'White Rice (Long Grain)': 0.41,
  'Brown Rice': 0.43,
  'Jasmine Rice': 0.40,
  'Basmati Rice': 0.39,
  'Wild Rice': 0.35,
  'Quinoa': 0.38,
  'Black Beans': 0.44,
  'Kidney Beans': 0.45,
  'Chickpeas': 0.42,
  'Lentils (Red)': 0.40,
  'Lentils (Green)': 0.41,
  'Split Peas': 0.43,
  'All-Purpose Flour': 0.26,
  'Bread Flour': 0.27,
  'Whole Wheat Flour': 0.28,
  'Sugar (Granulated)': 0.44,
  'Brown Sugar': 0.48,
  'Salt': 0.60,
  'Oats (Rolled)': 0.18,
  'Barley': 0.41,
  'Cornmeal': 0.28,
  'Pasta (Dry)': 0.25,
  'Almonds': 0.31,
  'Walnuts': 0.26,
  'Sunflower Seeds': 0.32,
  'Sesame Seeds': 0.35
};

export const DRY_GOODS_CATEGORIES = [
  'Rice & Grains',
  'Beans & Legumes', 
  'Flour & Baking',
  'Sugar & Sweeteners',
  'Nuts & Seeds',
  'Pasta & Noodles',
  'Spices & Seasonings',
  'Cereals & Oats'
];

// Container volume estimates (in cups)
export const CONTAINER_VOLUMES = {
  'Rice Bag (25 lbs)': 60,
  'Rice Bag (50 lbs)': 120,
  'Flour Bag (25 lbs)': 96,
  'Flour Bag (50 lbs)': 192,
  'Bean Bag (25 lbs)': 57,
  'Bean Bag (50 lbs)': 114,
  'Storage Bin (Small)': 20,
  'Storage Bin (Medium)': 40,
  'Storage Bin (Large)': 80,
  'Hotel Pan (Full)': 16,
  'Hotel Pan (Half)': 8,
  'Cambro Container (6 qt)': 24,
  'Cambro Container (12 qt)': 48,
  'Cambro Container (18 qt)': 72,
  'Plastic Bucket (5 gal)': 80,
  'Glass Jar (1 qt)': 4,
  'Glass Jar (2 qt)': 8,
  'Sealed Container (Small)': 12,
  'Sealed Container (Large)': 32
};

export function estimateWeightFromVolume(
  containerType: string, 
  fillLevel: number, 
  dryGoodType: string
): number {
  const containerVolume = CONTAINER_VOLUMES[containerType as keyof typeof CONTAINER_VOLUMES] || 20;
  const density = DRY_GOODS_DENSITY[dryGoodType as keyof typeof DRY_GOODS_DENSITY] || 0.35;
  const actualVolume = containerVolume * (fillLevel / 100);
  return actualVolume * density;
}

export function estimateVolumeFromWeight(
  weight: number,
  dryGoodType: string
): number {
  const density = DRY_GOODS_DENSITY[dryGoodType as keyof typeof DRY_GOODS_DENSITY] || 0.35;
  return weight / density;
}

export function getDryGoodSuggestions(name: string): string[] {
  const nameLower = name.toLowerCase();
  return Object.keys(DRY_GOODS_DENSITY).filter(item => 
    item.toLowerCase().includes(nameLower) || 
    nameLower.includes(item.toLowerCase().split(' ')[0])
  );
}

export function getRecommendedContainer(dryGoodType: string, weightLbs: number): string {
  const volume = estimateVolumeFromWeight(weightLbs, dryGoodType);
  
  if (volume <= 8) return 'Glass Jar (2 qt)';
  if (volume <= 16) return 'Sealed Container (Small)';
  if (volume <= 32) return 'Sealed Container (Large)';
  if (volume <= 48) return 'Cambro Container (12 qt)';
  if (volume <= 80) return 'Storage Bin (Large)';
  if (volume <= 120) return 'Rice Bag (50 lbs)';
  return 'Plastic Bucket (5 gal)';
}