// src/utils/cookieManager.js
class CookieManager {
  constructor() {
    this.defaultOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    };
  }

  // Set a cookie
  set(name, value, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (opts.maxAge) {
      cookieString += `; max-age=${opts.maxAge}`;
    }

    if (opts.domain) {
      cookieString += `; domain=${opts.domain}`;
    }

    if (opts.path) {
      cookieString += `; path=${opts.path}`;
    }

    if (opts.expires) {
      cookieString += `; expires=${opts.expires.toUTCString()}`;
    }

    if (opts.secure) {
      cookieString += '; secure';
    }

    if (opts.sameSite) {
      cookieString += `; samesite=${opts.sameSite}`;
    }

    document.cookie = cookieString;
  }

  // Get a cookie by name
  get(name) {
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      
      if (decodeURIComponent(cookieName) === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    
    return null;
  }

  // Get all cookies as an object
  getAll() {
    const cookies = document.cookie.split(';');
    const result = {};
    
    for (let cookie of cookies) {
      if (cookie.trim()) {
        const [name, value] = cookie.trim().split('=');
        result[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }
    
    return result;
  }

  // Check if a cookie exists
  has(name) {
    return this.get(name) !== null;
  }

  // Delete a cookie
  delete(name, options = {}) {
    const deleteOptions = {
      ...options,
      maxAge: -1,
      expires: new Date(0)
    };
    
    this.set(name, '', deleteOptions);
  }

  // Set JSON data as cookie
  setJSON(name, data, options = {}) {
    try {
      const jsonString = JSON.stringify(data);
      this.set(name, jsonString, options);
    } catch (error) {
      console.error('Error setting JSON cookie:', error);
    }
  }

  // Get JSON data from cookie
  getJSON(name) {
    try {
      const value = this.get(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error parsing JSON cookie:', error);
      return null;
    }
  }

  // Clear all cookies
  clearAll() {
    const cookies = this.getAll();
    
    Object.keys(cookies).forEach(name => {
      this.delete(name);
    });
  }

  // Set user preferences cookie
  setUserPreferences(preferences) {
    this.setJSON('user_preferences', preferences, { maxAge: 365 * 24 * 60 * 60 }); // 1 year
  }

  // Get user preferences
  getUserPreferences() {
    return this.getJSON('user_preferences') || {};
  }

  // Set authentication token
  setAuthToken(token, rememberMe = false) {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
    this.set('auth_token', token, {
      maxAge,
      secure: true,
      sameSite: 'Strict'
    });
  }

  // Get authentication token
  getAuthToken() {
    return this.get('auth_token');
  }

  // Set session data
  setSessionData(data) {
    this.setJSON('session_data', data, {
      maxAge: 24 * 60 * 60 // 1 day
    });
  }

  // Get session data
  getSessionData() {
    return this.getJSON('session_data');
  }

  // Set theme preference
  setTheme(theme) {
    this.set('theme', theme, {
      maxAge: 365 * 24 * 60 * 60 // 1 year
    });
  }

  // Get theme preference
  getTheme() {
    return this.get('theme') || 'light';
  }

  // Set language preference
  setLanguage(lang) {
    this.set('language', lang, {
      maxAge: 365 * 24 * 60 * 60 // 1 year
    });
  }

  // Get language preference
  getLanguage() {
    return this.get('language') || 'en';
  }
}

export const cookieManager = new CookieManager();