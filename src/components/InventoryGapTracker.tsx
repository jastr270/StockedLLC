import React, { useState } from 'react';
import { TrendingDown, RotateCcw, AlertTriangle, Target, Calendar, BarChart3, RefreshCw } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { format } from 'date-fns';

interface InventoryGapTrackerProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onResetBeginningInventory: (id?: string) => void;
  gapStats: {
    averageGap: number;
    highGapItems: number;
    totalItemsTracked: number;
    criticalGapItems: InventoryItem[];
  };
}

export function InventoryGapTracker({ 
  items, 
  isOpen, 
  onClose, 
  onResetBeginningInventory,
  gapStats 
}: InventoryGapTrackerProps) {
  const [sortBy, setSortBy] = useState<'gap' | 'name' | 'category' | 'value'>('gap');
  const [filterCategory, setFilterCategory] = useState('All');

  const itemsWithGaps = items.filter(item => item.inventoryGapPercentage !== undefined);
  const categories = Array.from(new Set(items.map(item => item.category)));

  const filteredItems = itemsWithGaps
    .filter(item => filterCategory === 'All' || item.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'gap':
          return (b.inventoryGapPercentage || 0) - (a.inventoryGapPercentage || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'value':
          const aValue = (a.beginningInventory || 0) * a.costPerUnit;
          const bValue = (b.beginningInventory || 0) * b.costPerUnit;
          return bValue - aValue;
        default:
          return 0;
      }
    });

  const getGapColor = (gap: number) => {
    if (gap >= 75) return 'text-red-600 bg-red-50 border-red-200';
    if (gap >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (gap >= 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getGapStatus = (gap: number) => {
    if (gap >= 75) return 'Critical';
    if (gap >= 50) return 'High';
    if (gap >= 25) return 'Moderate';
    return 'Low';
  };

  const calculateValueLoss = (item: InventoryItem) => {
    const beginningValue = (item.beginningInventory || 0) * item.costPerUnit;
    const currentValue = item.quantity * item.costPerUnit;
    return beginningValue - currentValue;
  };

  const totalValueLoss = itemsWithGaps.reduce((sum, item) => sum + calculateValueLoss(item), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl shadow-soft">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Inventory Gap Analysis</h2>
              <p className="text-sm text-gray-600 font-medium">Track usage patterns and inventory depletion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Gap Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Average Gap</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{gapStats.averageGap.toFixed(1)}%</p>
              <p className="text-sm text-blue-600">Across all items</p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800">High Gap Items</span>
              </div>
              <p className="text-3xl font-bold text-red-700">{gapStats.highGapItems}</p>
              <p className="text-sm text-red-600">Over 50% depleted</p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-emerald-800">Items Tracked</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700">{gapStats.totalItemsTracked}</p>
              <p className="text-sm text-emerald-600">With gap data</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Value Loss</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">${totalValueLoss.toFixed(0)}</p>
              <p className="text-sm text-purple-600">Since last reset</p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              >
                <option value="gap">Inventory Gap %</option>
                <option value="name">Item Name</option>
                <option value="category">Category</option>
                <option value="value">Beginning Value</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Filter Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              >
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => onResetBeginningInventory()}
                className="w-full px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reset All Beginning Inventory
              </button>
            </div>
          </div>

          {/* Critical Gap Alerts */}
          {gapStats.criticalGapItems.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-red-800">Critical Inventory Gaps (75%+ Depleted)</h3>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {gapStats.criticalGapItems.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gapStats.criticalGapItems.slice(0, 4).map(item => (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-soft">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-xs text-red-600 font-semibold">
                          Started with {item.beginningInventory}, now {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600 font-bold text-lg">{item.inventoryGapPercentage?.toFixed(1)}%</p>
                        <p className="text-sm text-gray-500">depleted</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Gap Table */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Inventory Gap Analysis</h3>
              <p className="text-sm text-gray-600 font-medium">Beginning vs Current inventory levels</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Item</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Beginning</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Current</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Gap %</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Value Loss</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Last Reset</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map(item => {
                    const gap = item.inventoryGapPercentage || 0;
                    const valueLoss = calculateValueLoss(item);
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.category}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-blue-700">{item.beginningInventory || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-gray-900">{item.quantity}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getGapColor(gap)}`}>
                            {gap.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-red-600">${valueLoss.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {item.lastInventoryReset ? format(item.lastInventoryReset, 'MMM dd') : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => onResetBeginningInventory(item.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                            title="Reset beginning inventory"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gap Analysis Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-soft">
              <h4 className="text-lg font-bold text-indigo-900 mb-4">Usage Patterns</h4>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Fast Moving Items:</span>
                    <span className="font-bold text-red-600">
                      {itemsWithGaps.filter(i => (i.inventoryGapPercentage || 0) > 50).length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Items with 50%+ depletion</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Slow Moving Items:</span>
                    <span className="font-bold text-green-600">
                      {itemsWithGaps.filter(i => (i.inventoryGapPercentage || 0) < 25).length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Items with less than 25% depletion</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total Value Consumed:</span>
                    <span className="font-bold text-purple-600">${totalValueLoss.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Since last inventory reset</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <h4 className="text-lg font-bold text-amber-900 mb-4">Reorder Recommendations</h4>
              <div className="space-y-3">
                {itemsWithGaps
                  .filter(item => (item.inventoryGapPercentage || 0) > 60)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.id} className="bg-white rounded-lg p-3 shadow-soft">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-700 font-bold text-sm">
                            {item.inventoryGapPercentage?.toFixed(1)}% used
                          </p>
                          <p className="text-xs text-gray-500">
                            Reorder {Math.max(item.minimumStock, (item.beginningInventory || 0) - item.quantity)} units
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-blue-900">How Inventory Gap Tracking Works</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 font-medium">
              <div className="space-y-2">
                <p>• <strong>Beginning Inventory:</strong> Set when item is first added or reset</p>
                <p>• <strong>Gap Calculation:</strong> (Beginning - Current) / Beginning × 100</p>
                <p>• <strong>Auto-tracking:</strong> Updates every time quantities change</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Reset Options:</strong> Individual items or all at once</p>
                <p>• <strong>Value Tracking:</strong> Shows monetary impact of usage</p>
                <p>• <strong>Trend Analysis:</strong> Identifies fast vs slow moving items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}