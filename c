import React from 'react';
import { AuthGuard } from './components/AuthGuard';

function AppContent() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
    </div>
  );
}

export default function App() {
  return (
    <AuthGuard>
      <AppContent />
    </AuthGuard>
  );
}import React, { useState, useEffect } from 'react';
import { Plus, Scan, Bot, BarChart3, Users, Settings, Package, Search, Filter, Download, Shield, Zap, Crown, Activity } from 'lucide-react';
import { Mic, Leaf, Truck, FileText } from 'lucide-react';
import { InventoryItemCard } from './components/InventoryItemCard';
import { AddItemModal } from './components/AddItemModal';
import { CameraScanner } from './components/CameraScanner';
import { AIAssistant } from './components/AIAssistant';
import { Analytics } from './components/Analytics';
import { TeamManagement } from './components/TeamManagement';
import { POSIntegrations } from './components/POSIntegrations';
import { QualityControl } from './components/QualityControl';
import { InventoryStats } from './components/InventoryStats';
import { LowStockAlerts } from './components/LowStockAlerts';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ExcelIntegration } from './components/ExcelIntegration';
import { AIFloatingButton } from './components/AIFloatingButton';
import { AuthGuard } from './components/AuthGuard';
import { UserProfile } from './components/UserProfile';
import { TrialBanner } from './components/TrialBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { BillingPortal } from './components/BillingPortal';
import { SecuritySettings } from './components/SecuritySettings';
import { HealthStatus } from './components/HealthStatus';
import { LoadingState, ErrorBoundary } from './components/LoadingStates';
import { VoiceInventoryInput } from './components/VoiceInventoryInput';
import { PredictiveReordering } from './components/PredictiveReordering';
import { WasteTracker } from './components/WasteTracker';
import { SupplierPortal } from './components/SupplierPortal';
import { ComplianceReporting } from './components/ComplianceReporting';
import { useInventory } from './hooks/useInventory';
import { useTeam } from './hooks/useTeam';
import { useAuth } from './hooks/useAuth';
import { useSubscription } from './hooks/useSubscription';
import { usePOSIntegrations } from './hooks/usePOSIntegrations';
import { aiAssistant } from './utils/aiAssistant';
import { ENHANCED_CATEGORIES } from './utils/foodDatabase';

function App() {
  const { items, isLoading: inventoryLoading, addItem, updateItem, deleteItem, addFromBarcode, importItems, resetBeginningInventory, getInventoryGapStats } = useInventory();
  const { currentUser, team, addTeamMember, updateMemberRole, removeMember, switchUser, hasPermission, activityLog } = useTeam();
  const { user, isAuthenticated, logout } = useAuth();
    const [isInitializing, setIsInitializing] = useState(true);
  const { user: subscriptionUser, isTrialActive, daysRemaining, canAccessFeature, startTrial, upgradeSubscription, cancelSubscription } = useSubscription();
  const { integrations, salesData, menuItems, autoReorderRules, connectPOS, disconnectPOS, syncPOSData, updateIntegrationSettings, getIntegrationStats } = usePOSIntegrations();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isPredictiveOpen, setIsPredictiveOpen] = useState(false);
  const [isWasteOpen, setIsWasteOpen] = useState(false);
  const [isSupplierPortalOpen, setIsSupplierPortalOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Generate AI insights
  const aiInsights = aiAssistant.generateInsights(items);
  const hasNewInsights = aiInsights.some(insight => insight.priority === 'critical' || insight.priority === 'high');

  // Get inventory gap statistics
  const gapStats = getInventoryGapStats();
  const integrationStats = getIntegrationStats();

  const handleVoiceCommand = (command: string, data: any) => {
    if (data.action === 'add_item') {
      // Add item based on voice command
      const newItem = {
        name: data.item.charAt(0).toUpperCase() + data.item.slice(1),
        description: `Added via voice command: "${command}"`,
        category: 'Other',
        quantity: data.quantity,
        unit: data.unit,
        supplier: 'Voice Entry',
        costPerUnit: 0,
        minimumStock: Math.max(1, Math.floor(data.quantity * 0.2)),
        location: 'Receiving Area',
        containerType: 'Unknown',
        weightPerContainer: 1,
        isDryGood: data.item.includes('rice') || data.item.includes('flour') || data.item.includes('beans')
      };
      addItem(newItem);
    } else if (data.action === 'subtract_item') {
      // Find and update existing item
      const existingItem = items.find(item => 
        item.name.toLowerCase().includes(data.item.toLowerCase())
      );
      if (existingItem) {
        updateItem(existingItem.id, { 
          quantity: Math.max(0, existingItem.quantity - data.quantity) 
        });
      }
    }
  };

  if (inventoryLoading) {
    return <LoadingState type="inventory" message="Loading your inventory..." />;
  }

  return (
    <ErrorBoundary>
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 safe-area-top safe-area-bottom">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* User Profile */}
            <UserProfile />

            {/* Trial Banner */}
            {isTrialActive && (
              <TrialBanner
                daysRemaining={daysRemaining}
                onUpgrade={() => setIsSubscriptionOpen(true)}
                isTrialActive={isTrialActive}
              />
            )}

            {/* Header */}
            <div className="glass-effect rounded-3xl shadow-elegant p-8 border border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Smart Inventory Pro
                  </h1>
                  <p className="text-xl text-white/80 font-semibold">
                    AI-Powered Restaurant Management
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow touch-target"
                  >
                    <Plus className="w-5 h-5" />
                    Add Item
                  </button>
                  
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 gradient-secondary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow touch-target"
                  >
                    <Scan className="w-5 h-5" />
                    Scan Barcode
                  </button>
                  
                  <button
                    onClick={() => setIsAnalyticsOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 gradient-info text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow touch-target"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <button
                onClick={() => setIsTeamOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Users className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">Team</p>
              </button>
              
              <button
                onClick={() => setIsPOSOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Zap className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">POS</p>
              </button>
              
              <button
                onClick={() => setIsQualityOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Shield className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">HACCP</p>
              </button>
              
              <button
                onClick={() => setIsSubscriptionOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Crown className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">Upgrade</p>
              </button>
              
              <button
                onClick={() => setIsBillingOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Settings className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">Billing</p>
              </button>
              
              <button
                onClick={() => setIsSecurityOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Activity className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">Security</p>
              </button>
              
              <button
                onClick={() => setIsVoiceOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Mic className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">Voice</p>
              </button>
              
              <button
                onClick={() => setIsWasteOpen(true)}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 touch-target"
              >
                <Leaf className="w-8 h-8 text-white mb-3 mx-auto" />
                <p className="text-white font-bold text-sm">Waste</p>
              </button>
            </div>

            {/* Inventory Stats */}
            <InventoryStats items={items} />

            {/* Low Stock Alerts */}
            <LowStockAlerts items={items} />

            {/* Search and Filter */}
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={ENHANCED_CATEGORIES}
            />

            {/* Excel Integration */}
            <ExcelIntegration items={items} onImport={importItems} />

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="glass-effect rounded-3xl shadow-elegant p-12 text-center border border-white/20">
                <Package className="w-16 h-16 text-white/60 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                <p className="text-white/80 font-medium mb-6">
                  {searchTerm || selectedCategory 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by adding your first inventory item'
                  }
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                >
                  Add First Item
                </button>
              </div>
            )}
          </div>

          {/* Floating AI Assistant */}
          <AIFloatingButton
            onClick={() => setIsAIOpen(true)}
            hasNewInsights={hasNewInsights}
            isOpen={isAIOpen}
          />

          {/* Health Status Monitor */}
          <HealthStatus />

          {/* Modals */}
          <AddItemModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddItem={addItem}
          />

          <CameraScanner
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onBarcodeDetected={addFromBarcode}
          />

          <AIAssistant
            items={items}
            userRole={currentUser?.role || 'staff'}
            teamName={team?.name || 'Restaurant Team'}
            isOpen={isAIOpen}
            onClose={() => setIsAIOpen(false)}
          />

          <Analytics
            items={items}
          />

          {currentUser && team && (
            <TeamManagement
              currentUser={currentUser}
              teamMembers={team.members}
              isOpen={isTeamOpen}
              onClose={() => setIsTeamOpen(false)}
              onAddMember={addTeamMember}
              onUpdateRole={updateMemberRole}
              onRemoveMember={removeMember}
              onSwitchUser={switchUser}
              hasPermission={hasPermission}
              activityLog={activityLog}
            />
          )}

          <POSIntegrations
            integrations={integrations}
            isOpen={isPOSOpen}
            onClose={() => setIsPOSOpen(false)}
            onConnect={connectPOS}
            onDisconnect={disconnectPOS}
            onSync={syncPOSData}
            onUpdateSettings={updateIntegrationSettings}
            stats={integrationStats}
          />

          <QualityControl
            items={items}
            isOpen={isQualityOpen}
            onClose={() => setIsQualityOpen(false)}
          />

          <SubscriptionModal
            isOpen={isSubscriptionOpen}
            onClose={() => setIsSubscriptionOpen(false)}
            onStartTrial={startTrial}
            onUpgrade={upgradeSubscription}
            isTrialActive={isTrialActive}
            daysRemaining={daysRemaining}
          />

          {subscriptionUser && (
            <BillingPortal
              user={subscriptionUser}
              isOpen={isBillingOpen}
              onClose={() => setIsBillingOpen(false)}
              onCancelSubscription={cancelSubscription}
              onUpgrade={upgradeSubscription}
            />
          )}

          <SecuritySettings
            isOpen={isSecurityOpen}
            onClose={() => setIsSecurityOpen(false)}
          />

          <VoiceInventoryInput
            isOpen={isVoiceOpen}
            onClose={() => setIsVoiceOpen(false)}
            onVoiceCommand={handleVoiceCommand}
          />

          <PredictiveReordering
            items={items}
            isOpen={isPredictiveOpen}
            onClose={() => setIsPredictiveOpen(false)}
            onCreateOrder={(orders) => {
              console.log('Creating purchase orders:', orders);
              // In real app, this would integrate with supplier systems
            }}
          />

          <WasteTracker
            items={items}
            isOpen={isWasteOpen}
            onClose={() => setIsWasteOpen(false)}
          />

          <SupplierPortal
            isOpen={isSupplierPortalOpen}
            onClose={() => setIsSupplierPortalOpen(false)}
          />

          <ComplianceReporting
            isOpen={isComplianceOpen}
            onClose={() => setIsComplianceOpen(false)}
          />
        </div>
      </AuthGuard>
    </ErrorBoundary>
  );
}

export default App;
