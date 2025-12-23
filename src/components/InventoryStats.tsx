import React from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle, DollarSign, Calendar, Scale } from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface InventoryStatsProps {
  items: InventoryItem[];
}

export function InventoryStats({ items }: InventoryStatsProps) {
  const totalItems = items.length;
  const totalWeightLbs = items.reduce((sum, item) => sum + item.totalWeightLbs, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);
  const outOfStock = items.filter(item => item.quantity === 0).length;
  const lowStock = items.filter(item => item.quantity > 0 && item.quantity <= item.minimumStock).length;
  const inStock = items.filter(item => item.quantity > item.minimumStock).length;
  const totalCases = items.reduce((sum, item) => sum + (item.quantityInCases || 0), 0);
  
  // Calculate expiring items (within 7 days)
  const today = new Date();
  const expiringItems = items.filter(item => {
    if (!item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  }).length;

  const stats = [
    {
      label: 'Total Items',
      value: totalItems,
      icon: Package,
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      label: 'Total Weight',
      value: `${totalWeightLbs.toFixed(1)} lbs`,
      icon: Scale,
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      label: 'Total Cases',
      value: totalCases,
      icon: Package,
      gradient: 'from-indigo-400 to-indigo-600'
    },
    {
      label: 'Total Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-emerald-400 to-emerald-600'
    },
    {
      label: 'In Stock',
      value: inStock,
      icon: CheckCircle,
      gradient: 'from-green-400 to-green-600'
    },
    {
      label: 'Low Stock',
      value: lowStock,
      icon: AlertTriangle,
      gradient: 'from-amber-400 to-amber-600'
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      icon: XCircle,
      gradient: 'from-red-400 to-red-600'
    },
    {
      label: 'Expiring Soon',
      value: expiringItems,
      icon: Calendar,
      gradient: 'from-orange-400 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="glass-effect rounded-3xl shadow-elegant p-6 hover:shadow-glow transition-all duration-500 hover:scale-110 group border border-white/20 hover-lift">
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl mb-4 bg-gradient-to-br ${stat.gradient} group-hover:scale-125 transition-transform duration-500 shadow-soft`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-2 tracking-tight">{stat.value}</p>
              <p className="text-sm text-white/80 font-bold leading-tight">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}