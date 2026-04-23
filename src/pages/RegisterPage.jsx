// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { saveUserToDatabase } from '../firebase';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          errors.name = 'Name must be less than 50 characters';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else if (value.length > 50) {
          errors.password = 'Password must be less than 50 characters';
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain at least one letter and one number';
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(errors, fieldErrors);
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    const termsChecked = e.target.terms?.checked;
    if (!termsChecked) {
      showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
      return;
    }
    
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    
    const normalizedEmail = formData.email.toLowerCase().trim();
    
    try {
      console.log('=== STARTING REGISTRATION PROCESS ===');
      console.log('1. Attempting to create user in Firebase Auth with email:', normalizedEmail);
      
      // Step 1: Create user in Firebase Authentication
      const userCredential = await register(normalizedEmail, formData.password, formData.name.trim());
      
      console.log('2. ✓ User created successfully in Firebase Auth');
      console.log('   User UID:', userCredential.user.uid);
      console.log('   User Email:', userCredential.user.email);
      
      // Step 2: Save user data to Realtime Database
      console.log('3. Attempting to save user data to Realtime Database...');
      
      const userData = {
        name: formData.name.trim(),
        email: normalizedEmail,
        createdAt: Date.now(),
        role: 'user',
        emailVerified: false,
        profileComplete: false,
        lastLogin: null,
        registrationSource: 'web_app',
        notificationPreferences: {
          email: true,
          push: true,
          sms: false
        }
      };
      
      console.log('   User data to save:', userData);
      
      await saveUserToDatabase(userCredential.user.uid, userData);
      
      console.log('4. ✓ User data saved successfully to Realtime Database');
      console.log('=== REGISTRATION COMPLETE ===');
      
      showNotification(
        'Registration successful! Please check your email to verify your account.', 
        'success'
      );
      
      setTimeout(() => {
        navigate('/auth/login', { 
          state: { 
            email: normalizedEmail,
            message: 'Registration successful! Please verify your email before logging in.'
          } 
        });
      }, 1500);
      
    } catch (error) {
      console.error('=== REGISTRATION FAILED ===');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/email-already-in-use':
          setValidationErrors(prev => ({
            ...prev,
            email: 'This email is already registered. Please login instead.'
          }));
          showNotification('Email already registered. Please login.', 'error');
          break;
          
        case 'auth/invalid-email':
          setValidationErrors(prev => ({
            ...prev,
            email: 'Invalid email address format'
          }));
          showNotification('Please enter a valid email address', 'error');
          break;
          
        case 'auth/weak-password':
          setValidationErrors(prev => ({
            ...prev,
            password: 'Password is too weak. Please choose a stronger password.'
          }));
          showNotification('Please choose a stronger password', 'error');
          break;
          
        case 'auth/operation-not-allowed':
          showNotification('Email/password registration is currently disabled. Please try again later.', 'error');
          break;
          
        case 'auth/network-request-failed':
          showNotification('Network error. Please check your internet connection.', 'error');
          break;
          
        default:
          showNotification(error.message || 'Registration failed. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (formData.password.length >= 6) strength += 1;
    if (formData.password.length >= 8) strength += 1;
    if (/(?=.*[A-Z])/.test(formData.password)) strength += 1;
    if (/(?=.*[a-z])/.test(formData.password)) strength += 1;
    if (/(?=.*\d)/.test(formData.password)) strength += 1;
    if (/(?=.*[@$!%*?&])/.test(formData.password)) strength += 1;
    
    const normalizedStrength = Math.min(3, Math.floor(strength / 2));
    
    const strengthMap = {
      0: { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' },
      1: { label: 'Fair', color: 'bg-orange-500', width: 'w-2/4' },
      2: { label: 'Good', color: 'bg-yellow-500', width: 'w-3/4' },
      3: { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
    };
    
    return {
      strength: normalizedStrength,
      label: strengthMap[normalizedStrength].label,
      color: strengthMap[normalizedStrength].color,
      width: strengthMap[normalizedStrength].width
    };
  };

  const isFieldInvalid = (fieldName) => {
    return touched[fieldName] && validationErrors[fieldName];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              to="/auth/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid('name') ? validationErrors.name : ''}
              required
              autoComplete="name"
              placeholder="John Doe"
              disabled={loading}
              icon={
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid('email') ? validationErrors.email : ''}
              required
              autoComplete="email"
              placeholder="john@example.com"
              disabled={loading}
              icon={
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid('password') ? validationErrors.password : ''}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={loading}
              icon={
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              helperText="Must be at least 6 characters with letters and numbers"
            />
            
            {formData.password && !validationErrors.password && (
              <div className="mt-1 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password strength:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength < 2 ? 'text-red-600' : 
                    passwordStrength.strength === 2 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                  />
                </div>
              </div>
            )}
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid('confirmPassword') ? validationErrors.confirmPassword : ''}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={loading}
              icon={
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            By creating an account, you agree to receive occasional updates about GKCGA events and programs.
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;