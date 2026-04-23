// src/pages/GkcgaPage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const GkcgaPage = () => {
  // Refs for scroll reveal
  const revealRefs = useRef([]);
  
  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Helper to add refs
  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // Arms/Programs data
  const arms = [
    {
      id: 1,
      title: "Sound of Revival Manifesting Sons (SORMS)",
      description: "Our flagship faith-based development and revival movement raising spiritually grounded, intellectually sound, and economically productive sons and daughters. Hosts annual conferences, virtual summits, and ongoing community formation.",
      features: [
        "Annual conferences (Lagos 2026)",
        "Virtual summits & bible studies",
        "Structured community & mentorship",
        "Leadership development tracks"
      ],
      isFeatured: true
    },
    {
      id: 2,
      title: "GKCGA Partnership Arms",
      description: "Partner with the Kingdom movement through giving, outreach, charity, and multimedia supporting the work across nations.",
      features: [
        "SORMS Programs Partnership",
        "Charity Partnership",
        "Outreach Partnership",
        "Multimedia Partnership"
      ],
      isFeatured: false
    },
    {
      id: 3,
      title: "Global Bible Study & Prayer Watch",
      description: "Daily live sessions on YouTube join kingdom citizens worldwide for worship, the Word, and intercession every night.",
      features: [
        "Daily at 12AM WAT / 11PM UK",
        "Live on YouTube & Zoom",
        "Open to everyone globally",
        "Archive of past sessions"
      ],
      isFeatured: false
    }
  ];

  // Conviction cards data
  const convictions = [
    {
      id: 1,
      icon: "👑",
      title: "Kingdom Consciousness",
      description: "Building believers who live in the consciousness, culture, power, and authority of God's Kingdom, not just religious activity."
    },
    {
      id: 2,
      icon: "🌍",
      title: "Global Deployment",
      description: "Raising and deploying Kingdom citizens across nations governance, business, education, media, arts, technology, and community."
    },
    {
      id: 3,
      icon: "🔥",
      title: "Kingdom Restoration",
      description: "Restoring God's original purposes on the earth, manifesting sons, and establishing His Kingdom until the world reflects Christ's reign."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* GKCGA Page */}
      <div id="page-gkcga">
        
        {/* GKCGA HERO */}
        <section className="relative py-28 md:py-36 bg-[#0c0c0e] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(124,58,237,0.1)_0%,transparent_60%),radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(124,58,237,0.05)_0%,transparent_50%)]"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Column */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.2)] px-4 py-1.5 rounded-full text-xs uppercase tracking-wider text-[#a78bfa] font-medium mb-6">
                  The Global Assembly
                </div>
                <h1 className="font-['DM_Serif_Display'] text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-tight mb-5">
                  God's Kingdom Citizens <em className="italic text-[#a78bfa] not-italic">Global Assembly</em>
                </h1>
                <p className="text-[0.95rem] leading-relaxed text-[#a1a1a6] font-light mb-8 max-w-lg">
                  "For Thine is the Kingdom, the Power, and the Glory" A non-denominational global Kingdom movement mandated to raise, equip, and deploy Kingdom citizens who manifest the reign of Christ across every sphere of life.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/joinsorms" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all">
                    Join the Movement
                    <span className="opacity-50">→</span>
                  </Link>


     <a
  href="https://docs.google.com/forms/d/e/1FAIpQLSeniJw28IL7YaTgy3UjX5GM48lATy2ykH-TkqxXqiB8cvOVMA/viewform?usp=send_form"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
>
  Partner With Us 
</a>



                  {/* <Link to="/partner" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[rgba(255,255,255,0.07)] text-white rounded-full text-sm font-medium hover:border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.05)] transition-all">
                    
                  </Link> */}
                </div>
              </div>
              
              {/* Right Column - Mandate Card */}
              <div>
                <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 md:p-9 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
                  <div className="text-xs uppercase tracking-wider text-[#a78bfa] font-medium mb-3">Our Mandate</div>
                  <h3 className="font-['DM_Serif_Display'] text-xl font-normal text-[#f5f5f7] mb-2">GKCGA</h3>
                  <p className="text-sm text-[#a1a1a6] leading-relaxed mb-5">Restoring God's original intent for humanity, reviving nations, and preparing a people who will rule and reign with Christ.</p>
                  <div className="w-8 h-px bg-[rgba(124,58,237,0.2)] my-4"></div>
                  <ul className="space-y-2.5">
                    <li className="flex items-center gap-2.5 text-xs text-[#a1a1a6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                      Raise Kingdom Citizens globally
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-[#a1a1a6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                      Restore God's original purposes
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-[#a1a1a6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                      Manifest sons across all spheres
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-[#a1a1a6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                      Establish His Kingdom on earth
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-[#a1a1a6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                      Prepare a people for His reign
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-4 mt-12 flex items-center gap-2 text-xs text-[#6e6e73]">
              <Link to="/" className="hover:text-[#f5f5f7] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#a78bfa]">GKCGA</span>
            </div>
          </div>
        </section>

        {/* WHAT IS GKCGA Section */}
        <section className="py-16 md:py-24 bg-[#f8f8fa]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left Column */}
              <div>
                <div className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
                  Who We Are
                </div>
                <h2 className="font-['DM_Serif_Display'] text-3xl md:text-4xl font-normal text-[#1d1d1f] leading-tight mb-6">
                  More than a church. A <em className="italic text-[#7c3aed] not-italic">Kingdom</em> movement.
                </h2>
                <p className="text-sm leading-relaxed text-[#86868b] mb-4 font-light">
                  God's Kingdom Citizens Global Assembly is not a church denomination, but a global assembly and movement of Kingdom ambassadors called to restore God's original intent for humanity.
                </p>
                <p className="text-sm leading-relaxed text-[#86868b] mb-4 font-light">
                  The Assembly exists to build believers who live in the consciousness, culture, power, and authority of God's Kingdom and who demonstrate this reality in governance, business, education, media, arts, technology, and community life.
                </p>
                <p className="text-sm leading-relaxed text-[#86868b] font-light">
                  We are raising a generation that doesn't just attend services, but represents the King in every system, structure, and sector of society.
                </p>
              </div>
              
              {/* Right Column - Conviction Cards */}
              <div className="flex flex-col gap-4">
                {convictions.map((conviction, index) => (
                  <div 
                    key={conviction.id}
                    ref={addToRefs}
                    className={`bg-white border border-[rgba(0,0,0,0.06)] rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all reveal`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    <span className="text-xl mb-2 block">{conviction.icon}</span>
                    <h4 className="font-['DM_Serif_Display'] text-sm font-normal text-[#1d1d1f] mb-1">{conviction.title}</h4>
                    <p className="text-xs leading-relaxed text-[#86868b]">{conviction.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GKCGA VISION Section */}
        <section className="py-16 md:py-24 bg-[#0c0c0e]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5">
                Our Vision
              </div>
              <h2 className="font-['DM_Serif_Display'] text-3xl md:text-4xl font-normal text-[#f5f5f7] mb-3">
                Until the world reflects the <em className="italic text-[#a78bfa] not-italic">reign of Christ</em>
              </h2>
              <p className="text-sm text-[#a1a1a6] max-w-lg mx-auto leading-relaxed">One vision drives everything we do at GKCGA.</p>
            </div>
            
            <div className="max-w-3xl mx-auto text-center">
              <div 
                ref={addToRefs}
                className="bg-[#161618] border border-[rgba(124,58,237,0.2)] rounded-2xl p-8 md:p-11 relative overflow-hidden reveal"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#a78bfa] via-[#6366f1] to-transparent"></div>
                <div className="text-xs uppercase tracking-wider text-[#a78bfa] font-medium mb-3">Vision Statement</div>
                <h3 className="font-['DM_Serif_Display'] text-xl font-normal text-[#f5f5f7] mb-4">The GKCGA Vision</h3>
                <p className="text-sm leading-relaxed text-[#a1a1a6] mb-5">
                  To raise God's Kingdom Citizens across the nations, restoring God's original purposes on the earth, manifesting sons, and establishing His Kingdom in every sphere of life until the world reflects the reign of Christ.
                </p>
                <div className="border-l-2 border-[#7c3aed] pl-4 text-sm italic leading-relaxed text-[#f5f5f7] font-['DM_Serif_Display']">
                  We are not building a denomination we are building a Kingdom culture that transforms every nation it touches.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GKCGA ARMS / PROGRAMS Section */}
        <section className="py-16 md:py-24 bg-[#f8f8fa]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
                Our Arms
              </div>
              <h2 className="font-['DM_Serif_Display'] text-3xl md:text-4xl font-normal text-[#1d1d1f] mb-3">
                Programs & <em className="italic text-[#7c3aed] not-italic">Initiatives</em>
              </h2>
              <p className="text-sm text-[#86868b] max-w-lg mx-auto leading-relaxed">
                GKCGA operates through several arms, each designed to raise kingdom citizens in a specific dimension of life and society.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {arms.map((arm, index) => (
                <div 
                  key={arm.id}
                  ref={addToRefs}
                  className={`bg-white border rounded-2xl p-8 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 reveal ${
                    arm.isFeatured 
                      ? 'border-[rgba(124,58,237,0.2)] shadow-[0_0_60px_rgba(124,58,237,0.06)] bg-gradient-to-b from-[rgba(124,58,237,0.04)] to-white' 
                      : 'border-[rgba(0,0,0,0.06)]'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="text-[0.6rem] uppercase tracking-wider text-[#7c3aed] font-semibold mb-4">
                    {arm.isFeatured ? 'Flagship Program' : arm.id === 2 ? 'Partnership' : 'Daily Engagement'}
                  </div>
                  <h3 className="font-['DM_Serif_Display'] text-xl font-normal text-[#1d1d1f] mb-3">{arm.title}</h3>
                  <p className="text-xs leading-relaxed text-[#48484a] mb-6">{arm.description}</p>
                  <ul className="space-y-2">
                    {arm.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[0.7rem] text-[#86868b]">
                        <span className="text-[#7c3aed]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center mt-12">
              <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all">
                Explore SORMS
              </Link>


      <a
  href="https://docs.google.com/forms/d/e/1FAIpQLSeniJw28IL7YaTgy3UjX5GM48lATy2ykH-TkqxXqiB8cvOVMA/viewform?usp=send_form"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
>
  Become a Partner<span className="opacity-50">→</span>
</a>


             
            </div>
          </div>
        </section>

        {/* GKCGA LEADERSHIP Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              ref={addToRefs}
              className="flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto reveal"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0 border-2 border-[rgba(124,58,237,0.2)]">
                <img 
                  src="/images/joshua.jpg" 
                  alt="Joshua Nwaeze"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-3">
                  Leadership
                </div>
                <h2 className="font-['DM_Serif_Display'] text-2xl font-normal text-[#1d1d1f] mb-1">Joshua Nwaeze</h2>
                <p className="text-xs text-[#7c3aed] font-medium mb-3">Founder & Convener, GKCGA / SORMS</p>
                <p className="text-sm leading-relaxed text-[#48484a] font-light max-w-lg">
                  Joshua Nwaeze is the founder of God's Kingdom Citizens Global Assembly and the convener of Sound of Revival Manifesting Sons. With a mandate to raise kingdom citizens who dominate in every sphere, he leads GKCGA in building a global movement of kingdom ambassadors.
                </p>
                <Link 
                  to="/about#ab-leadership" 
                  className="inline-flex items-center gap-1.5 text-xs text-[#7c3aed] font-medium mt-4 hover:gap-2 transition-all"
                >
                  Full leadership team →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* GKCGA CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#0c0520] to-[#0c0c0e] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(124,58,237,0.12),transparent_70%)]"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold justify-center mb-5">
                Join the Assembly
              </div>
              <h2 className="font-['DM_Serif_Display'] text-3xl md:text-4xl font-normal text-white mb-4">
                Be part of something <em className="italic text-[#a78bfa] not-italic">eternal</em>
              </h2>
              <p className="text-sm text-[#a1a1a6] leading-relaxed mb-8">
                GKCGA is not just an assembly it's a global mandate. Whether through SORMS, partnership, or daily devotion, there's a place for every kingdom citizen.
              </p>
              <Link to="/joinsorms" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0c0c0e] rounded-full text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all">
                Join the Movement
                <span className="opacity-50">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .reveal {
            transition-duration: 0.5s;
          }
        }
      `}</style>
    </div>
  );
};

export default GkcgaPage;