// src/pages/TicketsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TicketsPage = () => {
  const navigate = useNavigate();
  
  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };
  
  // State for ticket flow
  const [step, setStep] = useState(1); // 1: select ticket, 2: fill form, 3: payment, 4: confirmation
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [expandedFeatures, setExpandedFeatures] = useState({}); // Track expanded state for each ticket
  
  // Form data state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    churchOrOrganization: '',
    dominionBuilder: '', // Dominion Builder field - now available for all packages
    howDidYouHear: '',
    specialRequests: '',
    termsAccepted: false
  });
  
  // Form errors state
  const [formErrors, setFormErrors] = useState({});

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    tickets: useRef(null),
    form: useRef(null),
    payment: useRef(null),
    confirmation: useRef(null),
    info: useRef(null)
  };

  // State for scroll animations
  const [visibleSections, setVisibleSections] = useState({});

  // Handle scroll for section animations
  useEffect(() => {
    const handleScroll = () => {
      const newVisibleSections = {};
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
          newVisibleSections[key] = isVisible;
        }
      });
      setVisibleSections(newVisibleSections);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);

  // Helper function to determine animation class
  const getAnimationClass = (section, delay = 0) => {
    return visibleSections[section] 
      ? `animate-reveal visible animation-delay-${delay}` 
      : 'animate-reveal';
  };

  // Toggle expanded features for a ticket
  const toggleExpandedFeatures = (ticketId, e) => {
    e.stopPropagation();
    setExpandedFeatures(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  // Ticket tiers data - using "Package" instead of "Pass"
  const ticketTiers = [
    {
      id: 1,
      tier: 'Tier 1',
      name: 'General Access',
      price: '0',
      formattedPrice: 'Free',
      note: 'Standard admission',
      fullFeatures: [
        'Full conference access (2 days)',
        'Networking sessions',
        'Access to all general sessions',
        'Event program booklet'
      ],
      bgGradient: 'linear-gradient(180deg, #f0fdf4, #fff)',
      borderColor: '#bbf7d0',
      gradientFrom: '#22c55e',
      gradientTo: '#16a34a',
      badgeColor: '#16a34a',
      badgeBg: 'rgba(34,197,94,0.1)',
      buttonBg: 'rgba(34,197,94,0.08)',
      currency: '₦'
    },
    {
      id: 2,
      tier: 'Tier 2',
      name: 'Standard Package',
      price: '10000',
      formattedPrice: '₦10,000',
      note: 'Full experience',
      fullFeatures: [
        'Everything in General Access',
        'Priority seating',
        'VIP networking lounge',
        'Speaker meet & greet',
        'Exclusive workshop access',
        'Conference gift bag',
        'Certificate of participation',
        'Access to session recordings'
      ],
      bgGradient: 'linear-gradient(180deg, #eff6ff, #fff)',
      borderColor: '#bfdbfe',
      gradientFrom: '#3b82f6',
      gradientTo: '#2563eb',
      badgeColor: '#2563eb',
      badgeBg: 'rgba(59,130,246,0.1)',
      buttonBg: 'rgba(59,130,246,0.08)',
      currency: '₦'
    },
    {
      id: 3,
      tier: 'Tier 3',
      name: 'Premium Package',
      price: '25000',
      formattedPrice: '₦25,000',
      note: 'Premium access',
      fullFeatures: [
        'Everything in Standard Package',
        'Front row seating',
        'Exclusive gift bag',
        'One-on-one mentorship session',
        'Priority check-in',
        'Brand amplification on backdrops and banners'
      ],
      bgGradient: 'linear-gradient(180deg, #faf5ff, #fff)',
      borderColor: '#e9d5ff',
      gradientFrom: '#7c3aed',
      gradientTo: '#6d28d9',
      badgeColor: '#7c3aed',
      badgeBg: 'rgba(124,58,237,0.1)',
      buttonBg: 'rgba(124,58,237,0.08)',
      currency: '₦',
      featured: true
    },
    {
      id: 4,
      tier: 'Tier 4',
      name: 'Dominion Builders Package',
      price: '50000',
      formattedPrice: '₦100,000',
      note: 'Exclusive · Limited',
      fullFeatures: [
        'Everything in Premium Package',
        'Private reception with hosts',
        'Strategic planning session',
        'VIP parking & concierge',
        'Priority seating for Dominion Builders at the conference',
        'Public acknowledgement on stage',
        'End-of-event roundtable ceremony in Lagos',
        'Free access to 1 premium skill training',
        'Access to industry mentors',
        'Media and branding exposure',
        'Post-event project collaborations',
        'Speaking opportunities',
        'Accommodation assistance',
        'Exclusive networking dinner',
        'Annual membership access'
      ],
      bgGradient: 'linear-gradient(180deg, #fffbeb, #fff)',
      borderColor: '#fde68a',
      gradientFrom: '#d4a017',
      gradientTo: '#b8860b',
      badgeColor: '#b8860b',
      badgeBg: 'rgba(212,160,23,0.1)',
      buttonBg: 'rgba(212,160,23,0.08)',
      currency: '₦'
    }
  ];

  // Handle ticket selection
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user types
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.country) {
      errors.country = 'Please select your country';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    // Dominion Builder field is now required for ALL packages
    if (!formData.dominionBuilder.trim()) {
      errors.dominionBuilder = 'Please enter your Dominion Builder name (who introduced you to this package)';
    }
    
    if (!formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle proceed to payment
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle back to ticket selection
  const handleBackToTickets = () => {
    setStep(1);
    setSelectedTicket(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle back to form from payment
  const handleBackToForm = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate random ticket ID
  const generateTicketId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomChars = Array.from({ length: 8 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    return `SORMS-2026-${randomChars}`;
  };

  // Handle payment - navigate to payment component
  const handlePayment = () => {
    // Save registration data to localStorage for payment page
    const paymentData = {
      ticket: selectedTicket,
      attendee: formData,
      eventDate: eventDateRange,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('pendingTicketPurchase', JSON.stringify(paymentData));
    
    // Navigate to payment page with ticket details
    navigate('/payment', {
      state: {
        ticket: selectedTicket,
        attendee: formData,
        amount: selectedTicket.price,
        email: formData.email,
        fullName: formData.fullName
      }
    });
  };

  const eventDateRange = 'Friday 24 - Saturday 25 July, 2026';

  // How did you hear options
  const hearOptions = [
    'Social Media (Instagram / Facebook)',
    'YouTube',
    'WhatsApp / Telegram',
    'Friend or Family Referral',
    'Church Partnership',
    'Event / Conference',
    'Campus Outreach',
    'Google / Online Search',
    'Through a Dominion Builder',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section ref={sectionRefs.hero} className="relative py-28 md:py-36 bg-[#0c0c0e] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.1),transparent_60%)]"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-4 py-2 rounded-full ${visibleSections.hero ? 'animate-reveal visible' : 'animate-reveal'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse"></span>
            {step === 1 && 'CHOOSE TICKET PACKAGE'}
            {step === 2 && 'Step 2 of 4 • Registration'}
            {step === 3 && 'Step 3 of 4 • Payment'}
            {step === 4 && 'Step 4 of 4 • Confirmation'}
          </div>

          <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 leading-tight ${visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'}`} 
              style={{ fontFamily: "'DM Serif Display', serif" }}>
            {step === 1 && 'SORMS Lagos 2026'}
            {step === 2 && 'Your Registration Details'}
            {step === 3 && 'Complete Your Payment'}
            {step === 4 && 'Ticket Confirmed!'}
          </h1>

          {step === 1 && (
            <>

             <p className={`font-serif text-lg md:text-xl text-white mb-2 ${visibleSections.hero ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'}`}
                 style={{ fontFamily: "'DM Serif Display', serif" }}>
                {eventDateRange}
              </p>
              <p className={`text-base md:text-lg text-[#a1a1a6] mb-3 max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-300' : 'animate-reveal'}`}>
                Four tiers designed for every level of engagement. Select your preferred package to proceed.
              </p>
             
            </>
          )}

          {step === 2 && selectedTicket && (
            <p className={`text-base md:text-lg text-[#a1a1a6] mb-3 max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-300' : 'animate-reveal'}`}>
              You've selected <span className="text-[#a78bfa] font-semibold">{selectedTicket.name}</span> ({selectedTicket.formattedPrice})
            </p>
          )}

          {step === 3 && selectedTicket && (
            <p className={`text-base md:text-lg text-[#a1a1a6] mb-3 max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-300' : 'animate-reveal'}`}>
              Complete payment for <span className="text-[#a78bfa] font-semibold">{selectedTicket.name}</span>
            </p>
          )}

          {step === 4 && (
            <p className={`text-base md:text-lg text-[#a1a1a6] mb-3 max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-300' : 'animate-reveal'}`}>
              Your ticket has been confirmed. Check your email for details.
            </p>
          )}


        </div>
      </section>

      {/* Step 1: Select Ticket */}
      {step === 1 && (
        <section ref={sectionRefs.tickets} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          

            {/* Ticket Cards Grid - Centered */}
            <div className="flex justify-center">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
                {ticketTiers.map((ticket, index) => {
                  const isExpanded = expandedFeatures[ticket.id];
                  const visibleFeatures = isExpanded ? ticket.fullFeatures : ticket.fullFeatures.slice(0, 3);
                  const remainingCount = ticket.fullFeatures.length - 3;
                  
                  return (
                    <div 
                      key={ticket.id}
                      className={`ticket-card relative rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                        visibleSections.tickets ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'
                      }`}
                      style={{
                        background: ticket.bgGradient,
                        border: `1.5px solid ${ticket.borderColor}`,
                        boxShadow: ticket.featured ? '0 0 60px rgba(124,58,237,0.06)' : 'none'
                      }}
                    >
                      <div className="ticket-gradient-curve"></div>
                      
                      <span className="inline-block px-3 py-1 rounded-full text-[0.55rem] uppercase tracking-wider font-semibold mb-4"
                        style={{
                          background: ticket.badgeBg,
                          color: ticket.badgeColor
                        }}>
                        {ticket.tier}
                      </span>

                      <h3 className="font-serif text-xl font-normal text-[#1d1d1f] mb-2">{ticket.name}</h3>
                      <div className="font-serif text-3xl text-[#1d1d1f] mb-1">{ticket.formattedPrice}</div>
                      <p className="text-xs text-[#86868b] mb-5">{ticket.note}</p>

                      <div className="w-10 h-px mx-auto mb-5" style={{ background: ticket.gradientFrom, opacity: 0.3 }}></div>

                      {/* Features List */}
                      <ul className="space-y-2 mb-4 text-left">
                        {visibleFeatures.map((feature, idx) => (
                          <li key={idx} className="text-xs text-[#48484a] flex items-start gap-2">
                            <span className="text-[#7c3aed] flex-shrink-0">✓</span>
                            <span className="text-left">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Expand/Collapse Button */}
                      {ticket.fullFeatures.length > 3 && (
                        <button
                          onClick={(e) => toggleExpandedFeatures(ticket.id, e)}
                          className="text-xs font-medium transition-all mb-4 inline-flex items-center gap-1"
                          style={{ color: ticket.gradientTo }}
                        >
                          {isExpanded ? (
                            <>Show less <span className="text-sm">▲</span></>
                          ) : (
                            <>+{remainingCount} more benefits <span className="text-sm">▼</span></>
                          )}
                        </button>
                      )}

                      {/* Select Button */}
                      <button 
                        className="block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-80 hover:scale-[1.02]"
                        style={{
                          background: ticket.buttonBg,
                          color: ticket.gradientTo,
                          border: `1px solid ${ticket.gradientFrom}33`
                        }}
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        {ticket.price === '0' ? 'Register Free' : `Select • ${ticket.formattedPrice}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && selectedTicket && (
        <section ref={sectionRefs.form} className="py-20 bg-[#f8f8fa]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className={`bg-white rounded-2xl border border-black/5 shadow-xl relative overflow-hidden ${getAnimationClass('form', 200)}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              
              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-3">
                    <span className="w-5 h-px bg-[#7c3aed]"></span>
                    Step 2 of 4
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#1d1d1f] mb-2">
                    Your Registration Details
                  </h2>
                  <p className="text-sm text-[#86868b]">Please fill out the form below to complete your registration.</p>
                </div>

                {/* Ticket Summary */}
                <div className="bg-[#f8f8fa] rounded-xl p-5 mb-8 border border-black/5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-normal text-[#1d1d1f] mb-1">{selectedTicket.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl text-[#7c3aed]">{selectedTicket.formattedPrice}</div>
                      <p className="text-xs text-[#86868b]">{selectedTicket.note}</p>
                    </div>
                  </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleProceedToPayment} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Full Name <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={`w-full bg-[#f8f8fa] border ${formErrors.fullName ? 'border-red-400' : 'border-black/10'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all`}
                      />
                      {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Email Address <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={`w-full bg-[#f8f8fa] border ${formErrors.email ? 'border-red-400' : 'border-black/10'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all`}
                      />
                      {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Phone / WhatsApp <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234 801 234 5678"
                        className={`w-full bg-[#f8f8fa] border ${formErrors.phone ? 'border-red-400' : 'border-black/10'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all`}
                      />
                      {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Country <span className="text-[#7c3aed]">*</span>
                      </label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full bg-[#f8f8fa] border ${formErrors.country ? 'border-red-400' : 'border-black/10'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all`}
                      >
                        <option value="">Select country...</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.country && <p className="text-xs text-red-500 mt-1">{formErrors.country}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        City / State <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Your city or state"
                        className={`w-full bg-[#f8f8fa] border ${formErrors.city ? 'border-red-400' : 'border-black/10'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all`}
                      />
                      {formErrors.city && <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Church / Organization (Optional)
                      </label>
                      <input
                        type="text"
                        id="churchOrOrganization"
                        value={formData.churchOrOrganization}
                        onChange={handleInputChange}
                        placeholder="Your church or organization"
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Dominion Builder Field - NOW AVAILABLE FOR ALL PACKAGES (Tiers 1-4) */}
                  <div>
                    <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                      Who is your Dominion Builder? 
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-[#7c3aed] opacity-60">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="dominionBuilder"
                        value={formData.dominionBuilder}
                        onChange={handleInputChange}
                        placeholder="Enter the name of your Dominion Builder (who introduced you to this package)"
                        className={`w-full bg-[#f8f8fa] border ${formErrors.dominionBuilder ? 'border-red-400' : 'border-black/10'} rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all`}
                      />
                    </div>
                    {formErrors.dominionBuilder && <p className="text-xs text-red-500 mt-1">{formErrors.dominionBuilder}</p>}
                    <p className="text-xs text-[#86868b] mt-2 flex items-center gap-1">
                      Please provide the name of the person who made you register. This person is your Dominion Builder. If there is no one, please leave blank.
                    </p>
                  </div>

                  <div>
                    <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                      How did you hear about SORMS? <span className="text-[#7c3aed]">*</span>
                    </label>
                    <select
                      id="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleInputChange}
                      className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                    >
                      <option value="">Select an option...</option>
                      {hearOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                      Special Requests / Accessibility Needs (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                      className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 accent-[#7c3aed]"
                    />
                    <label htmlFor="termsAccepted" className="text-xs text-[#48484a] leading-relaxed">
                      I confirm that the information provided is accurate and I agree to the{' '}
                      <a href="#" className="text-[#7c3aed] hover:underline">Terms and Conditions</a> and{' '}
                      <a href="#" className="text-[#7c3aed] hover:underline">Privacy Policy</a>.
                      <span className="text-[#7c3aed] ml-1">*</span>
                    </label>
                  </div>
                  {formErrors.termsAccepted && <p className="text-xs text-red-500 mt-1">{formErrors.termsAccepted}</p>}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleBackToTickets}
                      className="px-6 py-3 border border-black/10 text-[#1d1d1f] rounded-lg text-sm font-medium hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
                    >
                      ← Back to Packages
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all"
                    >
                      Proceed to Payment →
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Payment - This now shows a summary and redirects to payment component */}
      {step === 3 && selectedTicket && (
        <section ref={sectionRefs.payment} className="py-20 bg-[#f8f8fa]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className={`bg-white rounded-2xl border border-black/5 shadow-xl relative overflow-hidden ${getAnimationClass('payment', 200)}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              
              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-3">
                    <span className="w-5 h-px bg-[#7c3aed]"></span>
                    Step 3 of 4
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#1d1d1f] mb-2">
                    Review & Payment
                  </h2>
                  <p className="text-sm text-[#86868b]">Review your order details before proceeding to payment.</p>
                </div>

                {/* Order Summary */}
                <div className="bg-[#f8f8fa] rounded-xl p-5 mb-8 border border-black/5">
                  <h3 className="font-medium text-[#1d1d1f] mb-4">Order Summary</h3>
                  
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <div>
                      <p className="font-medium text-[#1d1d1f] text-sm">{selectedTicket.name}</p>
                      <p className="text-xs text-[#86868b]">SORMS Lagos 2026 · {eventDateRange}</p>
                    </div>
                    <p className="font-semibold text-[#1d1d1f]">{selectedTicket.formattedPrice}</p>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 pt-4">
                    <p className="font-medium text-[#1d1d1f]">Total</p>
                    <p className="font-serif text-2xl text-[#7c3aed]">{selectedTicket.formattedPrice}</p>
                  </div>
                </div>

                {/* Attendee Info Summary */}
                <div className="bg-[#f8f8fa] rounded-xl p-5 mb-8 border border-black/5">
                  <h3 className="font-medium text-[#1d1d1f] mb-3">Attendee Information</h3>
                  <p className="text-sm text-[#48484a] mb-1"><span className="text-[#86868b]">Name:</span> {formData.fullName}</p>
                  <p className="text-sm text-[#48484a] mb-1"><span className="text-[#86868b]">Email:</span> {formData.email}</p>
                  <p className="text-sm text-[#48484a] mb-1"><span className="text-[#86868b]">Phone:</span> {formData.phone}</p>
                  {/* Dominion Builder summary now shows for ALL packages */}
                  {formData.dominionBuilder && (
                    <p className="text-sm text-[#48484a] mt-2 pt-2 border-t border-black/5">
                      <span className="text-[#86868b]">Dominion Builder:</span>{' '}
                      <span className="text-[#7c3aed] font-medium">{formData.dominionBuilder}</span>
                    </p>
                  )}
                </div>

                {/* Payment Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleBackToForm}
                    className="px-6 py-3 border border-black/10 text-[#1d1d1f] rounded-lg text-sm font-medium hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
                  >
                    ← Back to Form
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    className="flex-1 px-6 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all"
                  >
                    Proceed to Secure Payment →
                  </button>
                </div>

                <p className="text-center text-xs text-[#86868b] mt-6">
                  You will be redirected to our secure payment gateway to complete your transaction.
                  We accept cards, bank transfers, and mobile money.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      {step !== 4 && (
        <section ref={sectionRefs.info} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`text-center ${getAnimationClass('info', 200)}`}>
                <div className="w-12 h-12 rounded-full bg-[#7c3aed]/10 flex items-center justify-center text-2xl mx-auto mb-4">🎫</div>
                <h3 className="font-medium text-[#1d1d1f] mb-2">Instant Confirmation</h3>
                <p className="text-xs text-[#86868b]">Receive your ticket and event details immediately after payment.</p>
              </div>
              <div className={`text-center ${getAnimationClass('info', 400)}`}>
                <div className="w-12 h-12 rounded-full bg-[#7c3aed]/10 flex items-center justify-center text-2xl mx-auto mb-4">📧</div>
                <h3 className="font-medium text-[#1d1d1f] mb-2">Email Delivery</h3>
                <p className="text-xs text-[#86868b]">Tickets sent directly to your email with QR code for check-in.</p>
              </div>
              <div className={`text-center ${getAnimationClass('info', 600)}`}>
                <div className="w-12 h-12 rounded-full bg-[#7c3aed]/10 flex items-center justify-center text-2xl mx-auto mb-4">🎁</div>
                <h3 className="font-medium text-[#1d1d1f] mb-2">Group Discounts</h3>
                <p className="text-xs text-[#86868b]">Special rates available for groups of 5+. Contact us for details.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-[#0c0c0e] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="font-serif text-2xl font-normal text-white mb-3">Questions About Tickets?</h3>
          <p className="text-sm text-[#a1a1a6] mb-6">Our team is here to help with any inquiries about registration.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/contact" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/contact');
              }}
              className="px-6 py-2 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all"
            >
              Contact Support
            </Link>
            <a href="mailto:soundofrmsons@gmail.com" className="px-6 py-2 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all">
              soundofrmsons@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Notification Toast */}
      {notificationMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1d1d1f] text-white px-6 py-3 rounded-lg text-sm shadow-xl z-50 animate-fadeInUp max-w-[90vw] whitespace-normal text-center">
          {notificationMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        .animate-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        
        .animate-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease forwards;
        }
        
        .ticket-card {
          position: relative;
          overflow: hidden;
        }
        
        .ticket-gradient-curve {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 16px 16px 0 0;
          transition: all 0.3s ease;
        }
        
        .ticket-card:nth-child(1) .ticket-gradient-curve {
          background: linear-gradient(90deg, 
            rgba(34,197,94,0) 0%,
            #22c55e 15%,
            #16a34a 50%,
            #22c55e 85%,
            rgba(34,197,94,0) 100%
          );
        }
        
        .ticket-card:nth-child(2) .ticket-gradient-curve {
          background: linear-gradient(90deg, 
            rgba(59,130,246,0) 0%,
            #3b82f6 15%,
            #2563eb 50%,
            #3b82f6 85%,
            rgba(59,130,246,0) 100%
          );
        }
        
        .ticket-card:nth-child(3) .ticket-gradient-curve {
          background: linear-gradient(90deg, 
            rgba(124,58,237,0) 0%,
            #7c3aed 15%,
            #6d28d9 50%,
            #7c3aed 85%,
            rgba(124,58,237,0) 100%
          );
        }
        
        .ticket-card:nth-child(4) .ticket-gradient-curve {
          background: linear-gradient(90deg, 
            rgba(212,160,23,0) 0%,
            #d4a017 15%,
            #b8860b 50%,
            #d4a017 85%,
            rgba(212,160,23,0) 100%
          );
        }
        
        .ticket-card:hover .ticket-gradient-curve {
          filter: brightness(1.1);
        }
        
        .animation-delay-100 { transition-delay: 0.1s; }
        .animation-delay-200 { transition-delay: 0.2s; }
        .animation-delay-300 { transition-delay: 0.3s; }
        .animation-delay-400 { transition-delay: 0.4s; }
        .animation-delay-500 { transition-delay: 0.5s; }
        .animation-delay-600 { transition-delay: 0.6s; }
        .animation-delay-700 { transition-delay: 0.7s; }
        .animation-delay-800 { transition-delay: 0.8s; }
        
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (max-width: 600px) {
          .grid {
            grid-template-columns: 1fr;
          }
          
          .ticket-card {
            padding: 28px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default TicketsPage;