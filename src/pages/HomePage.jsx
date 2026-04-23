// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IAmInterestedModal from '../components/onboarding/IAmInterestedModal';
import { 
  saveContact, 
  saveVolunteerApplication, 
  checkExistingVolunteerApplication,
  getTimestamp 
} from '../firebase';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [emailSubscribe, setEmailSubscribe] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // ===== SORMS Registration Form State (inline) =====
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
  // =================================================

  // YouTube state
  const [recentVideos, setRecentVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(null);

  // YouTube config
  const CHANNEL_ID = 'UCpmZmnDshp0o48IZvhB5AbQ';
  const API_KEY = 'AIzaSyBdh9IkFnoGeCb7VvzLyG2U09QzPE-EWh4';

  // Static fallback events
  const staticEvents = [
    {
      id: 1,
      title: "The Manifested Sons - Pre-Conference Virtual Summit",
      date: "14th–15th March, 2026",
      time: "8PM WAT / 7PM UK",
      description: "A powerful gathering featuring Amb. Prince Joshua, Dr. Joseph Iwuchukwu, Eden Ologure, and Tosin Animashaun.",
      category: "Pre-Conference Summit",
      image: "/images/flyer1.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1540575467064-4e7c14ef6c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isStatic: true
    },
    {
      id: 2,
      title: "Accessing the Supernatural - Part 2",
      date: "Livestreamed",
      time: "12AM WAT",
      description: "Pst. Joshua Nwaeze ministering on accessing the supernatural realm, walking in power and authority.",
      category: "Bible Study",
      image: "/images/flyer2.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isStatic: true
    },
    {
      id: 3,
      title: "Contending Earnestly for the Faith",
      date: "Livestreamed",
      time: "Facebook & YouTube",
      description: "Pst. Peter C. Emmanuel, a clarion call to stand firm and contend for faith in an age of compromise.",
      category: "Ministry",
      image: "/images/flyer3.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isStatic: true
    }
  ];

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

  // Helper to extract YouTube video ID from any YouTube URL
  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);
    return match ? match[1] : null;
  };

  // Helper: format date for YouTube videos
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Fetch videos – ensures three distinct, most recent videos
  const fetchRecentVideos = async () => {
    const videosMap = new Map();

    // 1. Try YouTube Data API
    let apiSuccess = false;
    if (API_KEY) {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.error && data.items && data.items.length > 0) {
          data.items.forEach(item => {
            const videoId = item.id.videoId;
            if (videoId && !videosMap.has(videoId)) {
              videosMap.set(videoId, {
                id: { videoId },
                snippet: {
                  title: item.snippet.title,
                  publishedAt: item.snippet.publishedAt,
                  description: item.snippet.description,
                  thumbnails: item.snippet.thumbnails
                }
              });
            }
          });
          apiSuccess = videosMap.size >= 3;
        }
      } catch (err) {
        console.error('API fetch error:', err);
      }
    }

    // 2. Fallback to RSS if API didn't return enough unique videos
    if (!apiSuccess && videosMap.size < 3) {
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          data.items.slice(0, 10).forEach(item => {
            const videoId = extractVideoId(item.link);
            if (!videoId) return;

            if (!videosMap.has(videoId)) {
              let thumbnailUrl = item.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
              videosMap.set(videoId, {
                id: { videoId },
                snippet: {
                  title: item.title,
                  publishedAt: item.pubDate,
                  description: item.description || '',
                  thumbnails: {
                    high: { url: thumbnailUrl },
                    medium: { url: thumbnailUrl.replace('maxresdefault', 'mqdefault') },
                    default: { url: thumbnailUrl.replace('maxresdefault', 'default') }
                  }
                }
              });
            }
          });
        }
      } catch (err) {
        console.error('RSS fetch error:', err);
      }
    }

    // Convert map to array, deduplicate again (paranoid), sort, and take first 3
    const allVideos = Array.from(videosMap.values());
    
    // Extra deduplication by video ID (in case Map somehow had duplicates)
    const uniqueById = new Map();
    allVideos.forEach(video => {
      if (!uniqueById.has(video.id.videoId)) {
        uniqueById.set(video.id.videoId, video);
      }
    });
    const uniqueVideos = Array.from(uniqueById.values());
    
    // Sort by publish date (newest first)
    uniqueVideos.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));
    
    // Take the three most recent
    const videos = uniqueVideos.slice(0, 3);
    

    if (videos.length > 0) {
      setRecentVideos(videos);
      setVideosError(null);
    } else {
      setRecentVideos([]);
      setVideosError('No videos found');
    }
    setVideosLoading(false);
  };

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    about: useRef(null),
    pillars: useRef(null),
    community: useRef(null),
    events: useRef(null),
    emailCapture: useRef(null),
    testimonials: useRef(null),
    founder: useRef(null),
    volunteer: useRef(null),
    join: useRef(null)
  };

  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (videoRef.current) {
        const scrolled = window.scrollY;
        const scale = 1 + scrolled * 0.0005;
        videoRef.current.style.transform = `scale(${Math.min(scale, 1.2)})`;
      }

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

  useEffect(() => {
    const dismissed = localStorage.getItem('announcement-dismissed');
    if (dismissed === 'true') setShowAnnouncement(false);
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' });
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date('2026-07-24T09:00:00+01:00').getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const dismissAnnouncement = () => {
    setShowAnnouncement(false);
    localStorage.setItem('announcement-dismissed', 'true');
  };

  const handleEmailSubscribe = async (e) => {
    e.preventDefault();
    if (!emailSubscribe || !emailSubscribe.includes('@')) {
      setNotification({ show: true, message: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setIsSubscribing(true);
    try {
      const subscriberData = {
        email: emailSubscribe.trim(),
        source: 'homepage_email_capture',
        subscriptionType: 'newsletter',
        status: 'active',
        subscribedAt: getTimestamp(),
        userAgent: navigator.userAgent
      };
      await saveContact(subscriberData);
      setNotification({ show: true, message: '✓ You\'re subscribed! We\'ll keep you posted.', type: 'success' });
      setEmailSubscribe('');
    } catch (error) {
      console.error('Error saving subscriber:', error);
      setNotification({ show: true, message: 'There was an error. Please try again later.', type: 'error' });
    } finally {
      setIsSubscribing(false);
    }
  };

  // ===== SORMS Registration Form Handlers =====
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

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setFormStep(prev => prev - 1);
  };

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

  const saveToFirebase = async () => {
    try {
      const existingApplication = await checkExistingVolunteerApplication(formData.email);
      
      if (existingApplication) {
        setNotificationMessage('This email has already been registered. Please contact us if you need assistance.');
        setIsSubmitting(false);
        return false;
      }

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
        source: 'homepage_inline_form',
        applicationType: 'SORMS Community Application',
        timestamp: getTimestamp(),
        status: 'pending_review'
      };

      await saveVolunteerApplication(applicationData);
      return true;
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setNotificationMessage('There was an error submitting your application. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(3)) {
      setIsSubmitting(true);
      setNotificationMessage('');
      
      const saved = await saveToFirebase();
      
      if (saved) {
        setSubmitEmail(formData.email);
        setIsSubmitted(true);
      }
      
      setIsSubmitting(false);
    }
  };
  // ========================================

  useEffect(() => {
    fetchRecentVideos();
  }, []);

  const pillars = [
    {
      id: 1,
      title: "Spiritual Formation",
      number: "01",
      icon: "🙏",
      description: "Deepening intimacy with God and understanding our identity as sons through prayer, study, and spiritual disciplines.",
      spheres: ["Identity", "Intimacy", "Prayer", "Ministry", "Discipleship"],
      gradient: "from-purple-600 to-indigo-600"
    },
    {
      id: 2,
      title: "Leadership & Excellence",
      number: "02",
      icon: "📊",
      description: "Developing the capacity to lead with integrity and represent God with excellence in every sphere of influence.",
      spheres: ["Strategy", "Vision", "Impact", "Governance", "Ethics"],
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      id: 3,
      title: "Innovation & Enterprise",
      number: "03",
      icon: "💡",
      description: "Cultivating the mind of Christ in business, technology, and creativity building ventures that advance the kingdom.",
      spheres: ["Business", "Tech", "Creativity", "Wealth", "Stewardship"],
      gradient: "from-amber-600 to-orange-600"
    },
    {
      id: 4,
      title: "Governance & Culture",
      number: "04",
      icon: "⚖️",
      description: "Engaging policy, law, and culture with kingdom principles shaping society from positions of authority and service.",
      spheres: ["Government", "Law", "Policy", "Justice", "Culture"],
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      id: 5,
      title: "Community & Impact",
      number: "05",
      icon: "🌍",
      description: "Building relationships, transforming communities, and extending the reach of the kingdom through tangible acts of love.",
      spheres: ["Family", "Outreach", "Mentorship", "Service", "Unity"],
      gradient: "from-pink-600 to-purple-600"
    }
  ];

  const testimonials = [
    {
      id: 1,
      text: "Being part of SORMS has completely transformed how I see my role at work. I now lead with kingdom principles and it's changed everything, my team, my output, my purpose.",
      author: "Adaeze",
      role: "SORMS Community Member · Lagos",
      initial: "A"
    },
    {
      id: 2,
      text: "The teachings opened my eyes to see my profession as ministry. I've started mentoring young professionals to integrate faith with excellence in the workplace.",
      author: "Chidi",
      role: "SORMS Community Member · Abuja",
      initial: "C"
    },
    {
      id: 3,
      text: "As a creative, I finally found a community that values art as a sphere of kingdom influence. SORMS gave me both purpose and a tribe of people who get it.",
      author: "Ese",
      role: "SORMS Community Member · Accra",
      initial: "E"
    }
  ];

  const getAnimationClass = (section, delay = 0) => {
    return visibleSections[section] 
      ? `animate-reveal visible animation-delay-${delay}` 
      : 'animate-reveal';
  };

  const getDisplayCards = () => {
    if (videosLoading) return null;
    if (videosError || recentVideos.length === 0) {
      return staticEvents;
    }
    const cards = [...recentVideos];
    while (cards.length < 3) {
      const staticIndex = cards.length % staticEvents.length;
      cards.push({ isStatic: true, ...staticEvents[staticIndex] });
    }
    return cards;
  };

  const displayCards = getDisplayCards();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm animate-slide-up ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Announcement Bar */}
      {showAnnouncement && (
        <div 
          className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-black/5 py-4 animate-slideDown"
          style={{ marginTop: '0' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="bg-[#7c3aed] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  New
                </span>
                <p className="text-sm text-[#48484a]">
                  🔥 SORMS Lagos 2026 tickets are now live —{' '}
                  <Link 
                    to="/tickets" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/tickets');
                    }}
                    className="text-[#7c3aed] font-medium hover:text-[#6d28d9] transition-colors"
                  >
                    Register now
                  </Link>{' '}
                  and secure your seat for July 24–25.
                </p>
              </div>
              <button 
                onClick={dismissAnnouncement}
                className="text-[#86868b] hover:text-[#1d1d1f] transition-colors p-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Video Background */}
      <section ref={sectionRefs.hero} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0c0c0e]">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
            <source src="/videos/hero-background.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-3 mb-8 ${visibleSections.hero ? 'animate-fadeIn' : 'opacity-0'}`}>
              <span className="inline-block bg-[#7c3aed] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">Lagos 2026</span>
              <span className="text-xs uppercase tracking-wider text-white/50">A GKCGA Movement</span>
            </div>
            <h1 className={`font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal leading-[0.95] tracking-tight mb-4 ${
              visibleSections.hero ? 'animate-fadeUp' : 'opacity-0'
            }`} style={{ fontFamily: "'DM Serif Display', serif" }} animationDelay="0.2s">
              Sound of <em className="italic text-[#a78bfa] not-italic">Revival</em>
              <br />
              Manifesting <em className="italic text-[#a78bfa] not-italic">Sons</em>
            </h1>
            <p className={`text-sm uppercase tracking-widest text-white/50 mb-4 ${
              visibleSections.hero ? 'animate-fadeUp' : 'opacity-0'
            }`} style={{ animationDelay: '0.4s' }}>Lagos, Nigeria</p>
            <p className={`font-serif text-lg md:text-xl text-white mb-6 ${
              visibleSections.hero ? 'animate-fadeUp' : 'opacity-0'
            }`} style={{ fontFamily: "'DM Serif Display', serif", animationDelay: '0.6s' }}>
              Friday 24 - Saturday 25 July, 2026
            </p>
            <p className={`text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8 font-light ${
              visibleSections.hero ? 'animate-fadeUp' : 'opacity-0'
            }`} style={{ animationDelay: '0.8s' }}>
              A movement raising spiritually grounded, intellectually sound, and economically productive sons. Raising apostles in every sphere of society.
      
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 ${
              visibleSections.hero ? 'animate-fadeUp' : 'opacity-0'
            }`} style={{ animationDelay: '1s' }}>
              <Link
                to="/tickets"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/tickets');
                }}
                className="group relative px-8 py-4 bg-white text-[#0c0c0e] hover:bg-white/90 rounded-full font-semibold text-base transition-all duration-300 min-w-[240px] text-center inline-flex items-center justify-center gap-2"
              >
                Register Now
                <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link 
                to="/events"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/events');
                }}
                className="px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-full font-medium text-base transition-all duration-300 min-w-[200px] text-center"
              >
                Learn More
              </Link>
            </div>
            <div className={`flex gap-3 justify-center items-center mb-12 ${
              visibleSections.hero ? 'animate-fadeUp' : 'opacity-0'
            }`} style={{ animationDelay: '1.2s' }}>
              <div className="text-center min-w-[60px]">
                <span className="font-serif text-3xl text-white block bg-white/10 border border-white/20 rounded-lg px-3 py-2">{timeLeft.days}</span>
                <span className="text-[0.55rem] uppercase tracking-wider text-white/40 mt-1 block">Days</span>
              </div>
              <span className="font-serif text-2xl text-white/30 self-start pt-2">:</span>
              <div className="text-center min-w-[60px]">
                <span className="font-serif text-3xl text-white block bg-white/10 border border-white/20 rounded-lg px-3 py-2">{timeLeft.hours}</span>
                <span className="text-[0.55rem] uppercase tracking-wider text-white/40 mt-1 block">Hours</span>
              </div>
              <span className="font-serif text-2xl text-white/30 self-start pt-2">:</span>
              <div className="text-center min-w-[60px]">
                <span className="font-serif text-3xl text-white block bg-white/10 border border-white/20 rounded-lg px-3 py-2">{timeLeft.minutes}</span>
                <span className="text-[0.55rem] uppercase tracking-wider text-white/40 mt-1 block">Min</span>
              </div>
              <span className="font-serif text-2xl text-white/30 self-start pt-2">:</span>
              <div className="text-center min-w-[60px]">
                <span className="font-serif text-3xl text-white block bg-white/10 border border-white/20 rounded-lg px-3 py-2">{timeLeft.seconds}</span>
                <span className="text-[0.55rem] uppercase tracking-wider text-white/40 mt-1 block">Sec</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-fadeIn">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[0.6rem] uppercase tracking-wider text-white/40">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-scrollPulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={sectionRefs.about} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={getAnimationClass('about', 200)}>
              <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
           
                Who We Are
              </span>
              <p className="text-[#48484a] text-base leading-relaxed font-light mb-4">
                Sound of Revival Manifesting Sons is a faith-based development and revival movement committed to raising sons and daughters who manifest Christ in character, competence, leadership, and impact across every sphere of society.
              </p>
              <p className="text-[#48484a] text-base leading-relaxed font-light">
                Our conviction: Revival is not complete until it is seen in the marketplace, in governance, in innovation, in education, and in culture.
              </p>
              <div className="flex gap-4 mt-8 flex-wrap">
                <Link 
                  to="/joinsorms"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/joinsorms');
                  }}
                  className="px-8 py-3 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all"
                >                    
                  Become A SORMS Member
                </Link>
                <Link 
                  to="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/about');
                  }}
                  className="px-8 py-3 border border-black/10 text-[#1d1d1f] rounded-full text-sm font-medium hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
                >                      
                  Learn About Us
                </Link>
              </div>
            </div>
            <div className={`bg-white rounded-2xl p-12 border border-black/5 shadow-lg relative overflow-hidden ${getAnimationClass('about', 400)}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#7c3aed]/5 blur-3xl"></div>
              <p className="font-serif text-lg italic text-[#1d1d1f] mb-6 leading-relaxed" 
                 style={{ fontFamily: "'DM Serif Display', serif" }}>
                "SORMS are not just church attendees, but kingdom representatives equipped to shape systems, structures, and society."
              </p>
              <div className="w-10 h-px bg-[#7c3aed] mb-4"></div>
              <span className="text-xs uppercase tracking-wider text-[#86868b]">Sound of Revival Core Conviction</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Pillars Section */}
      <section ref={sectionRefs.pillars} className="py-24 bg-[#0c0c0e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('pillars', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
           
              Five Pillars
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              The <em className="italic text-[#a78bfa] not-italic">Formation</em> Framework
            </h2>
            <p className="text-[#a1a1a6] text-base font-light">
              The five essential dimensions of development that shape every member of the SORMS community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((pillar, index) => (
              <div 
                key={pillar.id}
                className={`group bg-[#161618] border border-white/5 rounded-xl hover:border-[#7c3aed]/30 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden ${
                  visibleSections.pillars ? `animate-reveal visible animation-delay-${(index + 1) * 100}` : 'animate-reveal'
                }`}
              >
                <div className="h-32 relative flex items-center justify-center bg-gradient-to-br from-[#1a1a1f] to-[#0f0f12]">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, #7c3aed 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }}></div>
                  <span className="relative z-10 text-3xl w-12 h-12 rounded-lg bg-black/30 backdrop-blur border border-white/10 flex items-center justify-center">
                    {pillar.icon}
                  </span>
                </div>
                <div className="p-6">
                  <span className="font-serif text-xs text-[#a78bfa] uppercase tracking-wider block mb-3">
                    Pillar {pillar.number}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-white mb-2 leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Levels Section */}
      <section ref={sectionRefs.community} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('community', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">

              Community Levels
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Find Your <em className="italic text-[#7c3aed] not-italic">Place</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className={`bg-white rounded-xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${
              visibleSections.community ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'
            }`}>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#7c3aed] font-semibold mb-4 block">Level 01</span>
              <h3 className="font-serif text-2xl font-normal text-[#1d1d1f] mb-3">Friends of SORMS</h3>
              <p className="text-sm text-[#48484a] mb-6">Open access. Explore what SORMS is building and begin your journey.</p>
              <ul className="space-y-3">
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Open programs & events</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Content & teachings access</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Newsletter & updates</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Community introductions</li>
              </ul>
            </div>
            <div className={`bg-white rounded-xl p-8 border border-[#7c3aed]/30 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden bg-gradient-to-b from-white to-[#f8f4ff] ${
              visibleSections.community ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'
            }`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#7c3aed] font-semibold mb-4 block">Level 02 — Core</span>
              <h3 className="font-serif text-2xl font-normal text-[#1d1d1f] mb-3">SORMS Community</h3>
              <p className="text-sm text-[#48484a] mb-6">Application-based. Structured training, mentorship, and a clear development pathway.</p>
              <ul className="space-y-3">
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Structured training & academies</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Mentorship access</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Growth tracks & milestones</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> WhatsApp & Telegram community</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Service opportunities</li>
              </ul>
            </div>
            <div className={`bg-white rounded-xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${
              visibleSections.community ? 'animate-reveal visible animation-delay-600' : 'animate-reveal'
            }`}>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#7c3aed] font-semibold mb-4 block">Level 03</span>
              <h3 className="font-serif text-2xl font-normal text-[#1d1d1f] mb-3">Builders Circle</h3>
              <p className="text-sm text-[#48484a] mb-6">Proven, vetted leaders who carry the vision, run programs, and mentor others.</p>
              <ul className="space-y-3">
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Lead programs & cohorts</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Mentor emerging sons</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Vision & governance role</li>
                <li className="text-xs text-[#86868b] flex items-center gap-2"><span className="text-[#7c3aed]">✓</span> Ambassador commissioning</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-4 justify-center mt-12">
            <Link 
              to="/joinsorms" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/joinsorms');
              }}
              className="px-8 py-3 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all"
            >
              Get Connected
            </Link>
            <Link 
              to="/community" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/community');
              }}
              className="px-8 py-3 border border-black/10 text-[#1d1d1f] rounded-full text-sm font-medium hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      <section ref={sectionRefs.events} className="py-24 bg-[#0c0c0e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('events', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
              
              Events & Summits
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              What's <em className="italic text-[#a78bfa] not-italic">Happening</em>
            </h2>
            <p className="text-[#a1a1a6] text-base font-light">
              The main event and recent gatherings from the SORMS movement.
            </p>
          </div>

          {/* Featured Event Card */}
          <div className={`bg-gradient-to-r from-[#1a1a1f] to-[#0f0f12] rounded-2xl p-8 md:p-12 border border-[#7c3aed]/20 mb-12 relative overflow-hidden ${getAnimationClass('events', 400)}`}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#a78bfa] to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#7c3aed]/10 blur-3xl"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#7c3aed]/20 border border-[#7c3aed]/30 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider text-[#a78bfa] font-semibold mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse"></span>
                  Upcoming · Featured Event
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-normal text-white mb-2">
                  SORMS <em className="italic text-[#a78bfa] not-italic">Lagos</em> 2026
                </h3>
                <p className="text-[#a1a1a6] mb-1">Friday 24 - Saturday 25 July, 2026</p>
                <p className="text-sm text-[#6e6e73]">Lagos, Nigeria · 2 Days · 10+ Speakers</p>
              </div>
              <div className="flex gap-4">
                <Link 
                  to="/tickets" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/tickets');
                  }}
                  className="px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
                >
                  Get Tickets
                </Link>
                <Link 
                  to="/events" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/events');
                  }}
                  className="px-8 py-3 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all"
                >
                  Event Details
                </Link>
              </div>
            </div>
          </div>

          {/* Past Events Label */}
          <div className={`text-[#6e6e73] text-xs uppercase tracking-wider mb-4 ${getAnimationClass('events', 600)}`}>
            Recent Events
          </div>

          {/* Past Events Grid - now shows three distinct most recent YouTube videos */}
          <div className="grid md:grid-cols-3 gap-6">
            {videosLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#161618] border border-white/5 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-64 bg-white/10"></div>
                  <div className="p-6">
                    <div className="h-6 bg-white/10 rounded mb-3"></div>
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-full mb-4"></div>
                    <div className="h-8 bg-white/10 rounded w-32"></div>
                  </div>
                </div>
              ))
            ) : displayCards ? (
              displayCards.map((card, index) => {
                if (card.isStatic) {
                  return (
                    <div 
                      key={`static-${card.id}`}
                      className={`group bg-[#161618] border border-white/5 rounded-xl overflow-hidden hover:border-[#7c3aed]/30 hover:-translate-y-2 transition-all duration-300 ${
                        visibleSections.events ? `animate-reveal visible animation-delay-${600 + (index + 1) * 200}` : 'animate-reveal'
                      }`}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = card.fallbackImage;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-block bg-[#7c3aed]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[0.55rem] uppercase tracking-wider font-semibold border border-white/20">
                            {card.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-serif text-lg font-normal text-white mb-2 line-clamp-2">
                          {card.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-3">
                          <span>📅 {card.date}</span>
                          <span>•</span>
                          <span>{card.time}</span>
                        </div>
                        <p className="text-xs text-[#a1a1a6] mb-4 line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <a
                      key={card.id.videoId}
                      href={`https://www.youtube.com/watch?v=${card.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group bg-[#161618] border border-white/5 rounded-xl overflow-hidden hover:border-[#7c3aed]/30 hover:-translate-y-2 transition-all duration-300 ${
                        visibleSections.events ? `animate-reveal visible animation-delay-${600 + (index + 1) * 200}` : 'animate-reveal'
                      }`}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={card.snippet.thumbnails.high?.url || card.snippet.thumbnails.medium?.url || card.snippet.thumbnails.default?.url}
                          alt={card.snippet.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://img.youtube.com/vi/${card.id.videoId}/mqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-block bg-[#7c3aed]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[0.55rem] uppercase tracking-wider font-semibold border border-white/20">
                            Watch on YouTube
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-serif text-lg font-normal text-white mb-2 line-clamp-2">
                          {card.snippet.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-3">
                          <span>📅 {formatDate(card.snippet.publishedAt)}</span>
                          <span>•</span>
                          <span>Livestreamed</span>
                        </div>
                        <p className="text-xs text-[#a1a1a6] mb-4 line-clamp-2">
                          {card.snippet.description || "Watch this powerful session from Sound of Revival."}
                        </p>
                      </div>
                    </a>
                  );
                }
              })
            ) : (
              staticEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className={`group bg-[#161618] border border-white/5 rounded-xl overflow-hidden hover:border-[#7c3aed]/30 hover:-translate-y-2 transition-all duration-300 ${
                    visibleSections.events ? `animate-reveal visible animation-delay-${600 + (index + 1) * 200}` : 'animate-reveal'
                  }`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = event.fallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="inline-block bg-[#7c3aed]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[0.55rem] uppercase tracking-wider font-semibold border border-white/20">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-serif text-lg font-normal text-white mb-2 line-clamp-2">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-3">
                      <span>📅 {event.date}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <p className="text-xs text-[#a1a1a6] mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Watch Live Button */}
          <div className="text-center mt-12">
            <Link
              to="/watchlive"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/watchlive');
              }}
              className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full text-sm font-medium transition-all group"
            >
              Watch Live
              <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section ref={sectionRefs.emailCapture} className="py-16 bg-[#0c0c0e] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className={`font-serif text-2xl font-normal text-white mb-2 ${getAnimationClass('emailCapture', 200)}`}>Stay in the loop</h3>
          <p className={`text-sm text-[#a1a1a6] mb-6 ${getAnimationClass('emailCapture', 400)}`}>
            Not ready to apply yet? Drop your email and we'll keep you updated on events, teachings, and community news.
          </p>
          <form onSubmit={handleEmailSubscribe} className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto ${getAnimationClass('emailCapture', 600)}`}>
            <input 
              type="email" 
              value={emailSubscribe}
              onChange={(e) => setEmailSubscribe(e.target.value)}
              placeholder="Enter your email" 
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white text-sm focus:outline-none focus:border-[#7c3aed] transition-all"
              disabled={isSubscribing}
              required
            />
            <button 
              type="submit"
              disabled={isSubscribing}
              className="bg-white text-[#0c0c0e] px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSubscribing ? (
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
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section ref={sectionRefs.testimonials} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('testimonials', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
           
              Voices of Impact
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              What Our <em className="italic text-[#7c3aed] not-italic">Citizens</em> Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${
                  visibleSections.testimonials ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'
                }`}
              >
                <div className="font-serif text-5xl text-[#7c3aed]/20 mb-4">"</div>
                <p className="text-sm text-[#48484a] mb-6 leading-relaxed italic">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white text-sm font-serif">
                    {testimonial.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1d1d1f]">{testimonial.author}</div>
                    <div className="text-xs text-[#86868b]">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Founder Section */}
      <section ref={sectionRefs.founder} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col md:flex-row items-center gap-12 max-w-3xl mx-auto ${getAnimationClass('founder', 200)}`}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#7c3aed]/30 flex-shrink-0">
              <img 
                src="/images/joshua.jpg" 
                alt="Joshua Nwaeze"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-3">
        
                Leadership
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#1d1d1f] mb-1">Joshua Nwaeze</h3>
              <p className="text-sm text-[#7c3aed] mb-4">Founder & Convener, SORMS</p>
              <p className="text-sm text-[#48484a] leading-relaxed font-light">
                Joshua Nwaeze is the convener of Sound of Revival Manifesting Sons and the visionary behind the SORMS movement, raising kingdom citizens who dominate in every sphere of society.
              </p>
              <Link 
                to="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about', { state: { scrollToLeadership: true } });
                  window.scrollTo(0, 0);
                }}
                className="inline-flex items-center gap-2 text-sm text-[#7c3aed] font-medium mt-4 hover:gap-3 transition-all"
              >
                Read full bio <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section ref={sectionRefs.volunteer} className="py-24 bg-gradient-to-br from-[#0c0c0e] to-[#1a1a1f] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className={getAnimationClass('volunteer', 200)}>
            <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5 justify-center">
       
              Lagos 2026
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Be a <em className="italic text-[#a78bfa] not-italic">Volunteer</em> for SORMS Lagos 2026
            </h2>
            <p className="text-[#a1a1a6] mb-8">
              We need dedicated volunteers to help make Sound of Revival Manifesting Sons Lagos 2026 a reality. Join our team and be part of something historic.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-[#a1a1a6]">Media</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-[#a1a1a6]">Logistics</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-[#a1a1a6]">Ushering</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-[#a1a1a6]">Prayer</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-[#a1a1a6]">Registration</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-[#a1a1a6]">Communications</span>
              <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-[#a1a1a6]">Hospitality</span>
            </div>
<a
  href="https://docs.google.com/forms/d/e/1FAIpQLSdOigtuFkhtkZvgxTsxcT1eQxP-s4TziZyOMEhHXRNQilaX_g/viewform"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
>
  Apply to Volunteer <span className="opacity-50">→</span>
</a>
          </div>
        </div>
      </section>

      {/* Join Form Section - Inline Multi-Step Form */}
      <section ref={sectionRefs.join} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className={getAnimationClass('join', 200)}>
              <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              
                Join the Movement
              </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4 leading-tight" 
    style={{ fontFamily: "'DM Serif Display', serif" }}>
  Begin your <em className="italic text-[#7c3aed] not-italic text-3xl md:text-4xl">SONSHIP</em> journey today.
</h2>
              <p className="text-[#48484a] mb-8 font-light">
                This is more than a sign-up. It is the first step of an intentional path from discovery to commissioning, from the crowd to the community.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-lg flex-shrink-0">✉️</div>
                  <div>
                    <span className="block text-sm font-medium text-[#1d1d1f] mb-1">Welcome Email</span>
                    <span className="text-xs text-[#86868b]">A personal welcome with your WhatsApp & Telegram community links, sent immediately after you join.</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-lg flex-shrink-0">🤝</div>
                  <div>
                    <span className="block text-sm font-medium text-[#1d1d1f] mb-1">Community Access</span>
                    <span className="text-xs text-[#86868b]">Join an active network of sons and daughters being raised for marketplace impact across Africa and beyond.</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-lg flex-shrink-0">🗺️</div>
                  <div>
                    <span className="block text-sm font-medium text-[#1d1d1f] mb-1">Your Growth Path</span>
                    <span className="text-xs text-[#86868b]">Be guided into the right track based on your calling, interests, and goals.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inline Registration Form */}
            <div className={`bg-white rounded-2xl border border-black/5 shadow-xl relative overflow-hidden ${getAnimationClass('join', 400)}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              <div className="p-8 md:p-10">
                {!isSubmitted ? (
                  <>
                    <h3 className="font-serif text-xl font-normal text-[#1d1d1f] mb-1">SORMS Community Application</h3>
                    <p className="text-xs text-[#86868b] mb-6">Complete all three steps — takes under 3 minutes.</p>

                    {/* Progress Steps */}
                    <div className="flex items-center mb-8">
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
                        <span className={`text-xs ml-2 font-medium ${formStep >= 1 ? 'text-[#7c3aed]' : 'text-[#86868b]'}`}>Personal</span>
                      </div>
                      <div className="flex-1 h-px bg-black/10 mx-4"></div>
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
                        <span className={`text-xs ml-2 font-medium ${formStep >= 2 ? 'text-[#7c3aed]' : 'text-[#86868b]'}`}>Location</span>
                      </div>
                      <div className="flex-1 h-px bg-black/10 mx-4"></div>
                      <div className="flex items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          formStep >= 3 
                            ? 'bg-[#7c3aed] text-white ring-4 ring-[#7c3aed]/20' 
                            : 'bg-[#f8f8fa] text-[#86868b] border border-black/10'
                        }`}>
                          3
                        </div>
                        <span className={`text-xs ml-2 font-medium ${formStep >= 3 ? 'text-[#7c3aed]' : 'text-[#86868b]'}`}>Interests</span>
                      </div>
                    </div>

                    {/* Step 1: Personal Information */}
                    {formStep === 1 && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                            <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                          <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                          <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                            <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                          <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                            <option value="Dominionbuilder">through a dominion Builder</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                      <div className="space-y-4">
                        <div>
                          <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                            Areas of Interest (select all that apply) <span className="text-[#7c3aed]">*</span>
                          </label>
                          <div className="grid md:grid-cols-2 gap-2">
                            {interestOptions.map((interest) => (
                              <label key={interest} className="flex items-center gap-3 p-2 bg-[#f8f8fa] rounded-lg border border-black/5 hover:border-[#7c3aed]/30 transition-all cursor-pointer">
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
                          <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-1">
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
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center">
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
                        href="https://chat.whatsapp.com/KGLRP8KmI603YwQ8LxQWb0?mode=gi_t"
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
            </div>
          </div>
        </div>
      </section>

      {/* I Am Interested Modal (unrelated, kept for other features) */}
      <IAmInterestedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
        
        .animate-fadeUp {
          animation: fadeUp 0.8s ease forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease forwards;
        }
        
        .animate-scrollPulse {
          animation: scrollPulse 2s infinite;
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
        
        .animate-pulse {
          animation: pulse 2s infinite;
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
        .animation-delay-900 { transition-delay: 0.9s; }
        .animation-delay-1000 { transition-delay: 1s; }
        .animation-delay-1200 { transition-delay: 1.2s; }
      `}</style>
    </div>
  );
};

export default HomePage;