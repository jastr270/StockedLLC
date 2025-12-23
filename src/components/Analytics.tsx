import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface AnalyticsProps {
  items: InventoryItem[];
}

export function Analytics({ items }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  // Category distribution data
  const categoryData = items.reduce((acc, item) => {
    const category = item.category;
    const existing = acc.find(c => c.name === category);
    if (existing) {
      existing.value += item.totalWeightLbs;
      existing.count += item.quantity;
    } else {
      acc.push({ 
        name: category, 
        value: item.totalWeightLbs, 
        count: item.quantity,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; count: number; color: string }>);

  // Value by category
  const valueData = items.reduce((acc, item) => {
    const category = item.category;
    const value = item.quantity * item.costPerUnit;
    const existing = acc.find(c => c.category === category);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ category, value });
    }
    return acc;
  }, [] as Array<{ category: string; value: number }>);

  // Stock level analysis
  const stockLevels = {
    outOfStock: items.filter(item => item.quantity === 0).length,
    lowStock: items.filter(item => item.quantity > 0 && item.quantity <= item.minimumStock).length,
    adequateStock: items.filter(item => item.quantity > item.minimumStock).length
  };

  const stockData = [
    { name: 'Out of Stock', value: stockLevels.outOfStock, color: '#ef4444' },
    { name: 'Low Stock', value: stockLevels.lowStock, color: '#f59e0b' },
    { name: 'Adequate Stock', value: stockLevels.adequateStock, color: '#10b981' }
  ];

  // Expiration tracking
  const today = new Date();
  const expirationData = items.filter(item => item.expirationDate).map(item => {
    const expDate = new Date(item.expirationDate!);
    const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      name: item.name,
      daysUntilExpiry,
      category: item.category,
      value: item.quantity * item.costPerUnit
    };
  }).filter(item => item.daysUntilExpiry <= 30).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-soft">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-white">Inventory Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-white/80" />
              <span className="text-white/80 font-semibold">Total Items</span>
            </div>
            <p className="text-3xl font-bold text-white">{items.length}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-white/80" />
              <span className="text-white/80 font-semibold">Total Value</span>
            </div>
            <p className="text-3xl font-bold text-white">
              ${items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-white/80" />
              <span className="text-white/80 font-semibold">Items Expiring</span>
            </div>
            <p className="text-3xl font-bold text-white">{expirationData.length}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Inventory by Category (Weight)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}lbs`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)} lbs`, 'Weight']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Levels */}
        <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Stock Level Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Value by Category */}
        <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Value by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: 'white', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: 'white', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expiration Timeline */}
        <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Items Expiring Soon</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {expirationData.length === 0 ? (
              <p className="text-white/60 text-center py-8">No items expiring in the next 30 days</p>
            ) : (
              expirationData.map((item, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  item.daysUntilExpiry <= 0 
                    ? 'bg-red-500/20 border-red-400/30' 
                    : item.daysUntilExpiry <= 3
                    ? 'bg-amber-500/20 border-amber-400/30'
                    : 'bg-yellow-500/20 border-yellow-400/30'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-white/70">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        item.daysUntilExpiry <= 0 ? 'text-red-300' : 
                        item.daysUntilExpiry <= 3 ? 'text-amber-300' : 'text-yellow-300'
                      }`}>
                        {item.daysUntilExpiry <= 0 ? 'EXPIRED' : `${item.daysUntilExpiry}d`}
                      </p>
                      <p className="text-sm text-white/70">${item.value.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}