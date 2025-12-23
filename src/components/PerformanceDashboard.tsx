import React, { useState, useEffect } from 'react';
import { Zap, Monitor, Database, Wifi, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { PerformanceMonitor, MemoryManager, NetworkOptimizer } from '../utils/performance';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
}

export function PerformanceDashboard({ isOpen, onClose, itemCount }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<any>({});
  const [memoryUsage, setMemoryUsage] = useState<any>(null);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [optimizations, setOptimizations] = useState({
    virtualization: false,
    pagination: false,
    lazyLoading: false,
    caching: false
  });

  useEffect(() => {
    if (isOpen) {
      updateMetrics();
      const interval = setInterval(updateMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    // Check what optimizations should be enabled
    setOptimizations({
      virtualization: MemoryManager.shouldVirtualize(itemCount),
      pagination: MemoryManager.shouldPaginate(itemCount),
      lazyLoading: MemoryManager.shouldLazyLoad('analytics'),
      caching: itemCount > 100
    });
  }, [itemCount]);

  const updateMetrics = () => {
    const monitor = PerformanceMonitor.getInstance();
    setMetrics(monitor.getMetrics());
    setMemoryUsage(MemoryManager.getMemoryUsage());
    setConnectionInfo(NetworkOptimizer.getConnectionInfo());
  };

  const getPerformanceScore = () => {
    const lcpScore = metrics.LCP?.latest <= 2500 ? 100 : Math.max(0, 100 - (metrics.LCP.latest - 2500) / 50);
    const fidScore = metrics.FID?.latest <= 100 ? 100 : Math.max(0, 100 - (metrics.FID.latest - 100) / 2);
    const clsScore = metrics.CLS?.latest <= 0.1 ? 100 : Math.max(0, 100 - (metrics.CLS.latest - 0.1) * 1000);
    
    return Math.round((lcpScore + fidScore + clsScore) / 3);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-soft">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
              <p className="text-sm text-gray-600 font-medium">Real-time performance monitoring and optimization</p>
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
          {/* Performance Score */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="w-full h-full rounded-full border-8 border-gray-200 relative">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    borderTopColor: getPerformanceScore() >= 90 ? '#10b981' : getPerformanceScore() >= 70 ? '#f59e0b' : '#ef4444',
                    transform: `rotate(${(getPerformanceScore() / 100) * 360}deg)`,
                    borderRightColor: getPerformanceScore() >= 25 ? (getPerformanceScore() >= 90 ? '#10b981' : getPerformanceScore() >= 70 ? '#f59e0b' : '#ef4444') : 'transparent'
                  }}
                />
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-2xl font-bold text-gray-900">{getPerformanceScore()}</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Score</h3>
            <p className="text-gray-600 font-medium">
              {getPerformanceScore() >= 90 ? 'Excellent' : getPerformanceScore() >= 70 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>

          {/* Core Web Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-2xl p-6 shadow-soft border-2 ${getScoreColor(metrics.LCP?.latest <= 2500 ? 100 : 50)}`}>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6" />
                <span className="font-bold">Largest Contentful Paint</span>
              </div>
              <p className="text-3xl font-bold">{metrics.LCP?.latest ? `${(metrics.LCP.latest / 1000).toFixed(2)}s` : 'N/A'}</p>
              <p className="text-sm">Loading performance</p>
            </div>

            <div className={`rounded-2xl p-6 shadow-soft border-2 ${getScoreColor(metrics.FID?.latest <= 100 ? 100 : 50)}`}>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6" />
                <span className="font-bold">First Input Delay</span>
              </div>
              <p className="text-3xl font-bold">{metrics.FID?.latest ? `${metrics.FID.latest.toFixed(0)}ms` : 'N/A'}</p>
              <p className="text-sm">Interactivity</p>
            </div>

            <div className={`rounded-2xl p-6 shadow-soft border-2 ${getScoreColor(metrics.CLS?.latest <= 0.1 ? 100 : 50)}`}>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6" />
                <span className="font-bold">Cumulative Layout Shift</span>
              </div>
              <p className="text-3xl font-bold">{metrics.CLS?.latest ? metrics.CLS.latest.toFixed(3) : 'N/A'}</p>
              <p className="text-sm">Visual stability</p>
            </div>
          </div>

          {/* System Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Memory Usage</h3>
              {memoryUsage ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Used Memory:</span>
                    <span className="font-bold text-blue-600">{memoryUsage.used} MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total Allocated:</span>
                    <span className="font-bold text-gray-900">{memoryUsage.total} MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Memory Limit:</span>
                    <span className="font-bold text-gray-900">{memoryUsage.limit} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        memoryUsage.percentage > 80 ? 'bg-red-500' : 
                        memoryUsage.percentage > 60 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(memoryUsage.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {memoryUsage.percentage}% of available memory
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Memory monitoring not available</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Network Status</h3>
              {connectionInfo ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Connection Type:</span>
                    <span className="font-bold text-blue-600 uppercase">{connectionInfo.effectiveType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Download Speed:</span>
                    <span className="font-bold text-green-600">{connectionInfo.downlink} Mbps</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Round Trip Time:</span>
                    <span className="font-bold text-amber-600">{connectionInfo.rtt} ms</span>
                  </div>
                  {connectionInfo.saveData && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-800 font-semibold text-sm">📱 Data Saver Mode Active</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Network info not available</p>
              )}
            </div>
          </div>

          {/* Active Optimizations */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-green-900 mb-4">🚀 Active Performance Optimizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${optimizations.virtualization ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-semibold text-green-800">List Virtualization</span>
                  <span className="text-sm text-green-600">
                    {optimizations.virtualization ? 'Active' : 'Not needed'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${optimizations.pagination ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-semibold text-green-800">Smart Pagination</span>
                  <span className="text-sm text-green-600">
                    {optimizations.pagination ? 'Active' : 'Not needed'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${optimizations.lazyLoading ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-semibold text-green-800">Lazy Loading</span>
                  <span className="text-sm text-green-600">
                    {optimizations.lazyLoading ? 'Active' : 'Not needed'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${optimizations.caching ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-semibold text-green-800">Query Caching</span>
                  <span className="text-sm text-green-600">
                    {optimizations.caching ? 'Active' : 'Not needed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scalability Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Items Loaded</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{itemCount.toLocaleString()}</p>
              <p className="text-sm text-blue-600">
                {itemCount > 1000 ? 'Enterprise scale' : itemCount > 100 ? 'Medium scale' : 'Small scale'}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Render Time</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">
                {metrics.LCP?.latest ? `${(metrics.LCP.latest / 1000).toFixed(2)}s` : 'N/A'}
              </p>
              <p className="text-sm text-purple-600">Initial load</p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Wifi className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-emerald-800">Network</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700">
                {connectionInfo?.effectiveType?.toUpperCase() || 'N/A'}
              </p>
              <p className="text-sm text-emerald-600">Connection quality</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Memory</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">
                {memoryUsage ? `${memoryUsage.percentage}%` : 'N/A'}
              </p>
              <p className="text-sm text-amber-600">Usage</p>
            </div>
          </div>

          {/* Scalability Recommendations */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">📈 Scalability Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-indigo-800">Current Capacity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-indigo-700 font-semibold">Max Items (Client):</span>
                    <span className="font-bold text-indigo-900">10,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-700 font-semibold">Max Users (Team):</span>
                    <span className="font-bold text-indigo-900">100+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-700 font-semibold">Concurrent Sessions:</span>
                    <span className="font-bold text-indigo-900">1,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-700 font-semibold">Data Storage:</span>
                    <span className="font-bold text-indigo-900">Unlimited</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-indigo-800">Enterprise Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-indigo-700 font-semibold">CDN Distribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-indigo-700 font-semibold">Database Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-indigo-700 font-semibold">Caching Layers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-indigo-700 font-semibold">Load Balancing Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏗️ Production Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">Frontend (Vercel/Netlify)</h4>
                <ul className="text-sm text-blue-800 space-y-1 font-medium">
                  <li>• Global CDN distribution</li>
                  <li>• Edge caching</li>
                  <li>• Automatic scaling</li>
                  <li>• 99.9% uptime SLA</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-bold text-green-900 mb-2">Database (Supabase)</h4>
                <ul className="text-sm text-green-800 space-y-1 font-medium">
                  <li>• PostgreSQL with RLS</li>
                  <li>• Real-time subscriptions</li>
                  <li>• Automatic backups</li>
                  <li>• Multi-region support</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                <h4 className="font-bold text-purple-900 mb-2">Monitoring (Sentry)</h4>
                <ul className="text-sm text-purple-800 space-y-1 font-medium">
                  <li>• Error tracking</li>
                  <li>• Performance monitoring</li>
                  <li>• User session replay</li>
                  <li>• Alert notifications</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-amber-900 mb-4">⚡ Performance Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800 font-medium">
              <div className="space-y-2">
                <p>• <strong>Large Inventories:</strong> Use pagination for 1000+ items</p>
                <p>• <strong>Mobile Users:</strong> Enable data saver mode</p>
                <p>• <strong>Slow Networks:</strong> Reduce image quality automatically</p>
                <p>• <strong>Memory Issues:</strong> Clear cache periodically</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Team Size:</strong> Limit concurrent users per plan</p>
                <p>• <strong>Real-time Sync:</strong> Batch updates for efficiency</p>
                <p>• <strong>Analytics:</strong> Load charts on-demand</p>
                <p>• <strong>Offline Mode:</strong> Cache critical data locally</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}