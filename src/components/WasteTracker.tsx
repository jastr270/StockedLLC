import React, { useState } from 'react';
import { Trash2, TrendingDown, DollarSign, Calendar, AlertTriangle, Target, Leaf, BarChart3 } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { format, subDays } from 'date-fns';

interface WasteTrackerProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface WasteEntry {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  quantityWasted: number;
  unit: string;
  reason: 'expired' | 'spoiled' | 'damaged' | 'overproduction' | 'contaminated' | 'other';
  costImpact: number;
  wasteDate: Date;
  reportedBy: string;
  preventable: boolean;
  notes: string;
}

export function WasteTracker({ items, isOpen, onClose }: WasteTrackerProps) {
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([
    {
      id: '1',
      itemId: '3',
      itemName: 'Atlantic Salmon Fillet',
      category: 'Seafood',
      quantityWasted: 2,
      unit: 'lbs',
      reason: 'expired',
      costImpact: 17.90,
      wasteDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reportedBy: 'Kitchen Manager',
      preventable: true,
      notes: 'Forgot to use before expiration date'
    },
    {
      id: '2',
      itemId: '5',
      itemName: 'Chicken Breast (Boneless)',
      category: 'Proteins',
      quantityWasted: 1.5,
      unit: 'lbs',
      reason: 'overproduction',
      costImpact: 7.28,
      wasteDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      reportedBy: 'Head Chef',
      preventable: true,
      notes: 'Prepared too much for slow night'
    }
  ]);

  const [newWasteEntry, setNewWasteEntry] = useState({
    itemId: '',
    quantityWasted: 0,
    reason: 'expired' as const,
    notes: '',
    reportedBy: 'Kitchen Manager'
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const handleAddWasteEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.id === newWasteEntry.itemId);
    if (!item) return;

    const wasteEntry: WasteEntry = {
      id: crypto.randomUUID(),
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      quantityWasted: newWasteEntry.quantityWasted,
      unit: item.unit,
      reason: newWasteEntry.reason,
      costImpact: newWasteEntry.quantityWasted * item.costPerUnit,
      wasteDate: new Date(),
      reportedBy: newWasteEntry.reportedBy,
      preventable: ['expired', 'spoiled', 'overproduction'].includes(newWasteEntry.reason),
      notes: newWasteEntry.notes
    };

    setWasteEntries(prev => [...prev, wasteEntry]);
    setNewWasteEntry({
      itemId: '',
      quantityWasted: 0,
      reason: 'expired',
      notes: '',
      reportedBy: 'Kitchen Manager'
    });
    setShowAddForm(false);
  };

  // Calculate waste statistics
  const totalWasteCost = wasteEntries.reduce((sum, entry) => sum + entry.costImpact, 0);
  const preventableWaste = wasteEntries.filter(entry => entry.preventable);
  const preventableWasteCost = preventableWaste.reduce((sum, entry) => sum + entry.costImpact, 0);
  
  const wasteByCategory = wasteEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.costImpact;
    return acc;
  }, {} as Record<string, number>);

  const wasteByReason = wasteEntries.reduce((acc, entry) => {
    acc[entry.reason] = (acc[entry.reason] || 0) + entry.costImpact;
    return acc;
  }, {} as Record<string, number>);

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'spoiled': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'damaged': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overproduction': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contaminated': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-soft">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Food Waste Tracker</h2>
              <p className="text-sm text-gray-600 font-medium">Monitor and reduce food waste with AI insights</p>
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
          {/* Waste Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800">Total Waste Cost</span>
              </div>
              <p className="text-3xl font-bold text-red-700">${totalWasteCost.toFixed(2)}</p>
              <p className="text-sm text-red-600">This period</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Preventable Waste</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">${preventableWasteCost.toFixed(2)}</p>
              <p className="text-sm text-amber-600">{Math.round((preventableWasteCost / totalWasteCost) * 100)}% of total</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Waste Rate</span>
              </div>
              <p className="text-3xl font-bold text-green-700">
                {((wasteEntries.length / items.length) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-green-600">Industry avg: 4-10%</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Monthly Savings</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">
                ${Math.round(preventableWasteCost * 4.33).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">Potential if eliminated</p>
            </div>
          </div>

          {/* Add Waste Entry */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-red-900">Report Food Waste</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
              >
                {showAddForm ? 'Cancel' : 'Report Waste'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddWasteEntry} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={newWasteEntry.itemId}
                  onChange={(e) => setNewWasteEntry(prev => ({ ...prev, itemId: e.target.value }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                  required
                >
                  <option value="">Select item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Quantity wasted"
                  value={newWasteEntry.quantityWasted}
                  onChange={(e) => setNewWasteEntry(prev => ({ ...prev, quantityWasted: parseFloat(e.target.value) || 0 }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                  required
                />

                <select
                  value={newWasteEntry.reason}
                  onChange={(e) => setNewWasteEntry(prev => ({ ...prev, reason: e.target.value as any }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                >
                  <option value="expired">Expired</option>
                  <option value="spoiled">Spoiled</option>
                  <option value="damaged">Damaged</option>
                  <option value="overproduction">Overproduction</option>
                  <option value="contaminated">Contaminated</option>
                  <option value="other">Other</option>
                </select>

                <button
                  type="submit"
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                >
                  Report Waste
                </button>

                <textarea
                  placeholder="Notes (optional)"
                  value={newWasteEntry.notes}
                  onChange={(e) => setNewWasteEntry(prev => ({ ...prev, notes: e.target.value }))}
                  className="md:col-span-2 lg:col-span-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft resize-none"
                  rows={2}
                />
              </form>
            )}
          </div>

          {/* Waste Entries */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Recent Waste Entries</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Item</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Quantity</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Reason</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Cost Impact</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Preventable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {wasteEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{entry.itemName}</p>
                          <p className="text-sm text-gray-600">{entry.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-red-600">{entry.quantityWasted} {entry.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getReasonColor(entry.reason)}`}>
                          {entry.reason.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-red-600">${entry.costImpact.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {format(entry.wasteDate, 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entry.preventable ? (
                          <span className="text-amber-600 font-bold">⚠️ Yes</span>
                        ) : (
                          <span className="text-green-600 font-bold">✓ No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Waste Reduction Recommendations */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
            <h4 className="text-lg font-bold text-emerald-900 mb-4">🎯 AI Waste Reduction Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">FIFO Implementation</h5>
                  <p className="text-sm text-gray-700">Use oldest items first. Could prevent 80% of expiration waste.</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">Potential savings: $47/month</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">Portion Control</h5>
                  <p className="text-sm text-gray-700">Standardize prep quantities based on historical demand.</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">Potential savings: $23/month</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">Smart Ordering</h5>
                  <p className="text-sm text-gray-700">Order smaller quantities more frequently for perishables.</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">Potential savings: $31/month</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-semibold text-gray-900 mb-2">Staff Training</h5>
                  <p className="text-sm text-gray-700">Train team on proper storage and rotation techniques.</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">Potential savings: $19/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}