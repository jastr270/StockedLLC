import React, { useRef, useEffect, useState } from 'react';
import { Scan, X, Package, AlertCircle, Info, Shield, Utensils, Search, Database, Zap } from 'lucide-react';
import { lookupBarcode, getBarcodeStats } from '../utils/barcodeDatabase';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string, productInfo?: any) => void;
}

// Real barcode scanning implementation
const initializeBarcodeScanner = (videoElement: HTMLVideoElement, onDetected: (code: string) => void) => {
  try {
    // Try to use Quagga for comprehensive barcode reading
    if (typeof window !== 'undefined' && (window as any).Quagga) {
      const Quagga = (window as any).Quagga;
      
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoElement,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          }
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "upc_reader",
            "upc_e_reader"
          ]
        },
        locate: true,
        locator: {
          patchSize: "medium",
          halfSample: true
        }
      }, (err: any) => {
        if (err) {
          console.error('Quagga init failed:', err);
          return;
        }
        
        Quagga.start();
        Quagga.onDetected((result: any) => {
          const code = result.codeResult.code;
          if (code && code.length >= 8) {
            onDetected(code);
          }
        });
      });
    }
  } catch (error) {
    console.error('Barcode scanner initialization failed:', error);
  }
};

export function BarcodeScanner({ isOpen, onClose, onBarcodeDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string>('');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [scanMethod, setScanMethod] = useState<'auto' | 'manual'>('auto');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError('');
      
      if (!navigator.mediaDevices?.getUserMedia) {
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
        
        // Initialize barcode scanning when video loads
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (scanMethod === 'auto' && videoRef.current) {
            initializeBarcodeScanner(videoRef.current, handleBarcodeDetected);
          }
        });
      }
    } catch (err) {
      handleCameraError(err);
    }
  };

  const handleCameraError = (err: any) => {
    const errorMessage = err?.message || 'Unknown camera error';
    if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
      setError('Camera permission denied. Please enable camera access and refresh the page.');
    } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFoundError')) {
      setError('No camera found. Please ensure your device has a camera.');
    } else if (errorMessage.includes('NotReadableError')) {
      setError('Camera is being used by another application. Please close other camera apps.');
    } else {
      setError('Camera unavailable. You can still manually enter barcodes below.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  const scanManually = () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) {
        // Fallback to manual entry
        const barcode = prompt('Enter barcode:');
        if (barcode) {
          handleBarcodeDetected(barcode);
        }
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        const barcode = prompt('Enter barcode:');
        if (barcode) {
          handleBarcodeDetected(barcode);
        }
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Try to detect QR codes or barcodes in the image
      try {
        // This would use jsQR if available
        if ((window as any).jsQR) {
          const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            handleBarcodeDetected(code.data);
            return;
          }
        }
      } catch (jsQRError) {
        console.debug('jsQR not available:', jsQRError);
      }
      
      // Fallback to manual entry
      const barcode = prompt('Barcode not detected. Enter manually:');
      if (barcode) {
        handleBarcodeDetected(barcode);
      }
    } catch (error) {
      console.error('Manual scanning error:', error);
      const barcode = prompt('Enter barcode:');
      if (barcode) {
        handleBarcodeDetected(barcode);
      }
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    if (detectedBarcode === barcode) return; // Prevent duplicate scans
    
    setDetectedBarcode(barcode);
    setIsLookingUp(true);
    
    try {
      const product = await lookupBarcode(barcode);
      
      setProductInfo(product);
    } catch (error) {
      console.error('Product lookup failed:', error);
      setProductInfo({
        name: `Product ${barcode}`,
        category: 'Other',
        supplier: 'Unknown',
        containerType: 'Package',
        weightPerContainer: 1,
        costPerUnit: 0,
        isDryGood: false,
        upc: barcode,
        error: 'Product lookup failed. Please update details manually.'
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleManualEntry = () => {
    if (manualBarcode && manualBarcode.length >= 8) {
      handleBarcodeDetected(manualBarcode);
      setManualBarcode('');
    } else if (!manualBarcode) {
      const barcode = prompt('Enter barcode:');
      if (barcode && barcode.length >= 8) {
        handleBarcodeDetected(barcode);
      }
    }
  };

  const simulateCommonBarcode = () => {
    const commonBarcodes = [
      '049000000443', // Coca-Cola
      '028400064057', // Pepsi
      '011110087256', // Kraft Mac & Cheese
      '123456789012', // Sysco Rice
      '234567890123'  // US Foods Flour
    ];
    const randomBarcode = commonBarcodes[Math.floor(Math.random() * commonBarcodes.length)];
    handleBarcodeDetected(randomBarcode);
  };

  const handleConfirmProduct = () => {
    if (detectedBarcode && productInfo) {
      onBarcodeDetected(detectedBarcode, productInfo);
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-soft">
              <Scan className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Professional Barcode Scanner</h2>
              <p className="text-sm text-gray-600">Real barcode reading with comprehensive product database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scan Method Toggle */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setScanMethod('auto')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                scanMethod === 'auto'
                  ? 'bg-blue-500 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              Auto Scan
            </button>
            <button
              onClick={() => setScanMethod('manual')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                scanMethod === 'manual'
                  ? 'bg-purple-500 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              Manual Entry
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Camera View */}
          <div className="flex-1 p-6 flex flex-col">
            {error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Issue</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <div className="space-y-3">
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                    >
                      Try Camera Again
                    </button>
                    <button
                      onClick={handleManualEntry}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft"
                    >
                      Enter Barcode Manually
                    </button>
                  </div>
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
                
                {/* Scanning Frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-80 h-48 border-4 border-white rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
                      
                      {/* Scanning line animation */}
                      <div className="absolute inset-2 overflow-hidden rounded-xl">
                        <div className="w-full h-1 bg-red-500 animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
                      </div>
                    </div>
                    <p className="text-white text-center mt-4 font-semibold">
                      {scanMethod === 'auto' ? 'Auto-scanning for barcodes...' : 'Position barcode in frame'}
                    </p>
                  </div>
                </div>

                {/* Detection Status */}
                {detectedBarcode && (
                  <div className="absolute top-4 left-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-soft">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      <span className="font-bold">Barcode Detected: {detectedBarcode}</span>
                      {isLookingUp && (
                        <div className="ml-auto flex items-center gap-2">
                          <Database className="w-4 h-4 animate-pulse" />
                          <span className="text-sm">Looking up product...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Controls */}
            <div className="mt-6 space-y-3">
              {/* Manual Barcode Entry */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter barcode manually..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                />
                <button
                  onClick={handleManualEntry}
                  className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                >
                  Lookup
                </button>
              </div>
              
              {scanMethod === 'manual' && (
                <button
                  onClick={scanManually}
                  disabled={!!error}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant"
                >
                  <Scan className="w-5 h-5" />
                  Scan Barcode Now
                </button>
              )}
              
              <button
                onClick={simulateCommonBarcode}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-soft"
              >
                <Database className="w-5 h-5" />
                Try Sample Product
              </button>
              
              <p className="text-sm text-gray-500 text-center font-medium">
                Reads UPC, EAN, Code 128, Code 39, and QR codes
              </p>
            </div>
          </div>

          {/* Product Information Panel */}
          {productInfo && (
            <div className="w-96 border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto">
              <div className="space-y-6">
                {/* Product Header */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{productInfo.name}</h4>
                  <p className="text-gray-600 font-semibold">{productInfo.category}</p>
                  
                  {productInfo.brand && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500 font-semibold">Brand:</span>
                      <span className="font-bold text-gray-800">{productInfo.brand}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500 font-semibold">UPC:</span>
                    <span className="font-bold text-blue-600">{productInfo.upc || detectedBarcode}</span>
                  </div>
                  
                  {productInfo.costPerUnit > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500 font-semibold">Est. Cost:</span>
                      <span className="font-bold text-green-600">${productInfo.costPerUnit}</span>
                    </div>
                  )}

                  {productInfo.error && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 font-semibold text-sm">⚠️ {productInfo.error}</p>
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                {productInfo.ingredients && productInfo.ingredients.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-4">
                      <Utensils className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-gray-900">Ingredients</h4>
                    </div>
                    <div className="space-y-2">
                      {productInfo.ingredients.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-green-800">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-gray-900">Allergen Information</h4>
                  </div>
                  {productInfo.allergens?.length > 0 ? (
                    <div className="space-y-2">
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-3">
                        <p className="text-red-800 font-bold text-sm mb-2">⚠️ CONTAINS ALLERGENS:</p>
                        <div className="flex flex-wrap gap-2">
                          {productInfo.allergens.map((allergen: string, index: number) => (
                            <span key={index} className={`px-3 py-1 rounded-full text-xs font-bold border ${getAllergenColor(allergen)}`}>
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <p className="text-green-800 font-bold text-sm">✅ No known allergens detected</p>
                    </div>
                  )}
                </div>

                {/* Nutritional Information */}
                {productInfo.nutritionalInfo && (
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-4">
                      <Info className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900">Nutrition Facts</h4>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-xs text-purple-600 font-bold mb-3">
                        Per {productInfo.nutritionalInfo.servingSize}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Calories:</span>
                          <span className="font-bold text-gray-900">{productInfo.nutritionalInfo.calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Protein:</span>
                          <span className="font-bold text-gray-900">{productInfo.nutritionalInfo.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Carbs:</span>
                          <span className="font-bold text-gray-900">{productInfo.nutritionalInfo.carbohydrates}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Fat:</span>
                          <span className="font-bold text-gray-900">{productInfo.nutritionalInfo.fat}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Fiber:</span>
                          <span className="font-bold text-gray-900">{productInfo.nutritionalInfo.fiber}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-semibold">Sodium:</span>
                          <span className="font-bold text-gray-900">{productInfo.nutritionalInfo.sodium}mg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleConfirmProduct}
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
            </div>
          )}
        </div>

        {/* Database Info */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-indigo-900">Professional Barcode System</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800 font-medium">
            <div className="space-y-1">
              <p>• <strong>Restaurant Database:</strong> {getBarcodeStats().localDatabase}+ products</p>
              <p>• <strong>External APIs:</strong> {getBarcodeStats().coverage}</p>
              <p>• <strong>Accuracy Rate:</strong> {getBarcodeStats().accuracy}</p>
            </div>
            <div className="space-y-1">
              <p>• <strong>Real-time Lookup:</strong> Unknown products fetched instantly</p>
              <p>• <strong>Ingredients & Allergens:</strong> Complete food safety data</p>
              <p>• <strong>Offline Caching:</strong> Scanned products saved locally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}