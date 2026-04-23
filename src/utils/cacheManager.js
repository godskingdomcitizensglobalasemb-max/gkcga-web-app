// src/utils/cacheManager.js
const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  dynamic: `dynamic-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`
};

// URLs to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/favicon.ico'
];

class CacheManager {
  constructor() {
    this.isServiceWorkerSupported = 'serviceWorker' in navigator;
  }

  // Register service worker
  async registerServiceWorker() {
    if (!this.isServiceWorkerSupported) {
      console.warn('Service workers are not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.notifyUpdate();
          }
        });
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Notify user about updates
  notifyUpdate() {
    if (window.confirm('New version available! Update now?')) {
      this.skipWaiting();
    }
  }

  // Skip waiting and activate new service worker
  async skipWaiting() {
    const registration = await navigator.serviceWorker.ready;
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    
    registration.waiting?.addEventListener('statechange', (event) => {
      if (event.target.state === 'activated') {
        window.location.reload();
      }
    });
  }

  // Cache API responses
  async cacheApiResponse(url, data, ttl = 3600000) { // Default 1 hour TTL
    if (!this.isServiceWorkerSupported) return;

    const cache = await caches.open(CACHE_NAMES.api);
    const response = new Response(JSON.stringify({
      data,
      timestamp: Date.now(),
      ttl
    }));
    
    await cache.put(url, response);
  }

  // Get cached API response
  async getCachedApiResponse(url) {
    if (!this.isServiceWorkerSupported) return null;

    try {
      const cache = await caches.open(CACHE_NAMES.api);
      const response = await cache.match(url);
      
      if (!response) return null;
      
      const cachedData = await response.json();
      const isExpired = Date.now() - cachedData.timestamp > cachedData.ttl;
      
      if (isExpired) {
        await cache.delete(url);
        return null;
      }
      
      return cachedData.data;
    } catch (error) {
      console.error('Error retrieving cached data:', error);
      return null;
    }
  }

  // Clear specific cache
  async clearCache(cacheName) {
    if (!this.isServiceWorkerSupported) return;
    
    try {
      await caches.delete(cacheName);
      console.log(`Cache ${cacheName} cleared`);
    } catch (error) {
      console.error(`Error clearing cache ${cacheName}:`, error);
    }
  }

  // Clear all caches
  async clearAllCaches() {
    if (!this.isServiceWorkerSupported) return;
    
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    );
    console.log('All caches cleared');
  }

  // Precache specific URLs
  async precacheUrls(urls) {
    if (!this.isServiceWorkerSupported) return;
    
    const cache = await caches.open(CACHE_NAMES.static);
    await cache.addAll(urls);
  }
}

export const cacheManager = new CacheManager();