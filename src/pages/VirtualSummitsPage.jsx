// src/pages/VirtualSummitsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { saveRegistration, checkExistingRegistration } from '../firebase';

const VirtualSummitsPage = () => {
  const [selectedSummit, setSelectedSummit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [hoveredSummit, setHoveredSummit] = useState(null);
  
  // Form state for Firebase
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summit: '',
    heardFrom: '',
    expectations: '',
    agreeToTerms: false
  });
  
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    existingRegistration: false
  });

  const sectionRefs = {
    hero: useRef(null),
    overview: useRef(null),
    schedule: useRef(null),
    speakers: useRef(null),
    faq: useRef(null)
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 // In VirtualSummitsPage.jsx, update the handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Reset form status
  setFormStatus({
    submitting: true,
    success: false,
    error: null,
    existingRegistration: false
  });

  try {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.summit) {
      throw new Error('Please fill in all required fields');
    }

    if (!formData.agreeToTerms) {
      throw new Error('Please agree to the terms and conditions');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      throw new Error('Please enter a valid phone number');
    }

    // Check if already registered
    const existing = await checkExistingRegistration(formData.email, formData.summit);
    
    if (existing) {
      setFormStatus({
        submitting: false,
        success: false,
        error: null,
        existingRegistration: true
      });
      return;
    }

    // Prepare data for Realtime Database - REMOVE the timestamp field
    // The saveRegistration function will add its own createdAt
    const registrationData = {
      fullName: formData.fullName.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.trim(),
      summit: formData.summit,
      heardFrom: formData.heardFrom || 'Not specified',
      expectations: formData.expectations || 'Not specified',
      pageSource: 'Virtual Summits 2026',
      userAgent: navigator.userAgent || 'unknown'
    };

    console.log('Saving registration to Realtime DB:', registrationData);

    // Save to Firebase Realtime Database
    const registrationId = await saveRegistration(registrationData);

    console.log('Registration saved with ID:', registrationId);

    // Success
    setFormStatus({
      submitting: false,
      success: true,
      error: null,
      existingRegistration: false
    });

    // Clear form after 3 seconds and close modal
    setTimeout(() => {
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        summit: '',
        heardFrom: '',
        expectations: '',
        agreeToTerms: false
      });
      setFormStatus({
        submitting: false,
        success: false,
        error: null,
        existingRegistration: false
      });
    }, 3000);

  } catch (error) {
    console.error('Registration error:', error);
    setFormStatus({
      submitting: false,
      success: false,
      error: error.message,
      existingRegistration: false
    });
  }
};

  // Open modal with optional pre-selected summit
  const openModal = (summitTitle = '') => {
    setFormData(prev => ({
      ...prev,
      summit: summitTitle || prev.summit
    }));
    setFormStatus({
      submitting: false,
      success: false,
      error: null,
      existingRegistration: false
    });
    setIsModalOpen(true);
  };

  const summits = [
    {
      id: 1,
      title: "Spiritual Formation Summit",
      theme: "Identity & Intimacy",
      date: "March 15-17, 2026",
      time: "6:00 PM - 8:30 PM WAT",
      speaker: {
        name: "Pastor Michael Okafor",
        title: "Lead Pastor, Grace Assembly",
        bio: "Apostolic teacher with over 15 years experience in spiritual formation",
        image: "/images/speakers/michael-okafor.jpg"
      },
      description: "Deepening intimacy with God and understanding our identity as sons. This summit focuses on establishing kingdom authority through worship, prayer, and spiritual warfare.",
      topics: [
        "Identity in Christ", 
        "Hearing God's Voice", 
        "Prayer Warfare", 
        "Worship Lifestyle",
        "Spiritual Disciplines",
        "Father-Son Relationship"
      ],
      schedule: [
        { day: "Day 1", topic: "Who Am I? Understanding Sonship", time: "6:00 PM - 8:30 PM" },
        { day: "Day 2", topic: "The Prayer Life of a Son", time: "6:00 PM - 8:30 PM" },
        { day: "Day 3", topic: "Walking in Spiritual Authority", time: "6:00 PM - 8:30 PM" }
      ],
      category: "spiritual",
      attendees: "1200+",
      price: "Free",
      color: "from-purple-500 to-indigo-500",
      gradient: "from-purple-600/20 via-indigo-600/20 to-purple-600/20",
      bgImage: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
    },
    {
      id: 2,
      title: "Excellence in Leadership",
      theme: "Leading with Distinction",
      date: "April 12-14, 2026",
      time: "6:00 PM - 8:30 PM WAT",
      speaker: {
        name: "Dr. Sarah Johnson",
        title: "Leadership Consultant, CEO Thrive Global",
        bio: "International leadership expert and author of 'Leading with Kingdom Excellence'",
        image: "/images/speakers/sarah-johnson.jpg"
      },
      description: "Developing skills to represent God with excellence in every sphere. Learn how to lead with integrity and impact in your workplace, community, and family.",
      topics: [
        "Leadership Principles",
        "Emotional Intelligence",
        "Team Building",
        "Decision Making",
        "Conflict Resolution",
        "Vision Casting"
      ],
      schedule: [
        { day: "Day 1", topic: "Foundations of Kingdom Leadership", time: "6:00 PM - 8:30 PM" },
        { day: "Day 2", topic: "Emotional Intelligence for Leaders", time: "6:00 PM - 8:30 PM" },
        { day: "Day 3", topic: "Building High-Impact Teams", time: "6:00 PM - 8:30 PM" }
      ],
      category: "leadership",
      attendees: "900+",
      price: "Free",
      color: "from-emerald-500 to-teal-500",
      gradient: "from-emerald-600/20 via-teal-600/20 to-emerald-600/20",
      bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
    },
    {
      id: 3,
      title: "Dominion Mandate",
      theme: "Authority & Influence",
      date: "May 10-12, 2026",
      time: "6:00 PM - 8:30 PM WAT",
      speaker: {
        name: "Joshua Nwaeze",
        title: "Founder, GKCGA",
        bio: "Visionary leader and convener of SORMS conference",
        image: "/images/speakers/joshua-nwaeze.jpg"
      },
      description: "Understanding our authority and responsibility as Kingdom citizens. Discover how to exercise dominion in the marketplace, government, and cultural spheres.",
      topics: [
        "Kingdom Authority",
        "Marketplace Influence",
        "Cultural Engagement",
        "Nation Building",
        "Spheres of Society",
        "Dominion Theology"
      ],
      schedule: [
        { day: "Day 1", topic: "Understanding Dominion", time: "6:00 PM - 8:30 PM" },
        { day: "Day 2", topic: "Influencing the 7 Mountains", time: "6:00 PM - 8:30 PM" },
        { day: "Day 3", topic: "From Sons to Kings", time: "6:00 PM - 8:30 PM" }
      ],
      category: "dominion",
      attendees: "1500+",
      price: "Free",
      color: "from-amber-500 to-orange-500",
      gradient: "from-amber-600/20 via-orange-600/20 to-amber-600/20",
      bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
    },
    {
      id: 4,
      title: "Economic Empowerment Summit",
      theme: "Wealth & Stewardship",
      date: "June 7-9, 2026",
      time: "6:00 PM - 8:30 PM WAT",
      speaker: {
        name: "Daniel A. (thefabsidea)",
        title: "Founder, thefabsidea",
        bio: "Business strategist and wealth creation expert",
        image: "/images/speakers/daniel-a.jpg"
      },
      description: "Biblical principles for wealth creation and financial stewardship. Learn how to build generational wealth and fund kingdom causes.",
      topics: [
        "Biblical Economics",
        "Investment Strategies",
        "Business Startups",
        "Legacy Planning",
        "Financial Freedom",
        "Kingdom Financing"
      ],
      schedule: [
        { day: "Day 1", topic: "Biblical Foundations of Wealth", time: "6:00 PM - 8:30 PM" },
        { day: "Day 2", topic: "Investment & Asset Building", time: "6:00 PM - 8:30 PM" },
        { day: "Day 3", topic: "Legacy & Kingdom Financing", time: "6:00 PM - 8:30 PM" }
      ],
      category: "economic",
      attendees: "1100+",
      price: "Free",
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-600/20 via-emerald-600/20 to-green-600/20",
      bgImage: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
    },
    {
      id: 5,
      title: "Social Impact & Media",
      theme: "Culture & Creativity",
      date: "July 12-14, 2026",
      time: "6:00 PM - 8:30 PM WAT",
      speaker: {
        name: "MIRACLE DOM-OKEKE",
        title: "Creative Director, Dom Clothings",
        bio: "Fashion designer and social impact entrepreneur",
        image: "/images/speakers/miracle-dom.jpg"
      },
      description: "Transforming culture through media, arts, and community engagement. Learn to use your creative gifts for kingdom influence.",
      topics: [
        "Content Creation",
        "Community Development",
        "Arts & Culture",
        "Social Innovation",
        "Media Strategy",
        "Brand Building"
      ],
      schedule: [
        { day: "Day 1", topic: "Creativity as Worship", time: "6:00 PM - 8:30 PM" },
        { day: "Day 2", topic: "Media for Kingdom Impact", time: "6:00 PM - 8:30 PM" },
        { day: "Day 3", topic: "Building Social Enterprises", time: "6:00 PM - 8:30 PM" }
      ],
      category: "social",
      attendees: "800+",
      price: "Free",
      color: "from-pink-500 to-rose-500",
      gradient: "from-pink-600/20 via-rose-600/20 to-pink-600/20",
      bgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
    },
    {
      id: 6,
      title: "Political & Governance",
      theme: "Righteous Leadership",
      date: "August 9-11, 2026",
      time: "6:00 PM - 8:30 PM WAT",
      speaker: {
        name: "Hon. James Ndlovu",
        title: "Director of Governmental Affairs",
        bio: "Former legislator and governance expert",
        image: "/images/speakers/james-ndlovu.jpg"
      },
      description: "Influencing governance and legislation with kingdom principles. Understand your role in shaping policy and nation-building.",
      topics: [
        "Biblical Governance",
        "Policy Making",
        "Civic Engagement",
        "Righteous Leadership",
        "Public Service",
        "Nation Building"
      ],
      schedule: [
        { day: "Day 1", topic: "Biblical Foundations of Government", time: "6:00 PM - 8:30 PM" },
        { day: "Day 2", topic: "The Believer in Public Office", time: "6:00 PM - 8:30 PM" },
        { day: "Day 3", topic: "Shaping National Policy", time: "6:00 PM - 8:30 PM" }
      ],
      category: "political",
      attendees: "700+",
      price: "Free",
      color: "from-blue-500 to-indigo-500",
      gradient: "from-blue-600/20 via-indigo-600/20 to-blue-600/20",
      bgImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
    }
  ];

  const filteredSummits = activeTab === 'all' 
    ? summits 
    : summits.filter(s => s.category === activeTab);

  const speakers = summits.map(s => s.speaker);

  const features = [
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 10L11 14L9 12M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Live Interactive Sessions",
      description: "Real-time engagement with speakers, Q&A sessions, and live discussions",
      stat: " ",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.752 11.168L10.416 14.336C9.98401 14.664 9.36001 14.296 9.36001 13.744V7.248C9.36001 6.696 9.98401 6.328 10.416 6.656L14.752 9.824C14.904 9.94 15.024 10.092 15.104 10.267C15.184 10.442 15.22 10.634 15.208 10.827C15.197 11.02 15.139 11.206 15.04 11.371C14.94 11.535 14.802 11.671 14.636 11.768L14.752 11.168Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "On-Demand Access",
      description: "All recordings available for 30 days post-summit with downloadable materials",
      stat: " ",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.042C10.3516 4.56336 8.2144 3.74694 6 3.75C4.948 3.75 3.938 3.93 3 4.262V18.512C3.962 18.172 4.999 18 6 18C8.305 18 10.408 18.867 12 20.292M12 6.042C13.6484 4.56336 15.7856 3.74694 18 3.75C19.052 3.75 20.062 3.93 21 4.262V18.512C20.038 18.172 19.001 18 18 18C15.7856 17.9969 13.6484 18.8134 12 20.292M12 6.042V20.292" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Digital Resource Kit",
      description: "Study guides, worksheets, slides, and supplementary reading materials",
      stat: " ",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C17.3431 15 16 16.3431 16 18V20H17ZM17 20H7M7 20H2V18C2 16.3431 3.34315 15 5 15C6.65685 15 8 16.3431 8 18V20H7ZM7 20V17M12 15V12M12 12V9M12 12H15M12 12H9M19 11C19 13.2091 17.2091 15 15 15C12.7909 15 11 13.2091 11 11C11 8.79086 12.7909 7 15 7C17.2091 7 19 8.79086 19 11ZM13 7V3.5C13 2.67157 12.3284 2 11.5 2H4.5C3.67157 2 3 2.67157 3 3.5V15.5C3 16.3284 3.67157 17 4.5 17H11.5C12.3284 17 13 16.3284 13 15.5V15" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "Networking",
      description: "Connect with attendees and speakers with in the environment",
      stat: " ",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Certificate of Completion",
      description: "Official certificate for each summit to enhance your professional portfolio",
      stat: " ",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5V3M15 5V7M15 5H11M19 11V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V11C5 9.89543 5.89543 9 7 9H17C18.1046 9 19 9.89543 19 11ZM9 13H11M13 13H15M9 17H11M13 17H15" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "Priority Access",
      description: "Early registration and VIP seating for SORMS 2026 physical event",
      stat: " ",
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8H20C20.5523 8 21 8.44772 21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9C3 8.44772 3.44772 8 4 8H7M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V8C17 9.10457 16.1046 10 15 10H9C7.89543 10 7 9.10457 7 8V4ZM12 14H12.01" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "Community Access",
      description: "Join exclusive WhatsApp and Telegram groups for ongoing discussions",
      stat: " ",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 18H12.01M8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "Mobile App Access",
      description: "Dedicated app for schedules, networking, and resource access",
      stat: " ",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  const stats = [
    {
      value: "@",
      label: "Summits",
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      sublabel: "March - August 2026"
    },
    {
      value: "20+",
      label: "Speakers",
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C17.3431 15 16 16.3431 16 18V20H17ZM17 20H7M7 20H2V18C2 16.3431 3.34315 15 5 15C6.65685 15 8 16.3431 8 18V20H7ZM7 20V17M12 15V12M12 12V9M12 12H15M12 12H9M19 11C19 13.2091 17.2091 15 15 15C12.7909 15 11 13.2091 11 11C11 8.79086 12.7909 7 15 7C17.2091 7 19 8.79086 19 11Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      sublabel: "International Leaders"
    },
    {
      value: "1k+",
      label: "Attendees",
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C17.3431 15 16 16.3431 16 18V20H17ZM17 20H7M7 20H2V18C2 16.3431 3.34315 15 5 15C6.65685 15 8 16.3431 8 18V20H7ZM7 20V17M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      sublabel: "Global Community"
    },
    {
      value: "100%",
      label: "Free",
      icon: (className = "w-8 h-8") => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      sublabel: "No Cost"
    }
  ];

  const faqs = [
    {
      q: "How do I access the virtual summits?",
      a: "After registering, you'll receive a confirmation email with a unique Zoom link and access credentials. You'll also get access to our mobile app for seamless participation."
    },
    {
      q: "Can I attend if I miss the live sessions?",
      a: "Absolutely! All sessions are recorded and available in your personalized dashboard for 30 days after each summit."
    },
    {
      q: "Will I receive certificates?",
      a: "Yes! Each summit comes with a beautifully designed certificate of completion that you can download and share on LinkedIn or your professional portfolio."
    },
    {
      q: "Is there networking opportunities?",
      a: "Yes! Each summit includes virtual networking lounges, breakout rooms, and dedicated WhatsApp groups for attendees to connect."
    },
    {
      q: "Do I need to register for each summit separately?",
      a: "You can register for individual summits or use our 'All-Access Pass' to register for all six summits at once."
    },
    {
      q: "What platform do you use?",
      a: "We use Zoom Webinar for main sessions and a combination of Zoom Breakout Rooms and our mobile app for networking."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Custom Styles */}
      <style>{`
        @keyframes reveal-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes reveal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-reveal-up {
          animation: reveal-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-reveal-fade {
          animation: reveal-fade 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(0,0,0,0.2);
        }

        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        .delay-700 { animation-delay: 0.7s; opacity: 0; }
      `}</style>

      {/* Hero Section - Sophisticated Executive Design */}
      <section 
        ref={sectionRefs.hero} 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
      >
        {/* Refined Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`,
              filter: 'brightness(0.35)',
              transform: `scale(1.05) translateY(${scrollY * 0.02}px)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90" />
          <div className="absolute inset-0 opacity-[0.02]" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="mb-8 animate-reveal-fade delay-100">
              <span className="inline-block text-xs uppercase tracking-[0.25em] text-slate-400 font-light border-t border-b border-slate-800 py-3 px-6">
                Volunteer for SORMS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-8 space-y-2 animate-reveal-up delay-200">
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white">
                Prepare for
              </span>
              <span className="block">
                <span className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white">
                  What's Coming
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-reveal-up delay-300">
              transformative virtual summits designed to prepare leaders for 
              <span className="text-white font-medium"> SORMS </span>. 
              Deepen your understanding, expand your influence, and connect with kingdom leaders.
            </p>

            {/* CTA Buttons - Updated to use openModal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-reveal-up delay-400">
              <button
                onClick={() => sectionRefs.schedule.current?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-sm font-medium text-base tracking-wide transition-all duration-300 min-w-[200px]"
              >
                Explore Summits
                <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all duration-300">→</span>
              </button>
              
              <button
                onClick={() => openModal()}
                className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white rounded-sm font-medium text-base tracking-wide transition-all duration-300 min-w-[200px]"
              >
                Register Now
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-slate-800/50 animate-reveal-up delay-500">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-light text-white mb-2">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">{stat.label}</div>
                  <div className="text-xs text-slate-600 mt-1">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-reveal-fade delay-700">
          <button 
            onClick={() => sectionRefs.overview.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-600 group-hover:text-slate-400 transition-colors">
              Explore
            </span>
            <div className="w-[2px] h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent group-hover:via-slate-400 transition-all" />
          </button>
        </div>
      </section>

      {/* Overview Section - Refined */}
      <section ref={sectionRefs.overview} className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-6">
                Overview
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-8 leading-tight">
                A series of{' '}
                <span className="font-medium italic">focused intensives</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Each summit is designed to address a specific sphere of influence, 
                providing deep-dive teaching, practical application, and meaningful 
                connection with peers and experts.
              </p>

              {/* Key Principles */}
              <div className="space-y-4">
                {[
                  { title: 'Expert-Led Sessions', desc: 'Learn from practitioners with real-world experience.' },
                  { title: 'Practical Application', desc: 'Leave with actionable strategies and frameworks.' },
                  { title: 'Peer Connection', desc: 'Build relationships with like-minded leaders.' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 bg-slate-100 group-hover:bg-slate-200 rounded-sm flex items-center justify-center transition-colors">
                      <span className="text-slate-600 text-lg">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Vision Card */}
            <div className="bg-slate-50 p-12">
              <blockquote className="space-y-6">
                <p className="text-2xl text-slate-700 leading-relaxed italic">
                  "These summits are not just events—they're incubators for the next 
                  generation of Kingdom leaders who will shape culture and society."
                </p>
                <footer className="text-sm text-slate-400 uppercase tracking-wider">
                  — Joshua Nwaeze, GKCGA
                </footer>
              </blockquote>
              
              <div className="mt-12 pt-12 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 text-lg">6</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Summits, One Purpose</p>
                    <p className="text-xs text-slate-500">Preparation for greater impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Clean & Professional */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              What's included
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every summit is designed to provide maximum value and lasting impact
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 hover-lift">
                <div className="text-slate-700 mb-4">
                  {feature.icon("w-10 h-10")}
                </div>
                <h3 className="text-sm font-medium text-slate-900 mb-2 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <span className="text-xs font-medium text-slate-400">
                  {feature.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summit Schedule - Sophisticated Grid */}
      <section ref={sectionRefs.schedule} className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-4">
              Schedule
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Choose your path
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
              Six focused intensives spanning March through August 2026
            </p>

            {/* Filter Tabs - Minimal */}
            <div className="flex flex-wrap justify-center gap-2 mt-12">
              {['all', 'spiritual', 'leadership', 'dominion', 'economic', 'social', 'political'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-xs uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-slate-900 text-white'
                      : 'bg-transparent text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Summit Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-200">
            {filteredSummits.map((summit, index) => (
              <div
                key={summit.id}
                className="bg-white p-8 hover-lift"
                onMouseEnter={() => setHoveredSummit(summit.id)}
                onMouseLeave={() => setHoveredSummit(null)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      {summit.date}
                    </span>
                    <h3 className="text-xl font-medium text-slate-900 mt-1">{summit.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{summit.theme}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 ${
                    summit.price === 'Free' ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white'
                  }`}>
                    {summit.price}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {summit.description}
                </p>

                {/* Topics */}
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-3">
                    Key Topics
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {summit.topics.slice(0, 4).map((topic, idx) => (
                      <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Speaker */}
                <div className="flex items-center gap-3 mb-6 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 text-sm font-medium">
                      {summit.speaker.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{summit.speaker.name}</p>
                    <p className="text-xs text-slate-500">{summit.speaker.title}</p>
                  </div>
                </div>

                {/* Schedule Preview */}
                <div className="mb-6">
                  {summit.schedule.map((day, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs py-2 border-b border-slate-50 last:border-0">
                      <span className="w-16 text-slate-400">{day.day}</span>
                      <span className="flex-1 text-slate-600">{day.topic}</span>
                      <span className="text-slate-400">{day.time}</span>
                    </div>
                  ))}
                </div>

                {/* Register Button - Updated to use openModal with summit title */}
                <button
                  onClick={() => openModal(summit.title)}
                  className="w-full mt-4 text-sm text-slate-400 hover:text-slate-900 text-left transition-colors flex items-center justify-between group"
                >
                  <span>Register for this summit</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
          </div>

          {/* All-Access Pass */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-slate-50 p-8 max-w-lg">
              <span className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                Best Value
              </span>
              <h3 className="text-2xl font-light text-slate-900 mb-3">All-Access Pass</h3>
              <p className="text-sm text-slate-600 mb-6">
                Register for all 6 summits and receive exclusive bonus materials
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-xs text-slate-500">All 6 Summits</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="text-xs text-slate-500">Bonus Resources</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="text-xs text-slate-500">VIP Networking</span>
              </div>
              <button
                onClick={() => openModal('All-Access Pass (All 6 Summits)')}
                className="px-8 py-3 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Register for All-Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section - Clean */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-4">
              Speakers
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Learn from experts
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Practitioners and thought leaders from various spheres of influence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-200">
            {speakers.map((speaker, index) => (
              <div key={index} className="bg-white p-6 text-center hover-lift">
                <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-slate-600 text-2xl font-light">
                    {speaker.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">{speaker.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{speaker.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Minimal Accordion */}
      <section ref={sectionRefs.faq} className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Common questions
            </h2>
          </div>

          <div className="space-y-px bg-slate-200">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white">
                <button
                  onClick={() => setSelectedSummit(selectedSummit === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-900">{faq.q}</span>
                  <span className={`text-slate-400 transform transition-transform duration-300 ${
                    selectedSummit === index ? 'rotate-45' : ''
                  }`}>
                    +
                  </span>
                </button>
                {selectedSummit === index && (
                  <div className="px-8 pb-6 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Sophisticated */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Ready to begin?
          </h2>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed">
            Join thousands of leaders preparing for SORMS Lagos 2026 through these transformative virtual summits
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openModal()}
              className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 text-sm font-medium tracking-wide transition-all duration-300 min-w-[200px]"
            >
              Register Now
            </button>
            
            <button
              onClick={() => sectionRefs.schedule.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white text-sm font-medium tracking-wide transition-all duration-300 min-w-[200px]"
            >
              View Schedule
            </button>
          </div>
          
          <p className="text-sm text-slate-600 mt-8">
            All summits are free • Recordings available for 30 days
          </p>
        </div>
      </section>

      {/* Registration Modal - With Firebase Realtime Database Integration */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-light text-slate-900 mb-2">Summit Registration</h3>
                <p className="text-sm text-slate-500">Virtual Summits 2026</p>
              </div>

              {/* Success Message */}
              {formStatus.success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200">
                  <p className="text-sm text-green-700 text-center">
                    Registration successful! You'll receive confirmation details shortly.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {formStatus.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 text-center">{formStatus.error}</p>
                </div>
              )}

              {/* Existing Registration Warning */}
              {formStatus.existingRegistration && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-700 text-center">
                    You're already registered for this summit. We'll send you the access details soon.
                  </p>
                </div>
              )}

              {!formStatus.success && !formStatus.existingRegistration && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                      placeholder="+234 123 456 7890"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Select Summit <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="summit"
                      value={formData.summit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                    >
                      <option value="">Choose a summit</option>
                      {summits.map(s => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                      <option value="All-Access Pass (All 6 Summits)">All-Access Pass (All 6 Summits)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                    >
                      <option value="">Select an option</option>
                      <option value="Church">Church</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friend">Friend/Family</option>
                      <option value="Email">Email Newsletter</option>
                      <option value="Website">Website</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      What do you hope to gain?
                    </label>
                    <textarea
                      name="expectations"
                      value={formData.expectations}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                      placeholder="Share your expectations..."
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      id="terms"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-500">
                      I agree to the <a href="#" className="text-slate-900 underline">terms and conditions</a> and 
                      consent to being contacted about this summit. <span className="text-red-400">*</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`w-full text-sm font-medium tracking-wide py-3 transition-colors ${
                      formStatus.submitting 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {formStatus.submitting ? 'Processing...' : 'Complete Registration'}
                  </button>

                  <p className="text-xs text-center text-slate-400">
                    You'll receive confirmation and access details via email
                  </p>
                </form>
              )}

              {/* Success Actions */}
              {(formStatus.success || formStatus.existingRegistration) && (
                <div className="text-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualSummitsPage;