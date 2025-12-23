import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertTriangle, XCircle, Wifi, Database, Cpu, HardDrive } from 'lucide-react';
import { healthMonitor } from '../utils/healthCheck';

export function HealthStatus() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start health monitoring
    healthMonitor.startMonitoring();
    
    // Update health status every 10 seconds
    const updateStatus = () => {
      const status = healthMonitor.getHealthStatus();
      setHealthStatus(status);
      
      // Show health indicator if there are issues
      setIsVisible(status.overall !== 'healthy');
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'unhealthy': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-600 animate-pulse" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'unhealthy': return 'bg-red-50 border-red-200 text-red-800';
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'api': return <Wifi className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'memory': return <Cpu className="w-4 h-4" />;
      case 'localStorage': return <HardDrive className="w-4 h-4" />;
      case 'network': return <Wifi className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (!healthStatus || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-30">
      <div className={`glass-effect rounded-2xl shadow-elegant p-4 border ${getStatusColor(healthStatus.overall)} max-w-sm`}>
        <div className="flex items-center gap-3 mb-3">
          {getStatusIcon(healthStatus.overall)}
          <h3 className="font-bold">System Status</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-auto p-1 hover:bg-black/10 rounded"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          {Object.entries(healthStatus.services).map(([service, check]: [string, any]) => (
            <div key={service} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getServiceIcon(service)}
                <span className="font-semibold capitalize">{service}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(check.status)}
                <span className="text-xs">{check.responseTime}ms</span>
              </div>
            </div>
          ))}
        </div>
        
        {healthStatus.overall !== 'healthy' && (
          <div className="mt-3 pt-3 border-t border-current/20">
            <p className="text-xs font-medium">
              Some services are experiencing issues. The app will continue to work with reduced functionality.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}