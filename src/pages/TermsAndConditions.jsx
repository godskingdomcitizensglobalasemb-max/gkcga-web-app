// src/pages/TermsAndConditions.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState('March 23, 2026');
  const [showPrintView, setShowPrintView] = useState(false);
  
  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    intro: useRef(null),
    acceptance: useRef(null),
    tickets: useRef(null),
    conduct: useRef(null),
    media: useRef(null),
    liability: useRef(null),
    intellectual: useRef(null),
    privacy: useRef(null),
    termination: useRef(null),
    governing: useRef(null),
    contact: useRef(null)
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

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You can add a toast notification here
    alert('Link copied to clipboard!');
  };

  // Terms sections data
  const termsSections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using the God\'s Kingdom Citizens Global Assembly (GKCGA) and Sound of Revival – Manifesting Sons (SORMS) websites, platforms, services, or attending our events, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services or attend our events.',
        'These terms apply to all users, attendees, volunteers, partners, and any other individuals interacting with GKCGA and SORMS. We reserve the right to update or modify these terms at any time without prior notice. Your continued use of our services constitutes acceptance of any changes.'
      ]
    },
    {
      id: 'tickets',
      title: '2. Ticket Purchases & Registration',
      content: [
        'All ticket sales for SORMS Lagos 2026 and other events are final. No refunds will be issued except in the case of event cancellation by the organizers.',
        'Tickets are non-transferable unless explicitly stated otherwise. If you need to transfer your ticket, please contact us at tickets@sorms.org at least 14 days before the event.',
        'Event registration includes access to specified sessions, materials, and amenities as described on the ticket page. Additional fees may apply for workshops, VIP experiences, or other add-ons.',
        'We reserve the right to refuse entry or revoke tickets at our discretion, with or without refund, for violations of our Code of Conduct or any applicable laws.',
        'In the event of cancellation, refunds will be issued to the original payment method within 14 business days. We are not responsible for any travel, accommodation, or other expenses incurred by attendees.',
        'Early bird and promotional pricing are available for limited times and quantities. We reserve the right to modify pricing at any time.'
      ]
    },
    {
      id: 'conduct',
      title: '3. Code of Conduct',
      content: [
        'All attendees, volunteers, speakers, and staff are expected to conduct themselves in a manner consistent with the values and principles of GKCGA and SORMS, which include respect, integrity, and honor toward all individuals.',
        'The following behaviors are strictly prohibited:',
        '• Harassment, discrimination, or intimidation of any kind based on race, ethnicity, gender, age, religion, disability, or any other characteristic',
        '• Disruptive behavior that interferes with event proceedings or other attendees\' experience',
        '• Unauthorized photography, recording, or live streaming of sessions without explicit permission',
        '• Selling or promoting products or services without prior authorization',
        '• Possession of weapons, illegal substances, or any items that pose a safety risk',
        'Violation of this Code of Conduct may result in immediate removal from the event without refund and potential banning from future events.'
      ]
    },
    {
      id: 'media',
      title: '4. Media & Photography',
      content: [
        'By attending our events, you grant GKCGA and SORMS the irrevocable right and permission to photograph, record, and/or video your likeness and to use such photographs, recordings, or videos in any media now known or hereafter devised, for promotional, educational, or any other legitimate purposes.',
        'If you do not wish to be photographed or recorded, please inform our registration desk or staff upon arrival, and we will make reasonable efforts to accommodate your request.',
        'Attendees may take personal photographs and videos for non-commercial use, provided they do not disrupt the event or infringe on the privacy of others. Commercial use of any content from our events requires prior written permission.',
        'Speakers and presenters retain the rights to their presentations. Recording of sessions without speaker permission is prohibited unless explicitly stated.'
      ]
    },
    {
      id: 'liability',
      title: '5. Limitation of Liability',
      content: [
        'GKCGA and SORMS, including its officers, directors, employees, volunteers, and agents, shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of our services or attendance at our events.',
        'You assume all risks associated with attending our events, including but not limited to risks of personal injury, property damage, or loss. We encourage all attendees to obtain appropriate travel and medical insurance.',
        'We are not responsible for the content, accuracy, or opinions expressed by speakers, sponsors, or other attendees. Any views expressed are those of the individual and do not necessarily reflect the views of GKCGA or SORMS.',
        'In jurisdictions that do not allow the exclusion or limitation of liability, our liability shall be limited to the maximum extent permitted by law.'
      ]
    },
    {
      id: 'intellectual',
      title: '6. Intellectual Property',
      content: [
        'All content provided on our websites, platforms, and events, including but not limited to text, graphics, logos, images, audio, video, and software, is the property of GKCGA and SORMS or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.',
        'You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any of our intellectual property without our prior written consent.',
        'The names "God\'s Kingdom Citizens Global Assembly," "Sound of Revival – Manifesting Sons," "SORMS," and related logos are trademarks of GKCGA. Unauthorized use is prohibited.',
        'If you believe your intellectual property rights have been infringed, please contact us at legal@sorms.org with a detailed description of the alleged infringement.'
      ]
    },
    {
      id: 'privacy',
      title: '7. Privacy & Data Protection',
      content: [
        'We collect and process personal information in accordance with our Privacy Policy. By using our services, you consent to such collection and processing.',
        'We use your information to communicate with you, process registrations, provide services, and improve our offerings. We do not sell your personal information to third parties.',
        'You have the right to access, correct, or delete your personal information. Please contact us at privacy@sorms.org for assistance.',
        'We implement reasonable security measures to protect your information, but no method of transmission over the internet is 100% secure.'
      ]
    },
    {
      id: 'termination',
      title: '8. Termination & Suspension',
      content: [
        'We reserve the right to terminate or suspend your access to our services, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, attendees, or our organization.',
        'Upon termination, your right to use our services will immediately cease. We shall not be liable to you or any third party for any termination of your access.',
        'Sections that by their nature should survive termination shall survive, including but not limited to intellectual property, limitation of liability, and governing law provisions.'
      ]
    },
    {
      id: 'governing',
      title: '9. Governing Law',
      content: [
        'These Terms and Conditions shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law principles.',
        'Any disputes arising under these terms shall be resolved exclusively in the courts of Lagos, Nigeria. You consent to the personal jurisdiction of such courts.',
        'If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.'
      ]
    },
    {
      id: 'contact',
      title: '10. Contact Information',
      content: [
        'If you have any questions about these Terms and Conditions, please contact us at:',
        'Email: legal@sorms.org',
        'Phone: +234 801 234 5678',
        'Address: Lagos, Nigeria',
        'We strive to respond to all inquiries within 5-7 business days.'
      ]
    }
  ];

  // Quick navigation items
  const quickNavItems = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'tickets', title: 'Ticket Purchases' },
    { id: 'conduct', title: 'Code of Conduct' },
    { id: 'media', title: 'Media & Photography' },
    { id: 'liability', title: 'Liability' },
    { id: 'intellectual', title: 'Intellectual Property' },
    { id: 'privacy', title: 'Privacy' },
    { id: 'contact', title: 'Contact' }
  ];

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section ref={sectionRefs.hero} className="relative py-28 md:py-36 bg-[#0c0c0e] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(124,58,237,0.1)_0%,transparent_60%),radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(124,58,237,0.05)_0%,transparent_50%)]"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-4 py-2 rounded-full ${visibleSections.hero ? 'animate-reveal visible' : 'animate-reveal'}`}>
            Legal Information
          </div>
          
          <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 leading-tight ${visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'}`} 
              style={{ fontFamily: "'DM Serif Display', serif" }}>
            Terms and <em className="italic text-[#a78bfa] not-italic">Conditions</em>
          </h1>
          
          <p className={`text-base md:text-lg text-[#a1a1a6] mb-6 max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-300' : 'animate-reveal'}`}>
            Welcome to God's Kingdom Citizens Global Assembly (GKCGA) and Sound of Revival – Manifesting Sons (SORMS). 
            Please read these terms carefully before using our services or attending our events.
          </p>
          
          <p className={`text-sm text-[#6e6e73] mb-8 ${visibleSections.hero ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'}`}>
            Last Updated: <span className="text-[#a78bfa]">{lastUpdated}</span>
          </p>
          
          <div className={`flex flex-wrap gap-4 justify-center ${visibleSections.hero ? 'animate-reveal visible animation-delay-500' : 'animate-reveal'}`}>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
          </div>
          
          <div className={`flex items-center justify-center gap-2 text-xs text-[#6e6e73] mt-12 ${visibleSections.hero ? 'animate-reveal visible animation-delay-600' : 'animate-reveal'}`}>
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
            <span className="text-[#a78bfa]">Terms & Conditions</span>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Quick Navigation */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className={`sticky top-24 bg-[#f8f8fa] rounded-2xl border border-black/5 p-6 ${getAnimationClass('intro', 200)}`}>
              <h3 className="font-serif text-lg font-normal text-[#1d1d1f] mb-4">Quick Navigation</h3>
              <nav className="space-y-2">
                {quickNavItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-sm text-[#48484a] hover:text-[#7c3aed] transition-colors py-2 px-3 rounded-lg hover:bg-white/50"
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-black/5">
                <p className="text-xs text-[#86868b] mb-3">Need assistance?</p>
                <Link
                  to="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/contact');
                  }}
                  className="inline-flex items-center gap-2 text-sm text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
                >
                  Contact Us
                  <span>→</span>
                </Link>
              </div>
            </div>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* Introduction */}
            <div ref={sectionRefs.intro} id="section-acceptance" className={`mb-12 ${getAnimationClass('intro', 200)}`}>
              <div className="prose prose-slate max-w-none">
                <p className="text-[#48484a] leading-relaxed mb-4">
                  These Terms and Conditions ("Terms") govern your use of the websites, platforms, services, and events provided by 
                  God's Kingdom Citizens Global Assembly (GKCGA) and Sound of Revival – Manifesting Sons (SORMS) ("we," "us," or "our"). 
                  By accessing our services or attending our events, you agree to be bound by these Terms.
                </p>
                <p className="text-[#48484a] leading-relaxed">
                  We are committed to providing a safe, respectful, and enriching experience for all participants. These Terms are designed 
                  to protect both you and our organization while ensuring that our mission of raising kingdom citizens is fulfilled.
                </p>
              </div>
            </div>
            
            {/* Terms Sections */}
            {termsSections.map((section, index) => (
              <div 
                key={section.id}
                id={`section-${section.id}`}
                ref={sectionRefs[section.id]}
                className={`mb-12 scroll-mt-24 ${getAnimationClass(section.id, 200)}`}
              >
                <div className="border-l-2 border-[#7c3aed] pl-6">
                  <h2 className="font-serif text-2xl font-normal text-[#1d1d1f] mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, idx) => {
                      // Check if this is a bullet point list item
                      if (paragraph.startsWith('•')) {
                        return (
                          <div key={idx} className="flex items-start gap-3 text-[#48484a] leading-relaxed ml-4">
                            <span className="text-[#7c3aed] mt-1">•</span>
                            <span className="text-sm">{paragraph.substring(1)}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={idx} className="text-[#48484a] leading-relaxed text-sm">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Acknowledgment Section */}
            <div ref={sectionRefs.termination} className={`mt-12 p-6 bg-[#f8f8fa] rounded-2xl border border-black/5 ${getAnimationClass('termination', 400)}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#1d1d1f] mb-2">Acknowledgment</h3>
                  <p className="text-sm text-[#48484a] leading-relaxed">
                    By using our services, attending our events, or accessing our content, you acknowledge that you have read, 
                    understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, 
                    please do not use our services or attend our events.
                  </p>
                  <p className="text-sm text-[#48484a] leading-relaxed mt-3">
                    For questions about these Terms, please contact us at <a href="mailto:legal@sorms.org" className="text-[#7c3aed] hover:underline">legal@sorms.org</a>.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Last Updated Note */}
            <div className={`mt-8 text-center text-xs text-[#86868b] border-t border-black/5 pt-8 ${getAnimationClass('governing', 600)}`}>
              <p>© {new Date().getFullYear()} God's Kingdom Citizens Global Assembly (GKCGA) & Sound of Revival – Manifesting Sons (SORMS). All rights reserved.</p>
              <p className="mt-2">Last updated: {lastUpdated}</p>
            </div>
          </main>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#0c0c0e] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="font-serif text-2xl font-normal text-white mb-3">Questions About Our Terms?</h3>
          <p className="text-sm text-[#a1a1a6] mb-6">Our team is here to help with any questions or concerns.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/contact" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/contact');
              }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all"
            >
              Contact Support
              <span>→</span>
            </Link>
            <a 
              href="mailto:legal@sorms.org" 
              className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all"
            >
              legal@sorms.org
            </a>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
        
        .animation-delay-100 { transition-delay: 0.1s; }
        .animation-delay-200 { transition-delay: 0.2s; }
        .animation-delay-300 { transition-delay: 0.3s; }
        .animation-delay-400 { transition-delay: 0.4s; }
        .animation-delay-500 { transition-delay: 0.5s; }
        .animation-delay-600 { transition-delay: 0.6s; }
        .animation-delay-700 { transition-delay: 0.7s; }
        .animation-delay-800 { transition-delay: 0.8s; }
        
        /* Print styles */
        @media print {
          .sticky {
            position: static;
          }
          aside {
            display: none;
          }
          .animate-reveal {
            opacity: 1 !important;
            transform: none !important;
          }
          button, a {
            text-decoration: none;
          }
        }
        
        /* Scroll margin for anchor links */
        .scroll-mt-24 {
          scroll-margin-top: 6rem;
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditions;