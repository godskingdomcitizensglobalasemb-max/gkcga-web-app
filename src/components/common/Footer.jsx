// src/components/common/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveContact, getTimestamp } from '../../firebase';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setNotification({
        show: true,
        message: 'Please enter a valid email address.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Firebase Realtime Database
      const subscriberData = {
        email: email.trim(),
        source: 'footer_subscribe',
        subscriptionType: 'newsletter',
        status: 'active',
        subscribedAt: getTimestamp(),
        ipAddress: '', // You can add IP detection if needed
        userAgent: navigator.userAgent
      };

      console.log('Saving subscriber to Firebase:', subscriberData);
      
      const recordId = await saveContact(subscriberData);
      
      console.log('Subscriber saved successfully with ID:', recordId);
      
      setNotification({
        show: true,
        message: '✓ Thank you for subscribing! Check your inbox for updates.',
        type: 'success'
      });
      setEmail('');
      
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
    } catch (error) {
      console.error('Error saving subscriber:', error);
      
      // Check if it's a duplicate email error
      if (error.message && error.message.includes('already exists')) {
        setNotification({
          show: true,
          message: 'This email is already subscribed to our newsletter.',
          type: 'info'
        });
      } else {
        setNotification({
          show: true,
          message: 'There was an error. Please try again later.',
          type: 'error'
        });
      }
      
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#0c0c0e] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-up ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {notification.message}
          </div>
        )}
        
        {/* Top Section - Social + Subscribe */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-white/5">
          {/* Social Links */}
          <div>
            <h3 className="text-[0.65rem] font-medium tracking-[0.15em] uppercase text-white mb-5 underline decoration-[#7c3aed] underline-offset-4">
              Stay Connected
            </h3>
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/company/sorms/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[#a1a1a6] hover:border-[#7c3aed] hover:text-white hover:bg-[#7c3aed]/15 transition-all duration-200 group"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@soundofrmsons" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[#a1a1a6] hover:border-[#7c3aed] hover:text-white hover:bg-[#7c3aed]/15 transition-all duration-200 group"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/soundofrmsons" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[#a1a1a6] hover:border-[#7c3aed] hover:text-white hover:bg-[#7c3aed]/15 transition-all duration-200 group"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
                </svg>
              </a>
              <a 
                href="https://web.facebook.com/profile.php?id=61578913514438&_rdc=1&_rdr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[#a1a1a6] hover:border-[#7c3aed] hover:text-white hover:bg-[#7c3aed]/15 transition-all duration-200 group"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@soundofrmsons" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[#a1a1a6] hover:border-[#7c3aed] hover:text-white hover:bg-[#7c3aed]/15 transition-all duration-200 group"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Subscribe Form */}
          <div>
            <h3 className="text-[0.65rem] font-medium tracking-[0.15em] uppercase text-white mb-5 underline decoration-[#7c3aed] underline-offset-4">
              Sign Up for Updates
            </h3>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email here"
                className="flex-1 bg-transparent border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-[#6e6e73] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all font-['DM_Sans']"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-[#0c0c0e] px-8 py-3 rounded-xl text-[0.7rem] font-semibold tracking-wider uppercase hover:opacity-85 transition-all hover:scale-[1.02] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#0c0c0e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
            <p className="text-[0.55rem] text-[#6e6e73] mt-3">
              We'll never spam you. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Bottom Section - Logo + Links */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div>
            <div className="mb-4">
              <img 
                src="/images/logo.png" 
                alt="SORMS Logo" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
           <p className="text-[0.7rem] text-[#6e6e73] leading-relaxed mb-4">
  <span className="font-medium">Intimacy</span> <span className="mx-1">•</span> 
  <span className="font-medium"> Excellence</span> <span className="mx-1">•</span> 
  <span className="font-medium"> Dominion</span>
</p>
            <p className="text-[0.6rem] text-[#6e6e73]/60 leading-relaxed">
              © 2026 SORMS<br />
              All rights reserved.
            </p>
            <span className="inline-block mt-3 text-[0.55rem] tracking-wider uppercase text-[#7c3aed] opacity-60">
              Presented by GKCGA
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.6rem] font-medium tracking-[0.12em] uppercase text-[#a1a1a6] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/watchlive" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Watch Live
                </Link>
              </li>
              <li>
                <Link to="/gkcga" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  GKCGA
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-[0.6rem] font-medium tracking-[0.12em] uppercase text-[#a1a1a6] mb-4">
              Programs
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="https://docs.google.com/forms/d/e/1FAIpQLSeniJw28IL7YaTgy3UjX5GM48lATy2ykH-TkqxXqiB8cvOVMA/viewform?usp=send_form" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link to="https://docs.google.com/forms/d/e/1FAIpQLSdOigtuFkhtkZvgxTsxcT1eQxP-s4TziZyOMEhHXRNQilaX_g/viewform" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Volunteer
                </Link>
              </li>
              {/* <li>
                <Link to="/grants" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  SORMS Grant
                </Link>
              </li> */}
              <li>
                <Link to="/terms" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Leadership & Contact */}
          <div>
            <h4 className="text-[0.6rem] font-medium tracking-[0.12em] uppercase text-[#a1a1a6] mb-4">
              Leadership
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about#ab-leadership" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Joshua Nwaeze
                </Link>
              </li>
              <li>
                <Link to="/community#builders-circle" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Builders Circle
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-[#6e6e73] hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
            
            {/* Contact Info */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-[0.6rem] text-[#6e6e73] mb-1">
                <span className="text-[#a1a1a6]">Email:</span> soundofrmsons@gmail.com
              </p>
              <p className="text-[0.6rem] text-[#6e6e73]">
                <span className="text-[#a1a1a6]">Phone:</span> +44 7555 684741
              </p>
            </div>
          </div>
        </div>

        {/* Copyright line with Design by GlobalScale */}
        <div className="py-6 text-center border-t border-white/5">
          <p className="text-[0.55rem] text-[#6e6e73]/50">
            © 2026 Sound of Revival – Manifesting Sons. All rights reserved. | 
            Design by <span className="text-[#7c3aed] font-medium">GlobalScale</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;