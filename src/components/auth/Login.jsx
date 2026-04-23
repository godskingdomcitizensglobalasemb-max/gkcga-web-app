// src/components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  saveUserLoginToDatabase, 
  getUserFromDatabase,
  checkUserRole
} from '../../firebase';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff,
  Shield,
  Sparkles,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Crown,
  Users,
  UserCog,
  Briefcase,
  Star
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendVerificationEmail } = useAuth();
  const { showNotification } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Admin credentials for demo/testing
  const adminCredentials = {
    email: 'admin@sorms.org',
    password: 'Admin@2026',
    role: 'admin'
  };

  useEffect(() => {
    console.log('Login component mounted');
    console.log('Location state:', location.state);
    console.log('Current pathname:', location.pathname);
    
    if (location.state?.message) {
      showNotification(location.state.message, 'info');
    }
    
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
    
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
    
    if (location.state?.verified) {
      showNotification('Email verified successfully! You can now log in.', 'success');
    }
  }, [location, showNotification]);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched({
      email: true,
      password: true
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await resendVerificationEmail();
      showNotification(
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Verification email sent! Please check your inbox (including spam folder).</span>
        </div>, 
        'success'
      );
    } catch (error) {
      console.error('Resend verification error:', error);
      showNotification(
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to send verification email. Please try again.</span>
        </div>, 
        'error'
      );
    } finally {
      setResendLoading(false);
    }
  };

  const getDashboardByRole = (role) => {
    const roleMap = {
      'admin': '/admin/dashboard',
      'super_admin': '/admin/dashboard',
      'mentor': '/mentor/dashboard',
      'volunteer': '/volunteer/dashboard',
      'partner': '/partner/dashboard',
      'user': '/dashboard',
      'member': '/dashboard'
    };
    return roleMap[role?.toLowerCase()] || '/dashboard';
  };

  const getWelcomeMessage = (role, name) => {
    const messages = {
      admin: `Welcome back, Administrator ${name}!`,
      super_admin: `Welcome back, Super Administrator ${name}!`,
      mentor: `Welcome back, Mentor ${name}! Ready to guide the next generation?`,
      volunteer: `Welcome back, Volunteer ${name}! Thank you for your service.`,
      partner: `Welcome back, Partner ${name}! Together we build the Kingdom.`,
      default: `Welcome back, ${name}!`
    };
    return messages[role?.toLowerCase()] || messages.default;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setShowVerificationNotice(false);

    const normalizedEmail = formData.email.toLowerCase().trim();
    
    try {
      console.log('1. Attempting login with email:', normalizedEmail);
      
      // Check for admin credentials (demo purposes)
      const isAdminDemo = normalizedEmail === adminCredentials.email && 
                          formData.password === adminCredentials.password;
      
      let userCredential;
      let userData;
      let role = 'user';
      let isAdmin = false;
      
      if (isAdminDemo) {
        // Demo admin login (bypass Firebase for testing)
        console.log('Demo admin login detected');
        userCredential = {
          user: {
            uid: 'admin-demo-123',
            email: adminCredentials.email,
            emailVerified: true,
            displayName: 'Administrator'
          }
        };
        userData = {
          name: 'Administrator',
          email: adminCredentials.email,
          role: 'admin',
          isAdmin: true,
          permissions: ['all']
        };
        role = 'admin';
        isAdmin = true;
      } else {
        // Normal Firebase login
        userCredential = await login(normalizedEmail, formData.password);
        
        console.log('2. Login successful for user:', userCredential.user.uid);
        console.log('3. Email verified:', userCredential.user.emailVerified);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          console.log('4. Email not verified - showing verification notice');
          setShowVerificationNotice(true);
          setUnverifiedEmail(normalizedEmail);
          showNotification(
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Please verify your email before logging in. Check your inbox (including spam folder).</span>
            </div>, 
            'warning'
          );
          setLoading(false);
          return;
        }

        // Get additional user data from Realtime Database
        console.log('5. Fetching user data from DB...');
        userData = await getUserFromDatabase(userCredential.user.uid);
        console.log('6. User data from DB:', userData);
        
        // Determine user role
        role = userData?.role?.toLowerCase() || 'user';
        isAdmin = role === 'admin' || role === 'super_admin';
      }
      
      // Save login activity
      console.log('7. Saving login activity...');
      const loginData = {
        timestamp: Date.now(),
        email: normalizedEmail,
        method: isAdminDemo ? 'demo_admin' : 'email/password',
        userAgent: navigator.userAgent || 'unknown',
        platform: navigator.platform || 'unknown',
        language: navigator.language || 'unknown',
        success: true,
        role: role
      };
      
      const loginId = await saveUserLoginToDatabase(
        userCredential.user.uid, 
        loginData
      );
      console.log('8. Login activity saved with ID:', loginId);
      
      // Handle "remember me"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', normalizedEmail);
        console.log('9. Email saved to localStorage');
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Store user data in localStorage and sessionStorage
      const displayName = userData?.name || 
                         userCredential.user.displayName || 
                         (isAdminDemo ? 'Administrator' : 'Builder');
      
      const userRole = role;
      const userPermissions = userData?.permissions || 
                             (isAdmin ? ['all'] : ['basic']);
      
      // Store in localStorage
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userName', displayName);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', normalizedEmail);
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
      
      // Store in sessionStorage as backup
      sessionStorage.setItem('userLoggedIn', 'true');
      sessionStorage.setItem('userName', displayName);
      sessionStorage.setItem('userRole', userRole);
      sessionStorage.setItem('userEmail', normalizedEmail);
      sessionStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      sessionStorage.setItem('userPermissions', JSON.stringify(userPermissions));
      
      console.log('10. Stored user data in localStorage and sessionStorage');
      console.log('11. User role:', userRole);
      console.log('12. Is admin:', isAdmin);
      
      // Show welcome notification with role-specific message
      const welcomeMessage = getWelcomeMessage(userRole, displayName);
      showNotification(
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <Crown className="w-5 h-5 text-yellow-500" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span>{welcomeMessage}</span>
        </div>, 
        'success'
      );
      
      // Determine redirect path based on role
      const fromPath = location.state?.from?.pathname;
      const redirectPath = fromPath || getDashboardByRole(userRole);
      
      console.log('13. Role:', userRole);
      console.log('14. From path:', fromPath);
      console.log('15. Redirect path:', redirectPath);
      console.log('16. Attempting navigation...');
      
      // Clear loading state before navigation
      setLoading(false);
      
      // Method 1: React Router navigate with state
      try {
        console.log('17. Using React Router navigate');
        navigate(redirectPath, { 
          replace: true,
          state: { 
            welcome: true, 
            userName: displayName,
            userRole: userRole,
            isAdmin: isAdmin,
            timestamp: Date.now()
          }
        });
        console.log('18. React Router navigation called');
      } catch (navError) {
        console.error('19. React Router navigation error:', navError);
        // Fallback to window.location
        window.location.href = redirectPath;
      }
      
      // Method 2: Backup check after 1 second
      setTimeout(() => {
        console.log('20. Checking current path:', window.location.pathname);
        console.log('21. Current URL:', window.location.href);
        
        // Check if we're still on login page
        if (window.location.pathname.includes('login') || window.location.pathname === '/auth/login') {
          console.log('22. Still on login page, forcing window.location navigation');
          window.location.href = redirectPath;
        } else {
          console.log('23. Successfully navigated to:', window.location.pathname);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Login error details:', {
        code: error.code,
        message: error.message
      });
      
      // Save failed login attempt
      if (formData.email) {
        try {
          const failedLoginData = {
            timestamp: Date.now(),
            email: normalizedEmail,
            method: 'email/password',
            userAgent: navigator.userAgent || 'unknown',
            platform: navigator.platform || 'unknown',
            language: navigator.language || 'unknown',
            success: false,
            errorCode: error.code || 'unknown_error',
            errorMessage: error.message || 'Unknown error'
          };
          
          await saveUserLoginToDatabase('unknown', failedLoginData);
        } catch (logError) {
          console.error('Error logging failed attempt:', logError);
        }
      }
      
      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/user-not-found':
          setErrors(prev => ({
            ...prev,
            email: 'No account found with this email'
          }));
          showNotification(
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Account not found. Please check your email or register.</span>
            </div>, 
            'error'
          );
          break;
          
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
          setErrors(prev => ({
            ...prev,
            password: 'Invalid email or password'
          }));
          showNotification(
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Invalid email or password. Please try again.</span>
            </div>, 
            'error'
          );
          break;
          
        case 'auth/too-many-requests':
          showNotification(
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Too many failed attempts. Please try again later.</span>
            </div>, 
            'error'
          );
          break;
          
        default:
          showNotification(
            error.message || 'Login failed. Please try again.', 
            'error'
          );
      }
      setLoading(false);
    }
  };

  // Admin quick login buttons
  const quickLoginButtons = [
    { 
      role: 'Admin', 
      email: adminCredentials.email, 
      password: adminCredentials.password,
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100'
    },
    { 
      role: 'Mentor', 
      email: 'mentor@sorms.org', 
      password: 'Mentor@2026',
      icon: UserCog,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    { 
      role: 'Volunteer', 
      email: 'volunteer@sorms.org', 
      password: 'Volunteer@2026',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    { 
      role: 'Partner', 
      email: 'partner@sorms.org', 
      password: 'Partner@2026',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    }
  ];

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    // Auto-submit after a short delay to show the filled form
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-50/50 to-purple-50/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-50/50 to-indigo-50/50 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your journey with{' '}
            <span className="font-semibold text-indigo-600">SORMS</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Admin, Mentor, Volunteer, or Partner? Use the quick login buttons below.
          </p>
        </div>

        {/* Quick Login Buttons for Admin/Demo */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-3 text-center uppercase tracking-wider">
            Quick Login (Demo)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickLoginButtons.map((btn, idx) => {
              const Icon = btn.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickLogin(btn.email, btn.password)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${btn.bgColor} hover:scale-105`}
                >
                  <Icon className={`w-4 h-4 bg-gradient-to-r ${btn.color} bg-clip-text text-transparent`} />
                  <span className="text-gray-700">Login as {btn.role}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            * Demo accounts for testing purposes
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {/* Verification Notice */}
          {showVerificationNotice && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    Email Not Verified
                  </h3>
                  <p className="text-xs text-yellow-700 mb-3">
                    We've sent a verification email to <strong>{unverifiedEmail}</strong>. 
                    Please check your inbox (including spam folder) and click the verification link.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="inline-flex items-center space-x-2 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend verification email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${errors.email && touched.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email && touched.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${errors.password && touched.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 pr-10 w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password && touched.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link 
                to="/auth/forgot-password" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>Sign in</span>
                </div>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Not a member yet?{' '}
                <Link 
                  to="/auth/register" 
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Register now
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            © 2026 SORMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;