import React, { useState, useEffect } from 'react';
import { Scale, Calculator, Wheat, Package } from 'lucide-react';
import { DRY_GOODS_DENSITY, CONTAINER_VOLUMES, estimateWeightFromVolume, estimateVolumeFromWeight } from '../utils/dryGoodsUtils';

interface DryGoodsEstimatorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEstimate: (estimate: {
    name: string;
    containerType: string;
    estimatedWeight: number;
    estimatedVolume: number;
    fillLevel: number;
  }) => void;
}

export function DryGoodsEstimator({ isOpen, onClose, onAddEstimate }: DryGoodsEstimatorProps) {
  const [selectedDryGood, setSelectedDryGood] = useState(Object.keys(DRY_GOODS_DENSITY)[0]);
  const [selectedContainer, setSelectedContainer] = useState(Object.keys(CONTAINER_VOLUMES)[0]);
  const [fillLevel, setFillLevel] = useState(80);
  const [estimatedWeight, setEstimatedWeight] = useState(0);
  const [estimatedVolume, setEstimatedVolume] = useState(0);

  useEffect(() => {
    const weight = estimateWeightFromVolume(selectedContainer, fillLevel, selectedDryGood);
    const volume = estimateVolumeFromWeight(weight, selectedDryGood);
    setEstimatedWeight(weight);
    setEstimatedVolume(volume);
  }, [selectedDryGood, selectedContainer, fillLevel]);

  const handleConfirm = () => {
    onAddEstimate({
      name: selectedDryGood,
      containerType: selectedContainer,
      estimatedWeight,
      estimatedVolume,
      fillLevel
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-500">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-soft">
              <Wheat className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dry Goods Estimator</h2>
              <p className="text-sm text-gray-600 font-medium">Calculate weight from container size and fill level</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft touch-target"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Dry Good Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Select Dry Good Type
            </label>
            <select
              value={selectedDryGood}
              onChange={(e) => setSelectedDryGood(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
            >
              {Object.keys(DRY_GOODS_DENSITY).map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Density: {DRY_GOODS_DENSITY[selectedDryGood as keyof typeof DRY_GOODS_DENSITY]} lbs per cup
            </p>
          </div>

          {/* Container Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Container Type
            </label>
            <select
              value={selectedContainer}
              onChange={(e) => setSelectedContainer(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
            >
              {Object.keys(CONTAINER_VOLUMES).map(container => (
                <option key={container} value={container}>{container}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Capacity: {CONTAINER_VOLUMES[selectedContainer as keyof typeof CONTAINER_VOLUMES]} cups
            </p>
          </div>

          {/* Fill Level Slider */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Fill Level: {fillLevel}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={fillLevel}
                onChange={(e) => setFillLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>10% (Nearly Empty)</span>
                <span>50% (Half Full)</span>
                <span>100% (Full)</span>
              </div>
            </div>
          </div>

          {/* Visual Fill Level Indicator */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200 shadow-soft">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-600" />
              Container Visualization
            </h4>
            <div className="relative w-32 h-48 mx-auto bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-400 to-yellow-300 transition-all duration-500 rounded-b-md"
                style={{ height: `${fillLevel}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 bg-white/80 px-2 py-1 rounded">
                  {fillLevel}%
                </span>
              </div>
            </div>
          </div>

          {/* Estimation Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-900">Estimated Weight</h4>
              </div>
              <p className="text-3xl font-bold text-blue-700">{estimatedWeight.toFixed(2)} lbs</p>
              <p className="text-sm text-blue-600 font-medium mt-1">
                Based on {fillLevel}% fill level
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-purple-900">Volume</h4>
              </div>
              <p className="text-3xl font-bold text-purple-700">{estimatedVolume.toFixed(1)} cups</p>
              <p className="text-sm text-purple-600 font-medium mt-1">
                Actual volume in container
              </p>
            </div>
          </div>

          {/* Serving Information */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-soft">
            <h4 className="font-bold text-emerald-900 mb-3">Serving Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-emerald-700 font-semibold">Cooked Rice Yield:</span>
                <span className="ml-2 text-emerald-900 font-bold">
                  {selectedDryGood.includes('Rice') ? `~${(estimatedVolume * 3).toFixed(0)} cups` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-emerald-700 font-semibold">Approx. Servings:</span>
                <span className="ml-2 text-emerald-900 font-bold">
                  {selectedDryGood.includes('Rice') ? `~${Math.floor(estimatedVolume * 3 / 0.5)} portions` : 'Varies'}
                </span>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">
              *Based on 0.5 cup cooked rice per serving
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft hover:shadow-elegant hover:scale-105 touch-target"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2 touch-target"
            >
              <Calculator className="w-5 h-5" />
              Add to Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}