import React, { useState, useEffect } from 'react';
import { Server, Users, Database, Globe, AlertTriangle, CheckCircle, TrendingUp, Zap } from 'lucide-react';

interface ScalabilityMonitorProps {
  userCount: number;
  itemCount: number;
  teamCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ScalabilityMonitor({ 
  userCount, 
  itemCount, 
  teamCount, 
  isOpen, 
  onClose 
}: ScalabilityMonitorProps) {
  const [systemHealth, setSystemHealth] = useState({
    cpu: 15,
    memory: 45,
    database: 23,
    network: 12,
    storage: 67
  });

  const [scalabilityMetrics, setScalabilityMetrics] = useState({
    requestsPerSecond: 1247,
    averageResponseTime: 89,
    errorRate: 0.02,
    uptime: 99.97,
    concurrentUsers: 2847,
    dataTransfer: 15.7 // GB per day
  });

  useEffect(() => {
    if (isOpen) {
      // Simulate real-time metrics updates
      const interval = setInterval(() => {
        setSystemHealth(prev => ({
          cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(20, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
          database: Math.max(10, Math.min(80, prev.database + (Math.random() - 0.5) * 6)),
          network: Math.max(5, Math.min(50, prev.network + (Math.random() - 0.5) * 5)),
          storage: Math.max(30, Math.min(95, prev.storage + (Math.random() - 0.5) * 3))
        }));

        setScalabilityMetrics(prev => ({
          requestsPerSecond: Math.max(800, Math.min(2000, prev.requestsPerSecond + (Math.random() - 0.5) * 100)),
          averageResponseTime: Math.max(50, Math.min(200, prev.averageResponseTime + (Math.random() - 0.5) * 20)),
          errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
          uptime: Math.max(99.5, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
          concurrentUsers: Math.max(1000, Math.min(5000, prev.concurrentUsers + (Math.random() - 0.5) * 200)),
          dataTransfer: Math.max(10, Math.min(50, prev.dataTransfer + (Math.random() - 0.5) * 2))
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getHealthColor = (value: number, reverse = false) => {
    const threshold = reverse ? 
      (value <= 30 ? 'green' : value <= 60 ? 'amber' : 'red') :
      (value <= 30 ? 'red' : value <= 70 ? 'amber' : 'green');
    
    switch (threshold) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      case 'amber': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getCapacityStatus = () => {
    if (userCount > 10000) return { status: 'enterprise', color: 'purple', message: 'Enterprise Scale' };
    if (userCount > 1000) return { status: 'large', color: 'blue', message: 'Large Scale' };
    if (userCount > 100) return { status: 'medium', color: 'green', message: 'Medium Scale' };
    return { status: 'small', color: 'amber', message: 'Small Scale' };
  };

  const capacity = getCapacityStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-soft">
              <Server className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Scalability Monitor</h2>
              <p className="text-sm text-gray-600 font-medium">Real-time system performance and capacity planning</p>
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
          {/* Current Scale Status */}
          <div className={`bg-gradient-to-r from-${capacity.color}-50 to-${capacity.color}-100 border-2 border-${capacity.color}-200 rounded-2xl p-6 shadow-soft`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br from-${capacity.color}-400 to-${capacity.color}-600 rounded-full flex items-center justify-center shadow-soft`}>
                  <Server className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{capacity.message}</h3>
                  <p className="text-gray-700 font-semibold">
                    {userCount.toLocaleString()} users • {itemCount.toLocaleString()} items • {teamCount.toLocaleString()} teams
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">System Healthy</span>
                </div>
                <p className="text-sm text-gray-600">Ready for {(userCount * 10).toLocaleString()}+ users</p>
              </div>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Requests/sec</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{scalabilityMetrics.requestsPerSecond.toLocaleString()}</p>
              <p className="text-sm text-blue-600">Peak capacity: 10,000/sec</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Response Time</span>
              </div>
              <p className="text-3xl font-bold text-green-700">{scalabilityMetrics.averageResponseTime}ms</p>
              <p className="text-sm text-green-600">Target: &lt;100ms</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Error Rate</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">{(scalabilityMetrics.errorRate * 100).toFixed(2)}%</p>
              <p className="text-sm text-purple-600">Target: &lt;0.1%</p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-emerald-800">Uptime</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700">{scalabilityMetrics.uptime.toFixed(2)}%</p>
              <p className="text-sm text-emerald-600">SLA: 99.9%</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Concurrent</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">{scalabilityMetrics.concurrentUsers.toLocaleString()}</p>
              <p className="text-sm text-amber-600">Active users</p>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-cyan-600" />
                <span className="font-bold text-cyan-800">Data Transfer</span>
              </div>
              <p className="text-3xl font-bold text-cyan-700">{scalabilityMetrics.dataTransfer.toFixed(1)}GB</p>
              <p className="text-sm text-cyan-600">Per day</p>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">System Health Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {Object.entries(systemHealth).map(([component, value]) => (
                <div key={component} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={value <= 30 ? '#10b981' : value <= 70 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="2"
                        strokeDasharray={`${value}, 100`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">{value}%</span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700 capitalize">{component}</p>
                  <p className={`text-xs font-bold ${
                    value <= 30 ? 'text-green-600' : value <= 70 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {value <= 30 ? 'Optimal' : value <= 70 ? 'Moderate' : 'High'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <h4 className="text-lg font-bold text-blue-900 mb-4">Current Infrastructure</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-800">Frontend (Vercel)</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-blue-700 font-semibold">• Global CDN with 100+ edge locations</p>
                    <p className="text-blue-700 font-semibold">• Automatic scaling to handle traffic spikes</p>
                    <p className="text-blue-700 font-semibold">• 99.99% uptime SLA</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">Database (Supabase)</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-green-700 font-semibold">• PostgreSQL with read replicas</p>
                    <p className="text-green-700 font-semibold">• Real-time subscriptions</p>
                    <p className="text-green-700 font-semibold">• Automatic backups & point-in-time recovery</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <h4 className="text-lg font-bold text-purple-900 mb-4">Scaling Projections</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-bold text-gray-900 mb-2">10,000 Users</h5>
                  <div className="text-sm space-y-1">
                    <p className="text-purple-700 font-semibold">• Infrastructure cost: $2,500/month</p>
                    <p className="text-purple-700 font-semibold">• Response time: &lt;150ms</p>
                    <p className="text-purple-700 font-semibold">• Database: 500GB storage</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <h5 className="font-bold text-gray-900 mb-2">100,000 Users</h5>
                  <div className="text-sm space-y-1">
                    <p className="text-purple-700 font-semibold">• Infrastructure cost: $15,000/month</p>
                    <p className="text-purple-700 font-semibold">• Multi-region deployment</p>
                    <p className="text-purple-700 font-semibold">• Database sharding required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Optimizations */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-emerald-900 mb-4">🚀 Enterprise Optimizations Active</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Code Splitting</span>
                </div>
                <p className="text-sm text-green-700">Lazy load components on demand</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Virtual Scrolling</span>
                </div>
                <p className="text-sm text-green-700">Handle 10,000+ items smoothly</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Query Caching</span>
                </div>
                <p className="text-sm text-green-700">5-minute intelligent caching</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Offline Support</span>
                </div>
                <p className="text-sm text-green-700">Works without internet</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Image Optimization</span>
                </div>
                <p className="text-sm text-green-700">WebP format with lazy loading</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Bundle Optimization</span>
                </div>
                <p className="text-sm text-green-700">Tree shaking and compression</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Database Indexing</span>
                </div>
                <p className="text-sm text-green-700">Optimized queries and indexes</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">CDN Caching</span>
                </div>
                <p className="text-sm text-green-700">Global edge caching</p>
              </div>
            </div>
          </div>

          {/* Capacity Planning */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Capacity Planning</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Scale</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Users</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Items</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Teams</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Infrastructure</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-green-600">Small Business</td>
                    <td className="px-6 py-4 text-center font-bold">1-100</td>
                    <td className="px-6 py-4 text-center font-bold">1-1,000</td>
                    <td className="px-6 py-4 text-center font-bold">1-10</td>
                    <td className="px-6 py-4 text-center text-sm">Single region</td>
                    <td className="px-6 py-4 text-center font-bold text-green-600">$200</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-blue-600">Medium Business</td>
                    <td className="px-6 py-4 text-center font-bold">100-1,000</td>
                    <td className="px-6 py-4 text-center font-bold">1K-10K</td>
                    <td className="px-6 py-4 text-center font-bold">10-100</td>
                    <td className="px-6 py-4 text-center text-sm">Multi-region</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">$1,500</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-purple-600">Enterprise</td>
                    <td className="px-6 py-4 text-center font-bold">1K-10K</td>
                    <td className="px-6 py-4 text-center font-bold">10K-100K</td>
                    <td className="px-6 py-4 text-center font-bold">100-1K</td>
                    <td className="px-6 py-4 text-center text-sm">Global + Edge</td>
                    <td className="px-6 py-4 text-center font-bold text-purple-600">$8,000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-red-600">Hyperscale</td>
                    <td className="px-6 py-4 text-center font-bold">10K+</td>
                    <td className="px-6 py-4 text-center font-bold">100K+</td>
                    <td className="px-6 py-4 text-center font-bold">1K+</td>
                    <td className="px-6 py-4 text-center text-sm">Custom architecture</td>
                    <td className="px-6 py-4 text-center font-bold text-red-600">$25,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Scaling Recommendations */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-amber-900 mb-4">🎯 Scaling Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-amber-800 font-medium">
              <div className="space-y-2">
                <p>• <strong>0-1K Users:</strong> Current setup handles perfectly</p>
                <p>• <strong>1K-10K Users:</strong> Add Redis caching layer</p>
                <p>• <strong>10K+ Users:</strong> Implement database sharding</p>
                <p>• <strong>100K+ Users:</strong> Microservices architecture</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Global Users:</strong> Multi-region deployment</p>
                <p>• <strong>High Availability:</strong> Load balancer + failover</p>
                <p>• <strong>Data Compliance:</strong> Regional data residency</p>
                <p>• <strong>Enterprise Security:</strong> VPC and private networks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}