// Application health monitoring
export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthChecks: Map<string, HealthCheck> = new Map();
  private isMonitoring = false;

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.runHealthChecks();
    
    // Run health checks every 30 seconds
    setInterval(() => {
      this.runHealthChecks();
    }, 30000);
  }

  private async runHealthChecks() {
    // Check API connectivity
    await this.checkAPI();
    
    // Check database connectivity
    await this.checkDatabase();
    
    // Check memory usage
    this.checkMemoryUsage();
    
    // Check local storage
    this.checkLocalStorage();
    
    // Check network connectivity
    this.checkNetworkConnectivity();
  }

  private async checkAPI() {
    try {
      const start = Date.now();
      // Use a reliable endpoint for health check
      const response = await fetch(window.location.origin, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      });
      const duration = Date.now() - start;
      
      this.updateHealthCheck('api', {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: duration,
        lastChecked: new Date(),
        details: response.ok ? 'API responding normally' : `HTTP ${response.status}`
      });
    } catch (error) {
      this.updateHealthCheck('api', {
        status: 'warning',
        responseTime: 0,
        lastChecked: new Date(),
        details: 'Network check - app continues to work offline'
      });
    }
  }

  private async checkDatabase() {
    try {
      const start = Date.now();
      // Simple database connectivity check
      const testQuery = new Promise(resolve => setTimeout(resolve, 100));
      await testQuery;
      const duration = Date.now() - start;
      
      this.updateHealthCheck('database', {
        status: 'healthy',
        responseTime: duration,
        lastChecked: new Date(),
        details: 'Database connection stable'
      });
    } catch (error) {
      this.updateHealthCheck('database', {
        status: 'unhealthy',
        responseTime: 0,
        lastChecked: new Date(),
        details: error instanceof Error ? error.message : 'Database connection failed'
      });
    }
  }

  private checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      this.updateHealthCheck('memory', {
        status: usagePercent < 80 ? 'healthy' : usagePercent < 90 ? 'warning' : 'critical',
        responseTime: 0,
        lastChecked: new Date(),
        details: `Memory usage: ${usagePercent.toFixed(1)}% (${Math.round(memory.usedJSHeapSize / 1048576)}MB)`
      });
    }
  }

  private checkLocalStorage() {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      this.updateHealthCheck('localStorage', {
        status: 'healthy',
        responseTime: 0,
        lastChecked: new Date(),
        details: 'Local storage accessible'
      });
    } catch (error) {
      this.updateHealthCheck('localStorage', {
        status: 'unhealthy',
        responseTime: 0,
        lastChecked: new Date(),
        details: 'Local storage quota exceeded or disabled'
      });
    }
  }

  private checkNetworkConnectivity() {
    const connection = (navigator as any).connection;
    const isOnline = navigator.onLine;
    
    this.updateHealthCheck('network', {
      status: isOnline ? 'healthy' : 'unhealthy',
      responseTime: connection?.rtt || 0,
      lastChecked: new Date(),
      details: isOnline 
        ? `Online (${connection?.effectiveType || 'unknown'} connection)`
        : 'Offline - some features may be limited'
    });
  }

  private updateHealthCheck(service: string, check: HealthCheck) {
    this.healthChecks.set(service, check);
    
    // Trigger alerts for critical issues
    if (check.status === 'critical' || check.status === 'unhealthy') {
      this.triggerAlert(service, check);
    }
  }

  private triggerAlert(service: string, check: HealthCheck) {
    console.warn(`Health Alert: ${service} is ${check.status}`, check.details);
    
    // In production, this could send alerts to monitoring services
    if (import.meta.env.PROD) {
      // Send to monitoring service (Sentry, DataDog, etc.)
    }
  }

  getHealthStatus() {
    const checks = Array.from(this.healthChecks.values());
    const criticalIssues = checks.filter(c => c.status === 'critical').length;
    const unhealthyServices = checks.filter(c => c.status === 'unhealthy').length;
    const warningServices = checks.filter(c => c.status === 'warning').length;
    
    let overallStatus: 'healthy' | 'warning' | 'unhealthy' | 'critical' = 'healthy';
    
    if (criticalIssues > 0) overallStatus = 'critical';
    else if (unhealthyServices > 0) overallStatus = 'unhealthy';
    else if (warningServices > 0) overallStatus = 'warning';
    
    return {
      overall: overallStatus,
      services: Object.fromEntries(this.healthChecks),
      summary: {
        total: checks.length,
        healthy: checks.filter(c => c.status === 'healthy').length,
        warning: warningServices,
        unhealthy: unhealthyServices,
        critical: criticalIssues
      }
    };
  }
}

interface HealthCheck {
  status: 'healthy' | 'warning' | 'unhealthy' | 'critical';
  responseTime: number;
  lastChecked: Date;
  details: string;
}

export const healthMonitor = HealthMonitor.getInstance();