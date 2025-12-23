import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, MapPin, Clock, Package, Search, Plus, AlertTriangle, Brain, Layers } from 'lucide-react';
import { InventoryItem, LocationMemory } from '../types/inventory';
import { format } from 'date-fns';

interface HiddenInventoryTrackerProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onAddHiddenItem: (item: Partial<InventoryItem>) => void;
}

export function HiddenInventoryTracker({ 
  items, 
  isOpen, 
  onClose, 
  onUpdateItem, 
  onAddHiddenItem 
}: HiddenInventoryTrackerProps) {
  const [locationMemories, setLocationMemories] = useState<LocationMemory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [newHiddenItem, setNewHiddenItem] = useState({
    name: '',
    quantity: 0,
    hiddenBehind: '',
    location: '',
    specificLocation: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Load location memories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('location-memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const memoriesWithDates = parsed.map((memory: any) => ({
          ...memory,
          lastScanned: new Date(memory.lastScanned),
          hiddenItems: memory.hiddenItems.map((item: any) => ({
            ...item,
            lastUpdated: new Date(item.lastUpdated)
          }))
        }));
        setLocationMemories(memoriesWithDates);
      } catch (error) {
        console.error('Failed to load location memories:', error);
      }
    }
  }, []);

  // Save location memories to localStorage
  useEffect(() => {
    localStorage.setItem('location-memories', JSON.stringify(locationMemories));
  }, [locationMemories]);

  const hiddenItems = items.filter(item => item.isHidden);
  const visibleItems = items.filter(item => !item.isHidden);
  
  const locations = Array.from(new Set(items.map(item => item.location)));
  const specificLocations = Array.from(new Set(items.map(item => item.specificLocation).filter(Boolean)));

  const addLocationMemory = (location: string, specificArea: string) => {
    const newMemory: LocationMemory = {
      id: crypto.randomUUID(),
      locationName: location,
      specificArea,
      hiddenItems: [],
      visibleItems: visibleItems.filter(item => item.location === location).map(item => item.id),
      lastScanned: new Date(),
      notes: ''
    };
    setLocationMemories(prev => [...prev, newMemory]);
  };

  const addHiddenItemToMemory = (memoryId: string, itemData: any) => {
    setLocationMemories(prev => prev.map(memory => 
      memory.id === memoryId 
        ? {
            ...memory,
            hiddenItems: [...memory.hiddenItems, {
              itemId: crypto.randomUUID(),
              itemName: itemData.name,
              quantity: itemData.quantity,
              hiddenBehind: itemData.hiddenBehind,
              stackLevel: itemData.stackLevel || 1,
              lastUpdated: new Date(),
              confidence: 1.0
            }]
          }
        : memory
    ));
  };

  const handleAddHiddenItem = () => {
    if (!newHiddenItem.name || !newHiddenItem.hiddenBehind || !newHiddenItem.location) return;

    // Add to inventory
    onAddHiddenItem({
      name: newHiddenItem.name,
      quantity: newHiddenItem.quantity,
      location: newHiddenItem.location,
      specificLocation: newHiddenItem.specificLocation,
      isHidden: true,
      hiddenBehind: newHiddenItem.hiddenBehind,
      stackPosition: 'back',
      lastSeenDate: new Date(),
      category: 'Other',
      supplier: 'Unknown',
      costPerUnit: 0,
      minimumStock: 1,
      containerType: 'Unknown',
      weightPerContainer: 1,
      isDryGood: false,
      unit: 'each'
    });

    // Add to location memory
    const memory = locationMemories.find(m => 
      m.locationName === newHiddenItem.location && 
      m.specificArea === newHiddenItem.specificLocation
    );

    if (memory) {
      addHiddenItemToMemory(memory.id, newHiddenItem);
    } else {
      addLocationMemory(newHiddenItem.location, newHiddenItem.specificLocation);
    }

    // Reset form
    setNewHiddenItem({
      name: '',
      quantity: 0,
      hiddenBehind: '',
      location: '',
      specificLocation: ''
    });
    setShowAddForm(false);
  };

  const markItemAsVisible = (itemId: string) => {
    onUpdateItem(itemId, { 
      isHidden: false, 
      hiddenBehind: undefined,
      lastSeenDate: new Date() 
    });
  };

  const markItemAsHidden = (itemId: string, hiddenBehind: string) => {
    onUpdateItem(itemId, { 
      isHidden: true, 
      hiddenBehind,
      lastSeenDate: new Date() 
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTimeSinceLastSeen = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl shadow-soft">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Inventory Tracking</h2>
              <p className="text-sm text-gray-600 font-medium">Track items behind boxes and in hidden locations</p>
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
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Visible Items</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{visibleItems.length}</p>
              <p className="text-sm text-blue-600">Currently in view</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <EyeOff className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Hidden Items</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">{hiddenItems.length}</p>
              <p className="text-sm text-purple-600">Behind other items</p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-emerald-800">Locations</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700">{locationMemories.length}</p>
              <p className="text-sm text-emerald-600">Tracked areas</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Last Scan</span>
              </div>
              <p className="text-lg font-bold text-amber-700">
                {locationMemories.length > 0 
                  ? getTimeSinceLastSeen(locationMemories.sort((a, b) => b.lastScanned.getTime() - a.lastScanned.getTime())[0].lastScanned)
                  : 'Never'
                }
              </p>
              <p className="text-sm text-amber-600">Most recent</p>
            </div>
          </div>

          {/* Add Hidden Item Form */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-indigo-900">Add Hidden Item</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {showAddForm ? 'Cancel' : 'Add Item'}
              </button>
            </div>

            {showAddForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newHiddenItem.name}
                  onChange={(e) => setNewHiddenItem(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newHiddenItem.quantity}
                  onChange={(e) => setNewHiddenItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                />
                <input
                  type="text"
                  placeholder="Hidden behind (e.g., rice bags)"
                  value={newHiddenItem.hiddenBehind}
                  onChange={(e) => setNewHiddenItem(prev => ({ ...prev, hiddenBehind: e.target.value }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                />
                <select
                  value={newHiddenItem.location}
                  onChange={(e) => setNewHiddenItem(prev => ({ ...prev, location: e.target.value }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Specific area (e.g., back corner)"
                  value={newHiddenItem.specificLocation}
                  onChange={(e) => setNewHiddenItem(prev => ({ ...prev, specificLocation: e.target.value }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                />
                <button
                  onClick={handleAddHiddenItem}
                  className="px-6 py-3 gradient-success text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Add Hidden Item
                </button>
              </div>
            )}
          </div>

          {/* Hidden Items List */}
          {hiddenItems.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hidden Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hiddenItems.map(item => (
                  <div key={item.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-purple-900">{item.name}</h4>
                        <p className="text-sm text-purple-700 font-semibold">
                          {item.quantity} units • {item.location}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        item.stackPosition === 'back' 
                          ? 'bg-red-100 text-red-800 border-red-200' 
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {item.stackPosition || 'hidden'}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-800 font-semibold">
                          Hidden behind: {item.hiddenBehind}
                        </span>
                      </div>
                      {item.lastSeenDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-800 font-semibold">
                            Last seen: {getTimeSinceLastSeen(item.lastSeenDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => markItemAsVisible(item.id)}
                      className="mt-4 w-full px-4 py-2 gradient-success text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Mark as Visible
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Memories */}
          {locationMemories.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location Memory</h3>
              <div className="space-y-4">
                {locationMemories.map(memory => (
                  <div key={memory.id} className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-200 rounded-2xl p-6 shadow-soft">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{memory.locationName}</h4>
                        <p className="text-sm text-gray-600 font-semibold">{memory.specificArea}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-semibold">
                          Last scanned: {format(memory.lastScanned, 'MMM dd, HH:mm')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {memory.hiddenItems.length} hidden items
                        </p>
                      </div>
                    </div>

                    {memory.hiddenItems.length > 0 && (
                      <div className="space-y-2">
                        {memory.hiddenItems.map((hiddenItem, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-soft">
                            <div>
                              <span className="font-semibold text-gray-900">{hiddenItem.itemName}</span>
                              <span className="ml-2 text-gray-600">({hiddenItem.quantity} units)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getConfidenceColor(hiddenItem.confidence)}`}>
                                {Math.round(hiddenItem.confidence * 100)}% sure
                              </span>
                              <span className="text-xs text-gray-500">
                                behind {hiddenItem.hiddenBehind}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-blue-900">How Smart Tracking Works</h4>
            </div>
            <div className="space-y-2 text-sm text-blue-800 font-medium">
              <p>• <strong>Add Hidden Items:</strong> Record items you know are behind boxes or in stacks</p>
              <p>• <strong>Location Memory:</strong> System remembers what's in each area over time</p>
              <p>• <strong>Confidence Tracking:</strong> Estimates how likely items are still there</p>
              <p>• <strong>Mark Visible:</strong> Update when you move items or reorganize storage</p>
              <p>• <strong>Voice Integration:</strong> Say "12 cases behind the rice bags" to add quickly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}