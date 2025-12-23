import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, Lightbulb, Zap, MessageCircle, Mic, MicOff } from 'lucide-react';
import { AIMessage, AIConversation, AI_CAPABILITIES } from '../types/ai';
import { aiAssistant } from '../utils/aiAssistant';
import { InventoryItem } from '../types/inventory';
import { format } from 'date-fns';

interface AIAssistantProps {
  items: InventoryItem[];
  userRole: string;
  teamName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ items, userRole, teamName, isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: AIMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: `👋 Hi! I'm your AI inventory assistant for **${teamName}**. I can help you with inventory management, analytics, POS integrations, and more!\n\n**Quick stats:**\n• ${items.length} items in inventory\n• ${items.filter(i => i.quantity <= i.minimumStock).length} items need attention\n• ${items.filter(i => i.expirationDate && new Date(i.expirationDate) <= new Date(Date.now() + 7*24*60*60*1000)).length} items expiring soon\n\nWhat would you like help with today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, items.length, teamName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        try {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: AIMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await aiAssistant.processMessage(messageToSend, {
        items,
        userRole,
        teamName
      });

      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const quickActions = aiAssistant.getQuickActions(items);
  const insights = aiAssistant.generateInsights(items);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-4xl h-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl shadow-soft">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Inventory Assistant</h2>
              <p className="text-sm text-gray-600 font-medium">Smart help for {teamName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">AI Insights</h3>
            </div>
            <div className="space-y-2">
              {insights.slice(0, 2).map(insight => (
                <div key={insight.id} className={`p-3 rounded-xl border text-sm ${
                  insight.priority === 'critical' ? 'bg-red-50 border-red-200 text-red-800' :
                  insight.priority === 'high' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <p className="font-bold">{insight.title}</p>
                  <p>{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-soft ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-white border border-gray-200'
              }`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-600">AI Assistant</span>
                  </div>
                )}
                <div className={`text-sm font-medium whitespace-pre-line ${
                  message.type === 'user' ? 'text-white' : 'text-gray-800'
                }`}>
                  {message.content}
                </div>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {format(message.timestamp, 'HH:mm')}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-600">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-gray-700">Quick Actions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 6).map((action, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(action.query)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-sm font-semibold text-gray-700 hover:text-purple-700 flex items-center gap-2"
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about inventory management..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft pr-12"
              />
              {recognitionRef.current && (
                <button
                  onClick={handleVoiceInput}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-4 gradient-primary text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          
          {isListening && (
            <div className="mt-3 flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Listening... Speak now</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}