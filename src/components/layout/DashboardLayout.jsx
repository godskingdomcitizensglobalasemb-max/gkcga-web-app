// src/components/layout/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  Users,
  Moon,
  Sun
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simple, clean navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
    { path: '/dashboard/projects', label: 'Projects', icon: Briefcase },
    { path: '/dashboard/mentorship', label: 'Mentorship', icon: GraduationCap },
    { path: '/dashboard/events', label: 'Events', icon: Calendar },
    { path: '/dashboard/resources', label: 'Resources', icon: BookOpen },
    { path: '/dashboard/network', label: 'Network', icon: Users },
    { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { path: '/dashboard/achievements', label: 'Achievements', icon: Award },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Logged out successfully', 'success');
      navigate('/');
    } catch (error) {
      showNotification('Failed to logout', 'error');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation - Dark Theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-30
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className={`
          h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700
          ${sidebarCollapsed ? 'justify-center' : 'justify-between'}
        `}>
          {!sidebarCollapsed ? (
            <Link to="/dashboard" className="font-semibold text-lg text-gray-900 dark:text-white">
              Dominion Builders
            </Link>
          ) : (
            <span className="font-semibold text-lg text-gray-900 dark:text-white">DB</span>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info - Dark Theme */}
        <div className={`
          p-4 border-b border-gray-200 dark:border-gray-700
          ${sidebarCollapsed ? 'text-center' : ''}
        `}>
          <div className={`
            flex ${sidebarCollapsed ? 'flex-col items-center' : 'items-center space-x-3'}
          `}>
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - Dark Theme */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 mx-2 rounded-lg transition-colors relative
                  ${sidebarCollapsed ? 'justify-center' : ''}
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Dark Theme */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              flex items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
            title={sidebarCollapsed ? 'Toggle theme' : ''}
          >
            {darkMode ? (
              <Sun className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
            ) : (
              <Moon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
            )}
            {!sidebarCollapsed && (
              <span className="text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
      

        {/* Main Content Area - Dark Theme */}
        <main className="p-6 dark:text-gray-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;