import React, { useState } from 'react';
import { Zap, Plus, Settings, AlertTriangle, CheckCircle, Clock, Package, Truck } from 'lucide-react';
import { AutoReorderRule } from '../types/integrations';
import { InventoryItem } from '../types/inventory';

interface AutoReorderSystemProps {
  rules: AutoReorderRule[];
  inventoryItems: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onCreateRule: (itemId: string, supplierId: string, triggerLevel: number, reorderQuantity: number) => void;
  onUpdateRule: (ruleId: string, updates: Partial<AutoReorderRule>) => void;
  onDeleteRule: (ruleId: string) => void;
  triggeredRules: AutoReorderRule[];
}

export function AutoReorderSystem({
  rules,
  inventoryItems,
  isOpen,
  onClose,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  triggeredRules
}: AutoReorderSystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    itemId: '',
    supplierId: '',
    triggerLevel: 10,
    reorderQuantity: 50
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.itemId && newRule.supplierId) {
      onCreateRule(newRule.itemId, newRule.supplierId, newRule.triggerLevel, newRule.reorderQuantity);
      setNewRule({ itemId: '', supplierId: '', triggerLevel: 10, reorderQuantity: 50 });
      setShowAddForm(false);
    }
  };

  const suppliers = Array.from(new Set(inventoryItems.map(item => item.supplier).filter(Boolean)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl shadow-soft">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Auto-Reorder System</h2>
              <p className="text-sm text-gray-600 font-medium">Automated inventory replenishment rules</p>
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
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Active Rules</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{rules.filter(r => r.isActive).length}</p>
              <p className="text-sm text-blue-600">Monitoring inventory</p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800">Triggered</span>
              </div>
              <p className="text-3xl font-bold text-red-700">{triggeredRules.length}</p>
              <p className="text-sm text-red-600">Need reordering</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Orders Placed</span>
              </div>
              <p className="text-3xl font-bold text-green-700">47</p>
              <p className="text-sm text-green-600">This month</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Cost Savings</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">$3,247</p>
              <p className="text-sm text-purple-600">Optimized ordering</p>
            </div>
          </div>

          {/* Triggered Rules Alert */}
          {triggeredRules.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-red-800">Reorder Alerts ({triggeredRules.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triggeredRules.map(rule => {
                  const item = inventoryItems.find(i => i.id === rule.itemId);
                  return (
                    <div key={rule.id} className="bg-white rounded-xl p-4 shadow-soft">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{item?.name}</p>
                          <p className="text-sm text-gray-600">Current: {item?.quantity} • Trigger: {rule.triggerLevel}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-bold">Order {rule.reorderQuantity}</p>
                          <p className="text-xs text-gray-500">From {item?.supplier}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Rule Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Reorder Rules ({rules.length})</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'Cancel' : 'Add Rule'}
            </button>
          </div>

          {/* Add Rule Form */}
          {showAddForm && (
            <form onSubmit={handleCreateRule} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <h4 className="font-bold text-green-900 mb-4">Create Auto-Reorder Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Inventory Item</label>
                  <select
                    value={newRule.itemId}
                    onChange={(e) => setNewRule(prev => ({ ...prev, itemId: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    required
                  >
                    <option value="">Select item</option>
                    {inventoryItems.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Supplier</label>
                  <select
                    value={newRule.supplierId}
                    onChange={(e) => setNewRule(prev => ({ ...prev, supplierId: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    required
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Trigger Level</label>
                  <input
                    type="number"
                    min="0"
                    value={newRule.triggerLevel}
                    onChange={(e) => setNewRule(prev => ({ ...prev, triggerLevel: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    placeholder="10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reorder Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newRule.reorderQuantity}
                    onChange={(e) => setNewRule(prev => ({ ...prev, reorderQuantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 px-6 py-3 gradient-success text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Create Rule
              </button>
            </form>
          )}

          {/* Existing Rules */}
          <div className="space-y-4">
            {rules.map(rule => {
              const item = inventoryItems.find(i => i.id === rule.itemId);
              const isTriggered = triggeredRules.some(tr => tr.id === rule.id);
              
              return (
                <div key={rule.id} className={`rounded-2xl p-6 shadow-soft border-2 ${
                  isTriggered 
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                    : rule.isActive
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl shadow-soft ${
                        isTriggered 
                          ? 'bg-gradient-to-br from-red-100 to-pink-100' 
                          : rule.isActive
                          ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                          : 'bg-gradient-to-br from-gray-100 to-slate-100'
                      }`}>
                        <Package className={`w-5 h-5 ${
                          isTriggered ? 'text-red-600' : rule.isActive ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item?.name || 'Unknown Item'}</h4>
                        <p className="text-sm text-gray-600 font-semibold">
                          Trigger at {rule.triggerLevel} units • Reorder {rule.reorderQuantity} units
                        </p>
                        <p className="text-xs text-gray-500">
                          Supplier: {item?.supplier} • Current: {item?.quantity || 0} units
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isTriggered && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                          REORDER NOW
                        </div>
                      )}
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.isActive}
                          onChange={(e) => onUpdateRule(rule.id, { isActive: e.target.checked })}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">Active</span>
                      </label>

                      <button
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {rule.lastTriggered && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">
                          Last triggered: {format(rule.lastTriggered, 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-blue-900 mb-4">🤖 How Auto-Reorder Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800 font-medium">
              <div className="space-y-2">
                <p>• <strong>Trigger Level:</strong> When inventory drops to this amount</p>
                <p>• <strong>Reorder Quantity:</strong> How much to automatically order</p>
                <p>• <strong>POS Integration:</strong> Sales automatically reduce inventory</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Supplier Notification:</strong> Automatic purchase orders sent</p>
                <p>• <strong>Smart Timing:</strong> Considers delivery schedules</p>
                <p>• <strong>Cost Optimization:</strong> Bulk ordering discounts applied</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}