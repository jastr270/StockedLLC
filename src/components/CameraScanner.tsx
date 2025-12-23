import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Package, AlertCircle, Info, Shield, Utensils, Scan, Eye, Brain, Zap } from 'lucide-react';
import { ScanResult, DetectedItem } from '../types/inventory';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string, productInfo?: any) => void;
  onMultiItemDetected?: (scanResult: ScanResult) => void;
}

// Enhanced product database with ingredients and allergens
const PRODUCT_DATABASE: Record<string, any> = {
  '012345678901': {
    name: 'White Rice - Premium Grade',
    category: 'Rice & Grains',
    supplier: 'Sysco',
    containerType: 'Rice Bag (25 lbs)',
    weightPerContainer: 25,
    costPerUnit: 18.50,
    isDryGood: true,
    densityLbsPerCup: 0.41,
    ingredients: ['White Rice'],
    allergens: [],
    nutritionalInfo: {
      calories: 205,
      protein: 4.3,
      carbohydrates: 44.5,
      fat: 0.4,
      fiber: 0.6,
      sodium: 1,
      servingSize: '1 cup cooked'
    }
  },
  '012345678902': {
    name: 'All-Purpose Flour',
    category: 'Flour & Baking',
    supplier: 'US Foods',
    containerType: 'Flour Bag (25 lbs)',
    weightPerContainer: 25,
    costPerUnit: 12.75,
    isDryGood: true,
    densityLbsPerCup: 0.26,
    ingredients: ['Enriched Wheat Flour', 'Niacin', 'Iron', 'Thiamine Mononitrate', 'Riboflavin', 'Folic Acid'],
    allergens: ['Wheat', 'Gluten'],
    nutritionalInfo: {
      calories: 455,
      protein: 12.9,
      carbohydrates: 95.4,
      fat: 1.2,
      fiber: 3.4,
      sodium: 2,
      servingSize: '1 cup'
    }
  },
  '012345678903': {
    name: 'Black Beans - Organic',
    category: 'Beans & Legumes',
    supplier: 'Performance Food Group',
    containerType: 'Bean Bag (25 lbs)',
    weightPerContainer: 25,
    costPerUnit: 22.00,
    isDryGood: true,
    densityLbsPerCup: 0.44,
    ingredients: ['Organic Black Beans'],
    allergens: [],
    nutritionalInfo: {
      calories: 227,
      protein: 15.2,
      carbohydrates: 40.8,
      fat: 0.9,
      fiber: 15.0,
      sodium: 2,
      servingSize: '1 cup cooked'
    }
  }
};

// AI-powered item detection simulation
const detectItemsInImage = async (imageData: string): Promise<ScanResult> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Simulate detecting multiple items
  const detectedItems: DetectedItem[] = [
    {
      containerType: 'Rice Bag (25 lbs)',
      estimatedWeight: 25.0,
      estimatedVolume: 60.0,
      isDryGood: true,
      grainType: 'White Rice',
      recognizedFood: {
        name: 'White Rice (Long Grain)',
        category: 'Rice & Grains',
        confidence: 0.92,
        visualCues: ['white color', 'grain texture', 'bag shape', 'commercial packaging']
      }
    },
    {
      containerType: 'Rice Bag (25 lbs)',
      estimatedWeight: 25.0,
      estimatedVolume: 60.0,
      isDryGood: true,
      grainType: 'White Rice',
      recognizedFood: {
        name: 'White Rice (Long Grain)',
        category: 'Rice & Grains',
        confidence: 0.89,
        visualCues: ['white color', 'grain texture', 'bag shape', 'stacked position']
      }
    },
    {
      containerType: 'Bean Bag (25 lbs)',
      estimatedWeight: 25.0,
      estimatedVolume: 57.0,
      isDryGood: true,
      grainType: 'Black Beans',
      recognizedFood: {
        name: 'Black Beans (Organic)',
        category: 'Beans & Legumes',
        confidence: 0.87,
        visualCues: ['dark color', 'bean texture', 'organic label', 'bag packaging']
      }
    },
    {
      containerType: 'Flour Bag (25 lbs)',
      estimatedWeight: 25.0,
      estimatedVolume: 96.0,
      isDryGood: true,
      grainType: 'All-Purpose Flour',
      recognizedFood: {
        name: 'All-Purpose Flour',
        category: 'Flour & Baking',
        confidence: 0.94,
        visualCues: ['white powder', 'flour texture', 'paper bag', 'brand labeling']
      }
    }
  ];

  return {
    totalCount: detectedItems.length,
    detectedItems,
    confidence: 0.91,
    processingTime: 3.2
  };
};

export function CameraScanner({ isOpen, onClose, onBarcodeDetected, onMultiItemDetected }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanMode, setScanMode] = useState<'barcode' | 'multi-item'>('barcode');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string>('');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [multiItemResult, setMultiItemResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError('');
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown camera error';
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setError('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (errorMessage.includes('NotFoundError')) {
        setError('No camera found. Please ensure your device has a camera.');
      } else {
        setError('Unable to access camera. Please check your device and browser settings.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const scanForBarcode = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const mockBarcodes = Object.keys(PRODUCT_DATABASE);
      const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      
      setDetectedBarcode(randomBarcode);
      const product = PRODUCT_DATABASE[randomBarcode];
      setProductInfo(product);
      setIsScanning(false);
    }, 1500);
  };

  const scanForMultipleItems = async () => {
    setIsScanning(true);
    setMultiItemResult(null);
    
    try {
      // Capture current frame from video
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (canvas && video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        // Convert to base64 for AI processing
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // AI-powered multi-item detection
        const result = await detectItemsInImage(imageData);
        setMultiItemResult(result);
      }
    } catch (error) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmBarcode = () => {
    if (detectedBarcode && productInfo) {
      onBarcodeDetected(detectedBarcode, productInfo);
      onClose();
    }
  };

  const handleConfirmMultiItems = () => {
    if (multiItemResult && onMultiItemDetected) {
      onMultiItemDetected(multiItemResult);
      onClose();
    }
  };

  const getAllergenColor = (allergen: string) => {
    const colors = {
      'Milk': 'bg-blue-100 text-blue-800 border-blue-200',
      'Wheat': 'bg-amber-100 text-amber-800 border-amber-200',
      'Gluten': 'bg-amber-100 text-amber-800 border-amber-200',
      'Fish': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Shellfish': 'bg-teal-100 text-teal-800 border-teal-200',
      'Eggs': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Nuts': 'bg-orange-100 text-orange-800 border-orange-200',
      'Soy': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[allergen as keyof typeof colors] || 'bg-red-100 text-red-800 border-red-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-soft">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Smart Camera Scanner</h2>
              <p className="text-sm text-gray-600">AI-powered barcode scanning and multi-item detection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scan Mode Toggle */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setScanMode('barcode')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                scanMode === 'barcode'
                  ? 'bg-blue-500 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <Scan className="w-4 h-4" />
              Barcode Scanner
            </button>
            <button
              onClick={() => setScanMode('multi-item')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                scanMode === 'multi-item'
                  ? 'bg-purple-500 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
              }`}
            >
              <Brain className="w-4 h-4" />
              AI Multi-Item Detection
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-3 font-medium">
            {scanMode === 'barcode' 
              ? 'Scan individual product barcodes for detailed info'
              : 'AI counts and identifies multiple items automatically'
            }
          </p>
        </div>

        <div className="flex-1 flex">
          {/* Camera View */}
          <div className="flex-1 p-6 flex flex-col">
            {error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Error</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative bg-black rounded-2xl overflow-hidden shadow-soft">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanMode === 'barcode' ? (
                    /* Barcode Scanning Frame */
                    <div className="relative">
                      <div className="w-64 h-40 border-4 border-white rounded-2xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
                        
                        {isScanning && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 animate-pulse rounded-2xl"></div>
                        )}
                      </div>
                      <p className="text-white text-center mt-4 font-semibold">
                        {isScanning ? 'Scanning barcode...' : 'Position barcode in frame'}
                      </p>
                    </div>
                  ) : (
                    /* Multi-Item Detection Grid */
                    <div className="relative w-full h-full">
                      {/* AI Detection Grid */}
                      <div className="absolute inset-4 border-2 border-purple-400 rounded-2xl">
                        <div className="grid grid-cols-3 grid-rows-3 h-full gap-2 p-2">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`border border-purple-300 rounded-lg ${
                                isScanning ? 'bg-purple-500/20 animate-pulse' : 'bg-purple-500/10'
                              }`}
                              style={{ animationDelay: `${i * 100}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* AI Status */}
                      <div className="absolute top-4 left-4 right-4">
                        <div className="bg-purple-500 text-white p-4 rounded-xl shadow-soft">
                          <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            <span className="font-bold">
                              {isScanning ? 'AI analyzing inventory...' : 'AI ready to detect multiple items'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center font-semibold bg-black/50 px-4 py-2 rounded-lg">
                        {isScanning ? 'Counting items and estimating weights...' : 'Point camera at storage area with multiple items'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Detection Results Overlay */}
                {scanMode === 'barcode' && detectedBarcode && (
                  <div className="absolute top-4 left-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-soft">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      <span className="font-bold">Product Detected: {detectedBarcode}</span>
                    </div>
                  </div>
                )}

                {scanMode === 'multi-item' && multiItemResult && (
                  <div className="absolute top-4 left-4 right-4 bg-purple-500 text-white p-4 rounded-xl shadow-soft">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span className="font-bold">
                        Detected {multiItemResult.totalCount} items • {multiItemResult.confidence * 100}% confidence
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Controls */}
            <div className="mt-6 space-y-4">
              {scanMode === 'barcode' ? (
                <button
                  onClick={scanForBarcode}
                  disabled={isScanning || !!error}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant"
                >
                  <Scan className="w-5 h-5" />
                  {isScanning ? 'Scanning Barcode...' : 'Scan Product Barcode'}
                </button>
              ) : (
                <button
                  onClick={scanForMultipleItems}
                  disabled={isScanning || !!error}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 gradient-secondary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant"
                >
                  <Brain className="w-5 h-5" />
                  {isScanning ? 'AI Analyzing Items...' : 'Detect Multiple Items'}
                </button>
              )}
              
              <p className="text-sm text-gray-500 text-center font-medium">
                {scanMode === 'barcode' 
                  ? 'Scan any food product to get ingredients, allergens, and nutrition info'
                  : 'AI will count items, estimate weights, and identify food types automatically'
                }
              </p>
            </div>
          </div>

          {/* Results Panel */}
          {((scanMode === 'barcode' && productInfo) || (scanMode === 'multi-item' && multiItemResult)) && (
            <div className="w-96 border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto">
              {scanMode === 'barcode' && productInfo ? (
                /* Barcode Product Info */
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{productInfo.name}</h4>
                    <p className="text-gray-600 font-semibold">{productInfo.category}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500 font-semibold">Supplier:</span>
                      <span className="font-bold text-gray-800">{productInfo.supplier}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500 font-semibold">Cost:</span>
                      <span className="font-bold text-green-600">${productInfo.costPerUnit}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-4">
                      <Utensils className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-gray-900">Ingredients</h4>
                    </div>
                    <div className="space-y-2">
                      {productInfo.ingredients?.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-green-800">{ingredient}</span>
                        </div>
                      )) || <p className="text-gray-500 text-sm">No ingredient information available</p>}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-gray-900">Allergen Information</h4>
                    </div>
                    {productInfo.allergens?.length > 0 ? (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-red-800 font-bold text-sm mb-2">⚠️ CONTAINS ALLERGENS:</p>
                        <div className="flex flex-wrap gap-2">
                          {productInfo.allergens.map((allergen: string, index: number) => (
                            <span key={index} className={`px-3 py-1 rounded-full text-xs font-bold border ${getAllergenColor(allergen)}`}>
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                        <p className="text-green-800 font-bold text-sm">✅ No known allergens detected</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleConfirmBarcode}
                      className="w-full px-6 py-4 gradient-success text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Add to Inventory
                    </button>
                    <button
                      onClick={() => {
                        setDetectedBarcode('');
                        setProductInfo(null);
                      }}
                      className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft"
                    >
                      Scan Another Item
                    </button>
                  </div>
                </div>
              ) : (
                /* Multi-Item Detection Results */
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">AI Detection Results</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 font-semibold">Items Found:</span>
                        <span className="ml-2 text-purple-700 font-bold">{multiItemResult?.totalCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold">Confidence:</span>
                        <span className="ml-2 text-green-600 font-bold">{((multiItemResult?.confidence || 0) * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold">Total Weight:</span>
                        <span className="ml-2 text-blue-600 font-bold">
                          {multiItemResult?.detectedItems.reduce((sum, item) => sum + item.estimatedWeight, 0).toFixed(1)} lbs
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold">Processing:</span>
                        <span className="ml-2 text-amber-600 font-bold">{multiItemResult?.processingTime.toFixed(1)}s</span>
                      </div>
                    </div>
                  </div>

                  {multiItemResult?.detectedItems && (
                    <div className="bg-white rounded-2xl p-6 shadow-soft">
                      <h4 className="font-bold text-gray-900 mb-4">Detected Items</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {multiItemResult.detectedItems.map((item, index) => (
                          <div key={index} className={`p-4 rounded-xl border-2 shadow-soft ${
                            item.isDryGood 
                              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
                              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                          }`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-gray-900">
                                  {item.recognizedFood?.name || item.containerType}
                                </p>
                                <p className="text-sm text-gray-600 font-semibold">
                                  {item.recognizedFood?.category || 'Unknown Category'}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    item.isDryGood ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {item.isDryGood ? 'Dry Good' : 'Perishable'}
                                  </span>
                                  <span className="text-xs text-gray-500 font-semibold">
                                    {(item.recognizedFood?.confidence || 0) * 100}% sure
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">{item.estimatedWeight.toFixed(1)} lbs</p>
                                {item.estimatedVolume && (
                                  <p className="text-sm text-gray-600">{item.estimatedVolume.toFixed(0)} cups</p>
                                )}
                              </div>
                            </div>
                            
                            {item.recognizedFood?.visualCues && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 font-medium">
                                  Visual cues: {item.recognizedFood.visualCues.slice(0, 3).join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {multiItemResult && (
                    <div className="space-y-3">
                      <button
                        onClick={handleConfirmMultiItems}
                        className="w-full px-6 py-4 gradient-secondary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        Add All {multiItemResult.totalCount} Items
                      </button>
                      <button
                        onClick={() => setMultiItemResult(null)}
                        className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft"
                      >
                        Scan Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Features Info */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-indigo-900">AI-Powered Features</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800 font-medium">
            <div className="space-y-1">
              <p>• <strong>Multi-item counting:</strong> Detects multiple containers at once</p>
              <p>• <strong>Weight estimation:</strong> Calculates weight from container size</p>
              <p>• <strong>Food recognition:</strong> Identifies rice, beans, flour, etc.</p>
            </div>
            <div className="space-y-1">
              <p>• <strong>Confidence scoring:</strong> Shows detection accuracy</p>
              <p>• <strong>Visual analysis:</strong> Uses color, texture, shape cues</p>
              <p>• <strong>Batch processing:</strong> Add multiple items instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}