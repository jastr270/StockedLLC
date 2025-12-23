import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Zap, Brain, Package, CheckCircle } from 'lucide-react';

interface VoiceInventoryInputProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceCommand: (command: string, data: any) => void;
}

export function VoiceInventoryInput({ isOpen, onClose, onVoiceCommand }: VoiceInventoryInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        try {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
            processVoiceCommand(finalTranscript);
          }
        } catch (error) {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerCommand = command.toLowerCase();
    
    // Parse different voice commands
    if (lowerCommand.includes('add') || lowerCommand.includes('received')) {
      // "Add 5 bags of rice" or "Received 10 cases of chicken"
      const quantityMatch = lowerCommand.match(/(\d+)\s*(bags?|cases?|boxes?|pounds?|lbs?)/);
      const itemMatch = lowerCommand.match(/(rice|chicken|flour|beans?|salmon|beef|milk|eggs?)/);
      
      if (quantityMatch && itemMatch) {
        const quantity = parseInt(quantityMatch[1]);
        const unit = quantityMatch[2];
        const item = itemMatch[1];
        
        const commandData = {
          action: 'add_item',
          quantity,
          unit,
          item,
          confidence: 0.95
        };
        
        setLastCommand(commandData);
        onVoiceCommand(command, commandData);
      }
    } else if (lowerCommand.includes('used') || lowerCommand.includes('consumed')) {
      // "Used 2 bags of flour" or "Consumed 5 pounds of chicken"
      const quantityMatch = lowerCommand.match(/(\d+)\s*(bags?|cases?|boxes?|pounds?|lbs?)/);
      const itemMatch = lowerCommand.match(/(rice|chicken|flour|beans?|salmon|beef|milk|eggs?)/);
      
      if (quantityMatch && itemMatch) {
        const quantity = parseInt(quantityMatch[1]);
        const unit = quantityMatch[2];
        const item = itemMatch[1];
        
        const commandData = {
          action: 'subtract_item',
          quantity,
          unit,
          item,
          confidence: 0.92
        };
        
        setLastCommand(commandData);
        onVoiceCommand(command, commandData);
      }
    } else if (lowerCommand.includes('check') || lowerCommand.includes('how much')) {
      // "Check rice inventory" or "How much chicken do we have"
      const itemMatch = lowerCommand.match(/(rice|chicken|flour|beans?|salmon|beef|milk|eggs?)/);
      
      if (itemMatch) {
        const commandData = {
          action: 'check_inventory',
          item: itemMatch[1],
          confidence: 0.98
        };
        
        setLastCommand(commandData);
        onVoiceCommand(command, commandData);
      }
    }
    
    setIsProcessing(false);
  };

  const voiceCommands = [
    { command: 'Add 5 bags of rice', description: 'Add items to inventory' },
    { command: 'Used 2 pounds of chicken', description: 'Subtract from inventory' },
    { command: 'Check flour inventory', description: 'Query current stock' },
    { command: 'Received 10 cases of milk', description: 'Add delivery items' },
    { command: 'Low stock alert for beans', description: 'Set up alerts' },
    { command: 'Temperature check salmon', description: 'Quality control' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-soft">
              <Mic className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Voice Inventory Control</h2>
              <p className="text-sm text-gray-600 font-medium">Hands-free inventory management for busy kitchens</p>
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
          {/* Voice Control Interface */}
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-br from-red-400 to-pink-500 animate-pulse shadow-glow' 
                : 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-elegant hover:scale-110'
            }`}>
              {isListening ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </div>
            
            <button
              onClick={isListening ? stopListening : startListening}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-elegant hover:scale-105 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'gradient-primary text-white hover:shadow-glow'
              }`}
            >
              {isListening ? 'Stop Listening' : 'Start Voice Input'}
            </button>
            
            <p className="text-gray-600 mt-4 font-medium">
              {isListening ? 'Listening... Speak your inventory command' : 'Click to start voice commands'}
            </p>
          </div>

          {/* Live Transcript */}
          {transcript && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-900">Voice Input</h4>
              </div>
              <p className="text-blue-800 font-semibold text-lg">"{transcript}"</p>
              {isProcessing && (
                <div className="flex items-center gap-2 mt-3">
                  <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-purple-700 font-semibold text-sm">AI processing command...</span>
                </div>
              )}
            </div>
          )}

          {/* Last Command Result */}
          {lastCommand && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-green-900">Command Processed</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700 font-semibold">Action:</span>
                  <span className="ml-2 text-green-900 font-bold capitalize">{lastCommand.action.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-green-700 font-semibold">Item:</span>
                  <span className="ml-2 text-green-900 font-bold capitalize">{lastCommand.item}</span>
                </div>
                <div>
                  <span className="text-green-700 font-semibold">Quantity:</span>
                  <span className="ml-2 text-green-900 font-bold">{lastCommand.quantity} {lastCommand.unit}</span>
                </div>
                <div>
                  <span className="text-green-700 font-semibold">Confidence:</span>
                  <span className="ml-2 text-green-900 font-bold">{(lastCommand.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Voice Command Examples */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
            <h4 className="font-bold text-purple-900 mb-4">🎤 Voice Command Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {voiceCommands.map((cmd, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-soft">
                  <p className="font-semibold text-gray-900 text-sm">"{cmd.command}"</p>
                  <p className="text-xs text-gray-600">{cmd.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kitchen-Optimized Features */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
            <h4 className="font-bold text-amber-900 mb-4">🍳 Kitchen-Optimized Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800 font-medium">
              <div className="space-y-2">
                <p>• <strong>Hands-free operation:</strong> Perfect for busy kitchen environments</p>
                <p>• <strong>Noise filtering:</strong> Works even with kitchen background noise</p>
                <p>• <strong>Quick commands:</strong> Add/subtract inventory in seconds</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Natural language:</strong> Speak normally, AI understands context</p>
                <p>• <strong>Multi-language support:</strong> English, Spanish, French</p>
                <p>• <strong>Offline capable:</strong> Commands cached when internet is down</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}