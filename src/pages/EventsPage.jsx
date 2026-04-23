// src/pages/EventsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const scrollToSpeakers = () => {
    const element = document.getElementById('speakers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // YouTube state
  const [allVideos, setAllVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(null);

  // YouTube config
  const CHANNEL_ID = 'UCpmZmnDshp0o48IZvhB5AbQ';
  const API_KEY = 'AIzaSyBdh9IkFnoGeCb7VvzLyG2U09QzPE-EWh4';

  // Static fallback events (same as before)
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
      description: "Pst. Joshua Nwaeze ministering on accessing the supernatural realm walking in power and authority.",
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
      description: "Pst. Peter C. Emmanuel a clarion call to stand firm and contend for faith in an age of compromise.",
      category: "Ministry",
      image: "/images/flyer3.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isStatic: true
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Fetch videos (get up to 10 videos)
  const fetchVideos = async () => {
    const videosMap = new Map();

    if (API_KEY) {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.error && data.items && data.items.length > 0) {
          data.items.forEach(item => {
            const videoId = item.id.videoId;
            if (!videosMap.has(videoId)) {
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
        }
      } catch (err) {
        console.error('API fetch error:', err);
      }
    }

    // Fallback: RSS feed if API fails or gives too few results
    if (videosMap.size < 6) {
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          data.items.slice(0, 10).forEach(item => {
            const videoId = item.link.split('v=')[1]?.split('&')[0] || '';
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

    const videos = Array.from(videosMap.values()).slice(0, 6); // get up to 6 videos
    if (videos.length > 0) {
      setAllVideos(videos);
      setVideosError(null);
    } else {
      setAllVideos([]);
      setVideosError('No videos found');
    }
    setVideosLoading(false);
  };

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    featured: useRef(null),
    tickets: useRef(null),
    speakers: useRef(null),
    pastEvents: useRef(null),
    partners: useRef(null),
    cta: useRef(null)
  };

  const [visibleSections, setVisibleSections] = useState({});
  const [expandedFeatures, setExpandedFeatures] = useState({});

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

      if (videoRef.current) {
        const scrolled = window.scrollY;
        const scale = 1 + scrolled * 0.0005;
        videoRef.current.style.transform = `scale(${Math.min(scale, 1.2)})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);

  const getAnimationClass = (section, delay = 0) => {
    return visibleSections[section] 
      ? `animate-reveal visible animation-delay-${delay}` 
      : 'animate-reveal';
  };

  const toggleExpandedFeatures = (ticketId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  // Featured event data
  const featuredEvent = {
    id: 'sorms-lagos-2026',
    name: 'SORMS Lagos 2026',
    fullTitle: 'Sound of Revival – Manifesting Sons',
    date: 'July 24–25, 2026',
    location: 'Madinat · Lagos, Nigeria',
    description: 'The premier gathering of kingdom citizens two days of worship, formation, leadership training, and commissioning. Join sons and daughters from across the continent for the event of the year.',
    speakers: 20,
    tracks: 5,
    expected: '1000+',
    image: '/images/events/lagos-2026.jpg'
  };

  // Ticket tiers data (unchanged)
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
        'Exhibitor hall access',
        'Conference materials',
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
        'Private dinner with speakers',
        'Leadership roundtable',
        'Exclusive gift bag',
        'One-on-one mentorship session',
        'VIP lounge access',
        'Priority check-in',
        'Event merchandise package'
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
      name: 'Dominion Builders',
      price: '50000',
      formattedPrice: '₦50,000',
      note: 'Exclusive · Limited',
      fullFeatures: [
        'Everything in Premium Package',
        'Private reception with hosts',
        'Strategic planning session',
        'Personalized ministry time',
        'VIP parking & concierge',
        'Accommodation assistance',
        'Private transportation',
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

  // Speakers data (unchanged)
  const speakers = [
    {
      id: 1,
      name: 'Joshua Nwaeze',
      role: 'Founder & Convener',
      organization: 'SORMS',
      initials: 'JN',
      confirmed: true,
      image: '/images/joshua.jpg'
    }
  ];

  // Partners data (unchanged)
  const partners = {
    title: ['GKCGA', 'Partner TBA', 'Partner TBA'],
    community: ['Partner TBA', 'Partner TBA', 'Partner TBA', 'Partner TBA', 'Partner TBA'],
    media: ['Partner TBA', 'Partner TBA', 'Partner TBA', 'Partner TBA']
  };

  const stats = [
    { value: '2', label: 'Days' },
    { value: '10+', label: 'Speakers' },
    { value: '1000+', label: 'Expected' }
  ];

  // Compute past videos (skip the first 3 most recent)
  const getPastVideos = () => {
    if (videosLoading) return null;
    if (videosError || allVideos.length === 0) {
      return staticEvents;
    }
    // Take videos from index 3 to 6 (the 4th, 5th, and 6th most recent)
    const past = allVideos.slice(3, 6);
    const result = [...past];
    // Fill with static events if needed
    while (result.length < 3) {
      const staticIndex = result.length % staticEvents.length;
      result.push({ isStatic: true, ...staticEvents[staticIndex] });
    }
    return result;
  };

  const pastDisplayCards = getPastVideos();

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Hero Section with Video Background */}
      <section ref={sectionRefs.hero} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0c0c0e]">
        <div className="absolute inset-0">
          {/* <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
          >
            <source src="/videos/events-bg.mp4" type="video/mp4" />
            <source src="/videos/hero-background.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video> */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-8 ${
              visibleSections.hero ? 'animate-reveal visible' : 'animate-reveal'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              🔥 Featured Event
            </div>

            <h1 className={`font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-4 leading-tight ${
              visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'
            }`} style={{ fontFamily: "'DM Serif Display', serif" }}>
              SORMS <em className="italic text-[#a78bfa] not-italic">Lagos</em> 2026
            </h1>

            <p className={`text-sm uppercase tracking-widest text-white/50 mb-4 ${
              visibleSections.hero ? 'animate-reveal visible animation-delay-300' : 'animate-reveal'
            }`}>
              Lagos, Nigeria
            </p>

            <p className={`font-serif text-lg md:text-xl text-white mb-6 ${
              visibleSections.hero ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'
            }`} style={{ fontFamily: "'DM Serif Display', serif" }}>
              Friday 24 - Saturday 25 July, 2026
            </p>

            <p className={`text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8 font-light ${
              visibleSections.hero ? 'animate-reveal visible animation-delay-500' : 'animate-reveal'
            }`}>
              {featuredEvent.description}
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 ${
              visibleSections.hero ? 'animate-reveal visible animation-delay-600' : 'animate-reveal'
            }`}>
              <Link 
                to="/tickets"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/tickets');
                }}
                className="group relative px-8 py-3 bg-white text-[#0c0c0e] hover:bg-white/90 rounded-full font-semibold text-sm transition-all duration-300 min-w-[200px] text-center inline-flex items-center justify-center gap-2"
              >
                Get Tickets
                <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <button
                onClick={scrollToSpeakers}
                className="px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded-full font-medium text-sm transition-all duration-300 min-w-[200px] text-center"
              >
                View Speakers
              </button>
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto pt-8 border-t border-white/10 ${
              visibleSections.hero ? 'animate-reveal visible animation-delay-700' : 'animate-reveal'
            }`}>
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  <div className="text-center">
                    <div className="font-serif text-2xl text-white">{stat.value}</div>
                    <div className="text-xs uppercase tracking-wider text-white/40 mt-1">{stat.label}</div>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="hidden md:block w-px h-8 bg-white/10 self-center"></div>
                  )}
                </React.Fragment>
              ))}
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



      {/* Speakers Section (unchanged) */}
      <section id="speakers" ref={sectionRefs.speakers} className="py-24 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('speakers', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
              Speakers
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Kingdom Voices on the <em className="italic text-[#a78bfa] not-italic">Biggest Stage</em>
            </h2>
            <p className="text-[#a1a1a6] text-base font-light">
              Leaders, ministers, entrepreneurs, and change-makers who are shaping the future across every sphere.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {speakers.map((speaker, index) => (
              <div 
                key={speaker.id}
                className={`group bg-[#161618] border border-white/5 rounded-xl overflow-hidden hover:border-[#7c3aed]/30 hover:-translate-y-1 transition-all duration-300 ${
                  visibleSections.speakers ? `animate-reveal visible animation-delay-${(index + 1) * 100}` : 'animate-reveal'
                }`}
              >
                <div className="relative h-48 bg-gradient-to-br from-[#1a0a3d] to-[#2d1065] flex items-center justify-center overflow-hidden">
                  {speaker.image ? (
                    <>
                      <img 
                        src={speaker.image} 
                        alt={speaker.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(124,58,237,0.2),transparent_70%)]"></div>
                      <span className="font-serif text-5xl text-white/20 z-10">{speaker.initials}</span>
                    </>
                  )}
                  
                  {!speaker.confirmed ? (
                    <span className="absolute bottom-2 right-2 bg-[#7c3aed]/70 backdrop-blur-sm px-2 py-1 rounded-full text-[0.5rem] uppercase tracking-wider text-white font-medium z-20">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="absolute bottom-2 right-2 bg-emerald-500/70 backdrop-blur-sm px-2 py-1 rounded-full text-[0.5rem] uppercase tracking-wider text-white font-medium z-20">
                      Confirmed
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-serif text-base font-normal text-white mb-0.5">{speaker.name}</h3>
                  <p className="text-xs text-[#a78bfa] font-medium mb-1">{speaker.role}</p>
                  <p className="text-[0.65rem] text-[#6e6e73]">{speaker.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Past Events Section with PAST VIDEOS ========== */}
      <section ref={sectionRefs.pastEvents} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('pastEvents', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Past Events
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Recent <em className="italic text-[#7c3aed] not-italic">Gatherings</em>
            </h2>
            <p className="text-[#48484a] text-base font-light">
              Highlights from our recent events and conferences.
            </p>
          </div>

          <div className={`text-[#6e6e73] text-xs uppercase tracking-wider mb-4 ${getAnimationClass('pastEvents', 600)}`}>
            Past Livestreams & Events
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {videosLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#f8f8fa] border border-black/5 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-64 bg-black/10"></div>
                  <div className="p-6">
                    <div className="h-6 bg-black/10 rounded mb-3"></div>
                    <div className="h-4 bg-black/10 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-black/10 rounded w-full mb-4"></div>
                    <div className="h-8 bg-black/10 rounded w-32"></div>
                  </div>
                </div>
              ))
            ) : pastDisplayCards ? (
              pastDisplayCards.map((card, index) => {
                if (card.isStatic) {
                  return (
                    <div
                      key={`static-${card.id}`}
                      className={`group bg-white rounded-xl border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden ${
                        visibleSections.pastEvents ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'
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
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-block bg-[#7c3aed]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[0.55rem] uppercase tracking-wider font-semibold border border-white/20">
                            {card.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-serif text-lg font-normal text-[#1d1d1f] mb-2 line-clamp-2">
                          {card.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#86868b] mb-3">
                          <span>📅 {card.date}</span>
                          <span>•</span>
                          <span>{card.time}</span>
                        </div>
                        <p className="text-xs text-[#86868b] mb-4 line-clamp-2">
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
                      className={`group bg-white rounded-xl border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden ${
                        visibleSections.pastEvents ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'
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
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-block bg-[#7c3aed]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[0.55rem] uppercase tracking-wider font-semibold border border-white/20">
                            Watch on YouTube
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-serif text-lg font-normal text-[#1d1d1f] mb-2 line-clamp-2">
                          {card.snippet.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#86868b] mb-3">
                          <span>📅 {formatDate(card.snippet.publishedAt)}</span>
                          <span>•</span>
                          <span>Past Livestream</span>
                        </div>
                        <p className="text-xs text-[#86868b] mb-4 line-clamp-2">
                          {card.snippet.description || "Watch this past session from Sound of Revival."}
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
                  className={`group bg-white rounded-xl border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden ${
                    visibleSections.pastEvents ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'
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
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="inline-block bg-[#7c3aed]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[0.55rem] uppercase tracking-wider font-semibold border border-white/20">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-serif text-lg font-normal text-[#1d1d1f] mb-2 line-clamp-2">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#86868b] mb-3">
                      <span>📅 {event.date}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <p className="text-xs text-[#86868b] mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/watchlive"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/watchlive');
              }}
              className="inline-flex items-center gap-2 text-[#1d1d1f] bg-black/5 hover:bg-black/10 px-8 py-3 rounded-full text-sm font-medium transition-all group"
            >
              Watch Live
              <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>
      {/* ========== END Past Events Section ========== */}

      {/* Partners Section (unchanged) */}
      <section ref={sectionRefs.partners} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('partners', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Partners & Sponsors
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Backed by <em className="italic text-[#7c3aed] not-italic">Kingdom</em> Builders
            </h2>
            <p className="text-[#48484a] text-base font-light">
              Organizations and individuals who believe in raising the next generation of marketplace apostles.
            </p>
          </div>

          <div className={`mb-12 ${getAnimationClass('partners', 400)}`}>
            <p className="text-center text-xs uppercase tracking-wider text-[#86868b] mb-6">Title Sponsors</p>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.title.map((partner, index) => (
                <div key={index} className="bg-white px-6 py-3 rounded-lg border border-black/5 shadow-sm hover:shadow-md transition-all">
                  <span className="font-serif text-sm text-[#48484a]">{partner}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`mb-12 ${getAnimationClass('partners', 600)}`}>
            <p className="text-center text-xs uppercase tracking-wider text-[#86868b] mb-6">Community Partners</p>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.community.map((partner, index) => (
                <div key={index} className="bg-white px-5 py-2 rounded-lg border border-black/5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-[#48484a]">{partner}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${getAnimationClass('partners', 800)}`}>
            <p className="text-center text-xs uppercase tracking-wider text-[#86868b] mb-6">Media Partners</p>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.media.map((partner, index) => (
                <div key={index} className="bg-white px-5 py-2 rounded-lg border border-black/5 shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs text-[#48484a]">{partner}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`text-center mt-12 ${getAnimationClass('partners', 1000)}`}>
            <p className="text-sm text-[#86868b] mb-4">Interested in partnering with SORMS Lagos 2026?</p>

      <a
  href="https://docs.google.com/forms/d/e/1FAIpQLSeniJw28IL7YaTgy3UjX5GM48lATy2ykH-TkqxXqiB8cvOVMA/viewform?usp=send_form"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
>
  Become a Partner <span className="opacity-50">→  </span>
</a>

      
          </div>
        </div>
      </section>

      {/* Volunteer CTA Section */}
      <section ref={sectionRefs.cta} className="py-24 bg-gradient-to-br from-[#0c0c0e] to-[#1a1a1f] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #7c3aed 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative max-w-3xl mx-auto px-4">
          <span className={`inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5 ${getAnimationClass('cta', 200)}`}>
            Lagos 2026
          </span>
          
          <h2 className={`font-serif text-4xl md:text-5xl font-normal text-white mb-4 ${getAnimationClass('cta', 400)}`}
              style={{ fontFamily: "'DM Serif Display', serif" }}>
            Be a <em className="italic text-[#a78bfa] not-italic">Volunteer</em>
          </h2>
          
          <p className={`text-lg text-[#a1a1a6] mb-8 max-w-2xl mx-auto leading-relaxed ${getAnimationClass('cta', 600)}`}>
            We need dedicated volunteers across every department to make SORMS Lagos 2026 a reality. Join our team and be part of something historic.
          </p>

          <div className={`flex flex-wrap gap-2 justify-center mb-8 ${getAnimationClass('cta', 800)}`}>
            {['Media', 'Logistics', 'Ushering', 'Prayer', 'Registration', 'Communications', 'Hospitality'].map((tag, index) => (
              <span key={index} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-[#a1a1a6]">
                {tag}
              </span>
            ))}
          </div>

          <div className={`${getAnimationClass('cta', 1000)}`}>
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

      {/* Final CTA */}
      <section className="py-16 bg-[#7c3aed] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-xs uppercase tracking-wider text-white/70 mb-2 block">July 24–25, 2026</span>
          <h3 className="font-serif text-2xl font-normal text-white mb-4">Don't miss Lagos 2026</h3>
          <p className="text-white/80 text-sm mb-6">Two days that could redefine your calling, your community, and your impact.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/tickets"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/tickets');
              }}
              className="group relative px-8 py-3 bg-white text-[#0c0c0e] hover:bg-white/90 rounded-full font-semibold text-sm transition-all duration-300 min-w-[200px] text-center inline-flex items-center justify-center gap-2"
            >
              Get Tickets
              <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/community"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/community');
              }}
              className="px-6 py-2 border border-white text-white rounded-full text-sm font-medium hover:bg-white/10 transition-all"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ... (all existing styles) ... */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
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
        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
        .animate-fadeUp { animation: fadeUp 0.8s ease forwards; }
        .animate-scrollPulse { animation: scrollPulse 2s infinite; }
        .animate-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .animate-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .event-ticket-card {
          position: relative;
          overflow: hidden;
        }
        .event-gradient-curve {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 16px 16px 0 0;
          transition: all 0.3s ease;
        }
        .event-ticket-card:nth-child(1) .event-gradient-curve {
          background: linear-gradient(90deg, rgba(34,197,94,0) 0%, #22c55e 15%, #16a34a 50%, #22c55e 85%, rgba(34,197,94,0) 100%);
        }
        .event-ticket-card:nth-child(2) .event-gradient-curve {
          background: linear-gradient(90deg, rgba(59,130,246,0) 0%, #3b82f6 15%, #2563eb 50%, #3b82f6 85%, rgba(59,130,246,0) 100%);
        }
        .event-ticket-card:nth-child(3) .event-gradient-curve {
          background: linear-gradient(90deg, rgba(124,58,237,0) 0%, #7c3aed 15%, #6d28d9 50%, #7c3aed 85%, rgba(124,58,237,0) 100%);
        }
        .event-ticket-card:nth-child(4) .event-gradient-curve {
          background: linear-gradient(90deg, rgba(212,160,23,0) 0%, #d4a017 15%, #b8860b 50%, #d4a017 85%, rgba(212,160,23,0) 100%);
        }
        .event-ticket-card:hover .event-gradient-curve {
          filter: brightness(1.1);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
        @media (max-width: 1024px) {
          .grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .grid { grid-template-columns: 1fr; }
          .event-ticket-card { padding: 28px 20px; }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;