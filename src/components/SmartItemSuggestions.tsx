import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Clock, Thermometer, Package, Star } from 'lucide-react';
import { searchFoodDatabase, getFoodSuggestions, FoodItem } from '../utils/foodDatabase';

interface SmartItemSuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: FoodItem) => void;
  selectedCategory?: string;
}

export function SmartItemSuggestions({ isOpen, onClose, onSelectItem, selectedCategory }: SmartItemSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<'search' | 'category' | 'seasonal'>('search');

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchFoodDatabase(searchQuery);
      setSuggestions(results);
    } else if (selectedCategory) {
      const results = getFoodSuggestions(selectedCategory);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, selectedCategory]);

  const handleSelectItem = (item: FoodItem) => {
    onSelectItem(item);
    onClose();
  };

  const getStorageIcon = (item: FoodItem) => {
    if (item.requiresFreezing) return <Package className="w-4 h-4 text-blue-500" />;
    if (item.requiresRefrigeration) return <Thermometer className="w-4 h-4 text-green-500" />;
    return <Package className="w-4 h-4 text-amber-500" />;
  };

  const getPerishabilityColor = (item: FoodItem) => {
    if (item.averageShelfLife <= 3) return 'text-red-600 bg-red-50';
    if (item.averageShelfLife <= 7) return 'text-amber-600 bg-amber-50';
    if (item.averageShelfLife <= 30) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-soft">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Food Database</h2>
              <p className="text-sm text-gray-600 font-medium">Browse professional food items with pre-filled details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for produce, meats, dairy, seafood, grains..."
              className="w-full pl-14 pr-5 py-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium text-lg shadow-soft"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {['All Items', 'Produce', 'Proteins', 'Seafood', 'Dairy & Eggs', 'Rice & Grains', 'Frozen Foods'].map(category => (
              <button
                key={category}
                onClick={() => {
                  if (category === 'All Items') {
                    setSearchQuery('');
                    setSuggestions([]);
                  } else {
                    const results = getFoodSuggestions(category);
                    setSuggestions(results);
                  }
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 font-semibold text-sm"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelectItem(item)}
                className="p-6 border-2 border-gray-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 text-left group shadow-soft hover:shadow-elegant hover:scale-105"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors duration-300">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 font-semibold">
                      {item.category} • {item.subcategory}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStorageIcon(item)}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPerishabilityColor(item)}`}>
                      {item.averageShelfLife}d
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 font-semibold">Avg Cost:</span>
                    <span className="ml-2 text-gray-900 font-bold">${item.averageCostPerUnit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Storage:</span>
                    <span className="ml-2 text-gray-900 font-bold">{item.storageLocation[0]}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Units:</span>
                    <span className="ml-2 text-gray-900 font-bold">{item.commonUnits.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Supplier:</span>
                    <span className="ml-2 text-gray-900 font-bold">{item.suppliers[0]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {item.perishable && <Clock className="w-4 h-4 text-amber-500" />}
                    {item.requiresRefrigeration && <Thermometer className="w-4 h-4 text-blue-500" />}
                    {item.isDryGood && <Package className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (item.nutritionalDensity === 'high' ? 3 : item.nutritionalDensity === 'medium' ? 2 : 1)
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1 font-semibold">Nutrition</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {suggestions.length === 0 && searchQuery.length >= 2 && (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-gray-600 mb-2">No items found</h4>
              <p className="text-gray-500 font-medium">Try a different search term or browse by category</p>
            </div>
          )}

          {suggestions.length === 0 && searchQuery.length < 2 && (
            <div className="text-center py-8">
              <Sparkles className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-gray-600 mb-2">Professional Food Database</h4>
              <p className="text-gray-500 font-medium">Search for items or browse categories to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}