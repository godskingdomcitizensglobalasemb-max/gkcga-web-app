// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({});
  const lastNotificationRef = useRef({ message: '', type: '', timestamp: 0 });

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      // Clear all timers when component unmounts
      Object.values(timersRef.current).forEach(timerId => {
        clearTimeout(timerId);
      });
    };
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Clear the timer for this notification
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    // Prevent duplicate notifications within 2 seconds
    const now = Date.now();
    const lastNotif = lastNotificationRef.current;
    
    if (
      lastNotif.message === message && 
      lastNotif.type === type && 
      now - lastNotif.timestamp < 2000
    ) {
      console.log('Duplicate notification prevented:', message);
      return;
    }

    // Update last notification
    lastNotificationRef.current = {
      message,
      type,
      timestamp: now
    };

    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);

    // For console logging during development
    console.log(`[${type.toUpperCase()}] ${message}`);

    if (duration > 0) {
      // Store timer ID for cleanup
      timersRef.current[id] = setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    Object.values(timersRef.current).forEach(timerId => {
      clearTimeout(timerId);
    });
    timersRef.current = {};
    setNotifications([]);
    lastNotificationRef.current = { message: '', type: '', timestamp: 0 };
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        showNotification, 
        removeNotification,
        clearAllNotifications 
      }}
    >
      {children}
      {/* Render notifications */}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

// Separate component for notifications to prevent re-renders
const NotificationContainer = React.memo(({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onRemove={onRemove} 
        />
      ))}
    </div>
  );
});

const NotificationItem = React.memo(({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300); // Match animation duration
  }, [notification.id, onRemove]);

  // Auto close after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4700); // Slightly less than the notification duration to allow for exit animation

    return () => clearTimeout(timer);
  }, [handleClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} text-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          {getIcon()}
          <div className="flex-1 mr-2">
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div 
        className="h-1 bg-white/30 animate-progress"
        style={{ 
          animation: `progress ${4700}ms linear forwards`
        }}
      />
    </div>
  );
});

// Add CSS animation to your global styles or here
const style = document.createElement('style');
style.textContent = `
  @keyframes progress {
    0% { width: 100%; }
    100% { width: 0%; }
  }
`;
document.head.appendChild(style);