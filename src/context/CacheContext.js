// src/context/CacheContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { cacheManager } from '../utils/cacheManager';
import { cookieManager } from '../utils/cookieManager';

const CacheContext = createContext();

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export const CacheProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStats, setCacheStats] = useState({
    staticCacheSize: 0,
    apiCacheSize: 0,
    imageCacheSize: 0
  });
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Register service worker
    const initServiceWorker = async () => {
      const registration = await cacheManager.registerServiceWorker();
      if (registration) {
        setServiceWorkerRegistered(true);
      }
    };

    initServiceWorker();

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache API data with TTL
  const cacheApiData = async (key, data, ttl) => {
    await cacheManager.cacheApiResponse(key, data, ttl);
  };

  // Get cached API data
  const getCachedApiData = async (key) => {
    return await cacheManager.getCachedApiResponse(key);
  };

  // Clear all caches
  const clearAllCaches = async () => {
    await cacheManager.clearAllCaches();
    // Also clear cookies
    cookieManager.clearAll();
  };

  // Set cookie
  const setCookie = (name, value, options) => {
    cookieManager.set(name, value, options);
  };

  // Get cookie
  const getCookie = (name) => {
    return cookieManager.get(name);
  };

  // Set user preferences
  const setUserPreferences = (preferences) => {
    cookieManager.setUserPreferences(preferences);
  };

  // Get user preferences
  const getUserPreferences = () => {
    return cookieManager.getUserPreferences();
  };

  // Set auth token
  const setAuthToken = (token, rememberMe) => {
    cookieManager.setAuthToken(token, rememberMe);
  };

  // Get auth token
  const getAuthToken = () => {
    return cookieManager.getAuthToken();
  };

  const value = {
    isOnline,
    cacheStats,
    serviceWorkerRegistered,
    cacheApiData,
    getCachedApiData,
    clearAllCaches,
    setCookie,
    getCookie,
    setUserPreferences,
    getUserPreferences,
    setAuthToken,
    getAuthToken,
    cookieManager,
    cacheManager
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};