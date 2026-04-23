// src/pages/AdminLoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, logoutUser, isUserAdmin, getUserFromDatabase } from '../firebase';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if already logged in as admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (user) {
        const isAdmin = await isUserAdmin(user.uid);
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          await logoutUser();
          setError('Session expired. Please login with admin credentials.');
        }
      }
    };
    checkAdminAccess();
  }, [user, navigate]);

  // Load saved email from localStorage if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    setLoading(true);

    try {
      // Login user
      const userCredential = await loginUser(email, password);
      const loggedInUser = userCredential.user;
      
      // Check if user is admin
      const isAdmin = await isUserAdmin(loggedInUser.uid);
      
      // Get user data for debugging
      const userData = await getUserFromDatabase(loggedInUser.uid);
      
      if (isAdmin) {
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('adminEmail', email);
        } else {
          localStorage.removeItem('adminEmail');
        }
        
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
        setDebugInfo(`User ${email} is not an admin. Role: ${userData?.role || 'none'}`);
        await logoutUser();
      }
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      
      let errorMessage = 'Invalid email or password. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0c0c0e] to-[#0f0f12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7c3aed]/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#a78bfa]/5 rounded-full blur-3xl animate-float-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-3xl animate-float-slow animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124,58,237,0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Animated Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-slide-in-up">
          <Link to="/" className="inline-block group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <img 
                src="/images/logo.png" 
                alt="GKCGA Logo" 
                className="h-14 w-auto relative mx-auto mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%237c3aed"/%3E%3Ctext x="50" y="67" font-size="40" text-anchor="middle" fill="white" font-family="Arial"%3EG%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </Link>
          <h1 className="font-serif text-4xl font-normal text-white mb-2 tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Welcome Back
          </h1>
          <p className="text-sm text-[#a1a1a6]">
            Secure administrator access portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden transform transition-all duration-500 hover:shadow-3xl animate-slide-in-up animation-delay-200">
          {/* Premium Gradient Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity" style={{ padding: '1px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)' }}></div>
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-transparent animate-slide-in"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#7c3aed]/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#a78bfa]/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative p-8">
            {/* Error Message with Premium Styling */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm animate-shake">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-400 font-medium">{error}</p>
                    {debugInfo && (
                      <p className="text-xs text-red-400/70 mt-1 font-mono">{debugInfo}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-300">
                    ℹ️ First-time setup? Contact admin to create an admin account.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="text-[0.65rem] uppercase tracking-wider text-[#a1a1a6] font-medium block mb-2 transition-all group-focus-within:text-[#a78bfa]">
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 ${emailFocused ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868b] group-focus-within:text-[#a78bfa] transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                    placeholder="admin@example.com"
                    className="w-full bg-[#1a1a1f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all placeholder:text-[#6e6e73]"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="text-[0.65rem] uppercase tracking-wider text-[#a1a1a6] font-medium block mb-2 transition-all group-focus-within:text-[#a78bfa]">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${passwordFocused ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868b] group-focus-within:text-[#a78bfa] transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#1a1a1f] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all placeholder:text-[#6e6e73]"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#86868b] hover:text-[#a78bfa] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#7c3aed] rounded border-white/20 bg-[#1a1a1f]"
                  />
                  <span className="text-xs text-[#a1a1a6] group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <Link 
                  to="/admin/forgot-password" 
                  className="text-xs text-[#a78bfa] hover:text-[#c4b5fd] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[#7c3aed] rounded-xl"></div>
                <div className="relative px-6 py-3 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 w-full z-10">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying credentials...
                    </>
                  ) : (
                    <>
                      <span>Access Dashboard</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-xs text-[#6e6e73]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
                <span>Secure admin area • 256-bit encryption</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Site Link */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs text-[#a1a1a6] hover:text-white transition-all group"
          >
            <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to main website</span>
          </Link>
        </div>

        {/* Version Info */}
        <div className="text-center mt-4">
          <p className="text-[0.6rem] text-[#6e6e73]">GKCGA Admin Portal v2.0 • Protected by Firebase Auth</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(15px); }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @media (max-width: 640px) {
          .backdrop-blur-xl {
            backdrop-filter: blur(8px);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;