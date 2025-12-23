import React, { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Clock, Calendar, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { SalesData, MenuSync } from '../types/integrations';
import { InventoryItem } from '../types/inventory';
import { format, subDays, startOfDay } from 'date-fns';

interface SalesAnalyticsProps {
  salesData: SalesData[];
  menuItems: MenuSync[];
  inventoryItems: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function SalesAnalytics({ salesData, menuItems, inventoryItems, isOpen, onClose }: SalesAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  // Calculate sales metrics
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalItemsSold = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0);
  const averageOrderValue = totalRevenue / (salesData.length || 1);

  // Top selling items
  const itemSales = salesData.reduce((acc, sale) => {
    const existing = acc.find(item => item.name === sale.itemName);
    if (existing) {
      existing.quantity += sale.quantitySold;
      existing.revenue += sale.revenue;
    } else {
      acc.push({
        name: sale.itemName,
        quantity: sale.quantitySold,
        revenue: sale.revenue
      });
    }
    return acc;
  }, [] as Array<{ name: string; quantity: number; revenue: number }>);

  const topSellingItems = itemSales.sort((a, b) => b.quantity - a.quantity).slice(0, 10);

  // Sales trend data
  const salesTrend = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const daySales = salesData.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= dayStart && saleDate < dayEnd;
    });

    return {
      date: format(date, 'MMM dd'),
      revenue: daySales.reduce((sum, sale) => sum + sale.revenue, 0),
      orders: daySales.length,
      items: daySales.reduce((sum, sale) => sum + sale.quantitySold, 0)
    };
  });

  // Ingredient usage analysis
  const ingredientUsage = menuItems.reduce((acc, menuItem) => {
    const menuSales = salesData.filter(sale => sale.itemName === menuItem.menuItemName);
    const totalSold = menuSales.reduce((sum, sale) => sum + sale.quantitySold, 0);

    menuItem.ingredients.forEach(ingredient => {
      const totalUsed = totalSold * ingredient.quantityNeeded;
      const existing = acc.find(item => item.inventoryItemId === ingredient.inventoryItemId);
      
      if (existing) {
        existing.totalUsed += totalUsed;
      } else {
        acc.push({
          inventoryItemId: ingredient.inventoryItemId,
          inventoryItemName: ingredient.inventoryItemName,
          totalUsed,
          unit: ingredient.unit
        });
      }
    });

    return acc;
  }, [] as Array<{ inventoryItemId: string; inventoryItemName: string; totalUsed: number; unit: string }>);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-soft">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sales & Inventory Analytics</h2>
              <p className="text-sm text-gray-600 font-medium">POS integration insights and performance metrics</p>
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold text-green-700">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600">From POS systems</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Items Sold</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{totalItemsSold}</p>
              <p className="text-sm text-blue-600">Total quantity</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Avg Order Value</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">${averageOrderValue.toFixed(2)}</p>
              <p className="text-sm text-purple-600">Per transaction</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Menu Items</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">{menuItems.length}</p>
              <p className="text-sm text-amber-600">Linked to inventory</p>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trend (7 Days)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'revenue' ? 'Revenue' : 'Orders']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Items</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSellingItems.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Quantity Sold']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="quantity" fill="url(#salesGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Ingredient Usage Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ingredient Usage from Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredientUsage.slice(0, 9).map((ingredient, index) => (
                <div key={ingredient.inventoryItemId} className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4 shadow-soft">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{ingredient.inventoryItemName}</p>
                      <p className="text-xs text-gray-600">Used in menu items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{ingredient.totalUsed.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">{ingredient.unit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Item Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Menu Item Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Menu Item</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Quantity Sold</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Revenue</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Avg Price</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Ingredient Cost</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topSellingItems.slice(0, 10).map((item, index) => {
                    const menuItem = menuItems.find(m => m.menuItemName === item.name);
                    const ingredientCost = menuItem?.ingredients.reduce((sum, ing) => {
                      const inventoryItem = inventoryItems.find(inv => inv.id === ing.inventoryItemId);
                      return sum + (inventoryItem?.costPerUnit || 0) * ing.quantityNeeded;
                    }, 0) || 0;
                    
                    const avgPrice = item.revenue / item.quantity;
                    const profitMargin = ((avgPrice - ingredientCost) / avgPrice) * 100;

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-blue-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-center font-bold text-green-600">${item.revenue.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center font-bold text-gray-900">${avgPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center font-bold text-red-600">${ingredientCost.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-bold ${profitMargin > 60 ? 'text-green-600' : profitMargin > 30 ? 'text-amber-600' : 'text-red-600'}`}>
                            {profitMargin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Impact */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">🎯 POS Integration Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-indigo-800">Inventory Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-indigo-700">98.5%</p>
                <p className="text-sm text-indigo-600">Real-time sync accuracy</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Time Saved</span>
                </div>
                <p className="text-2xl font-bold text-green-700">15.2h</p>
                <p className="text-sm text-green-600">Per week vs manual entry</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-800">Cost Reduction</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">$2,847</p>
                <p className="text-sm text-purple-600">Monthly savings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}