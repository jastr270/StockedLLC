import React from 'react';
import { Loader, Package, Users, BarChart3, Wifi } from 'lucide-react';

interface LoadingStateProps {
  type?: 'default' | 'inventory' | 'analytics' | 'team' | 'sync';
  message?: string;
  progress?: number;
}

export function LoadingState({ type = 'default', message, progress }: LoadingStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'inventory': return <Package className="w-8 h-8 text-blue-600" />;
      case 'analytics': return <BarChart3 className="w-8 h-8 text-purple-600" />;
      case 'team': return <Users className="w-8 h-8 text-green-600" />;
      case 'sync': return <Wifi className="w-8 h-8 text-amber-600" />;
      default: return <Loader className="w-8 h-8 text-blue-600 animate-spin" />;
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'inventory': return 'Loading inventory data...';
      case 'analytics': return 'Generating analytics...';
      case 'team': return 'Loading team information...';
      case 'sync': return 'Syncing with POS systems...';
      default: return 'Loading...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="glass-effect rounded-2xl shadow-elegant p-8 text-center">
        <div className="mb-4">
          {getIcon()}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{getMessage()}</h3>
        
        {progress !== undefined && (
          <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

interface SkeletonLoaderProps {
  type: 'card' | 'table' | 'chart' | 'list';
  count?: number;
}

export function SkeletonLoader({ type, count = 3 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="glass-effect rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden animate-pulse">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="h-4 bg-gray-300 rounded w-48"></div>
            </div>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-100 flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-2 bg-gray-100 rounded w-1/4"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        );

      case 'chart':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="h-64 bg-gray-100 rounded-xl flex items-end justify-center gap-2 p-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-gray-300 rounded-t"
                  style={{ 
                    width: '20px', 
                    height: `${Math.random() * 150 + 50}px` 
                  }}
                ></div>
              ))}
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Safely send to error tracking service
    try {
      if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
        // Send to Sentry, LogRocket, etc.
        console.log('Error sent to tracking service');
      }
    } catch (trackingError) {
      // Never let error tracking crash the app
      console.debug('Error tracking failed (non-critical):', trackingError);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl shadow-elegant p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6 font-medium">
              We're sorry, but something unexpected happened. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}