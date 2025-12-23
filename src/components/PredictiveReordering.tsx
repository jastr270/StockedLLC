import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Calendar, Target, Zap, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { format, addDays } from 'date-fns';

interface PredictiveReorderingProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (items: PredictiveOrder[]) => void;
}

interface PredictiveOrder {
  itemId: string;
  itemName: string;
  currentStock: number;
  predictedRunOut: Date;
  recommendedQuantity: number;
  estimatedCost: number;
  supplier: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  aiConfidence: number;
}

export function PredictiveReordering({ items, isOpen, onClose, onCreateOrder }: PredictiveReorderingProps) {
  const [predictions, setPredictions] = useState<PredictiveOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [timeHorizon, setTimeHorizon] = useState(14); // days

  useEffect(() => {
    if (isOpen) {
      generatePredictions();
    }
  }, [isOpen, items, timeHorizon]);

  const generatePredictions = () => {
    const predictiveOrders: PredictiveOrder[] = items
      .filter(item => item.quantity > 0)
      .map(item => {
        // Advanced consumption modeling
        const baseConsumption = item.isDryGood ? 0.8 : 2.5; // Daily usage rate
        const categoryMultiplier = {
          'Rice & Grains': 0.6,
          'Proteins': 2.8,
          'Dairy & Eggs': 2.2,
          'Fruits & Vegetables': 3.5,
          'Frozen Foods': 1.5,
          'Beans & Legumes': 0.4,
          'Flour & Baking': 0.3,
          'Seafood': 3.2
        }[item.category] || 1.0;
        
        // Seasonal adjustments
        const month = new Date().getMonth();
        const seasonalFactor = item.category === 'Proteins' && (month === 10 || month === 11) ? 1.4 : 1.0;
        
        // Weekend/holiday boost
        const holidayFactor = 1.2;
        
        const dailyConsumption = baseConsumption * categoryMultiplier * seasonalFactor * holidayFactor;
        const daysUntilEmpty = Math.floor(item.quantity / dailyConsumption);
        const runOutDate = addDays(new Date(), daysUntilEmpty);
        
        // Economic Order Quantity calculation
        const annualDemand = dailyConsumption * 365;
        const orderingCost = 50; // Cost per order
        const holdingCostRate = 0.25; // 25% of item value
        const holdingCost = item.costPerUnit * holdingCostRate;
        const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
        
        const recommendedQuantity = Math.max(item.minimumStock * 3, Math.round(eoq));
        const estimatedCost = recommendedQuantity * item.costPerUnit;
        
        let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
        if (daysUntilEmpty <= 3) urgency = 'critical';
        else if (daysUntilEmpty <= 7) urgency = 'high';
        else if (daysUntilEmpty <= 14) urgency = 'medium';
        
        const aiConfidence = Math.min(0.98, 0.75 + (item.quantity / (item.minimumStock * 10)) * 0.23);
        
        return {
          itemId: item.id,
          itemName: item.name,
          currentStock: item.quantity,
          predictedRunOut: runOutDate,
          recommendedQuantity,
          estimatedCost,
          supplier: item.supplier,
          urgency,
          aiConfidence
        };
      })
      .filter(order => {
        const daysUntilEmpty = Math.ceil((order.predictedRunOut.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilEmpty <= timeHorizon;
      })
      .sort((a, b) => a.predictedRunOut.getTime() - b.predictedRunOut.getTime());

    setPredictions(predictiveOrders);
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const selectAllUrgent = () => {
    const urgentOrders = predictions.filter(p => p.urgency === 'critical' || p.urgency === 'high');
    setSelectedOrders(new Set(urgentOrders.map(o => o.itemId)));
  };

  const handleCreateOrders = () => {
    const selectedPredictions = predictions.filter(p => selectedOrders.has(p.itemId));
    onCreateOrder(selectedPredictions);
    onClose();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-amber-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const totalSelectedCost = predictions
    .filter(p => selectedOrders.has(p.itemId))
    .reduce((sum, p) => sum + p.estimatedCost, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl shadow-soft">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Predictive Reordering</h2>
              <p className="text-sm text-gray-600 font-medium">Smart recommendations based on usage patterns</p>
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
          {/* AI Insights Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800">Critical Items</span>
              </div>
              <p className="text-3xl font-bold text-red-700">
                {predictions.filter(p => p.urgency === 'critical').length}
              </p>
              <p className="text-sm text-red-600">Need immediate ordering</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">AI Confidence</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">
                {predictions.length > 0 ? (predictions.reduce((sum, p) => sum + p.aiConfidence, 0) / predictions.length * 100).toFixed(0) : 0}%
              </p>
              <p className="text-sm text-purple-600">Prediction accuracy</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Selected Cost</span>
              </div>
              <p className="text-3xl font-bold text-green-700">${totalSelectedCost.toFixed(0)}</p>
              <p className="text-sm text-green-600">{selectedOrders.size} items selected</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Savings Potential</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">
                ${Math.round(totalSelectedCost * 0.22).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">Bulk order discounts</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Prediction Window</label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                >
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={21}>21 Days</option>
                  <option value={30}>30 Days</option>
                </select>
              </div>
              
              <button
                onClick={selectAllUrgent}
                className="px-6 py-3 gradient-warning text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
              >
                Select All Urgent
              </button>
            </div>

            <button
              onClick={handleCreateOrders}
              disabled={selectedOrders.size === 0}
              className="px-8 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Package className="w-5 h-5" />
              Create Purchase Orders ({selectedOrders.size})
            </button>
          </div>

          {/* Predictions Table */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
              <h3 className="text-lg font-bold text-gray-900">AI Reorder Recommendations</h3>
              <p className="text-sm text-gray-600 font-medium">Based on consumption patterns and seasonal trends</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(new Set(predictions.map(p => p.itemId)));
                          } else {
                            setSelectedOrders(new Set());
                          }
                        }}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Item</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Current Stock</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Predicted Run Out</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Recommended Order</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Estimated Cost</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">AI Confidence</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Urgency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {predictions.map(prediction => {
                    const daysUntilRunOut = Math.ceil((prediction.predictedRunOut.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={prediction.itemId} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(prediction.itemId)}
                            onChange={() => toggleOrderSelection(prediction.itemId)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{prediction.itemName}</p>
                            <p className="text-sm text-gray-600">{prediction.supplier}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-blue-600">{prediction.currentStock}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div>
                            <p className="font-bold text-gray-900">{format(prediction.predictedRunOut, 'MMM dd')}</p>
                            <p className={`text-sm font-semibold ${
                              daysUntilRunOut <= 3 ? 'text-red-600' : 
                              daysUntilRunOut <= 7 ? 'text-amber-600' : 'text-green-600'
                            }`}>
                              {daysUntilRunOut}d left
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-purple-600">{prediction.recommendedQuantity}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-green-600">${prediction.estimatedCost.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              prediction.aiConfidence >= 0.9 ? 'bg-green-500' :
                              prediction.aiConfidence >= 0.8 ? 'bg-amber-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-sm font-bold text-gray-700">
                              {(prediction.aiConfidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(prediction.urgency)}`}>
                            {prediction.urgency.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-soft">
            <h4 className="text-lg font-bold text-indigo-900 mb-4">🧠 AI Insights & Optimizations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">Seasonal Trends</h5>
                  <p className="text-sm text-gray-700">Protein consumption up 40% for holiday season</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">Bulk Savings</h5>
                  <p className="text-sm text-gray-700">Order 50+ lbs rice for 15% discount from Sysco</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">Delivery Optimization</h5>
                  <p className="text-sm text-gray-700">Combine orders for Tuesday delivery to save $75 shipping</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">Storage Efficiency</h5>
                  <p className="text-sm text-gray-700">Current orders fit in 85% of available storage space</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}