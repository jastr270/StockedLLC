export const initializeErrorTracking = () => {
  if (import.meta.env.PROD) {
    // Error tracking would be initialized here in production
    console.log('Error tracking initialized');
  }
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error('Application Error:', error, context);
  
  if (import.meta.env.PROD) {
    // Send to error tracking service in production
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  console.log(`[${level.toUpperCase()}]`, message);
  
  if (import.meta.env.PROD) {
    // Send to error tracking service in production
  }
};