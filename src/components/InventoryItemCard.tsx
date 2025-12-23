import React, { useState } from 'react';
import { Edit, Trash2, Package, MapPin, Calendar, DollarSign, Scale, AlertTriangle, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { format } from 'date-fns';

interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
  onDelete: (id: string) => void;
}

export function InventoryItemCard({ item, onUpdate, onDelete }: InventoryItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    quantity: item.quantity,
    costPerUnit: item.costPerUnit,
    minimumStock: item.minimumStock,
    location: item.location
  });

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      quantity: item.quantity,
      costPerUnit: item.costPerUnit,
      minimumStock: item.minimumStock,
      location: item.location
    });
    setIsEditing(false);
  };

  const getStockStatus = () => {
    if (item.quantity === 0) return { status: 'out', color: 'red', icon: AlertTriangle };
    if (item.quantity <= item.minimumStock) return { status: 'low', color: 'amber', icon: AlertTriangle };
    return { status: 'good', color: 'green', icon: CheckCircle };
  };

  const getExpirationStatus = () => {
    if (!item.expirationDate) return null;
    
    const today = new Date();
    const expDate = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'red', text: 'EXPIRED' };
    if (daysUntilExpiry <= 3) return { status: 'critical', color: 'red', text: `${daysUntilExpiry}d left` };
    if (daysUntilExpiry <= 7) return { status: 'warning', color: 'amber', text: `${daysUntilExpiry}d left` };
    return { status: 'good', color: 'green', text: `${daysUntilExpiry}d left` };
  };

  const stockStatus = getStockStatus();
  const expirationStatus = getExpirationStatus();
  const StatusIcon = stockStatus.icon;

  return (
    <div className={`glass-effect rounded-3xl shadow-elegant p-8 border transition-all duration-500 hover:shadow-glow hover:scale-105 group ${
      item.isHidden ? 'border-purple-300 bg-purple-100/20' : 'border-white/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white line-clamp-2">{item.name}</h3>
            {item.isHidden && (
              <div className="p-1 bg-purple-500/20 rounded-lg">
                <EyeOff className="w-4 h-4 text-purple-300" />
              </div>
            )}
          </div>
          <p className="text-white/70 text-sm font-semibold line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/30">
              {item.category}
            </span>
            {item.isDryGood && (
              <span className="px-2 py-1 bg-amber-500/20 rounded-full text-xs font-bold text-amber-200 border border-amber-400/30">
                Dry Good
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-3 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stock Status */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${
        stockStatus.color === 'red' ? 'bg-red-500/20 border-red-400/30' :
        stockStatus.color === 'amber' ? 'bg-amber-500/20 border-amber-400/30' :
        'bg-green-500/20 border-green-400/30'
      }`}>
        <StatusIcon className={`w-6 h-6 ${
          stockStatus.color === 'red' ? 'text-red-300' :
          stockStatus.color === 'amber' ? 'text-amber-300' :
          'text-green-300'
        }`} />
        <div className="flex-1">
          <p className={`font-bold ${
            stockStatus.color === 'red' ? 'text-red-200' :
            stockStatus.color === 'amber' ? 'text-amber-200' :
            'text-green-200'
          }`}>
            {stockStatus.status === 'out' ? 'OUT OF STOCK' :
             stockStatus.status === 'low' ? 'LOW STOCK' : 'IN STOCK'}
          </p>
          <p className="text-white/70 text-sm font-semibold">
            {isEditing ? (
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => setEditData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm font-bold"
              />
            ) : (
              item.quantity
            )} {item.unit} • Min: {item.minimumStock}
          </p>
        </div>
      </div>

      {/* Expiration Alert */}
      {expirationStatus && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${
          expirationStatus.color === 'red' ? 'bg-red-500/20 border-red-400/30' :
          expirationStatus.color === 'amber' ? 'bg-amber-500/20 border-amber-400/30' :
          'bg-green-500/20 border-green-400/30'
        }`}>
          <Calendar className={`w-5 h-5 ${
            expirationStatus.color === 'red' ? 'text-red-300' :
            expirationStatus.color === 'amber' ? 'text-amber-300' :
            'text-green-300'
          }`} />
          <div>
            <p className={`font-bold text-sm ${
              expirationStatus.color === 'red' ? 'text-red-200' :
              expirationStatus.color === 'amber' ? 'text-amber-200' :
              'text-green-200'
            }`}>
              {expirationStatus.status === 'expired' ? 'EXPIRED' : 'EXPIRES'}
            </p>
            <p className="text-white/70 text-xs font-semibold">{expirationStatus.text}</p>
          </div>
        </div>
      )}

      {/* Hidden Item Info */}
      {item.isHidden && item.hiddenBehind && (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 bg-purple-500/20 border border-purple-400/30">
          <EyeOff className="w-5 h-5 text-purple-300" />
          <div>
            <p className="font-bold text-sm text-purple-200">HIDDEN ITEM</p>
            <p className="text-white/70 text-xs font-semibold">Behind: {item.hiddenBehind}</p>
            {item.lastSeenDate && (
              <p className="text-white/60 text-xs">
                Last seen: {format(item.lastSeenDate, 'MMM dd')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Scale className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-bold">TOTAL WEIGHT</p>
              <p className="text-white font-bold">{item.totalWeightLbs.toFixed(1)} lbs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Package className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-bold">CONTAINER</p>
              <p className="text-white font-bold text-sm">{item.containerType}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-bold">TOTAL VALUE</p>
              <p className="text-white font-bold">
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.costPerUnit}
                    onChange={(e) => setEditData(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) || 0 }))}
                    className="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm font-bold"
                  />
                ) : (
                  `$${item.totalValue.toFixed(2)}`
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <MapPin className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-bold">LOCATION</p>
              <p className="text-white font-bold text-sm">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm font-bold"
                  />
                ) : (
                  item.location
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Gap Tracking */}
      {item.inventoryGapPercentage !== undefined && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-bold">Inventory Gap</span>
            <span className={`font-bold ${
              item.inventoryGapPercentage > 75 ? 'text-red-300' :
              item.inventoryGapPercentage > 50 ? 'text-amber-300' :
              item.inventoryGapPercentage > 25 ? 'text-yellow-300' :
              'text-green-300'
            }`}>
              {item.inventoryGapPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                item.inventoryGapPercentage > 75 ? 'bg-red-400' :
                item.inventoryGapPercentage > 50 ? 'bg-amber-400' :
                item.inventoryGapPercentage > 25 ? 'bg-yellow-400' :
                'bg-green-400'
              }`}
              style={{ width: `${Math.min(item.inventoryGapPercentage, 100)}%` }}
            />
          </div>
          <p className="text-white/60 text-xs mt-1 font-medium">
            Started with {item.beginningInventory}, now {item.quantity}
          </p>
        </div>
      )}

      {/* Supplier & Last Updated */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white/60 rounded-full"></div>
          <span className="text-white/80 font-bold">{item.supplier}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/60" />
          <span className="text-white/60 font-semibold">
            {format(new Date(item.updatedAt), 'MMM dd')}
          </span>
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex gap-3 mt-6 pt-6 border-t border-white/20">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-bold shadow-soft"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 gradient-success text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}