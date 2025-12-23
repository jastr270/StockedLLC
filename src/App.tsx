import React, { useState } from 'react';
import { AuthGuard } from './components/AuthGuard';

import { Plus, Scan, BarChart3, Users, Settings, Package, Mic, Leaf, Zap, Shield, Crown, Activity } from 'lucide-react';

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
import { useSubscription } from './hooks/useSubscription';
import { usePOSIntegrations } from './hooks/usePOSIntegrations';

import { aiAssistant } from './utils/aiAssistant';
import { ENHANCED_CATEGORIES } from './utils/foodDatabase';

function AppInner() {
  const {
    items,
    isLoading: inventoryLoading,
    addItem,
    updateItem,
    deleteItem,
    addFromBarcode,
    importItems,
    getInventoryGapStats
  } = useInventory();

  const {
    currentUser,
    team,
    addTeamMember,
    updateMemberRole,
    removeMember,
    switchUser,
    hasPermission,
    activityLog
  } = useTeam();

  const {
    user: subscriptionUser,
    isTrialActive,
    daysRemaining,
    startTrial,
    upgradeSubscription,
    cancelSubscription
  } = useSubscription();

  const {
    integrations,
    connectPOS,
    disconnectPOS,
    syncPOSData,
    updateIntegrationSettings,
    getIntegrationStats
  } = usePOSIntegrations();

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

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const aiInsights = aiAssistant.generateInsights(items);
  const hasNewInsights = aiInsights.some((insight) => insight.priority === 'critical' || insight.priority === 'high');

  const gapStats = getInventoryGapStats();
  const integrationStats = getIntegrationStats();

  const handleVoiceCommand = (command: string, data: any) => {
    if (data.action === 'add_item') {
      addItem({
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
        isDryGood: data.item.includes('rice') || data.item.includes('flour') || data.item.includes('beans'),
      });
    } else if (data.action === 'subtract_item') {
      const existingItem = items.find((i) => i.name.toLowerCase().includes(data.item.toLowerCase()));
      if (existingItem) {
        updateItem(existingItem.id, { quantity: Math.max(0, existingItem.quantity - data.quantity) });
      }
    }
  };

  if (inventoryLoading) {
    return <LoadingState type="inventory" message="Loading your inventory..." />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 safe-area-top safe-area-bottom">
        <div className="max-w-7xl mx-auto space-y-8">
          <UserProfile />

          {isTrialActive && (
            <TrialBanner
              daysRemaining={daysRemaining}
              onUpgrade={() => setIsSubscriptionOpen(true)}
              isTrialActive={isTrialActive}
            />
          )}

          {/* Your existing UI continues here — you can paste your full header/actions section back in */}
          <InventoryStats items={items} />
          <LowStockAlerts items={items} />

          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={ENHANCED_CATEGORIES}
          />

          <ExcelIntegration items={items} onImport={importItems} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <InventoryItemCard key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />
            ))}
          </div>
        </div>

        <AIFloatingButton onClick={() => setIsAIOpen(true)} hasNewInsights={hasNewInsights} isOpen={isAIOpen} />
        <HealthStatus />

        <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddItem={addItem} />
        <CameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onBarcodeDetected={addFromBarcode} />

        <AIAssistant
          items={items}
          userRole={currentUser?.role || 'staff'}
          teamName={team?.name || 'Restaurant Team'}
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
        />

        <Analytics items={items} />

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

        <QualityControl items={items} isOpen={isQualityOpen} onClose={() => setIsQualityOpen(false)} />

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

        <SecuritySettings isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />
        <VoiceInventoryInput isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} onVoiceCommand={handleVoiceCommand} />

        <PredictiveReordering
          items={items}
          isOpen={isPredictiveOpen}
          onClose={() => setIsPredictiveOpen(false)}
          onCreateOrder={(orders) => console.log('Creating purchase orders:', orders)}
        />

        <WasteTracker items={items} isOpen={isWasteOpen} onClose={() => setIsWasteOpen(false)} />
        <SupplierPortal isOpen={isSupplierPortalOpen} onClose={() => setIsSupplierPortalOpen(false)} />
        <ComplianceReporting isOpen={isComplianceOpen} onClose={() => setIsComplianceOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthGuard>
      <AppInner />
    </AuthGuard>
  );
}
