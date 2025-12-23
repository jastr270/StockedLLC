// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    try {
      this.initializeObservers();
    } catch (error) {
      console.error('Performance monitoring initialization failed:', error);
    }
  }

  private initializeObservers() {
    // Monitor Core Web Vitals
    if (typeof PerformanceObserver !== 'undefined') {
      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          try {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.recordMetric('LCP', lastEntry.startTime);
          } catch (error) {
            console.debug('LCP measurement error:', error);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.debug('LCP observer not supported:', error);
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            this.recordMetric('CLS', entry.value);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }

    // Send to analytics if performance is poor
    if (this.shouldAlert(name, value)) {
      this.sendPerformanceAlert(name, value);
    }
  }

  private shouldAlert(metric: string, value: number): boolean {
    const thresholds = {
      'LCP': 2500, // 2.5 seconds
      'FID': 100,  // 100ms
      'CLS': 0.1   // 0.1 cumulative score
    };
    return value > (thresholds[metric as keyof typeof thresholds] || Infinity);
  }

  private sendPerformanceAlert(metric: string, value: number) {
    // In production, send to monitoring service
    console.warn(`Performance Alert: ${metric} = ${value}`);
    
    // Could integrate with services like:
    // - Sentry for error tracking
    // - DataDog for performance monitoring
    // - New Relic for application monitoring
  }

  getMetrics() {
    const result: Record<string, { avg: number; p95: number; latest: number }> = {};
    
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const p95Index = Math.floor(sorted.length * 0.95);
        const p95 = sorted[p95Index] || sorted[sorted.length - 1];
        const latest = values[values.length - 1];
        
        result[name] = { avg, p95, latest };
      }
    });
    
    return result;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Database optimization utilities
export class DatabaseOptimizer {
  private static queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static cacheQuery(key: string, data: any, ttl: number = this.DEFAULT_TTL) {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Cleanup old entries
    this.cleanupCache();
  }

  static getCachedQuery(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.queryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private static cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.queryCache.delete(key);
      }
    }
  }

  static clearCache() {
    this.queryCache.clear();
  }

  // Batch operations for better performance
  static batchUpdate(updates: Array<{ id: string; data: any }>) {
    // Group updates by type for efficient batch processing
    const batches = new Map<string, any[]>();
    
    updates.forEach(update => {
      const type = update.data.type || 'default';
      if (!batches.has(type)) {
        batches.set(type, []);
      }
      batches.get(type)!.push(update);
    });

    // Process each batch
    return Promise.all(
      Array.from(batches.entries()).map(([type, batch]) => 
        this.processBatch(type, batch)
      )
    );
  }

  private static async processBatch(type: string, batch: any[]) {
    // Simulate batch processing with delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return batch.map(item => ({ ...item, processed: true }));
  }
}

// Memory management for large datasets
export class MemoryManager {
  private static readonly MAX_ITEMS_IN_MEMORY = 1000;
  private static readonly CLEANUP_THRESHOLD = 0.8; // 80% of max

  static shouldVirtualize(itemCount: number): boolean {
    return itemCount > 100; // Virtualize lists over 100 items
  }

  static shouldPaginate(itemCount: number): boolean {
    return itemCount > 50; // Paginate over 50 items
  }

  static getOptimalPageSize(itemCount: number): number {
    if (itemCount < 100) return itemCount;
    if (itemCount < 1000) return 25;
    if (itemCount < 10000) return 50;
    return 100;
  }

  static shouldLazyLoad(componentType: string): boolean {
    const lazyComponents = ['analytics', 'reports', 'pos-integrations', 'quality-control'];
    return lazyComponents.includes(componentType);
  }

  // Memory usage monitoring
  static getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }
    return null;
  }

  static shouldTriggerCleanup(): boolean {
    const usage = this.getMemoryUsage();
    return usage ? usage.percentage > 80 : false;
  }
}

// Network optimization
export class NetworkOptimizer {
  private static requestQueue: Array<() => Promise<any>> = [];
  private static isProcessing = false;
  private static readonly MAX_CONCURRENT = 6; // Browser limit

  static async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private static async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;
    const batch = this.requestQueue.splice(0, this.MAX_CONCURRENT);
    
    try {
      await Promise.all(batch.map(request => request()));
    } catch (error) {
      console.error('Batch request failed:', error);
    }

    this.isProcessing = false;
    
    // Process next batch if queue has items
    if (this.requestQueue.length > 0) {
      setTimeout(() => this.processQueue(), 10);
    }
  }

  // Preload critical resources
  static preloadCriticalResources() {
    const criticalImages = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg'
    ];

    criticalImages.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Compress data before sending
  static compressData(data: any): string {
    // Simple compression - in production use proper compression library
    return JSON.stringify(data);
  }

  // Check connection quality
  static getConnectionInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }
}