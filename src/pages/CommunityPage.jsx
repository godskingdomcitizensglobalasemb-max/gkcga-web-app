// src/pages/CommunityPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const navigate = useNavigate();

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    levels: useRef(null),
    benefits: useRef(null),
    growth: useRef(null),
    values: useRef(null),
    cta: useRef(null)
  };

  // State for scroll animations
  const [visibleSections, setVisibleSections] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

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
    handleScroll(); // Check initial visibility
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);

  // Helper function to determine animation class
  const getAnimationClass = (section, delay = 0) => {
    return visibleSections[section] 
      ? `animate-reveal visible animation-delay-${delay}` 
      : 'animate-reveal';
  };

  // Scroll to growth track section
  const scrollToGrowthTrack = () => {
    const element = document.getElementById('growth-track');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Community levels data
  const communityLevels = [
    {
      id: 1,
      level: "01",
      name: "Friends of SORMS",
      badge: "Level 01",
      description: "Open access for anyone curious about the movement. No application needed — just show up and start exploring.",
      features: [
        "Open programs & events",
        "Content & teachings access",
        "Newsletter & updates",
        "Community introductions",
        "Social media community",
        "Event announcements"
      ],
      icon: "👋",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: 2,
      level: "02",
      name: "SORMS Community",
      badge: "Level 02 — Core",
      description: "The heart of SORMS. Application-based membership with structured training, mentorship, and a clear development pathway.",
      features: [
        "Structured training & academies",
        "Mentorship access",
        "Growth tracks & milestones",
        "WhatsApp & Telegram community",
        "Service opportunities",
        "Priority event registration",
        "Peer accountability groups"
      ],
      icon: "🤝",
      color: "from-purple-600 to-indigo-600",
      featured: true
    },
    {
      id: 3,
      level: "03",
      name: "Builders Circle",
      badge: "Level 03",
      description: "Proven, vetted leaders who carry the vision forward. Builders run programs, mentor emerging sons, and shape the direction of the movement.",
      features: [
        "Lead programs & cohorts",
        "Mentor emerging sons",
        "Vision & governance role",
        "Ambassador commissioning",
        "Speaking invitations",
        "Strategic planning access"
      ],
      icon: "👑",
      color: "from-amber-500 to-orange-500"
    }
  ];

  // Benefits data
  const benefitsData = [
    {
      id: 1,
      icon: "🎓",
      title: "Training & Academies",
      description: "Structured learning programmes designed to build competence in leadership, business, ministry, and professional excellence."
    },
    {
      id: 2,
      icon: "🤝",
      title: "Mentorship Network",
      description: "Get paired with experienced leaders and mentors who guide your growth, challenge your thinking, and hold you accountable."
    },
    {
      id: 3,
      icon: "🌍",
      title: "Global Community",
      description: "Connect with sons and daughters across Africa and beyond — a network of kingdom-minded professionals, creatives, and leaders."
    },
    {
      id: 4,
      icon: "📅",
      title: "Exclusive Events",
      description: "Priority access to summits, conferences, roundtables, and intimate leadership gatherings not open to the general public."
    },
    {
      id: 5,
      icon: "📈",
      title: "Growth Milestones",
      description: "A clear, tracked pathway from entry to commissioning — with milestones, assessments, and recognition at every stage."
    },
    {
      id: 6,
      icon: "💬",
      title: "Active Chat Communities",
      description: "WhatsApp and Telegram groups for prayer, discussion, collaboration, job opportunities, and daily encouragement."
    }
  ];

  // Growth track data
  const growthTracks = [
    {
      id: 1,
      level: 1,
      name: "Foundation",
      features: [
        "Leadership Council access",
        "Community awards",
        "Priority seating at events",
        "Public acknowledgement",
        "Roundtable invitations"
      ],
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: 2,
      level: 2,
      name: "Development",
      features: [
        "Skill training programs",
        "Mentor access",
        "Media exposure",
        "Global network access",
        "Collaborative projects"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      level: 3,
      name: "Influence",
      features: [
        "Project collaborations",
        "Sponsored gifts",
        "Leadership track",
        "Brand amplification",
        "Speaking invitations"
      ],
      color: "from-pink-500 to-pink-600"
    },
    {
      id: 4,
      level: 4,
      name: "Leadership",
      features: [
        "Event leadership roles",
        "Speaking opportunities",
        "Ambassador commissioning",
        "Mentorship of cohorts",
        "Vision governance seat"
      ],
      color: "from-amber-500 to-orange-500",
      featured: true
    }
  ];

  // Community values
  const communityValues = [
    {
      id: 1,
      title: "Intentional Growth",
      description: "Every level of the community is designed with intentionality to meet you where you are and move you toward where God is calling you.",
      icon: "🎯"
    },
    {
      id: 2,
      title: "Authentic Relationships",
      description: "We believe in doing life together. Real connections, honest conversations, and lasting friendships.",
      icon: "❤️"
    },
    {
      id: 3,
      title: "Kingdom Impact",
      description: "Everything we do is aimed at equipping you to make a tangible difference in your sphere of influence.",
      icon: "⚡"
    }
  ];

  // Stats data
  const stats = [
    { value: "500+", label: "Active Members", icon: "👥" },
    { value: "15+", label: "Countries", icon: "🌍" },
    { value: "10+", label: "Mentors", icon: "🤝" },
    { value: "50+", label: "Events Yearly", icon: "📅" }
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className={`${visibleSections.hero ? 'animate-reveal visible' : 'animate-reveal'}`}>
              <div className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
                Our Community
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight" 
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                Find your <em className="italic text-[#a78bfa] not-italic">place</em> in the movement.
              </h1>
              <p className="text-lg text-[#a1a1a6] mb-8 leading-relaxed max-w-xl">
                SORMS is more than an event it's a structured community of sons and daughters being raised for marketplace impact. Whether you're just discovering us or ready to lead, there's a level for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/joinsorms"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/joinsorms');
                  }}
                  className="px-8 py-3 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all"
                >
                  Join the Movement
                </Link>
                {/* <button
                  onClick={scrollToGrowthTrack}
                  className="px-8 py-3 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all"
                >
                  View Growth Track
                </button> */}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="font-serif text-xl text-white">{stat.value}</div>
                    <div className="text-xs text-[#6e6e73] uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Mandate Card */}
            <div className={`relative ${visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'}`}>
              <div className="bg-[#161618] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#7c3aed]/10 blur-3xl"></div>
                
                <span className="text-xs uppercase tracking-wider text-[#a78bfa] font-semibold mb-4 block">
                  Community Structure
                </span>
                <h3 className="font-serif text-2xl font-normal text-white mb-3">
                  Three Levels of Engagement
                </h3>
                <p className="text-sm text-[#a1a1a6] mb-6">
                  From open access to leadership commissioning every level is intentional, progressive, and rooted in kingdom values.
                </p>
                <div className="w-8 h-px bg-white/10 my-4"></div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[#a1a1a6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                    Friends of SORMS Open Access
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#a1a1a6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                    SORMS Community Application-Based
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#a1a1a6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                    Builders Circle Leadership Tier
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#a1a1a6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                    Growth tracks at every level
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#a1a1a6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                    Mentorship & accountability
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#6e6e73] mt-16 pt-8 border-t border-white/5">
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
            <span className="text-[#a78bfa]">Community</span>
          </div>
        </div>
      </section>

      <section ref={sectionRefs.levels} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('levels', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Community Levels
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Three Tiers of <em className="italic text-[#7c3aed] not-italic">Belonging</em>
            </h2>
            <p className="text-[#48484a] text-base font-light">
              Every level of the SORMS community is designed with intentionality to meet you where you are and move you toward where God is calling you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
           
            <div className={`bg-white rounded-xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${
              visibleSections.levels ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'
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
              visibleSections.levels ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'
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
              visibleSections.levels ? 'animate-reveal visible animation-delay-600' : 'animate-reveal'
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
            {/* <button
              onClick={scrollToGrowthTrack}
              className="px-8 py-3 border border-black/10 text-[#1d1d1f] rounded-full text-sm font-medium hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
            >
              View Growth Track
            </button> */}
          </div>
        </div>
      </section> 

      {/* Benefits Section */}
      <section ref={sectionRefs.benefits} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('benefits', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Why Join
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              What the <em className="italic text-[#7c3aed] not-italic">Community</em> Offers You
            </h2>
            <p className="text-[#48484a] text-base font-light">
              Being part of SORMS means access to a network, a growth structure, and a family committed to seeing you manifest your full potential.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsData.map((benefit, index) => (
              <div 
                key={benefit.id}
                className={`group bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${
                  visibleSections.benefits ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-serif text-xl font-normal text-[#1d1d1f] mb-3">{benefit.title}</h3>
                <p className="text-sm text-[#48484a] leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Track Section
      <section id="growth-track" ref={sectionRefs.growth} className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
       
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('growth', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Growth Track
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Benefits for <em className="italic text-[#7c3aed] not-italic">Kingdom Citizens</em>
            </h2>
            <p className="text-[#48484a] text-base font-light">
              As you progress through the movement, each level unlocks greater opportunities, responsibilities, and impact.
            </p>
          </div>

          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {growthTracks.map((track, index) => (
              <div 
                key={track.id}
                className={`group relative bg-white rounded-xl p-6 border border-black/5 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                  track.featured ? 'ring-2 ring-[#7c3aed]/20' : ''
                } ${visibleSections.growth ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'}`}
              >
                {track.featured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
                )}
                
            
                <div className="font-serif text-5xl text-[#7c3aed]/10 absolute top-4 right-4">
                  {track.level}
                </div>

                <div className={`inline-block px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-wider font-semibold mb-4 bg-gradient-to-r ${track.color} text-white`}>
                  Level {track.level}
                </div>
                
                <h3 className="font-serif text-xl font-normal text-[#1d1d1f] mb-4">{track.name}</h3>
                
                <ul className="space-y-2">
                  {track.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-[#86868b] flex items-start gap-2">
                      <span className="text-[#7c3aed] mt-0.5">—</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Community Values Section */}
      <section ref={sectionRefs.values} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('values', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Our Values
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              What <em className="italic text-[#7c3aed] not-italic">Defines</em> Us
            </h2>
            <p className="text-[#48484a] text-base font-light">
              These core values shape everything we do as a community.
            </p>
          </div>

          {/* Values Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {communityValues.map((value, index) => (
              <div 
                key={value.id}
                className={`text-center ${visibleSections.values ? `animate-reveal visible animation-delay-${(index + 1) * 200}` : 'animate-reveal'}`}
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-serif text-xl font-normal text-[#1d1d1f] mb-3">{value.title}</h3>
                <p className="text-sm text-[#48484a] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent mx-auto my-12"></div>

          {/* Quote */}
          <div className={`text-center max-w-3xl mx-auto ${getAnimationClass('values', 800)}`}>
            <p className="font-serif text-lg italic text-[#86868b]">
              "We are not just building a community we are raising a family of kingdom citizens committed to transforming every sphere of society."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={sectionRefs.cta} className="py-24 bg-gradient-to-br from-[#0c0c0e] to-[#1a1a1f] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #7c3aed 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative max-w-3xl mx-auto px-4">
          <span className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
            Join Us
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4" 
              style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ready to find your <em className="italic text-[#a78bfa] not-italic">place</em>?
          </h2>
          <p className="text-lg text-[#a1a1a6] mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you're exploring for the first time or ready to commit to the full growth journey, there's a seat at the table for you. Take the first step today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/joinsorms"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/joinsorms');
              }}
              className="px-8 py-3 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all"
            >
              Join the Movement
            </Link>
            
            <Link 
              to="/events" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/events');
              }}
              className="px-8 py-3 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all"
            >
              Explore Events
            </Link>
          </div>

          {/* Testimonial Avatars */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] border-2 border-white/20 flex items-center justify-center text-white text-xs font-serif">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-xs text-[#6e6e73] ml-2">Join 500+ members worldwide</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
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
      `}</style>
    </div>
  );
};

export default CommunityPage;