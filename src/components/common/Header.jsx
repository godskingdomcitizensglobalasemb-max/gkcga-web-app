// src/components/common/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleDropdown = (itemName) => {
    setActiveDropdown(prev => prev === itemName ? null : itemName);
  };

  // Updated navItems to match exactly what you specified
  const navItems = [
    { name: 'Home', path: '/', description: 'Return to homepage' },
    { name: 'About', path: '/about', description: 'Learn about our mission' },
    { name: 'GKCGA', path: '/gkcga', description: 'God\'s Kingdom Citizens Global Assembly' },
    { name: 'Community', path: '/community', description: 'Join our community of kingdom citizens' },
    { name: 'Events', path: '/events', description: 'Summits, conferences and gatherings' },
    { name: 'Watch Live', path: '/watchlive', description: 'Live broadcasts and teachings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-xl' 
        : 'bg-transparent py-4'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative" aria-label="GKCGA Home">
            <div className="relative flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt="GKCGA Logo"
                  className="h-10 w-auto transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className={`
                  text-xs font-medium tracking-widest uppercase leading-tight
                  transition-all duration-500
                  ${isScrolled ? 'text-white/90' : 'text-white/90'}
                  font-['DM_Sans']
                `}>
                  A GKCGA Movement
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.path}
                  className={`
                    px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 
                    inline-flex items-center relative group
                    tracking-wide uppercase
                    font-['DM_Sans']
                    ${isScrolled 
                      ? isActive(item.path) 
                        ? 'text-white bg-white/10' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      : isActive(item.path) 
                        ? 'text-white bg-white/20' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"></span>
                  )}
                </Link>
              </div>
            ))}

            {/* Register Now CTA Button */}
            <div className="ml-4">
              <Link
                to="/tickets"
                className={`
                  px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 inline-block
                  ${isScrolled 
                    ? 'bg-white text-black hover:bg-white/90' 
                    : 'bg-white text-black hover:bg-white/90'
                  }
                `}
              >
                Register Now
              </Link>
            </div>
          </div>

          {/* Right Section - Mobile */}
          <div className="flex items-center space-x-4 lg:hidden">
            <Link
              to="/tickets"
              className={`
                px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300
                ${isScrolled 
                  ? 'bg-white text-black' 
                  : 'bg-white text-black'
                }
              `}
            >
              Register
            </Link>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-md transition-all duration-200 relative ${
                isScrolled ? 'text-white' : 'text-white'
              }`} 
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-5 h-4">
                <span className={`absolute block w-5 h-0.5 transform transition-all duration-300 ${
                  isScrolled ? 'bg-white' : 'bg-white'
                } ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}></span>
                <span className={`absolute block w-5 h-0.5 transform transition-all duration-300 ${
                  isScrolled ? 'bg-white' : 'bg-white'
                } ${isMenuOpen ? 'opacity-0' : 'top-2'}`}></span>
                <span className={`absolute block w-5 h-0.5 transform transition-all duration-300 ${
                  isScrolled ? 'bg-white' : 'bg-white'
                } ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Premium styling */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl py-2">
            <div className="space-y-1 px-2">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-white/10 last:border-0">
                  <Link 
                    to={item.path} 
                    className="block px-3 py-3 text-sm font-medium text-black hover:bg-black/5 rounded-lg transition-colors duration-200 font-['DM_Sans']" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              
              {/* Register Now in mobile menu */}
              <div className="pt-4 mt-2 border-t border-white/10 px-3">
                <Link
                  to="/tickets"
                  className="block w-full px-3 py-2 text-sm font-semibold rounded-lg text-center font-['DM_Sans'] bg-black text-white hover:bg-black/90 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll Progress Bar - Premium styling */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
          <div 
            className="h-full bg-white transition-all duration-300" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}
    </header>
  );
};

export default Header;