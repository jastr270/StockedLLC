import React, { useState } from 'react';
import { Bot, MessageCircle, Sparkles, X } from 'lucide-react';

interface AIFloatingButtonProps {
  onClick: () => void;
  hasNewInsights?: boolean;
  isOpen?: boolean;
}

export function AIFloatingButton({ onClick, hasNewInsights = false, isOpen = false }: AIFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-16 h-16 rounded-full shadow-elegant transition-all duration-300 flex items-center justify-center group ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'gradient-primary hover:scale-110 hover:shadow-glow'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
        
        {hasNewInsights && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        )}

        {/* Tooltip */}
        {isHovered && !isOpen && (
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shadow-elegant">
            AI Assistant
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black"></div>
          </div>
        )}

        {/* Pulse animation for new insights */}
        {hasNewInsights && !isOpen && (
          <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
        )}
      </button>

      {/* Quick help bubble */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-elegant p-4 border border-gray-200 max-w-xs transform transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-gray-900 text-sm">Need Help?</span>
          </div>
          <p className="text-xs text-gray-600 font-medium">
            Ask me about inventory management, POS integrations, team setup, or anything else!
          </p>
        </div>
      )}
    </div>
  );
}