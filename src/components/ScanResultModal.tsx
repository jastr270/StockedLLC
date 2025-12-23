import React from 'react';
import { X, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { ScanResult } from '../types/inventory';

interface ScanResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult | null;
  onConfirm: (result: ScanResult) => void;
}

export function ScanResultModal({ isOpen, onClose, scanResult, onConfirm }: ScanResultModalProps) {
  if (!isOpen || !scanResult) return null;

  const handleConfirm = () => {
    onConfirm(scanResult);
    onClose();
  };

  const totalWeight = scanResult.detectedItems.reduce((sum, item) => sum + item.estimatedWeight, 0);
  const dryGoodsCount = scanResult.detectedItems.filter(item => item.isDryGood).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-lg max-h-[95vh] overflow-y-auto transform transition-all duration-500 safe-area-top safe-area-bottom">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-soft">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Scan Results</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 shadow-soft touch-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">Detection Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
              <div>
                <span className="text-blue-700">Total Containers:</span>
                <span className="ml-2 text-blue-900 font-bold">{scanResult.totalCount}</span>
              </div>
              <div>
                <span className="text-blue-700">Total Weight:</span>
                <span className="ml-2 text-blue-900 font-bold">{totalWeight.toFixed(1)} lbs</span>
              </div>
              <div>
                <span className="text-blue-700">Dry Goods:</span>
                <span className="ml-2 text-blue-900 font-bold">{dryGoodsCount} detected</span>
              </div>
              <div>
                <span className="text-blue-700">Avg Weight:</span>
                <span className="ml-2 text-blue-900 font-bold">{(totalWeight / scanResult.totalCount).toFixed(1)} lbs</span>
              </div>
            </div>
          </div>

          {scanResult.detectedItems.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Detected Items</h4>
              <div className="space-y-3">
                {scanResult.detectedItems.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-2xl shadow-soft border ${
                    item.isDryGood 
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100' 
                      : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full shadow-soft ${
                        item.isDryGood 
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                          : 'bg-gradient-to-br from-green-400 to-emerald-500'
                      }`}></div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {item.recognizedFood?.name || (item.isDryGood && item.grainType ? item.grainType : item.containerType)}
                        </p>
                        <p className="text-sm text-gray-600 font-semibold">
                          {item.recognizedFood?.category || 'Unknown'} • {item.estimatedWeight.toFixed(1)} lbs
                          {item.isDryGood && item.estimatedVolume && ` • ~${item.estimatedVolume.toFixed(0)} cups`}
                        </p>
                        {item.recognizedFood?.visualCues && (
                          <p className="text-xs text-gray-500 font-medium mt-1">
                            Visual cues: {item.recognizedFood.visualCues.slice(0, 3).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Dry Goods Detection</h4>
                <p className="text-sm text-amber-800 font-semibold">
                  AI estimates rice, flour, and dry goods weights based on container size and type. 
                  Please verify the detected items match your actual inventory before confirming.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft hover:shadow-elegant hover:scale-105 touch-target"
            >
              Rescan
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-4 gradient-success text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow touch-target"
            >
              Confirm & Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}