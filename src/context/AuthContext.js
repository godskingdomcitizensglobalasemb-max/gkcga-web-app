// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Register function
  const register = async (email, password, name) => {
    try {
      console.log('AuthContext.register - Creating user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      console.log('AuthContext.register - User created, updating profile with name:', name);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      console.log('AuthContext.register - Sending email verification');
      
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/login`,
        handleCodeInApp: true
      };
      
      await sendEmailVerification(userCredential.user, actionCodeSettings);
      
      console.log('AuthContext.register - Verification email sent to:', email);
      console.log('AuthContext.register - Registration complete for UID:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('AuthContext.register - Error:', error.code, error.message);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log('AuthContext.login - Attempting login for email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext.login - Login successful for UID:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('AuthContext.login - Error:', error.code, error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear all stored data
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      sessionStorage.clear();
      
      await signOut(auth);
      console.log('AuthContext.logout - Logout successful');
    } catch (error) {
      console.error('AuthContext.logout - Error:', error);
      throw error;
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        const actionCodeSettings = {
          url: `${window.location.origin}/auth/login`,
          handleCodeInApp: true
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        console.log('AuthContext.resendVerification - Email sent to:', auth.currentUser.email);
        return true;
      }
      return false;
    } catch (error) {
      console.error('AuthContext.resendVerification - Error:', error);
      throw error;
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/login`,
        handleCodeInApp: true
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log('AuthContext.resetPassword - Reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('AuthContext.resetPassword - Error:', error);
      throw error;
    }
  };

  // Reload user to check email verification status
  const reloadUser = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
        return auth.currentUser.emailVerified;
      }
      return false;
    } catch (error) {
      console.error('AuthContext.reloadUser - Error:', error);
      throw error;
    }
  };

  // Auth state observer
  useEffect(() => {
    console.log('AuthContext - Setting up auth state observer');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthContext - Auth state changed:', user ? `User logged in: ${user.uid}` : 'No user');
      setUser(user);
      setIsAuthenticated(!!user);
      setLoading(false);
      
      // If user is logged in, store in localStorage as backup
      if (user) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email || '');
      } else {
        // Don't clear immediately - give time for navigation
        setTimeout(() => {
          if (!auth.currentUser) {
            localStorage.removeItem('userLoggedIn');
          }
        }, 1000);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    resendVerificationEmail,
    resetPassword,
    reloadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};