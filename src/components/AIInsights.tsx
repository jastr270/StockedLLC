import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { AIInsight } from '../types/ai';
import { format } from 'date-fns';

interface AIInsightsProps {
  insights: AIInsight[];
  onActionClick?: (insight: AIInsight) => void;
}

export function AIInsights({ insights, onActionClick }: AIInsightsProps) {
  if (insights.length === 0) {
    return (
      <div className="glass-effect rounded-2xl shadow-elegant p-6 mb-8 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
            <Brain className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-white">AI Insights</h3>
        </div>
        <div className="text-center py-6">
          <Lightbulb className="w-12 h-12 text-white/60 mx-auto mb-3" />
          <p className="text-white/80 font-semibold">All systems running smoothly!</p>
          <p className="text-white/60 text-sm">No urgent recommendations at this time.</p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'alert': return <AlertTriangle className="w-5 h-5" />;
      case 'optimization': return <Target className="w-5 h-5" />;
      case 'prediction': return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getInsightColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'critical': return 'from-red-100 to-pink-100 border-red-200 text-red-800';
      case 'high': return 'from-amber-100 to-orange-100 border-amber-200 text-amber-800';
      case 'medium': return 'from-blue-100 to-indigo-100 border-blue-200 text-blue-800';
      case 'low': return 'from-green-100 to-emerald-100 border-green-200 text-green-800';
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-elegant p-6 mb-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-white">AI Insights & Recommendations</h3>
        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {insights.length}
        </span>
      </div>

      <div className="space-y-4">
        {insights.slice(0, 4).map(insight => (
          <div key={insight.id} className={`bg-gradient-to-r border-2 rounded-2xl p-4 shadow-soft ${getInsightColor(insight.priority)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/50 rounded-lg">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h4 className="font-bold mb-1">{insight.title}</h4>
                  <p className="text-sm font-medium opacity-90">{insight.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold opacity-70">
                      {insight.type.toUpperCase()} • {insight.priority.toUpperCase()}
                    </span>
                    <span className="text-xs opacity-60">
                      {format(insight.createdAt, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
              
              {insight.actionable && onActionClick && (
                <button
                  onClick={() => onActionClick(insight)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 hover:scale-110"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {insights.length > 4 && (
        <div className="mt-4 text-center">
          <button className="text-white/80 hover:text-white text-sm font-semibold hover:underline">
            View all {insights.length} insights
          </button>
        </div>
      )}
    </div>
  );
}