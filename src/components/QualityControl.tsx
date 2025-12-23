import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Star, Camera, FileText, Thermometer, Clock } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { format } from 'date-fns';

interface QualityControlProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface QualityCheck {
  id: string;
  itemId: string;
  itemName: string;
  checkDate: Date;
  inspector: string;
  visualInspection: 'pass' | 'fail' | 'warning';
  smellTest: 'pass' | 'fail' | 'warning';
  textureCheck: 'pass' | 'fail' | 'warning';
  temperatureCheck?: number;
  overallRating: number;
  notes: string;
  photos: string[];
  correctiveActions: string[];
  haccp_compliant: boolean;
}

export function QualityControl({ items, isOpen, onClose }: QualityControlProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [newCheck, setNewCheck] = useState({
    visualInspection: 'pass' as const,
    smellTest: 'pass' as const,
    textureCheck: 'pass' as const,
    temperatureCheck: 40,
    overallRating: 5,
    notes: '',
    inspector: 'Kitchen Manager',
    correctiveActions: [] as string[]
  });

  const handleSubmitCheck = () => {
    if (!selectedItem) return;

    const check: QualityCheck = {
      id: crypto.randomUUID(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      checkDate: new Date(),
      inspector: newCheck.inspector,
      visualInspection: newCheck.visualInspection,
      smellTest: newCheck.smellTest,
      textureCheck: newCheck.textureCheck,
      temperatureCheck: newCheck.temperatureCheck,
      overallRating: newCheck.overallRating,
      notes: newCheck.notes,
      photos: [],
      correctiveActions: newCheck.correctiveActions,
      haccp_compliant: newCheck.overallRating >= 4 && 
                      newCheck.visualInspection === 'pass' && 
                      newCheck.smellTest === 'pass' && 
                      newCheck.textureCheck === 'pass'
    };

    setQualityChecks(prev => [...prev, check]);
    setSelectedItem(null);
    setNewCheck({
      visualInspection: 'pass',
      smellTest: 'pass',
      textureCheck: 'pass',
      temperatureCheck: 40,
      overallRating: 5,
      notes: '',
      inspector: 'Kitchen Manager',
      correctiveActions: []
    });
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'fail': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'fail': return <XCircle className="w-4 h-4" />;
    }
  };

  const getTemperatureStatus = (temp: number, category: string) => {
    const ranges = {
      'Frozen Foods': { min: -10, max: 10, ideal: 0 },
      'Dairy & Eggs': { min: 32, max: 40, ideal: 36 },
      'Proteins': { min: 32, max: 40, ideal: 36 },
      'Seafood': { min: 30, max: 38, ideal: 34 },
      'Fruits & Vegetables': { min: 32, max: 45, ideal: 38 },
      'Rice & Grains': { min: 50, max: 80, ideal: 65 }
    };
    
    const range = ranges[category as keyof typeof ranges] || { min: 32, max: 70, ideal: 50 };
    
    if (temp < range.min || temp > range.max) return 'fail';
    if (Math.abs(temp - range.ideal) > 5) return 'warning';
    return 'pass';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-soft">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">HACCP Quality Control</h2>
              <p className="text-sm text-gray-600 font-medium">Food safety inspections and compliance tracking</p>
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
          {!selectedItem ? (
            <>
              {/* HACCP Compliance Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-800">HACCP Compliant</span>
                  </div>
                  <p className="text-3xl font-bold text-green-700">
                    {qualityChecks.filter(c => c.haccp_compliant).length}
                  </p>
                  <p className="text-sm text-green-600">Passed inspections</p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <span className="font-bold text-amber-800">Needs Review</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-700">
                    {qualityChecks.filter(c => !c.haccp_compliant && c.overallRating >= 3).length}
                  </p>
                  <p className="text-sm text-amber-600">Minor issues found</p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="font-bold text-red-800">Critical Issues</span>
                  </div>
                  <p className="text-3xl font-bold text-red-700">
                    {qualityChecks.filter(c => c.overallRating < 3).length}
                  </p>
                  <p className="text-sm text-red-600">Immediate action required</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <span className="font-bold text-blue-800">Today's Checks</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">
                    {qualityChecks.filter(c => 
                      format(c.checkDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    ).length}
                  </p>
                  <p className="text-sm text-blue-600">Inspections completed</p>
                </div>
              </div>

              {/* Item Selection for Inspection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Item for Quality Inspection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.slice(0, 9).map(item => {
                    const lastCheck = qualityChecks.filter(c => c.itemId === item.id).sort((a, b) => b.checkDate.getTime() - a.checkDate.getTime())[0];
                    const needsCheck = !lastCheck || (new Date().getTime() - lastCheck.checkDate.getTime()) > (24 * 60 * 60 * 1000);
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-4 border-2 rounded-xl transition-all duration-300 text-left group shadow-soft hover:shadow-elegant ${
                          needsCheck 
                            ? 'border-amber-300 bg-amber-50 hover:border-amber-400' 
                            : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
                            needsCheck 
                              ? 'bg-gradient-to-br from-amber-100 to-orange-100' 
                              : 'bg-gradient-to-br from-green-100 to-emerald-100'
                          }`}>
                            <Shield className={`w-5 h-5 ${needsCheck ? 'text-amber-600' : 'text-green-600'}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.category} • {item.location}</p>
                            {needsCheck && (
                              <p className="text-xs text-amber-600 font-semibold">Inspection due</p>
                            )}
                            {lastCheck && !needsCheck && (
                              <p className="text-xs text-green-600 font-semibold">
                                Last checked: {format(lastCheck.checkDate, 'MMM dd')}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Quality Checks */}
              {qualityChecks.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Quality Inspections</h3>
                  <div className="space-y-3">
                    {qualityChecks.slice(-5).reverse().map(check => (
                      <div key={check.id} className={`rounded-xl p-4 border-2 shadow-soft ${
                        check.haccp_compliant 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                          : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">{check.itemName}</p>
                              {check.haccp_compliant ? (
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">HACCP ✓</span>
                              ) : (
                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">NON-COMPLIANT</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Inspected by {check.inspector} • {format(check.checkDate, 'MMM dd, yyyy HH:mm')}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(check.visualInspection)}`}>
                                {getStatusIcon(check.visualInspection)} Visual
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(check.smellTest)}`}>
                                {getStatusIcon(check.smellTest)} Smell
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(check.textureCheck)}`}>
                                {getStatusIcon(check.textureCheck)} Texture
                              </span>
                              {check.temperatureCheck && (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(getTemperatureStatus(check.temperatureCheck, selectedItem?.category || ''))}`}>
                                  <Thermometer className="w-3 h-3" /> {check.temperatureCheck}°F
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < check.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 font-semibold">{check.overallRating}/5</p>
                          </div>
                        </div>
                        {check.notes && (
                          <div className="mt-3 p-3 bg-white rounded-lg shadow-soft">
                            <p className="text-sm text-gray-700 font-medium">{check.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Quality Inspection Form */
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
                <h3 className="text-lg font-bold text-blue-900 mb-2">HACCP Inspection: {selectedItem.name}</h3>
                <p className="text-blue-700 font-semibold">{selectedItem.category} • {selectedItem.location}</p>
                <p className="text-sm text-blue-600 mt-1">
                  Last updated: {format(new Date(selectedItem.updatedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Visual Inspection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Visual Inspection</label>
                  <div className="space-y-2">
                    {(['pass', 'warning', 'fail'] as const).map(status => (
                      <label key={status} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="visual"
                          value={status}
                          checked={newCheck.visualInspection === status}
                          onChange={(e) => setNewCheck(prev => ({ ...prev, visualInspection: e.target.value as any }))}
                          className="w-4 h-4"
                        />
                        <span className={`flex items-center gap-2 font-semibold ${getStatusColor(status).split(' ')[0]}`}>
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Smell Test */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Smell Test</label>
                  <div className="space-y-2">
                    {(['pass', 'warning', 'fail'] as const).map(status => (
                      <label key={status} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="smell"
                          value={status}
                          checked={newCheck.smellTest === status}
                          onChange={(e) => setNewCheck(prev => ({ ...prev, smellTest: e.target.value as any }))}
                          className="w-4 h-4"
                        />
                        <span className={`flex items-center gap-2 font-semibold ${getStatusColor(status).split(' ')[0]}`}>
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Texture Check */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Texture Check</label>
                  <div className="space-y-2">
                    {(['pass', 'warning', 'fail'] as const).map(status => (
                      <label key={status} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="texture"
                          value={status}
                          checked={newCheck.textureCheck === status}
                          onChange={(e) => setNewCheck(prev => ({ ...prev, textureCheck: e.target.value as any }))}
                          className="w-4 h-4"
                        />
                        <span className={`flex items-center gap-2 font-semibold ${getStatusColor(status).split(' ')[0]}`}>
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Temperature Check */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Temperature (°F)</label>
                  <input
                    type="number"
                    value={newCheck.temperatureCheck}
                    onChange={(e) => setNewCheck(prev => ({ ...prev, temperatureCheck: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    placeholder="Temperature"
                  />
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(getTemperatureStatus(newCheck.temperatureCheck, selectedItem.category))}`}>
                    {getTemperatureStatus(newCheck.temperatureCheck, selectedItem.category) === 'pass' ? '✓ Safe Range' : 
                     getTemperatureStatus(newCheck.temperatureCheck, selectedItem.category) === 'warning' ? '⚠ Monitor' : '✗ Unsafe'}
                  </div>
                </div>
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Overall Quality Rating</label>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200 shadow-soft">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewCheck(prev => ({ ...prev, overallRating: rating }))}
                        className="p-1 hover:scale-110 transition-transform duration-200"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= newCheck.overallRating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-700">{newCheck.overallRating}/5</span>
                    <p className="text-sm text-gray-600">
                      {newCheck.overallRating >= 4 ? 'Excellent Quality' : 
                       newCheck.overallRating >= 3 ? 'Good Quality' : 
                       newCheck.overallRating >= 2 ? 'Acceptable' : 'Poor Quality'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inspector and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Inspector</label>
                  <select
                    value={newCheck.inspector}
                    onChange={(e) => setNewCheck(prev => ({ ...prev, inspector: e.target.value }))}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                  >
                    <option value="Kitchen Manager">Kitchen Manager</option>
                    <option value="Head Chef">Head Chef</option>
                    <option value="Sous Chef">Sous Chef</option>
                    <option value="Food Safety Officer">Food Safety Officer</option>
                    <option value="General Manager">General Manager</option>
                    <option value="Health Inspector">Health Inspector</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Inspection Notes</label>
                  <textarea
                    value={newCheck.notes}
                    onChange={(e) => setNewCheck(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    placeholder="Observations, concerns, corrective actions taken..."
                    rows={4}
                  />
                </div>
              </div>

              {/* HACCP Compliance Check */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
                <h4 className="text-lg font-bold text-green-900 mb-3">HACCP Compliance Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${newCheck.visualInspection === 'pass' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="font-semibold text-gray-700">Visual inspection passed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${newCheck.smellTest === 'pass' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="font-semibold text-gray-700">Smell test passed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${newCheck.textureCheck === 'pass' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="font-semibold text-gray-700">Texture check passed</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${getTemperatureStatus(newCheck.temperatureCheck, selectedItem?.category || '') === 'pass' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="font-semibold text-gray-700">Temperature within range</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${newCheck.overallRating >= 4 ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="font-semibold text-gray-700">Quality rating ≥ 4/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft hover:shadow-elegant hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCheck}
                  className="flex-1 px-6 py-4 gradient-success text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Complete HACCP Inspection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}