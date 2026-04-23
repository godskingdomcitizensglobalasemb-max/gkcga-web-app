// src/pages/AdminSetupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setupAdminUser } from '../firebase';

const AdminSetupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await setupAdminUser(email, password);
      setMessage({ 
        text: 'Admin user created successfully! You can now log in.', 
        type: 'success' 
      });
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (error) {
      console.error('Setup error:', error);
      setMessage({ 
        text: error.message || 'Error setting up admin user', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c0e] to-[#1a1a1f] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#a78bfa]/10 rounded-full blur-3xl animate-float-slow animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-normal text-white mb-2">Admin Setup</h1>
          <p className="text-sm text-[#a1a1a6]">Create the first admin user</p>
        </div>

        <div className="bg-white rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
          
          <div className="p-8">
            {message.text && (
              <div className={`mb-6 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-xs ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Create Admin User'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-black/5 text-center">
              <Link to="/admin/login" className="text-xs text-[#7c3aed] hover:text-[#6d28d9]">
                Already have an admin account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AdminSetupPage;