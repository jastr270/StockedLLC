import React from 'react';
import { AlertTriangle, Package, ShoppingCart, Clock } from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface LowStockAlertsProps {
  items: InventoryItem[];
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  const outOfStock = items.filter(item => item.quantity === 0);
  const lowStock = items.filter(item => item.quantity > 0 && item.quantity <= item.minimumStock);
  const expiringSoon = items.filter(item => {
    if (!item.expirationDate) return false;
    const today = new Date();
    const expDate = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  const totalAlerts = outOfStock.length + lowStock.length + expiringSoon.length;

  if (totalAlerts === 0) {
    return (
      <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-soft">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-white">Inventory Status</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">All Good!</h4>
          <p className="text-white/80 font-medium">No stock alerts or expiring items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-soft">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-white">Inventory Alerts</h3>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-soft">
          {totalAlerts}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Out of Stock */}
        {outOfStock.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-red-800">Out of Stock ({outOfStock.length})</h4>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {outOfStock.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-3 shadow-soft">
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.category} • {item.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock */}
        {lowStock.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-amber-800">Low Stock ({lowStock.length})</h4>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lowStock.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-3 shadow-soft">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-700 font-bold text-sm">{item.quantity}</p>
                      <p className="text-xs text-gray-500">Min: {item.minimumStock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expiring Soon */}
        {expiringSoon.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-orange-600" />
              <h4 className="font-bold text-orange-800">Expiring Soon ({expiringSoon.length})</h4>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {expiringSoon.map(item => {
                const daysLeft = Math.ceil((new Date(item.expirationDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={item.id} className="bg-white rounded-lg p-3 shadow-soft">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-700 font-bold text-sm">{daysLeft}d</p>
                        <p className="text-xs text-gray-500">{item.quantity} left</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}