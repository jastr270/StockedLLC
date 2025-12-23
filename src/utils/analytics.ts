// Privacy-focused analytics without tracking personal data
export class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.initializeAnalytics();
  }

  private initializeAnalytics() {
    // Track page views
    this.trackPageView(window.location.pathname);
    
    // Track performance metrics
    this.trackPerformanceMetrics();
    
    // Track user engagement
    this.trackUserEngagement();
  }

  trackEvent(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      name,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.pathname
      }
    };

    this.events.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Send to analytics service (if configured)
    this.sendToAnalytics(event);
  }

  trackPageView(path: string) {
    this.trackEvent('page_view', { path });
  }

  trackFeatureUsage(feature: string, action: string) {
    this.trackEvent('feature_usage', { feature, action });
  }

  trackPerformanceMetrics() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'largest-contentful-paint') {
            this.trackEvent('performance_metric', {
              metric: 'LCP',
              value: entry.startTime,
              rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs_improvement' : 'poor'
            });
          }
        });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  trackUserEngagement() {
    let startTime = Date.now();
    let isActive = true;

    // Track session duration
    const trackSession = () => {
      if (isActive) {
        const duration = Date.now() - startTime;
        this.trackEvent('session_duration', { duration });
      }
    };

    // Track when user becomes inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        trackSession();
      } else {
        isActive = true;
        startTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', trackSession);
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Only send in production and if analytics is configured
    try {
      if (import.meta.env.PROD && import.meta.env.VITE_ANALYTICS_ENDPOINT) {
        fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        }).catch(() => {
          // Silently fail - analytics shouldn't break the app
        });
      }
    } catch (error) {
      // Prevent any analytics errors from crashing the app
      console.debug('Analytics error (non-critical):', error);
    }
  }

  getSessionStats() {
    const sessionEvents = this.events.filter(e => e.properties.sessionId === this.sessionId);
    return {
      totalEvents: sessionEvents.length,
      sessionDuration: Date.now() - new Date(sessionEvents[0]?.properties.timestamp || Date.now()).getTime(),
      featuresUsed: Array.from(new Set(sessionEvents.map(e => e.properties.feature).filter(Boolean))),
      pagesVisited: Array.from(new Set(sessionEvents.filter(e => e.name === 'page_view').map(e => e.properties.path)))
    };
  }
}

interface AnalyticsEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
}

export const analytics = Analytics.getInstance();