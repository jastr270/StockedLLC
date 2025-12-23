// Service Worker for offline functionality and caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, show update notification
                showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    });
  }
};

const showUpdateNotification = () => {
  // Show a toast notification for app updates
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
        <span class="text-xs">🔄</span>
      </div>
      <div>
        <p class="font-semibold">App Update Available</p>
        <p class="text-sm opacity-90">Refresh to get the latest features</p>
      </div>
      <button onclick="window.location.reload()" class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-semibold">
        Update
      </button>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 10000);
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
};