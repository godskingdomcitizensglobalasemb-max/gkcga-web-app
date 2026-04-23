// src/pages/JoinSormsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  saveVolunteerApplication, 
  checkExistingVolunteerApplication,
  getTimestamp 
} from '../firebase';

const JoinSormsPage = () => {
  const navigate = useNavigate();

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    heard: '',
    dominionBuilder: '',
    interests: [],
    commitment: ''
  });

  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitEmail, setSubmitEmail] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    form: useRef(null),
    benefits: useRef(null),
    testimonial: useRef(null)
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          interests: [...prev.interests, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          interests: prev.interests.filter(i => i !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  // Handle form step navigation
  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setFormStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate current step
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        setNotificationMessage('Please enter your full name.');
        return false;
      }
      if (!formData.email || !formData.email.includes('@')) {
        setNotificationMessage('Please enter a valid email address.');
        return false;
      }
      if (!formData.phone) {
        setNotificationMessage('Please enter your phone number.');
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.country) {
        setNotificationMessage('Please select your country.');
        return false;
      }
      if (!formData.city) {
        setNotificationMessage('Please enter your city.');
        return false;
      }
      if (!formData.heard) {
        setNotificationMessage('Please tell us how you heard about SORMS.');
        return false;
      }
      if (!formData.dominionBuilder) {
        setNotificationMessage('Please enter the name of your Dominion Builder.');
        return false;
      }
    }
    
    if (step === 3) {
      if (formData.interests.length === 0) {
        setNotificationMessage('Please select at least one area of interest.');
        return false;
      }
      if (!formData.commitment) {
        setNotificationMessage('Please confirm your commitment.');
        return false;
      }
    }
    
    setNotificationMessage('');
    return true;
  };

  // Save to Firebase Realtime Database
  const saveToFirebase = async () => {
    try {
      // Check if email already exists
      const existingApplication = await checkExistingVolunteerApplication(formData.email);
      
      if (existingApplication) {
        setNotificationMessage('This email has already been registered. Please contact us if you need assistance.');
        setIsSubmitting(false);
        return false;
      }

      // Prepare data for Firebase
      const applicationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        heardFrom: formData.heard,
        dominionBuilder: formData.dominionBuilder,
        interests: formData.interests,
        commitment: formData.commitment,
        source: 'join_sorms_page',
        applicationType: 'SORMS Community Application',
        timestamp: getTimestamp(),
        status: 'pending_review'
      };

      console.log('Saving to Firebase:', applicationData);
      
      // Save to Realtime Database
      const recordId = await saveVolunteerApplication(applicationData);
      
      console.log('Application saved successfully with ID:', recordId);
      return true;
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setNotificationMessage('There was an error submitting your application. Please try again.');
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(3)) {
      setIsSubmitting(true);
      setNotificationMessage('');
      
      const saved = await saveToFirebase();
      
      if (saved) {
        setSubmitEmail(formData.email);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      setIsSubmitting(false);
    }
  };

  // Interest options
  const interestOptions = [
    'Spiritual Formation',
    'Leadership Development',
    'Business & Entrepreneurship',
    'Scholarship & Career',
    'Ministry & Discipleship',
    'Social Impact',
    'Media & Communications',
    'Technology & Innovation'
  ];

  // Benefits data
  const benefits = [
    {
      icon: "✉️",
      title: "Welcome Email",
      description: "A personal welcome with your WhatsApp & Telegram community links, sent immediately after you join."
    },
    {
      icon: "🤝",
      title: "Community Access",
      description: "Join an active network of sons and daughters being raised for marketplace impact across Africa and beyond."
    },
    {
      icon: "🗺️",
      title: "Your Growth Path",
      description: "Be guided into the right track based on your calling, interests, and goals."
    },
    {
      icon: "🔒",
      title: "Your Data is Safe",
      description: "Collected only to serve you better and build the SORMS community database."
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Hero Section */}
      <section ref={sectionRefs.hero} className="relative py-24 md:py-32 bg-[#0c0c0e] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent opacity-30"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-4 py-2 rounded-full ${visibleSections.hero ? 'animate-reveal visible' : 'animate-reveal'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse"></span>
            Join the Community
          </div>

          {/* Headline */}
          <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight ${visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'}`} 
              style={{ fontFamily: "'DM Serif Display', serif" }}>
            Become a <em className="italic text-[#a78bfa] not-italic">SORMS Member</em>
          </h1>

          {/* Description */}
          <p className={`text-lg text-[#a1a1a6] mb-8 leading-relaxed max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'}`}>
            This is more than a sign-up. It's the first step of an intentional path from discovery to commissioning, from the crowd to the community of kingdom citizens.
          </p>

          {/* Breadcrumb */}
          <div className={`flex items-center justify-center gap-2 text-xs text-[#6e6e73] mt-8 ${visibleSections.hero ? 'animate-reveal visible animation-delay-600' : 'animate-reveal'}`}>
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
              className="hover:text-[#a78bfa] transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-[#a78bfa]">Join SORMS</span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section ref={sectionRefs.form} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!isSubmitted ? (
            <div className={`bg-white rounded-2xl border border-black/5 shadow-xl relative overflow-hidden ${getAnimationClass('form', 200)}`}>
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              
              <div className="p-8 md:p-12">
                {/* Form Header */}
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#1d1d1f] mb-2">
                  SORMS Community Application
                </h2>
                <p className="text-sm text-[#86868b] mb-8">
                  Complete the form below — takes under 3 minutes
                </p>

                {/* Progress Steps */}
                <div className="flex items-center mb-10">
                  {/* Step 1 */}
                  <div className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      formStep >= 1 
                        ? formStep > 1 
                          ? 'bg-[#7c3aed] text-white' 
                          : 'bg-[#7c3aed] text-white ring-4 ring-[#7c3aed]/20'
                        : 'bg-[#f8f8fa] text-[#86868b] border border-black/10'
                    }`}>
                      {formStep > 1 ? '✓' : '1'}
                    </div>
                    <span className={`text-xs ml-2 font-medium ${formStep >= 1 ? 'text-[#7c3aed]' : 'text-[#86868b]'}`}>
                      Personal
                    </span>
                  </div>
                  
                  <div className="flex-1 h-px bg-black/10 mx-4"></div>
                  
                  {/* Step 2 */}
                  <div className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      formStep >= 2 
                        ? formStep > 2 
                          ? 'bg-[#7c3aed] text-white' 
                          : 'bg-[#7c3aed] text-white ring-4 ring-[#7c3aed]/20'
                        : 'bg-[#f8f8fa] text-[#86868b] border border-black/10'
                    }`}>
                      {formStep > 2 ? '✓' : '2'}
                    </div>
                    <span className={`text-xs ml-2 font-medium ${formStep >= 2 ? 'text-[#7c3aed]' : 'text-[#86868b]'}`}>
                      Location
                    </span>
                  </div>
                  
                  <div className="flex-1 h-px bg-black/10 mx-4"></div>
                  
                  {/* Step 3 */}
                  <div className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      formStep >= 3 
                        ? 'bg-[#7c3aed] text-white ring-4 ring-[#7c3aed]/20' 
                        : 'bg-[#f8f8fa] text-[#86868b] border border-black/10'
                    }`}>
                      3
                    </div>
                    <span className={`text-xs ml-2 font-medium ${formStep >= 3 ? 'text-[#7c3aed]' : 'text-[#86868b]'}`}>
                      Interests
                    </span>
                  </div>
                </div>

                {/* Step 1: Personal Information */}
                {formStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                          First Name <span className="text-[#7c3aed]">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Your first name"
                          className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                          Last Name <span className="text-[#7c3aed]">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Your last name"
                          className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                        />
                      </div>
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
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Phone / WhatsApp Number <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234 801 234 5678"
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all inline-flex items-center gap-2"
                      >
                        Continue
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Source */}
                {formStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                          Country <span className="text-[#7c3aed]">*</span>
                        </label>
                        <select
                          id="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                        >
                          <option value="">Select country...</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Kenya">Kenya</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Uganda">Uganda</option>
                          <option value="Tanzania">Tanzania</option>
                          <option value="Ethiopia">Ethiopia</option>
                          <option value="Cameroon">Cameroon</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                          City / State <span className="text-[#7c3aed]">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Your city"
                          className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        How did you hear about SORMS? <span className="text-[#7c3aed]">*</span>
                      </label>
                      <select
                        id="heard"
                        value={formData.heard}
                        onChange={handleInputChange}
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      >
                        <option value="">Select an option...</option>
                        <option value="Social Media">Social Media (Instagram / Facebook)</option>
                        <option value="YouTube">YouTube</option>
                        <option value="WhatsApp/Telegram">WhatsApp / Telegram</option>
                        <option value="Referral">Friend or Family Referral</option>
                        <option value="Church">Church Partnership</option>
                        <option value="Event">Event / Conference</option>
                        <option value="Campus">Campus Outreach</option>
                        <option value="Search">Google / Online Search</option>
                        <option value="Dominionbuilder">Through a Dominion Builder</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* NEW: Who is your Dominion Builder field */}
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Who is your Dominion Builder? <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="text"
                        id="dominionBuilder"
                        value={formData.dominionBuilder}
                        onChange={handleInputChange}
                        placeholder="Dominion builder's name"
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={prevStep}
                        className="px-8 py-3 border border-black/10 text-[#1d1d1f] rounded-lg text-sm font-medium hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all inline-flex items-center gap-2"
                      >
                        Continue
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Interests & Commitment */}
                {formStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-3">
                        Areas of Interest (select all that apply) <span className="text-[#7c3aed]">*</span>
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {interestOptions.map((interest) => (
                          <label key={interest} className="flex items-center gap-3 p-3 bg-[#f8f8fa] rounded-lg border border-black/5 hover:border-[#7c3aed]/30 transition-all cursor-pointer">
                            <input
                              type="checkbox"
                              value={interest}
                              checked={formData.interests.includes(interest)}
                              onChange={handleInputChange}
                              className="w-4 h-4 accent-[#7c3aed]"
                            />
                            <span className="text-sm text-[#48484a]">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Commitment <span className="text-[#7c3aed]">*</span>
                      </label>
                      <select
                        id="commitment"
                        value={formData.commitment}
                        onChange={handleInputChange}
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      >
                        <option value="">Select...</option>
                        <option value="yes">Yes, I commit fully to growth, service, and SORMS values</option>
                        <option value="learning">I'm still learning what this means</option>
                      </select>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={prevStep}
                        className="px-8 py-3 border border-black/10 text-[#1d1d1f] rounded-lg text-sm font-medium hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Join the Movement
                            <span className="text-lg">✦</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notification Message */}
                {notificationMessage && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    notificationMessage.includes('error') || notificationMessage.includes('already registered')
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className={`text-xs ${
                      notificationMessage.includes('error') || notificationMessage.includes('already registered')
                        ? 'text-red-600'
                        : 'text-yellow-700'
                    }`}>
                      {notificationMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Success State */
            <div className={`bg-white rounded-2xl border border-black/5 shadow-xl relative overflow-hidden p-12 text-center ${getAnimationClass('form', 200)}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              
              <div className="w-20 h-20 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce-subtle">
                ✦
              </div>
              
              <h2 className="font-serif text-3xl font-normal text-[#1d1d1f] mb-3">
                Welcome to the Movement!
              </h2>
              
              <p className="text-[#48484a] mb-8 max-w-md mx-auto">
                A welcome email is on its way to <strong className="text-[#7c3aed]">{submitEmail}</strong> with your community access links.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                <a
                  href="https://chat.whatsapp.com/KGLRP8KmI603YwQ8LxQWb0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] text-white rounded-lg text-sm font-semibold hover:bg-[#20b859] transition-all inline-flex items-center gap-2"
                >
                  <span>💬</span> Join WhatsApp
                </a>
              </div>
              
              <p className="text-xs text-[#86868b]">
                Check your inbox (and spam folder) for the confirmation email.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={sectionRefs.benefits} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('benefits', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              What You'll Receive
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Your <em className="italic text-[#7c3aed] not-italic">Welcome</em> Package
            </h2>
            <p className="text-[#48484a] text-base font-light">
              When you join SORMS, you gain immediate access to these benefits.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all ${
                  visibleSections.benefits ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-xl mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-medium text-[#1d1d1f] mb-2">{benefit.title}</h3>
                <p className="text-xs text-[#86868b] leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={sectionRefs.testimonial} className="py-24 bg-[#f8f8fa]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Section Header */}
    <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('testimonial', 200)}`}>
      <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
        Voices
      </span>
      <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
          style={{ fontFamily: "'DM Serif Display', serif" }}>
        What New <em className="italic text-[#7c3aed] not-italic">Members</em> Say
      </h2>
    </div>

    {/* Testimonials Grid */}
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* Testimonial 1 - Emem Williams (Detailed) */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-200` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "I listened to these messages last week; it broke me indeed. I saw my life x-rayed. I had to recheck the purpose of the sound to sons program and read it word for word. purpose and ordination are becoming clearer. Consecration attached to the ordination is being given too, (things I never knew before). I no longer feel scared when praying for someone. I went to school and met a teacher seriously ill, I prayed, and before break period, she was eating, standing to teach, and telling colleagues God answers prayers of faith."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            EW
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Emem Williams</div>
            <div className="text-xs text-[#86868b]">Uyo, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Testimonial 2 - Obiajuru Onyinye Fortunate */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-400` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "I attended the recently concluded Sound of Revival, and I'm convinced it's not just a sound, but an Echo of Revival! The program brought me deliverance and restored things I'd lost, my faith, joy, happiness, and peace. Fear that had taken hold was lifted. May the name of the Lord be praised! Amen."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            OO
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Obiajuru Onyinye Fortunate</div>
            <div className="text-xs text-[#86868b]">Calabar, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Testimonial 3 - Nwaburu Onyinyechi Goodness */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-600` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "Due to the publicity video, While we were joyfully inviting people for the programme, the video was posted on facebook, and my uncle saw me dancing in the video and sent me a screenshot... long story short, he told me he would sponsor me till I finish school. Secondly, my prayer life was restored."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            NO
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Nwaburu Onyinyechi Goodness</div>
            <div className="text-xs text-[#86868b]">Lagos, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Testimonial 4 - Emem Samuel Williams */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-800` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "I heard God speak so clearly to me, in each day of the program. It left an unforgettable experience in my life."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            ES
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Emem Samuel Williams</div>
            <div className="text-xs text-[#86868b]">Uyo, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Testimonial 5 - Offonze Chidiogo Treasure */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-1000` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "My spiritual life was done but through Sound of Revival I was restored. God brought about more clarity to me."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            OT
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Offonze Chidiogo Treasure</div>
            <div className="text-xs text-[#86868b]">Calabar, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Testimonial 6 - Ebizo Gregory Dan */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-1200` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "God really came through for me by showing me mercies and breakthrough."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            EG
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Ebizo Gregory Dan</div>
            <div className="text-xs text-[#86868b]">Calabar, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Testimonial 7 - Victor Ozoemelam */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-1400` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "There was a spiritual awakening."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            VO
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Victor Ozoemelam</div>
            <div className="text-xs text-[#86868b]">Aba, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Testimonial 8 - Ezekwem Victor Akachukwu */}
      <div 
        className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all ${
          visibleSections.testimonial ? `animate-reveal visible animation-delay-1600` : 'animate-reveal'
        }`}
      >
        <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
        <p className="text-[#48484a] mb-6 leading-relaxed">
          "Spiritual restoration. Divine promises."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-sm font-serif">
            EV
          </div>
          <div>
            <div className="font-medium text-sm text-[#1d1d1f]">Ezekwem Victor Akachukwu</div>
            <div className="text-xs text-[#86868b]">Lagos, Nigeria</div>
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className={`grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 pt-8 border-t border-black/5 ${getAnimationClass('testimonial', 600)}`}>
      <div className="text-center">
        <div className="font-serif text-2xl text-[#7c3aed]">500+</div>
        <div className="text-xs text-[#86868b] uppercase tracking-wider mt-1">Active Members</div>
      </div>
      <div className="text-center">
        <div className="font-serif text-2xl text-[#7c3aed]">15+</div>
        <div className="text-xs text-[#86868b] uppercase tracking-wider mt-1">Countries</div>
      </div>
      <div className="text-center">
        <div className="font-serif text-2xl text-[#7c3aed]">10+</div>
        <div className="text-xs text-[#86868b] uppercase tracking-wider mt-1">Mentors</div>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#0c0c0e] to-[#1a1a1f] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #7c3aed 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative max-w-2xl mx-auto px-4">
          <h3 className="font-serif text-2xl font-normal text-white mb-3">Ready to begin your journey?</h3>
          <p className="text-sm text-[#a1a1a6] mb-6">Join hundreds of kingdom citizens who've already found their place.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/events" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/events');
              }}
              className="px-6 py-2 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all"
            >
              Explore Events
            </Link>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdOigtuFkhtkZvgxTsxcT1eQxP-s4TziZyOMEhHXRNQilaX_g/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Volunteer <span className="opacity-50">→</span>
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
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
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animation-delay-100 { transition-delay: 0.1s; }
        .animation-delay-200 { transition-delay: 0.2s; }
        .animation-delay-300 { transition-delay: 0.3s; }
        .animation-delay-400 { transition-delay: 0.4s; }
        .animation-delay-500 { transition-delay: 0.5s; }
        .animation-delay-600 { transition-delay: 0.6s; }
        .animation-delay-700 { transition-delay: 0.7s; }
        .animation-delay-800 { transition-delay: 0.8s; }
      `}</style>
    </div>
  );
};

export default JoinSormsPage;