import React, { useState } from 'react';
import { Wifi, Settings, Zap, DollarSign, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { POSIntegration, POS_PROVIDERS } from '../types/integrations';
import { format } from 'date-fns';

interface POSIntegrationsProps {
  integrations: POSIntegration[];
  isOpen: boolean;
  onClose: () => void;
  onConnect: (posType: string, apiKey: string, webhookUrl?: string) => Promise<boolean>;
  onDisconnect: (integrationId: string) => void;
  onSync: (integrationId: string) => Promise<void>;
  onUpdateSettings: (integrationId: string, settings: any) => void;
  stats: {
    connectedIntegrations: number;
    totalRevenue: number;
    todaySales: number;
    menuItemsLinked: number;
    activeRules: number;
  };
}

export function POSIntegrations({
  integrations,
  isOpen,
  onClose,
  onConnect,
  onDisconnect,
  onSync,
  onUpdateSettings,
  stats
}: POSIntegrationsProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'connect' | 'settings'>('overview');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !apiKey) return;

    setIsConnecting(true);
    const success = await onConnect(selectedProvider, apiKey, webhookUrl);
    
    if (success) {
      setApiKey('');
      setWebhookUrl('');
      setSelectedProvider('');
      setSelectedTab('overview');
    }
    
    setIsConnecting(false);
  };

  const getStatusColor = (status: POSIntegration['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'syncing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'disconnected': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: POSIntegration['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-soft">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">POS System Integrations</h2>
              <p className="text-sm text-gray-600 font-medium">Connect with Toast, Clover, Square, and other restaurant systems</p>
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
          {/* Integration Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Wifi className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Connected</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{stats.connectedIntegrations}</p>
              <p className="text-sm text-blue-600">POS systems</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Revenue</span>
              </div>
              <p className="text-3xl font-bold text-green-700">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-green-600">Total tracked</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Today's Sales</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">{stats.todaySales}</p>
              <p className="text-sm text-purple-600">Orders processed</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Menu Items</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">{stats.menuItemsLinked}</p>
              <p className="text-sm text-amber-600">Linked to inventory</p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800">Auto Rules</span>
              </div>
              <p className="text-3xl font-bold text-red-700">{stats.activeRules}</p>
              <p className="text-sm text-red-600">Reorder rules active</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Connected Systems', icon: Wifi },
              { id: 'connect', label: 'Add Integration', icon: Plus },
              { id: 'settings', label: 'Sync Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-blue-500 text-white shadow-soft'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {integrations.length === 0 ? (
                <div className="text-center py-12">
                  <Wifi className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No POS Systems Connected</h3>
                  <p className="text-gray-500 font-medium mb-6">
                    Connect your restaurant POS system to automatically sync inventory and sales data
                  </p>
                  <button
                    onClick={() => setSelectedTab('connect')}
                    className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                  >
                    Add Your First Integration
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrations.map(integration => (
                    <div key={integration.id} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">
                            {POS_PROVIDERS.find(p => p.id === integration.type)?.logo || '🏪'}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{integration.name}</h3>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(integration.status)}`}>
                              {getStatusIcon(integration.status)}
                              {integration.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSync(integration.id)}
                            disabled={integration.status === 'syncing'}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                            title="Sync now"
                          >
                            <RefreshCw className={`w-4 h-4 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                          </button>
                          <button
                            onClick={() => onDisconnect(integration.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                            title="Disconnect"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Last Sync:</span>
                          <span className="font-bold text-gray-800">
                            {integration.lastSync ? format(integration.lastSync, 'MMM dd, HH:mm') : 'Never'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Sync Frequency:</span>
                          <span className="font-bold text-gray-800 capitalize">{integration.syncFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Auto Sync:</span>
                          <span className={`font-bold ${integration.settings.autoSync ? 'text-green-600' : 'text-gray-600'}`}>
                            {integration.settings.autoSync ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Active Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {integration.features.filter(f => f.enabled).map(feature => (
                            <span key={feature.name} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                              {feature.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Connect Tab */}
          {selectedTab === 'connect' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your POS System</h3>
                <p className="text-gray-600 font-medium">
                  Choose your restaurant POS system to enable automatic inventory sync
                </p>
              </div>

              {/* POS Provider Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {POS_PROVIDERS.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-6 border-2 rounded-2xl transition-all duration-300 text-left shadow-soft hover:shadow-elegant ${
                      selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{provider.logo}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {provider.features.slice(0, 3).map(feature => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-gray-700 font-semibold">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Connection Form */}
              {selectedProvider && (
                <form onSubmit={handleConnect} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">
                      {POS_PROVIDERS.find(p => p.id === selectedProvider)?.logo}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-900">
                        Connect {POS_PROVIDERS.find(p => p.id === selectedProvider)?.name}
                      </h4>
                      <p className="text-blue-700 font-semibold">Enter your API credentials to get started</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        API Key *
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                        placeholder="Enter your API key"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        Find this in your {POS_PROVIDERS.find(p => p.id === selectedProvider)?.name} dashboard
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Webhook URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                        placeholder="https://your-webhook-url.com"
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        For real-time inventory updates
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-xl shadow-soft">
                    <h5 className="font-bold text-gray-900 mb-2">What will be synced:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 font-semibold">Inventory levels</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 font-semibold">Sales data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 font-semibold">Menu items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 font-semibold">Cost tracking</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setSelectedProvider('')}
                      className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isConnecting}
                      className="flex-1 px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wifi className="w-5 h-5" />
                          Connect {POS_PROVIDERS.find(p => p.id === selectedProvider)?.name}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {selectedTab === 'settings' && (
            <div className="space-y-6">
              {integrations.map(integration => (
                <div key={integration.id} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">
                      {POS_PROVIDERS.find(p => p.id === integration.type)?.logo}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-600">Configure sync settings and features</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Sync Settings</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'autoSync', label: 'Auto Sync', description: 'Automatically sync data' },
                          { key: 'syncInventory', label: 'Inventory Sync', description: 'Sync inventory levels' },
                          { key: 'syncSales', label: 'Sales Data', description: 'Import sales transactions' },
                          { key: 'syncMenu', label: 'Menu Items', description: 'Link menu to inventory' },
                          { key: 'autoReorder', label: 'Auto Reorder', description: 'Automatic reordering' },
                          { key: 'notifyOnLowStock', label: 'Low Stock Alerts', description: 'POS notifications' }
                        ].map(setting => (
                          <label key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                            <div>
                              <span className="font-semibold text-gray-900">{setting.label}</span>
                              <p className="text-xs text-gray-600">{setting.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={integration.settings[setting.key as keyof typeof integration.settings] as boolean}
                              onChange={(e) => onUpdateSettings(integration.id, {
                                [setting.key]: e.target.checked
                              })}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Advanced Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Reorder Threshold (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={integration.settings.reorderThreshold}
                            onChange={(e) => onUpdateSettings(integration.id, {
                              reorderThreshold: parseInt(e.target.value) || 0
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Sync Frequency
                          </label>
                          <select
                            value={integration.syncFrequency}
                            onChange={(e) => {
                              const updatedIntegration = {
                                ...integration,
                                syncFrequency: e.target.value as any
                              };
                              // Update integration directly
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                          >
                            <option value="realtime">Real-time</option>
                            <option value="hourly">Every Hour</option>
                            <option value="daily">Daily</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Integration Benefits */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-emerald-900 mb-4">🚀 Integration Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-800">Automatic Inventory Deduction</span>
                </div>
                <p className="text-sm text-emerald-700 font-medium pl-8">
                  When items are sold through your POS, inventory automatically decreases
                </p>

                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-800">Real-time Sales Analytics</span>
                </div>
                <p className="text-sm text-emerald-700 font-medium pl-8">
                  Track which menu items are selling and their ingredient usage
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-800">Smart Reordering</span>
                </div>
                <p className="text-sm text-emerald-700 font-medium pl-8">
                  Automatically reorder ingredients when they hit minimum levels
                </p>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-800">Cost Optimization</span>
                </div>
                <p className="text-sm text-emerald-700 font-medium pl-8">
                  Track food costs per menu item and optimize pricing
                </p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-blue-900 mb-4">📋 Setup Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-bold text-blue-800 mb-2">For Toast POS:</h5>
                <ol className="space-y-1 text-blue-700 font-medium">
                  <li>1. Log into Toast Web Dashboard</li>
                  <li>2. Go to Admin → Integrations → API</li>
                  <li>3. Generate new API key</li>
                  <li>4. Copy the key and paste above</li>
                  <li>5. Enable webhook notifications</li>
                </ol>
              </div>

              <div>
                <h5 className="font-bold text-blue-800 mb-2">For Clover:</h5>
                <ol className="space-y-1 text-blue-700 font-medium">
                  <li>1. Access Clover Developer Dashboard</li>
                  <li>2. Create new app or use existing</li>
                  <li>3. Generate API token</li>
                  <li>4. Set inventory permissions</li>
                  <li>5. Configure webhook endpoints</li>
                </ol>
              </div>

              <div>
                <h5 className="font-bold text-blue-800 mb-2">For Square:</h5>
                <ol className="space-y-1 text-blue-700 font-medium">
                  <li>1. Open Square Developer Console</li>
                  <li>2. Create application</li>
                  <li>3. Get production access token</li>
                  <li>4. Enable inventory permissions</li>
                  <li>5. Test connection</li>
                </ol>
              </div>

              <div>
                <h5 className="font-bold text-blue-800 mb-2">For Enterprise Systems:</h5>
                <ol className="space-y-1 text-blue-700 font-medium">
                  <li>1. Contact your POS vendor</li>
                  <li>2. Request API documentation</li>
                  <li>3. Set up dedicated integration</li>
                  <li>4. Configure data mapping</li>
                  <li>5. Schedule sync testing</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}