import React, { useState } from 'react';
import { X, Package, Sparkles, Search } from 'lucide-react';
import { Wheat } from 'lucide-react';
import { AddItemFormData } from '../types/inventory';
import { SmartItemSuggestions } from './SmartItemSuggestions';
import { FoodItem, ENHANCED_CATEGORIES, STORAGE_LOCATIONS, COMMON_SUPPLIERS } from '../utils/foodDatabase';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: AddItemFormData) => void;
}

const units = [
  'lbs', 'kg', 'oz', 'g',
  'pieces', 'boxes', 'cases', 'bags',
  'gallons', 'liters', 'bottles', 'cans',
  'dozen', 'each'
];

const containerTypes = [
  'Rice Bag (25 lbs)',
  'Rice Bag (50 lbs)',
  'Flour Bag (25 lbs)',
  'Flour Bag (50 lbs)',
  'Bean Bag (25 lbs)',
  'Bean Bag (50 lbs)',
  'Storage Bin (Small)',
  'Storage Bin (Medium)',
  'Storage Bin (Large)',
  'Hotel Pan (Full)',
  'Hotel Pan (Half)',
  'Cambro Container (6 qt)',
  'Cambro Container (12 qt)',
  'Cambro Container (18 qt)',
  'Plastic Bucket (5 gal)',
  'Glass Jar (1 qt)',
  'Glass Jar (2 qt)',
  'Sealed Container (Small)',
  'Sealed Container (Large)',
  'Box (Small)',
  'Box (Medium)',
  'Box (Large)',
  'Case (24-pack)',
  'Can (Large)',
  'Jar',
  'Bottle',
  'Tray',
  'Package',
  'Bundle',
  'Other'
];

export function AddItemModal({ isOpen, onClose, onAddItem }: AddItemModalProps) {
  const [isSmartSuggestionsOpen, setIsSmartSuggestionsOpen] = useState(false);
  const [formData, setFormData] = useState<AddItemFormData>({
    name: '',
    description: '',
    quantity: 0,
    quantityInCases: 0,
    unitsPerCase: 24,
    unit: units[0],
    category: ENHANCED_CATEGORIES[0],
    supplier: '',
    costPerUnit: 0,
    costPerCase: 0,
    minimumStock: 5,
    minimumStockCases: 1,
    location: STORAGE_LOCATIONS[0],
    containerType: containerTypes[0],
    weightPerContainer: 25.0,
    trackByCases: false,
    isDryGood: true,
    densityLbsPerCup: 0.41
  });

  const handleSmartItemSelect = (item: FoodItem) => {
    setFormData(prev => ({
      ...prev,
      name: item.name,
      category: item.category,
      supplier: item.suppliers[0],
      costPerUnit: item.averageCostPerUnit,
      costPerCase: item.averageCostPerUnit * 24, // Default 24 units per case
      unitsPerCase: 24,
      location: item.storageLocation[0],
      containerType: item.commonContainers[0],
      weightPerContainer: item.isDryGood ? 25.0 : 1.0,
      trackByCases: !item.isDryGood, // Track non-dry goods by cases
      isDryGood: item.isDryGood,
      densityLbsPerCup: item.densityLbsPerCup,
      unit: item.commonUnits[0],
      expirationDate: item.perishable ? new Date(Date.now() + item.averageShelfLife * 24 * 60 * 60 * 1000) : undefined
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAddItem(formData);
      setFormData({
        name: '',
        description: '',
        quantity: 0,
        unit: units[0],
        category: ENHANCED_CATEGORIES[0],
        supplier: '',
        costPerUnit: 0,
        minimumStock: 5,
        location: STORAGE_LOCATIONS[0],
        containerType: containerTypes[0],
        weightPerContainer: 25.0,
        isDryGood: true,
        densityLbsPerCup: 0.41
      });
      onClose();
    }
  };

  const handleInputChange = (field: keyof AddItemFormData, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-500 scale-100">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-soft">
              <Wheat className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add Food Item</h2>
              <p className="text-sm text-gray-600 font-medium">Rice, grains, and dry goods with weight estimation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Smart Suggestions Button */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-emerald-900 mb-2">Professional Food Database</h4>
                <p className="text-sm text-emerald-700 font-medium">
                  Browse our database of 500+ professional food items with pre-filled details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSmartSuggestionsOpen(true)}
                className="px-6 py-3 gradient-success text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Browse Items
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                placeholder="e.g., White Rice, Black Beans, Flour..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              >
                {ENHANCED_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              placeholder="Brand, origin, grade, special notes..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Container Type
              </label>
              <select
                value={formData.containerType}
                onChange={(e) => handleInputChange('containerType', e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              >
                {containerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Weight per Container/Bag (lbs)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.weightPerContainer}
                onChange={(e) => handleInputChange('weightPerContainer', parseFloat(e.target.value) || 0)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                placeholder="e.g., 25, 50 for rice bags"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Container/Bag Count
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Minimum Stock (containers/bags)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.minimumStock}
                onChange={(e) => handleInputChange('minimumStock', parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Total Weight (All Containers)
              </label>
              <div className="w-full px-5 py-4 border-2 border-purple-200 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 font-bold text-lg shadow-soft">
                {(formData.quantity * formData.weightPerContainer).toFixed(1)} lbs
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Supplier
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              >
                <option value="">Select Supplier</option>
                {COMMON_SUPPLIERS.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Storage Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              >
                {STORAGE_LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                {formData.trackByCases ? 'Cost per Unit' : 'Cost per Container/Bag'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => {
                  const costPerUnit = parseFloat(e.target.value) || 0;
                  handleInputChange('costPerUnit', costPerUnit);
                  if (formData.trackByCases && formData.unitsPerCase) {
                    handleInputChange('costPerCase', costPerUnit * formData.unitsPerCase);
                  }
                }}
                disabled={formData.trackByCases}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                placeholder="0.00"
              />
              {formData.trackByCases && (
                <p className="text-xs text-blue-600 mt-1 font-semibold">
                  Case cost: ${(formData.costPerCase || 0).toFixed(2)} ({formData.unitsPerCase} units)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expirationDate ? formData.expirationDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('expirationDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft hover:shadow-elegant hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </form>

        <SmartItemSuggestions
          isOpen={isSmartSuggestionsOpen}
          onClose={() => setIsSmartSuggestionsOpen(false)}
          onSelectItem={handleSmartItemSelect}
          selectedCategory={formData.category}
        />
      </div>
    </div>
  );
}