// src/pages/VolunteerPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { saveVolunteerApplication, checkExistingVolunteerApplication } from '../firebase';

const VolunteerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  
  // Form state for Firebase
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ageGroup: '',
    departmentPreferences: [],
    previousExperience: '',
    motivation: '',
    heardFrom: '',
    agreeToTerms: false
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    existingApplication: false
  });

  const sectionRefs = {
    hero: useRef(null),
    overview: useRef(null),
    departments: useRef(null),
    requirements: useRef(null),
    faq: useRef(null)
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'departmentPreferences') {
      // Handle department preferences checkboxes
      setFormData(prev => {
        const newPreferences = checked 
          ? [...prev.departmentPreferences, value]
          : prev.departmentPreferences.filter(dept => dept !== value);
        return { ...prev, departmentPreferences: newPreferences };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle form submission to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset form status
    setFormStatus({
      submitting: true,
      success: false,
      error: null,
      existingApplication: false
    });

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.ageGroup) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.departmentPreferences.length === 0) {
        throw new Error('Please select at least one department preference');
      }

      if (!formData.agreeToTerms) {
        throw new Error('Please agree to the terms and conditions');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if already applied
      const existing = await checkExistingVolunteerApplication(formData.email);
      
      if (existing) {
        setFormStatus({
          submitting: false,
          success: false,
          error: null,
          existingApplication: true
        });
        return;
      }

      // Save to Firebase
      const applicationId = await saveVolunteerApplication({
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        timestamp: new Date().toISOString(),
        pageSource: 'Volunteer Page 2026',
        status: 'pending'
      });

      // Success
      setFormStatus({
        submitting: false,
        success: true,
        error: null,
        existingApplication: false
      });

      // Clear form after 3 seconds and close modal
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          ageGroup: '',
          departmentPreferences: [],
          previousExperience: '',
          motivation: '',
          heardFrom: '',
          agreeToTerms: false
        });
        setFormStatus({
          submitting: false,
          success: false,
          error: null,
          existingApplication: false
        });
      }, 3000);

    } catch (error) {
      setFormStatus({
        submitting: false,
        success: false,
        error: error.message,
        existingApplication: false
      });
    }
  };

  // Open modal with optional pre-selected department
  const openModal = (departmentName = '') => {
    if (departmentName) {
      setFormData(prev => ({
        ...prev,
        departmentPreferences: [departmentName]
      }));
    }
    setFormStatus({
      submitting: false,
      success: false,
      error: null,
      existingApplication: false
    });
    setIsModalOpen(true);
  };

const departments = [
  {
    id: 1,
    name: "Media & Technical",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 10L11 14L9 12M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="18" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 7L22 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    roles: [
      { title: "Photography", description: "Capture key moments and speakers" },
      { title: "Videography", description: "Record sessions and testimonials" },
      { title: "Live Streaming", description: "Manage broadcast platforms" },
      { title: "Sound Engineering", description: "Operate audio equipment" },
      { title: "Lighting", description: "Create atmosphere through lighting" },
      { title: "Social Media", description: "Live updates and engagement" }
    ],
    description: "Capture and broadcast through professional media coverage. Your skills will help reach thousands online.",
    commitment: "Pre-event training + 3 event days",
    spots: 15,
    filled: 5,
    category: "technical",
    skills: ["Technical aptitude", "Creativity", "Attention to detail"],
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    lightBg: "bg-blue-50/50"
  },
  {
    id: 2,
    name: "Logistics & Operations",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 7H17M7 12H12M7 17H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M19 19L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    roles: [
      { title: "Venue Setup", description: "Arrange seating and stages" },
      { title: "Equipment Management", description: "Track and maintain gear" },
      { title: "Transportation", description: "Coordinate vehicle movements" },
      { title: "Inventory", description: "Manage supplies and materials" },
      { title: "Runner", description: "Support various departments" },
      { title: "Stage Management", description: "Coordinate speaker transitions" }
    ],
    description: "Ensure everything runs smoothly behind the scenes. You'll be the backbone that makes the event flow seamlessly.",
    commitment: "3 days pre-event + 3 event days",
    spots: 20,
    filled: 8,
    category: "operations",
    skills: ["Organization", "Problem-solving", "Physical stamina"],
    gradient: "from-green-500 to-emerald-500",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    lightBg: "bg-green-50/50"
  },
  {
    id: 3,
    name: "Ushering & Hospitality",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4.5C10.607 4.5 9.5 5.607 9.5 7C9.5 8.393 10.607 9.5 12 9.5C13.393 9.5 14.5 8.393 14.5 7C14.5 5.607 13.393 4.5 12 4.5Z" 
          stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 20V19C5 15.686 8.134 13 12 13C15.866 13 19 15.686 19 19V20" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 7H22M22 7H19M22 7V4M22 7V10" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="19" cy="16" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    roles: [
      { title: "Greeters", description: "First point of contact for attendees" },
      { title: "Seating Ushers", description: "Guide attendees to seats" },
      { title: "Information Desk", description: "Answer questions and assist" },
      { title: "VIP Hospitality", description: "Serve special guests" },
      { title: "Refreshments", description: "Manage food and beverage areas" },
      { title: "Registration", description: "Check-in attendees" }
    ],
    description: "Welcome attendees with warmth and excellence, creating a memorable experience from the moment they arrive.",
    commitment: "Event days only (3 days)",
    spots: 25,
    filled: 12,
    category: "hospitality",
    skills: ["Friendliness", "Communication", "Patience"],
    gradient: "from-yellow-500 to-amber-500",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    lightBg: "bg-yellow-50/50"
  },
  {
    id: 4,
    name: "Prayer & Counseling",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21L16 17M12 21L8 17M12 21V14M12 14C13.6569 14 15 12.6569 15 11V7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V11C9 12.6569 10.3431 14 12 14Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 10C18 13.3137 15.3137 16 12 16C8.68629 16 6 13.3137 6 10" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 20L23 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    roles: [
      { title: "Prayer Team", description: "Pray with attendees before/after sessions" },
      { title: "Altar Call Counselors", description: "Minister to those responding" },
      { title: "Intercessors", description: "Pray during sessions" },
      { title: "Follow-up Team", description: "Connect with new believers" }
    ],
    description: "Support the spiritual atmosphere and minister to attendees. Be available for those seeking prayer and guidance.",
    commitment: "Training sessions + event days",
    spots: 20,
    filled: 10,
    category: "spiritual",
    skills: ["Maturity", "Compassion", "Discretion"],
    gradient: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    lightBg: "bg-purple-50/50"
  },
  {
    id: 5,
    name: "Children's Ministry",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 20V19C5 15.686 8.134 13 12 13C15.866 13 19 15.686 19 19V20" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="18" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 10L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="6" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 10L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    roles: [
      { title: "Childcare", description: "Care for infants and toddlers" },
      { title: "Kids Program Leaders", description: "Lead children's sessions" },
      { title: "Activities Coordinators", description: "Organize games and crafts" },
      { title: "Safety Team", description: "Ensure children's safety" }
    ],
    description: "Create a fun, safe, and spiritual environment for children while parents attend sessions.",
    commitment: "Event days (3 days)",
    spots: 12,
    filled: 4,
    category: "children",
    skills: ["Love for children", "Creativity", "Patience"],
    gradient: "from-red-500 to-rose-500",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    lightBg: "bg-red-50/50"
  },
  {
    id: 6,
    name: "Administration",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10H21M7 15H11M7 18H14M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="17" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M19 17L21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    roles: [
      { title: "Registration Desk", description: "Process attendee check-ins" },
      { title: "Data Entry", description: "Manage databases" },
      { title: "Certificate Preparation", description: "Prepare and distribute certificates" },
      { title: "Office Support", description: "General administrative tasks" },
      { title: "Communication", description: "Internal team coordination" }
    ],
    description: "Handle the administrative tasks that keep everything organized and running efficiently.",
    commitment: "Pre-event (remote) + event days",
    spots: 10,
    filled: 3,
    category: "admin",
    skills: ["Organization", "Computer skills", "Attention to detail"],
    gradient: "from-indigo-500 to-purple-500",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    lightBg: "bg-indigo-50/50"
  },
  {
    id: 7,
    name: "Security",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L20 7V12C20 16 16 20 12 21C8 20 4 16 4 12V7L12 3Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12V16M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 21L23 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    roles: [
      { title: "Crowd Control", description: "Manage attendee flow" },
      { title: "Perimeter Security", description: "Monitor entry points" },
      { title: "Parking Management", description: "Direct vehicle movement" },
      { title: "Emergency Response", description: "First aid and emergency protocols" }
    ],
    description: "Ensure the safety and security of all attendees, staff, and property throughout the event.",
    commitment: "Event days (3 days)",
    spots: 15,
    filled: 6,
    category: "security",
    skills: ["Alertness", "Calm under pressure", "Physical fitness"],
    gradient: "from-gray-600 to-gray-800",
    iconBg: "bg-gray-50",
    iconColor: "text-gray-700",
    lightBg: "bg-gray-50/50"
  },
  {
    id: 8,
    name: "Creative Arts",
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20L20 4M12 8L16 12M8 12L12 16M4 16L8 20M16 4L20 8" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    roles: [
      { title: "Stage Design", description: "Create impactful stage setups" },
      { title: "Decorations", description: "Design and install decor" },
      { title: "Art Installations", description: "Create visual art pieces" },
      { title: "Props", description: "Design and manage props" },
      { title: "Set Design", description: "Plan and execute stage sets" }
    ],
    description: "Transform the venue into a space that reflects kingdom glory and enhances the worship experience.",
    commitment: "Pre-event setup + event days",
    spots: 10,
    filled: 2,
    category: "creative",
    skills: ["Creativity", "Design skills", "Teamwork"],
    gradient: "from-orange-500 to-red-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    lightBg: "bg-orange-50/50"
  }
];

  const filteredDepartments = activeFilter === 'all' 
    ? departments 
    : departments.filter(d => d.category === activeFilter);

const benefits = [
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5V3M15 5V7M15 5H11M19 11V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V11C5 9.89543 5.89543 9 7 9H17C18.1046 9 19 9.89543 19 11ZM9 13H11M13 13H15M9 17H11M13 17H15" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Free Event Access",
    description: "Attend all sessions when not on duty"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 11H8.01M16 11H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Meals Provided",
    description: "Breakfast, lunch, and dinner during shifts"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Certificate of Service",
    description: "Official recognition from GKCGA"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6.042C10.3516 4.56336 8.2144 3.74694 6 3.75C4.948 3.75 3.938 3.93 3 4.262V18.512C3.962 18.172 4.999 18 6 18C8.305 18 10.408 18.867 12 20.292M12 6.042C13.6484 4.56336 15.7856 3.74694 18 3.75C19.052 3.75 20.062 3.93 21 4.262V18.512C20.038 18.172 19.001 18 18 18C15.7856 17.9969 13.6484 18.8134 12 20.292M12 6.042V20.292" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Comprehensive Training",
    description: "Department-specific training and orientation"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C17.3431 15 16 16.3431 16 18V20H17ZM17 20H7M7 20H2V18C2 16.3431 3.34315 15 5 15C6.65685 15 8 16.3431 8 18V20H7ZM7 20V17M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Leadership Networking",
    description: "Connect with ministry leaders and influencers"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18H12.01M8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 9H15M9 13H15M9 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Exclusive Volunteer Gear",
    description: "SORMS 2026 volunteer t-shirt and materials"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 21H20M12 17V21M9 4L12 2L15 4V10L12 12L9 10V4Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 21V15C18 13.8954 17.1046 13 16 13H8C6.89543 13 6 13.8954 6 15V21" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Leadership Development",
    description: "Grow through hands-on experience"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 3L21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V13H15V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 13V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Behind-the-Scenes Access",
    description: "Unique perspective of event operations"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10H21M7 15H11M7 18H14M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Reference Letter",
    description: "For future opportunities upon request"
  },
  {
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4.5C10.607 4.5 9.5 5.607 9.5 7C9.5 8.393 10.607 9.5 12 9.5C13.393 9.5 14.5 8.393 14.5 7C14.5 5.607 13.393 4.5 12 4.5Z" 
          stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 20V19C5 15.686 8.134 13 12 13C15.866 13 19 15.686 19 19V20" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 7H22M22 7H19M22 7V4M22 7V10" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Community",
    description: "Join a team of like-minded volunteers"
  }
];

  const requirements = [
    {
      category: "Age & Legal",
      icon: "📋",
      items: [
        "18 years or older (16-17 with parental consent form)",
        "Valid ID for registration",
        "Parental consent form (if under 18)"
      ]
    },
    {
      category: "Spiritual",
      icon: "🙏",
      items: [
        "Committed to SORMS and GKCGA vision",
        "Active in a local church",
        "Agree with statement of faith",
        "Recommendation from pastor/leader"
      ]
    },
    {
      category: "Time Commitment",
      icon: "⏰",
      items: [
        "Available for mandatory training sessions",
        "Able to serve full event days (3 days)",
        "Punctual and reliable",
        "Attend pre-event briefings"
      ]
    },
    {
      category: "Personal Qualities",
      icon: "⭐",
      items: [
        "Team player with good communication",
        "Positive, servant-hearted attitude",
        "Flexible and adaptable",
        "Professional conduct"
      ]
    }
  ];

  const timeline = [
    {
      phase: "Phase 1: Application",
      date: "Jan 1 - Feb 28, 2026",
      items: ["Submit online application", "Initial screening", "Department preferences"],
      status: "open",
      statusText: "Applications Open",
      color: "green"
    },
    {
      phase: "Phase 2: Interview",
      date: "Mar 1 - Mar 31, 2026",
      items: ["Department interviews", "Skills assessment", "Role matching"],
      status: "upcoming",
      statusText: "Starts Mar 1",
      color: "yellow"
    },
    {
      phase: "Phase 3: Selection",
      date: "Apr 1 - Apr 15, 2026",
      items: ["Acceptance notifications", "Role confirmation", "Welcome package"],
      status: "upcoming",
      statusText: "Starts Apr 1",
      color: "blue"
    },
    {
      phase: "Phase 4: Training",
      date: "May - Jul 2026",
      items: ["General orientation", "Department training", "Team building", "Venue walkthrough"],
      status: "upcoming",
      statusText: "Starts May",
      color: "purple"
    },
    {
      phase: "Phase 5: Event",
      date: "Aug 2026",
      items: ["SORMS Lagos 2026", "Daily briefings", "Post-event debrief", "Certificate distribution"],
      status: "upcoming",
      statusText: "August 2026",
      color: "indigo"
    }
  ];


const stats = [
  { 
    value: "8", 
    label: "Departments", 
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21H21M5 21V7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V21M9 9H15M9 13H13" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="7" y="5" width="10" height="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    sublabel: "Specialized Teams"
  },
  { 
    value: "127", 
    label: "Volunteer Slots", 
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 20V19C5 15.686 8.134 13 12 13C15.866 13 19 15.686 19 19V20" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="19" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 17L23 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    sublabel: "Limited Availability"
  },
  { 
    value: "5000+", 
    label: "Attendees", 
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 20V19C5 15.686 8.134 13 12 13C15.866 13 19 15.686 19 19V20" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="19" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 13L23 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    sublabel: "Expected Attendance"
  },
  { 
    value: "3", 
    label: "Event Days", 
    icon: (className = "w-8 h-8") => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 10H21M8 2V6M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="15" r="1.5" fill="currentColor" fillOpacity="0.8"/>
        <circle cx="12" cy="15" r="1.5" fill="currentColor" fillOpacity="0.8"/>
        <circle cx="16" cy="15" r="1.5" fill="currentColor" fillOpacity="0.8"/>
      </svg>
    ),
    sublabel: "Immersive Experience"
  }
];

  const faqs = [
    {
      q: "What's the time commitment for volunteers?",
      a: "Volunteers commit to serving during all 3 event days (approximately 8 hours per day). Some departments require additional pre-event training and setup days."
    },
    {
      q: "Do I need previous experience?",
      a: "Not at all! We provide comprehensive training for all roles. We're looking for willing hearts and teachable spirits."
    },
    {
      q: "Can I choose my department?",
      a: "Yes, you can indicate your preferences. We'll do our best to place you according to your gifts, interests, and department needs."
    },
    {
      q: "What about accommodation for out-of-town volunteers?",
      a: "We're working on arrangements for out-of-town volunteers. Details will be shared upon acceptance. We'll help coordinate with local hosts."
    },
    {
      q: "Is there an age requirement?",
      a: "Volunteers must be 18 or older. Those 16-17 can volunteer with a completed parental consent form (available for download)."
    },
    {
      q: "What's the application process?",
      a: "Apply online → Initial screening → Department interview → Acceptance → Training → Event service. Simple!"
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

        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .animate-reveal-up {
          animation: reveal-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-reveal-fade {
          animation: reveal-fade 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-float-subtle {
          animation: float-subtle 6s ease-in-out infinite;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .text-balance {
          text-wrap: balance;
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
      <section ref={sectionRefs.hero} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Refined Background with Subtle Texture */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
              filter: 'brightness(0.4)',
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
                SORMS Lagos 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-8 space-y-2 animate-reveal-up delay-200">
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white">
                Volunteer
              </span>
              <span className="block">
                <span className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white">
                  with Purpose
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-reveal-up delay-300">
              Join an exclusive team of dedicated servants creating an atmosphere for 
              <span className="text-white font-medium"> 5,000+ attendees</span> to encounter God. 
              Your service will help shape a historic move of God.
            </p>

            {/* CTA Buttons - Updated to use openModal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-reveal-up delay-400">
              <button
                onClick={() => openModal()}
                className="group relative px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-sm font-medium text-base tracking-wide transition-all duration-300 min-w-[200px]"
              >
                Submit Application
                <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all duration-300">→</span>
              </button>
              
              <button 
                onClick={() => sectionRefs.overview.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white rounded-sm font-medium text-base tracking-wide transition-all duration-300 min-w-[200px]"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-slate-800/50 animate-reveal-up delay-500">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-light text-white mb-2">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">{stat.label}</div>
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
                Service that creates{' '}
                <span className="font-medium italic">lasting impact</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Behind every great move of God are dedicated servants who make it happen. 
                When you volunteer at SORMS Lagos 2026, you're not just filling a role — 
                you're investing in eternity and creating an atmosphere for transformation.
              </p>

              {/* Key Principles */}
              <div className="space-y-4">
                {[
                  { title: 'Excellence in Service', desc: 'Every task, no matter how small, done with precision and care.' },
                  { title: 'Spiritual Growth', desc: 'Deepen your faith through hands-on ministry experience.' },
                  { title: 'Lasting Community', desc: 'Build relationships with like-minded servants.' }
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
                  "To raise God's Kingdom Citizens across the nations, restoring God's purposes on earth 
                  according to the original design, manifesting sons through revival."
                </p>
                <footer className="text-sm text-slate-400 uppercase tracking-wider">
                  — SORMS Vision Statement
                </footer>
              </blockquote>
              
              <div className="mt-12 pt-12 border-t border-slate-200">
                <p className="text-sm text-slate-500 leading-relaxed">
                  "The greatest among you will be your servant." 
                  <span className="block mt-2 text-slate-400">— Matthew 23:11</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid - Clean & Professional */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-4">
              Benefits
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              What you'll receive
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Beyond the experience of serving, we ensure our volunteers are well taken care of
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-slate-200">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 hover-lift">
                <span className="text-3xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-sm font-medium text-slate-900 mb-2 uppercase tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section - Sophisticated Grid */}
      <section ref={sectionRefs.departments} className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-4">
              Departments
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Find your place
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Eight distinct departments where your gifts can make the greatest impact
            </p>

            {/* Filter Tabs - Minimal */}
            <div className="flex flex-wrap justify-center gap-2 mt-12">
              {['all', 'technical', 'operations', 'hospitality', 'spiritual', 'children', 'admin', 'security', 'creative'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 text-xs uppercase tracking-wider transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-transparent text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Department Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white p-8 hover-lift"
                onMouseEnter={() => setHoveredCard(dept.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-sm text-slate-400 uppercase tracking-wider">
                      {dept.spots - dept.filled} positions
                    </span>
                    <h3 className="text-xl font-medium text-slate-900 mt-1">{dept.name}</h3>
                  </div>
                  <span className="text-3xl opacity-50">{dept.icon}</span>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">Filled</span>
                    <span className="text-slate-900 font-medium">{dept.filled}/{dept.spots}</span>
                  </div>
                  <div className="w-full h-px bg-slate-200">
                    <div 
                      className="h-px bg-slate-900 transition-all duration-300"
                      style={{ width: `${(dept.filled / dept.spots) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {dept.description}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-3">
                    Key Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dept.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Commitment */}
                <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-6">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{dept.commitment}</span>
                </div>

                {/* Apply Button - Updated to use openModal with department name */}
                <button
                  onClick={() => openModal(dept.name)}
                  className="w-full mt-6 text-sm text-slate-400 hover:text-slate-900 text-left transition-colors flex items-center justify-between group"
                >
                  <span>Apply for this department</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Timeline - Split Layout */}
      <section ref={sectionRefs.requirements} className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Requirements */}
            <div>
              <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-6">
                Requirements
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-12">
                What you'll need
              </h2>

              <div className="space-y-6">
                {requirements.map((req, index) => (
                  <div key={index} className="bg-white p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{req.icon}</span>
                      <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                        {req.category}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {req.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className="w-1 h-1 bg-slate-300 rounded-full mt-2" />
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-6">
                Timeline
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-12">
                Selection process
              </h2>

              <div className="space-y-4">
                {timeline.map((phase, index) => (
                  <div key={index} className="bg-white p-8 relative">
                    {/* Status */}
                    <div className="absolute top-8 right-8">
                      <span className={`text-xs uppercase tracking-wider ${
                        phase.status === 'open' ? 'text-green-600' : 'text-slate-300'
                      }`}>
                        {phase.statusText}
                      </span>
                    </div>

                    {/* Phase Number */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 text-sm">{(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-900">{phase.phase}</h3>
                        <p className="text-xs text-slate-400 mt-1">{phase.date}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <ul className="space-y-2">
                      {phase.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-center gap-3">
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Consent Form */}
              <div className="mt-6 bg-white p-8">
                <h3 className="text-sm font-medium text-slate-900 mb-2 uppercase tracking-wide">
                  Parental Consent
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  For volunteers aged 16-17
                </p>
                <a
                  href="/pdfs/parental-consent-form.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <span>Download Form</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Clean Quotes */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-slate-400 text-xs tracking-[0.25em] uppercase mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Voices of service
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-slate-200">
            {[
              {
                name: "Blessing Adeyemi",
                role: "Media Team '24",
                quote: "Volunteering transformed my perspective on service. I grew more in that one event than in years of just attending."
              },
              {
                name: "Chidi Okonkwo",
                role: "Logistics Team '24",
                quote: "Being behind the scenes showed me the power of hidden service. Every role matters in fulfilling the vision."
              },
              {
                name: "Peace Eze",
                role: "Ushering Team '24",
                quote: "I went in to serve and came out transformed. The experience shaped my understanding of true ministry."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 text-lg font-light">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Minimal Accordion */}
      <section ref={sectionRefs.faq} className="py-32 bg-slate-50">
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
                  onClick={() => setSelectedDepartment(selectedDepartment === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-900">{faq.q}</span>
                  <span className={`text-slate-400 transform transition-transform duration-300 ${
                    selectedDepartment === index ? 'rotate-45' : ''
                  }`}>
                    +
                  </span>
                </button>
                {selectedDepartment === index && (
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
            Ready to serve?
          </h2>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed">
            Join the team that will serve thousands and create an atmosphere for transformation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openModal()}
              className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 text-sm font-medium tracking-wide transition-all duration-300 min-w-[200px]"
            >
              Submit Application
            </button>
            
            <button
              onClick={() => setShowPdfViewer(true)}
              className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white text-sm font-medium tracking-wide transition-all duration-300 min-w-[200px]"
            >
              Download Info Pack
            </button>
          </div>
          
          <p className="text-sm text-slate-600 mt-8">
            Applications close February 28, 2026 • 127 positions available
          </p>
        </div>
      </section>

      {/* Application Modal - With Firebase Integration */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-slate-900 mb-2">Volunteer Application</h3>
                <p className="text-sm text-slate-500">SORMS Lagos 2026</p>
              </div>

              {/* Success Message */}
              {formStatus.success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200">
                  <p className="text-sm text-green-700 text-center">
                    Application submitted successfully! We'll contact you within 5-7 business days.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {formStatus.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 text-center">{formStatus.error}</p>
                </div>
              )}

              {/* Existing Application Warning */}
              {formStatus.existingApplication && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-700 text-center">
                    You've already submitted an application. We'll be in touch soon!
                  </p>
                </div>
              )}

              {!formStatus.success && !formStatus.existingApplication && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                        placeholder="Doe"
                      />
                    </div>
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
                      Age Group <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                    >
                      <option value="">Select age group</option>
                      <option value="18-25">18-25</option>
                      <option value="26-35">26-35</option>
                      <option value="36-45">36-45</option>
                      <option value="46-55">46-55</option>
                      <option value="56+">56+</option>
                      <option value="16-17 (with parental consent)">16-17 (with parental consent)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Department Preferences <span className="text-red-400">*</span> (Select up to 3)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {departments.slice(0, 8).map(dept => (
                        <label key={dept.id} className="flex items-center gap-2 p-3 border border-slate-200 hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            name="departmentPreferences"
                            value={dept.name}
                            checked={formData.departmentPreferences.includes(dept.name)}
                            onChange={handleInputChange}
                            className="rounded-none text-slate-900"
                            disabled={formData.departmentPreferences.length >= 3 && !formData.departmentPreferences.includes(dept.name)}
                          />
                          <span className="text-xs text-slate-600">{dept.name}</span>
                        </label>
                      ))}
                    </div>
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
                      Previous Experience
                    </label>
                    <textarea
                      name="previousExperience"
                      value={formData.previousExperience}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                      placeholder="Briefly describe any relevant experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                      Why do you want to volunteer? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-400 outline-none transition-colors text-sm"
                      placeholder="Share your motivation for serving..."
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
                      confirm that the information provided is accurate. <span className="text-red-400">*</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`w-full text-sm font-medium tracking-wide py-4 transition-colors ${
                      formStatus.submitting 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {formStatus.submitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>

                  <p className="text-xs text-center text-slate-400">
                    We'll contact you within 5-7 business days
                  </p>
                </form>
              )}

              {/* Success Actions */}
              {(formStatus.success || formStatus.existingApplication) && (
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

      {/* PDF Info Pack - Minimal */}
      {showPdfViewer && (
        <div className="fixed bottom-8 right-8 z-50 w-96 bg-white shadow-2xl border border-slate-200">
          <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <h3 className="text-sm font-medium text-slate-900">Volunteer Information Pack</h3>
            <button
              onClick={() => setShowPdfViewer(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <a
              href="/pdfs/sorms-2026-volunteer-info-pack.pdf"
              download
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-xs text-slate-600">SORMS-2026-Volunteer-Guide.pdf</span>
              <span className="text-xs text-slate-400">↓</span>
            </a>
            <p className="text-xs text-slate-400 mt-3">
              Contains role descriptions, schedules, and application guide
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerPage;