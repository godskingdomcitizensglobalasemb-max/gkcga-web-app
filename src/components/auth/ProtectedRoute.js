// src/components/auth/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute - Checking access');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('Loading:', loading);
    console.log('Location:', location.pathname);
    
    // Check localStorage as backup during transition
    const storedLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    console.log('Stored logged in status:', storedLoggedIn);
    
    // If we're still loading but have stored data, wait a bit
    if (loading && storedLoggedIn) {
      console.log('Waiting for auth to load...');
      const timer = setTimeout(() => {
        setChecking(false);
        if (!isAuthenticated && storedLoggedIn) {
          console.log('Auth still not loaded after timeout, but stored data exists');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    setChecking(false);
    
    // If not authenticated after loading, set redirect flag
    if (!loading && !isAuthenticated && !storedLoggedIn) {
      console.log('Not authenticated, will redirect to login');
      setShouldRedirect(true);
    }
  }, [isAuthenticated, user, loading, location]);

  if (loading || checking) {
    console.log('ProtectedRoute - Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect || (!isAuthenticated && !localStorage.getItem('userLoggedIn'))) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - Role not allowed, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

export default ProtectedRoute;