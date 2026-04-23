// src/pages/AboutPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for image modal (click)
  const [modalImage, setModalImage] = useState(null);
  // State for hover popup (works on all devices)
  const [hoveredLeader, setHoveredLeader] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const isTouchDeviceRef = useRef(false);
  const popupRef = useRef(null);

  // Detect touch device for better hover simulation
  useEffect(() => {
    const checkTouchDevice = () => {
      isTouchDeviceRef.current = ('ontouchstart' in window) || 
                                 (navigator.maxTouchPoints > 0) ||
                                 (window.matchMedia && window.matchMedia('(hover: none)').matches);
    };
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setModalImage(null);
        setHoveredLeader(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // Scroll to leadership section
  const scrollToLeadership = () => {
    const element = document.getElementById('ab-leadership');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle hover for desktop devices
  const handleMouseEnter = (leader) => {
    if (isTouchDeviceRef.current) return;
    
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredLeader(leader);
  };

  const handleMouseLeave = () => {
    if (isTouchDeviceRef.current) return;
    
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredLeader(null);
    }, 100);
  };

  // Handle popup mouse events to keep it open
  const handlePopupMouseEnter = () => {
    if (isTouchDeviceRef.current) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handlePopupMouseLeave = () => {
    if (isTouchDeviceRef.current) return;
    setHoveredLeader(null);
  };

  // For touch devices: handle touch start to toggle popup
  const handleTouchStart = (leader, e) => {
    if (!isTouchDeviceRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (hoveredLeader?.id === leader.id) {
      setHoveredLeader(null);
    } else {
      setHoveredLeader(leader);
    }
  };

  // Close popup when tapping outside
  useEffect(() => {
    const handleDocumentTouch = (e) => {
      if (isTouchDeviceRef.current && hoveredLeader) {
        const isClickInsideCard = e.target.closest('.leader-card-wrapper');
        const isClickInsidePopup = e.target.closest('.leader-popup-container');
        
        if (!isClickInsideCard && !isClickInsidePopup) {
          setHoveredLeader(null);
        }
      }
    };
    
    const handleDocumentClick = (e) => {
      if (!isTouchDeviceRef.current && hoveredLeader) {
        const isClickInsideCard = e.target.closest('.leader-card-wrapper');
        const isClickInsidePopup = e.target.closest('.leader-popup-container');
        
        if (!isClickInsideCard && !isClickInsidePopup) {
          setHoveredLeader(null);
        }
      }
    };
    
    document.addEventListener('touchstart', handleDocumentTouch, { passive: false });
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('touchstart', handleDocumentTouch);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [hoveredLeader]);

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    mandate: useRef(null),
    background: useRef(null),
    visionMission: useRef(null),
    pillars: useRef(null),
    philosophy: useRef(null),
    objectives: useRef(null),
    leadership: useRef(null),
    cta: useRef(null)
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
  }, []);

  // Handle scroll to leadership section when coming from HomePage
  useEffect(() => {
    if (location.state?.scrollToLeadership) {
      setTimeout(() => {
        const leadershipSection = document.getElementById('ab-leadership');
        if (leadershipSection) {
          leadershipSection.scrollIntoView({ behavior: 'smooth' });
          navigate(location.pathname, { replace: true, state: {} });
        }
      }, 800);
    }
    
    if (window.location.hash === '#leadership') {
      setTimeout(() => {
        const leadershipSection = document.getElementById('ab-leadership');
        if (leadershipSection) {
          leadershipSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname);
          }, 1000);
        }
      }, 500);
    }
  }, [location, navigate]);

  const getAnimationClass = (section, delay = 0) => {
    return visibleSections[section] 
      ? `animate-reveal visible animation-delay-${delay}` 
      : 'animate-reveal';
  };

  const pillars = [
    {
      id: 1,
      number: "01",
      title: "Spiritual Formation",
      icon: "🙏",
      description: "Deepening intimacy with God and understanding our identity as sons. This pillar covers prayer life, study of the Word, spiritual disciplines, fasting, worship, and building a personal walk with God that sustains public impact.",
      gradient: "from-purple-600 to-indigo-600"
    },
    {
      id: 2,
      number: "02",
      title: "Leadership & Excellence",
      icon: "📊",
      description: "Developing the capacity to lead with integrity and represent God with excellence. Covers communication, emotional intelligence, strategic thinking, team building, and the ethics of kingdom leadership in secular spaces.",
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      id: 3,
      number: "03",
      title: "Innovation & Enterprise",
      icon: "💡",
      description: "Cultivating the mind of Christ in business, technology, and creativity. Enterprise development, startup incubation, financial literacy, and building businesses that operate on kingdom values.",
      gradient: "from-amber-600 to-orange-600"
    },
    {
      id: 4,
      number: "04",
      title: "Governance & Culture",
      icon: "⚖️",
      description: "Engaging policy, law, and culture with kingdom principles. Understanding governance structures, civic engagement, cultural production, and occupying seats of authority to shape systems from the inside.",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      id: 5,
      number: "05",
      title: "Community & Impact",
      icon: "🌍",
      description: "Building relationships, transforming communities, and extending the kingdom through tangible acts of love. Outreach programmes, social enterprises, mentorship networks, and creating lasting change.",
      gradient: "from-pink-600 to-purple-600"
    }
  ];

  const beliefs = [
    {
      id: 1,
      icon: "👑",
      title: "Kingdom Representatives",
      description: "SORMS are not just church attendees — they are kingdom representatives, called to carry God's values and authority into every sphere they inhabit."
    },
    {
      id: 2,
      icon: "🛠️",
      title: "Skillfully Equipped",
      description: "Sons are not only spiritually gifted, but skillfully equipped. Gift without discipline is potential without impact — we develop both."
    },
    {
      id: 3,
      icon: "🌐",
      title: "Beyond the Pulpit",
      description: "Sons are not raised only for the pulpit, but also for the marketplace, the systems, and the structures of society where real transformation happens."
    },
    {
      id: 4,
      icon: "🔥",
      title: "Visible Transformation",
      description: "True revival produces visible transformation in families, institutions, industries, and nations — not just personal spiritual experiences."
    }
  ];

  const objectives = [
    {
      id: 1,
      number: "01",
      title: "Raise spiritually mature and purpose-driven individuals.",
      description: "Formation that goes beyond surface-level faith to deep character, calling clarity, and kingdom consciousness."
    },
    {
      id: 2,
      number: "02",
      title: "Equip young people and professionals with leadership and life skills.",
      description: "Practical tools for the real world — communication, governance, emotional intelligence, and influence."
    },
    {
      id: 3,
      number: "03",
      title: "Develop ethical, innovative, and impact-driven entrepreneurs.",
      description: "Faith-based enterprise development that produces businesses built on integrity and kingdom values."
    },
    {
      id: 4,
      number: "04",
      title: "Provide scholarship access and educational support.",
      description: "Removing financial barriers so that promising individuals can access quality education and global opportunities."
    },
    {
      id: 5,
      number: "05",
      title: "Build a pipeline of transformational leaders across key sectors.",
      description: "Identifying, developing, and deploying leaders into governance, business, education, media, and beyond."
    },
    {
      id: 6,
      number: "06",
      title: "Bridge the gap between faith, competence, and societal relevance.",
      description: "Making the connection between spiritual identity and professional excellence — so sons show up fully in every room."
    }
  ];

  // Council Members Data
  const councilMembers = [
    {
      id: 1,
      name: "Newman Okoye",
      role: "Data Analytics Expert",
      description: "Founder, DNDigitals Academy LTD. Leading the charge in establishing kingdom authority through data and technology.",
      image: "/images/newman-okoye.jpg",
      fullDescription: "Newman Okoye is a Data Analytics Expert and the Founder of DNDigitals Academy LTD. He is passionate about establishing kingdom authority through data and technology, helping organizations make informed decisions based on accurate insights. With years of experience in the tech industry, Newman is committed to raising a generation of data-driven leaders who will transform the marketplace with integrity and excellence."
    }
  ];

  // Pillar Leaders Data
  const pillarLeaders = [
    {
      id: 2,
      name: "Chukwuebuka",
      role: "Media Team Lead",
      image: "/images/chukwuebuka.png",
      description: "Media Team Lead at SORMS, committed to using media and music as powerful tools for influence.",
      fullDescription: "Chukwuebuka, the Media Team lead at SORMS is committed to the will of God, a purpose-driven leader, student and tech enthusiast driven by impact, creativity, and transformation. With a disciplined and analytical approach to problem-solving, he is developing the capacity to build systems and solutions that are both practical and scalable.\n\nHe is versatile across social media management, media production, and digital systems, combining technical skill with creative expression. Through his work, he is committed to using media and music as powerful tools for influence, with a deep desire to see the message of the Kingdom of God effectively communicated and propagated to a generation.\n\nChukwuebuka is focused on building with intention, leveraging technology, creativity, and leadership to create lasting value and drive meaningful change."
    },
    {
      id: 3,
      name: "Margherita Bray",
      role: "Admin Lead",
      image: "/images/magherita.png",
      description: "Admin Lead at SORMS, bringing structure, creativity, and coordination to every assignment.",
      fullDescription: "Margherita Bray, Admin. Lead at Sound of Revival Manifesting Sons (SORMS), a Chef, Event Planner, and Creative Professional driven by a deep passion for God, people, and excellence.\n\nWith a background in Event and Entertainment Management, she brings structure, creativity, and coordination into every assignment, with a strong focus on delivering impactful and well-organised outcomes.\n\nShe is passionate about serving others, solving problems, and creating meaningful experiences that uplift and add value. Alongside her professional work, she expresses her love for God through music and worship, using her voice and piano as instruments of praise.\n\nMargherita is committed to building with intention, contributing to the vision of SORMS through leadership, service, and dedication to raising a generation aligned with purpose and excellence."
    }
  ];

  // Combine all leaders for hover functionality
  const allLeaders = [...pillarLeaders, ...councilMembers];

  // Special Chukwuebuka card component with guaranteed hover
  const ChukwuebukaCard = ({ leader, index }) => {
    const cardRef = useRef(null);
    
    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;
      
      const handleMouseEnter = () => {
        if (!isTouchDeviceRef.current) {
          setHoveredLeader(leader);
        }
      };
      
      const handleMouseLeave = () => {
        if (!isTouchDeviceRef.current) {
          hoverTimeoutRef.current = setTimeout(() => {
            setHoveredLeader(null);
          }, 100);
        }
      };
      
      const handleTouch = (e) => {
        if (isTouchDeviceRef.current) {
          e.preventDefault();
          e.stopPropagation();
          if (hoveredLeader?.id === leader.id) {
            setHoveredLeader(null);
          } else {
            setHoveredLeader(leader);
          }
        }
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('touchstart', handleTouch, { passive: false });
      
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('touchstart', handleTouch);
      };
    }, [leader]);
    
    return (
      <div 
        ref={cardRef}
        className="leader-card-wrapper"
        style={{ 
          cursor: 'pointer',
          position: 'relative',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto'
        }}
      >
        <div className={`bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${visibleSections.leadership ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'}`}>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] aspect-square">
            <img 
              src={leader.image} 
              alt={leader.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'top',
                pointerEvents: 'none'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent && !parent.querySelector('.fallback-initials')) {
                  const fallback = document.createElement('div');
                  fallback.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(to bottom right,#7c3aed,#a78bfa);pointer-events:none;';
                  fallback.innerHTML = `<span style="font-family:serif;font-size:4rem;color:rgba(255,255,255,0.3);">${leader.name.charAt(0)}</span>`;
                  parent.appendChild(fallback);
                }
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', zIndex: 10, pointerEvents: 'none' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: 'white', fontSize: '0.55rem', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)' }}>
                {leader.name}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-serif text-base font-normal text-[#1d1d1f] mb-1 line-clamp-1">{leader.name}</h4>
            <p className="text-xs text-[#7c3aed] font-medium line-clamp-1">{leader.role}</p>
            <p className="text-xs text-[#86868b] mt-2 line-clamp-2">
              {(leader.fullDescription || leader.description || "").substring(0, 80)}...
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Regular card component for other leaders
  const RegularCard = ({ leader, index }) => (
    <div 
      className="leader-card-wrapper"
      style={{ 
        cursor: 'pointer',
        position: 'relative',
        width: '100%',
        height: '100%',
        pointerEvents: 'auto'
      }}
      onMouseEnter={() => handleMouseEnter(leader)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => handleTouchStart(leader, e)}
    >
      <div className="leader-card-overlay"></div>
      <div className={`bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${visibleSections.leadership ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'}`}>
        <div className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] aspect-square">
          <img 
            src={leader.image} 
            alt={leader.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent && !parent.querySelector('.fallback-initials')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-initials absolute inset-0 flex items-center justify-center pointer-events-none';
                fallback.innerHTML = `<span class="font-serif text-4xl text-white/30">${leader.name.charAt(0)}</span>`;
                parent.appendChild(fallback);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="bg-black/70 backdrop-blur-sm text-white text-[0.55rem] font-semibold px-2 py-1 rounded-full border border-white/20">
              {leader.name}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
            <span className="bg-black/50 backdrop-blur-sm text-white text-[0.5rem] px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">Hover</span>
              <span className="sm:hidden">Tap</span>
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="font-serif text-base font-normal text-[#1d1d1f] mb-1 line-clamp-1">{leader.name}</h4>
          <p className="text-xs text-[#7c3aed] font-medium line-clamp-1">{leader.role}</p>
          <p className="text-xs text-[#86868b] mt-2 line-clamp-2">
            {(leader.fullDescription || leader.description || "").substring(0, 80)}...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes popup {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .animate-popup {
          animation: popup 0.2s ease-out forwards;
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
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
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

        @media (max-width: 640px) {
          .leader-popup-container {
            max-width: 95%;
            max-height: 85vh;
          }
        }

        .leader-card-wrapper {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .leader-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 20;
          cursor: pointer;
          background-color: transparent;
          border-radius: 0.75rem;
        }
        
        .leader-popup-container,
        .leader-popup-container * {
          pointer-events: auto !important;
        }
      `}</style>

      {/* ABOUT HERO SECTION */}
      <section ref={sectionRefs.hero} className="relative py-32 md:py-40 bg-[#0c0c0e] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,58,237,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(124,58,237,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'}>
              <div className="inline-flex items-center gap-2 bg-[#7c3aed]/20 border border-[#7c3aed]/30 px-4 py-2 rounded-full text-xs uppercase tracking-wider text-[#a78bfa] font-semibold mb-6">
                Our Story & Mission
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight" 
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                We are raising <em className="italic text-[#a78bfa] not-italic">apostles</em> for every sphere.
              </h1>
              <p className="text-[#a1a1a6] text-lg mb-8 leading-relaxed max-w-lg">
                Sound of Revival Manifesting Sons exists to bridge the gap between spiritual vitality and societal impact, equipping sons and daughters to represent God's values across every sector of society.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link 
                  to="/joinsorms" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/joinsorms');
                  }}
                  className="px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
                >
                  Join the Movement
                </Link>
                <button
                  onClick={scrollToLeadership}
                  className="px-8 py-3 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all"
                >
                  Meet Our Leadership
                </button>
              </div>
            </div>

            <div className={`bg-[#161618] border border-white/5 rounded-2xl p-8 shadow-xl relative overflow-hidden ${visibleSections.hero ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#a78bfa] font-semibold mb-4 block">Core Mandate</span>
              <h3 className="font-serif text-xl font-normal text-white mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Sound of Revival Manifesting Sons
              </h3>
              <p className="text-sm text-[#a1a1a6] mb-6">
                Raising apostles in the marketplace through spiritual formation, leadership development, and human capacity building.
              </p>
              <div className="w-8 h-px bg-white/10 my-4"></div>
              <ul className="space-y-3">
                <li className="text-xs text-[#a1a1a6] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7c3aed]"></span>
                  Discipleship & Spiritual Formation
                </li>
                <li className="text-xs text-[#a1a1a6] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7c3aed]"></span>
                  Leadership Development
                </li>
                <li className="text-xs text-[#a1a1a6] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7c3aed]"></span>
                  Purpose Discovery
                </li>
                <li className="text-xs text-[#a1a1a6] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7c3aed]"></span>
                  Enterprise Development
                </li>
                <li className="text-xs text-[#a1a1a6] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7c3aed]"></span>
                  Societal Transformation
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6e6e73] mt-16 border-t border-white/5 pt-6">
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
            <span className="text-white/20">/</span>
            <span className="text-[#a78bfa]">About</span>
          </div>
        </div>
      </section>

      {/* BACKGROUND & RATIONALE SECTION */}
      <section ref={sectionRefs.background} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className={getAnimationClass('background', 200)}>
              <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
                Background & Rationale
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-6 leading-tight" 
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                The <em className="italic text-[#7c3aed] not-italic">gap</em> we exist to close.
              </h2>
              <p className="text-[#48484a] text-base leading-relaxed font-light mb-4">
                Across Africa and the world today, there is a growing gap between spiritual vitality and societal impact. Many believers are spiritually active but economically powerless, morally passionate but professionally unprepared, gifted but undisciplined, called but not strategically positioned.
              </p>
              <p className="text-[#48484a] text-base leading-relaxed font-light mb-4">
                Sound of Revival Manifesting Sons is established as a faith-based human capacity and spiritual formation movement committed to raising a generation of spiritually grounded, intellectually sound, and economically productive sons and daughters who will represent God's values across every sector of society.
              </p>
              <p className="text-[#48484a] text-base leading-relaxed font-light">
                We exist to equip believers to live out their faith with competence, character, and influence in the real world.
              </p>
            </div>

            <div className="space-y-4">
              <div className={`bg-white rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all ${getAnimationClass('background', 400)}`}>
                <span className="text-2xl mb-3 block">🏛️</span>
                <h4 className="font-serif text-base font-normal text-[#1d1d1f] mb-2">Marketplace Apostles</h4>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  God is not only raising pastors, but apostles in business, governance, media, technology, education, arts, and social transformation.
                </p>
              </div>
              
              <div className={`bg-white rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all ${getAnimationClass('background', 500)}`}>
                <span className="text-2xl mb-3 block">🌍</span>
                <h4 className="font-serif text-base font-normal text-[#1d1d1f] mb-2">Societal Revival</h4>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  Revival is not complete until it is seen in the marketplace, in governance, in innovation, in education, and in culture.
                </p>
              </div>
              
              <div className={`bg-white rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all ${getAnimationClass('background', 600)}`}>
                <span className="text-2xl mb-3 block">⚡</span>
                <h4 className="font-serif text-base font-normal text-[#1d1d1f] mb-2">Complete Formation</h4>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  Spiritually grounded, intellectually sound, and economically productive, this is the standard we build every son toward.
                </p>
              </div>
              
              <div className={`bg-gradient-to-r from-[#f3f0ff] to-[#faf8ff] rounded-xl p-6 border border-[#7c3aed]/20 shadow-sm ${getAnimationClass('background', 700)}`}>
                <p className="font-serif text-sm italic text-[#1d1d1f] leading-relaxed">
                  "Revival is not complete until it is seen in the marketplace, in governance, in innovation, in education, and in culture."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section ref={sectionRefs.visionMission} className="py-24 bg-[#0c0c0e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('visionMission', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
              Vision & Mission
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Where we are <em className="italic text-[#a78bfa] not-italic">going</em> and how we get there.
            </h2>
            <p className="text-[#a1a1a6] text-base font-light">
              Two anchors that define everything SORMS does from every programme to every son we raise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={`bg-[#161618] border border-white/5 rounded-2xl p-8 relative overflow-hidden ${getAnimationClass('visionMission', 400)}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#a78bfa] to-transparent"></div>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#a78bfa] font-semibold mb-4 block">Vision Statement</span>
              <h3 className="font-serif text-xl font-normal text-white mb-4">Our Vision</h3>
              <p className="text-sm text-[#a1a1a6] mb-6 leading-relaxed">
                We envision a generation of mature sons and daughters who manifest Christ in character, competence, leadership, and impact across every sphere of society.
              </p>
              <div className="border-l-2 border-[#7c3aed] pl-4 py-1">
                <p className="text-xs text-[#a78bfa] italic">
                  A generation that is visible not just in the pew, but in the boardroom, the courtroom, the classroom, and the marketplace.
                </p>
              </div>
            </div>

            <div className={`bg-[#161618] border border-white/5 rounded-2xl p-8 relative overflow-hidden ${getAnimationClass('visionMission', 500)}`}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#a78bfa] to-transparent"></div>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#a78bfa] font-semibold mb-4 block">Mission Statement</span>
              <h3 className="font-serif text-xl font-normal text-white mb-4">Our Mission</h3>
              <p className="text-sm text-[#a1a1a6] mb-6 leading-relaxed">
                To build spiritually rooted and professionally equipped leaders through discipleship, leadership development, entrepreneurship, scholarship support, and strategic capacity-building initiatives.
              </p>
              <div className="border-l-2 border-[#7c3aed] pl-4 py-1">
                <p className="text-xs text-[#a78bfa] italic">
                  We do not just produce church members — we produce kingdom ambassadors who carry God's standards into every sector they occupy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIVE PILLARS SECTION */}
      <section ref={sectionRefs.pillars} className="py-24 bg-[#0c0c0e] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('pillars', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
              Five Pillars
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              The Formation <em className="italic text-[#a78bfa] not-italic">Framework</em> In Depth
            </h2>
            <p className="text-[#a1a1a6] text-base font-light">
              Each pillar represents a dimension of growth that shapes every SORMS member from the inside out.
            </p>
          </div>

          <div className="space-y-4">
            {pillars.map((pillar, index) => (
              <div 
                key={pillar.id}
                className={`bg-[#161618] border border-white/5 rounded-xl p-6 hover:border-[#7c3aed]/30 transition-all flex flex-col md:flex-row gap-6 ${visibleSections.pillars ? `animate-reveal visible animation-delay-${(index + 1) * 100}` : 'animate-reveal'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <div className="text-[0.6rem] uppercase tracking-wider text-[#a78bfa] font-semibold mb-2">Pillar {pillar.number}</div>
                  <h3 className="font-serif text-lg font-normal text-white mb-2">{pillar.title}</h3>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section ref={sectionRefs.philosophy} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-2xl mb-16 ${getAnimationClass('philosophy', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              <span className="w-5 h-px bg-[#7c3aed]"></span>
              Our Philosophy
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              What we <em className="italic text-[#7c3aed] not-italic">believe</em> about sons.
            </h2>
            <p className="text-[#48484a] text-base font-light">
              These convictions drive every programme, curriculum, and community standard we uphold at SORMS.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {beliefs.map((belief, index) => (
              <div 
                key={belief.id}
                className={`bg-white border border-black/5 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex gap-4 ${visibleSections.philosophy ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'}`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-xl flex-shrink-0">
                  {belief.icon}
                </div>
                <div>
                  <h4 className="font-serif text-base font-normal text-[#1d1d1f] mb-2">{belief.title}</h4>
                  <p className="text-xs text-[#86868b] leading-relaxed">{belief.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE OBJECTIVES SECTION */}
      <section ref={sectionRefs.objectives} className="py-24 bg-[#0c0c0e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className={getAnimationClass('objectives', 200)}>
              <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
                Core Objectives
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-6 leading-tight" 
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                What Sound of Revival <em className="italic text-[#a78bfa] not-italic">exists</em> to do.
              </h2>
              <p className="text-[#a1a1a6] text-base mb-8 font-light">
                Six clear commitments that define our work every programme, cohort, and initiative traces back to one of these objectives.
              </p>
              
              <Link 
                to="/joinsorms"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/joinsorms');
                }}
                className="inline-block px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
              >
                Join the Movement
              </Link>
            </div>

            <div className="space-y-2">
              {objectives.map((objective, index) => (
                <div 
                  key={objective.id}
                  className={`bg-[#161618] border border-white/5 rounded-xl p-6 hover:bg-[#1a1a1f] transition-all flex gap-4 ${visibleSections.objectives ? `animate-reveal visible animation-delay-${(index + 1) * 100}` : 'animate-reveal'}`}
                >
                  <div className="font-serif text-3xl text-[#7c3aed]/30 flex-shrink-0 w-12 text-center">
                    {objective.number}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white mb-2">{objective.title}</div>
                    <div className="text-xs text-[#a1a1a6] leading-relaxed">{objective.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP SECTION - FINAL FIX */}
      <section id="ab-leadership" ref={sectionRefs.leadership} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('leadership', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Our Leadership
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Guided by <em className="italic text-[#7c3aed] not-italic">vision</em> and conviction.
            </h2>
            <p className="text-[#48484a] text-base font-light">
              Guided by kingdom principles and a passion for raising influencers across every sphere of society.
            </p>
          </div>

          {/* Featured Leader - Joshua Nwaeze */}
          <div className={`bg-white rounded-2xl border border-black/5 shadow-xl overflow-hidden mb-12 ${getAnimationClass('leadership', 400)}`}>
            <div className="grid md:grid-cols-3">
              <div 
                className="md:col-span-1 h-64 md:h-auto relative overflow-hidden cursor-pointer group"
                onClick={() => setModalImage('/images/joshua.jpg')}
              >
                <img 
                  src="/images/joshua.jpg" 
                  alt="Joshua Nwaeze"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-white/20 backdrop-blur rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/50 md:via-transparent md:to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 md:hidden pointer-events-none">
                  <h3 className="text-2xl font-bold text-white">Joshua Nwaeze</h3>
                  <p className="text-[#a78bfa]">Lead Visionary</p>
                </div>
              </div>
              <div className="md:col-span-2 p-8 md:p-10">
                <span className="inline-block bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-wider text-[#7c3aed] font-semibold mb-4">
                  Lead Visionary
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#1d1d1f] mb-2 hidden md:block">Joshua Nwaeze</h3>
                <p className="text-sm text-[#7c3aed] mb-4 hidden md:block">Founder & Convener, SORMS</p>
                <p className="text-sm text-[#48484a] leading-relaxed mb-4">
                  Joshua Nwaeze is a passionate lover of God, revivalist, and visionary youth leader with a clear burden to raise a generation of spiritually awakened, intellectually equipped, and purpose-driven leaders who manifest Christ in every sphere of influence.
                </p>
                <p className="text-sm text-[#48484a] leading-relaxed mb-4">
                  He is a graduate of the University of Calabar, where he studied Human Nutrition & Dietetics, also trained in Science Laboratory Technology at Ibadan City Polytechnic. Currently serving in the healthcare sector in the United Kingdom, Joshua is also advancing professionally in Data Analytics embodying a rare synthesis of spiritual fervency and intellectual precision.
                </p>
                <p className="text-sm text-[#48484a] leading-relaxed mb-6">
                  As a Youth Pastor, Choir Leader, and the Convener of Sound of Revival-Manifesting Sons (SORMS), Joshua carries a strategic mandate that goes beyond conferences. SORMS is not merely an event platform; it is a revival and capacity-building movement designed to awaken identity, cultivate intimacy with God, and build practical competence for societal dominion.
                </p>
                <div className="border-l-2 border-[#7c3aed] pl-4 py-1 bg-[#f8f8fa] rounded-r-lg">
                  <p className="text-xs text-[#1d1d1f] italic">
                    "The world begins to resonate with the true purpose for which it was created when kingdom citizens arise in their God-given authority."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-serif text-xl font-normal text-[#1d1d1f] text-center mb-8">
            Pillar Leaders & Council Members
          </h3>

          {/* Leaders Grid - Using different components for Chukwuebuka vs others */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allLeaders.map((leader, index) => (
              leader.id === 2 ? (
                <ChukwuebukaCard key={leader.id} leader={leader} index={index} />
              ) : (
                <RegularCard key={leader.id} leader={leader} index={index} />
              )
            ))}
          </div>
        </div>

        {/* Hover/Tap Popup Modal */}
        {hoveredLeader && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setHoveredLeader(null)}
          >
            <div 
              ref={popupRef}
              className="leader-popup-container relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-popup max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handlePopupMouseLeave}
            >
              <button
                onClick={() => setHoveredLeader(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                aria-label="Close popup"
              >
                ✕
              </button>
              
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-[#1d1d1f] to-[#2d2d2f] flex-shrink-0">
                <img 
                  src={hoveredLeader.image} 
                  alt={hoveredLeader.name}
                  className="w-full h-full object-contain object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=Photo+Coming+Soon';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{hoveredLeader.name}</h3>
                  <p className="text-[#a78bfa] text-sm sm:text-base font-medium">{hoveredLeader.role}</p>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="prose prose-sm max-w-none">
                  <p className="text-[#48484a] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {hoveredLeader.fullDescription || hoveredLeader.description || "More information about this leader coming soon."}
                  </p>
                </div>
              </div>
              
              <div className="px-4 sm:px-6 py-2 sm:py-3 bg-[#f8f8fa] border-t border-black/5 text-center flex-shrink-0">
                <p className="text-[10px] sm:text-xs text-[#86868b] flex items-center justify-center gap-2">
                  <span>Hover away or tap outside to close</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Click image for fullscreen</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal for enlarged image */}
        {modalImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all"
            onClick={() => setModalImage(null)}
          >
            <div 
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-2xl"
                aria-label="Close modal"
              >
                ✕
              </button>
              <img 
                src={modalImage} 
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section ref={sectionRefs.cta} className="py-24 bg-gradient-to-br from-[#0c0c0e] to-[#1a1a1f] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className={visibleSections.cta ? 'animate-reveal visible' : 'animate-reveal'}>
            <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5 justify-center">
              Lagos 2026
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Ready to <em className="italic text-[#a78bfa] not-italic">manifest</em> your calling?
            </h2>
            <p className="text-[#a1a1a6] text-lg mb-8 max-w-2xl mx-auto">
              This is your invitation to step out of the crowd and into a community of sons and daughters committed to representing God across every sphere of society.
            </p>
            <Link 
              to="/joinsorms"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/joinsorms');
              }}
              className="inline-block px-10 py-4 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Join the Movement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;