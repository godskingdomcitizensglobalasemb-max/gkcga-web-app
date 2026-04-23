// src/pages/PrivacyPolicy.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
    infoCollection: useRef(null),
    infoUse: useRef(null),
    infoSharing: useRef(null),
    dataSecurity: useRef(null),
    cookies: useRef(null),
    yourRights: useRef(null),
    children: useRef(null),
    thirdParty: useRef(null),
    international: useRef(null),
    retention: useRef(null),
    updates: useRef(null),
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
    alert('Link copied to clipboard!');
  };

  // Privacy sections data
  const privacySections = [
    {
      id: 'intro',
      title: 'Introduction',
      content: [
        'God\'s Kingdom Citizens Global Assembly (GKCGA) and Sound of Revival – Manifesting Sons (SORMS) ("we," "us," or "our") are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our websites, use our platforms, register for our events, or interact with our services.',
        'Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.',
        'This Privacy Policy applies to information collected through our websites, mobile applications, event registration platforms, social media pages, email communications, and any other interactions you may have with us.'
      ]
    },
    {
      id: 'infoCollection',
      title: '1. Information We Collect',
      content: [
        'We collect several types of information from and about users of our services, including:',
        '• Personal Identifiers: Name, email address, phone number, mailing address, date of birth, and government-issued identification where required.',
        '• Registration Information: Church affiliation, organization name, professional title, areas of interest, and attendance history.',
        '• Payment Information: Billing details, payment method information, and transaction history. Payment processing is handled by secure third-party payment processors.',
        '• Technical Data: IP address, browser type, device information, operating system, and usage data collected through cookies and similar technologies.',
        '• Communication Data: Records of your correspondence with us, including emails, chat messages, and phone calls.',
        '• Event Participation: Attendance records, session participation, feedback, surveys, and photographs or videos taken during events.',
        '• Social Media Information: If you interact with us on social media platforms, we may collect information from your public profile.'
      ]
    },
    {
      id: 'infoUse',
      title: '2. How We Use Your Information',
      content: [
        'We use the information we collect for various purposes, including:',
        '• To process your event registrations, ticket purchases, and donations',
        '• To communicate with you about events, updates, and ministry activities',
        '• To provide, operate, and maintain our services',
        '• To improve, personalize, and expand our services',
        '• To understand and analyze how you use our services',
        '• To develop new products, services, features, and functionality',
        '• To send you technical notices, updates, security alerts, and support messages',
        '• To respond to your comments, questions, and requests',
        '• To protect against fraudulent, unauthorized, or illegal activity',
        '• To comply with legal obligations and enforce our policies',
        '• To share with your consent or as otherwise disclosed at the time of collection'
      ]
    },
    {
      id: 'infoSharing',
      title: '3. Information Sharing & Disclosure',
      content: [
        'We do not sell, rent, or trade your personal information to third parties for marketing purposes. We may share your information in the following circumstances:',
        '• Service Providers: We may share your information with third-party vendors, service providers, contractors, or agents who perform services on our behalf, such as payment processing, email delivery, event management, and data analysis.',
        '• Event Partners: For events, we may share attendee information with co-sponsors, speakers, and partners as necessary for event operations. You will be notified when such sharing occurs.',
        '• Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).',
        '• Business Transfers: In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction.',
        '• Protection of Rights: We may disclose information to protect the rights, property, or safety of GKCGA, SORMS, our users, or others.',
        '• With Your Consent: We may share your information for any other purpose with your consent.'
      ]
    },
    {
      id: 'dataSecurity',
      title: '4. Data Security',
      content: [
        'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:',
        '• Encryption of sensitive data during transmission using Secure Socket Layer (SSL) technology',
        '• Regular security assessments and vulnerability scanning',
        '• Access controls and authentication protocols',
        '• Secure data storage with limited access',
        '• Staff training on data protection and privacy practices',
        'However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.',
        'If a data breach occurs that compromises your personal information, we will notify you and any applicable regulator as required by law.'
      ]
    },
    {
      id: 'cookies',
      title: '5. Cookies & Tracking Technologies',
      content: [
        'We use cookies and similar tracking technologies to track activity on our services and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.',
        'We use the following types of cookies:',
        '• Essential Cookies: Required for the operation of our services, enabling core functionality such as security, network management, and accessibility.',
        '• Preference Cookies: Remember your preferences and settings to enhance your experience.',
        '• Analytics Cookies: Help us understand how visitors interact with our services, collect information about usage, and improve our offerings.',
        '• Marketing Cookies: Track your online activity to deliver more relevant advertising.',
        'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services.',
        'We also use Google Analytics to understand how users engage with our websites. Google Analytics uses cookies to collect information about your use of our services. You can learn more about Google\'s privacy practices at policies.google.com/privacy.'
      ]
    },
    {
      id: 'yourRights',
      title: '6. Your Privacy Rights',
      content: [
        'Depending on your location, you may have certain rights regarding your personal information, including:',
        '• Right to Access: You have the right to request copies of your personal information.',
        '• Right to Rectification: You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.',
        '• Right to Erasure: You have the right to request that we erase your personal information, under certain conditions.',
        '• Right to Restrict Processing: You have the right to request that we restrict the processing of your personal information, under certain conditions.',
        '• Right to Object to Processing: You have the right to object to our processing of your personal information, under certain conditions.',
        '• Right to Data Portability: You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.',
        '• Right to Withdraw Consent: You have the right to withdraw your consent at any time where we rely on consent to process your personal information.',
        'To exercise any of these rights, please contact us at privacy@sorms.org. We will respond to your request within 30 days.',
        'If you are located in the European Economic Area (EEA), you also have the right to lodge a complaint with your local data protection authority.'
      ]
    },
    {
      id: 'children',
      title: '7. Children\'s Privacy',
      content: [
        'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us immediately.',
        'If we become aware that we have collected personal information from a child under age 13 without verification of parental consent, we will take steps to remove that information from our servers.',
        'For certain events and programs, we may have specific consent processes for minors. Parents or guardians will be required to provide consent and may have the right to access and delete their child\'s information.'
      ]
    },
    {
      id: 'thirdParty',
      title: '8. Third-Party Links & Services',
      content: [
        'Our services may contain links to third-party websites, applications, and services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.',
        'We encourage you to review the privacy policies of any third-party sites or services you visit. This Privacy Policy applies solely to information collected by GKCGA and SORMS.',
        'Examples of third-party services we may use include:',
        '• Payment processors (e.g., Flutterwave, Paystack)',
        '• Email marketing platforms (e.g., Mailchimp)',
        '• Event management platforms (e.g., Eventbrite)',
        '• Analytics services (e.g., Google Analytics)',
        '• Social media platforms (e.g., YouTube, Instagram, Facebook)'
      ]
    },
    {
      id: 'international',
      title: '9. International Data Transfers',
      content: [
        'Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.',
        'If you are located outside Nigeria and choose to provide information to us, please note that we transfer the data, including personal information, to Nigeria and process it there.',
        'Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.',
        'We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your personal information will take place to an organization or a country unless there are adequate controls in place.'
      ]
    },
    {
      id: 'retention',
      title: '10. Data Retention',
      content: [
        'We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.',
        'Specific retention periods:',
        '• Registration information: Retained for the duration of your active participation and for 5 years after your last interaction',
        '• Transaction records: Retained for 7 years to comply with financial and tax regulations',
        '• Communications: Retained for 3 years',
        '• Event participation records: Retained indefinitely for historical and statistical purposes, but anonymized where possible',
        'When we no longer need your personal information, we will securely delete or anonymize it.'
      ]
    },
    {
      id: 'updates',
      title: '11. Updates to This Privacy Policy',
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or for other operational reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
        'You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.',
        'If we make material changes that affect how we use or disclose your personal information, we will provide additional notice, such as via email or through a prominent notice on our website.'
      ]
    },
    {
      id: 'contact',
      title: '12. Contact Us',
      content: [
        'If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:',
        'Email: privacy@sorms.org',
        'Phone: +234 801 234 5678',
        'Address: Lagos, Nigeria',
        'Data Protection Officer: For privacy-related inquiries, please contact our Data Protection Officer at dpo@sorms.org.',
        'We strive to respond to all privacy-related inquiries within 5-7 business days. If you have an unresolved privacy concern that we have not addressed satisfactorily, you may have the right to lodge a complaint with your local data protection authority.'
      ]
    }
  ];

  // Quick navigation items
  const quickNavItems = [
    { id: 'intro', title: 'Introduction' },
    { id: 'infoCollection', title: 'Information We Collect' },
    { id: 'infoUse', title: 'How We Use Your Info' },
    { id: 'infoSharing', title: 'Information Sharing' },
    { id: 'dataSecurity', title: 'Data Security' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'yourRights', title: 'Your Privacy Rights' },
    { id: 'children', title: "Children's Privacy" },
    { id: 'contact', title: 'Contact Us' }
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
            Privacy & Data Protection
          </div>
          
          <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 leading-tight ${visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'}`} 
              style={{ fontFamily: "'DM Serif Display', serif" }}>
            Privacy <em className="italic text-[#a78bfa] not-italic">Policy</em>
          </h1>
          
          <p className={`text-base md:text-lg text-[#a1a1a6] mb-6 max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-300' : 'animate-reveal'}`}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
            <Link 
              to="/terms" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/terms');
              }}
              className="hover:text-[#a78bfa] transition-colors"
            >
              Terms
            </Link>
            <span>/</span>
            <span className="text-[#a78bfa]">Privacy Policy</span>
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
                <div className="bg-[#7c3aed]/5 rounded-xl p-4">
                  <p className="text-xs text-[#86868b] mb-2">Questions about your data?</p>
                  <Link
                    to="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/contact');
                    }}
                    className="inline-flex items-center gap-2 text-sm text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
                  >
                    Contact Privacy Team
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* Privacy Shield Icon */}
            <div className={`mb-8 text-center ${getAnimationClass('intro', 200)}`}>
              <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6-4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2z" />
                </svg>
              </div>
            </div>
            
            {/* Privacy Sections */}
            {privacySections.map((section, index) => (
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
            
            {/* Your Rights Summary Card */}
            <div className={`mt-8 p-6 bg-gradient-to-r from-[#f8f8fa] to-white rounded-2xl border border-black/5 ${getAnimationClass('yourRights', 400)}`}>
              <h3 className="font-serif text-lg font-normal text-[#1d1d1f] mb-3">Your Privacy Rights at a Glance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#48484a]">Right to Access your data</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#48484a]">Right to Rectification</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#48484a]">Right to Erasure (to be forgotten)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#48484a]">Right to Data Portability</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#48484a]">Right to Object to Processing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#48484a]">Right to Withdraw Consent</span>
                </div>
              </div>
              <p className="text-xs text-[#86868b] mt-4 pt-3 border-t border-black/5">
                To exercise any of these rights, contact us at <a href="mailto:privacy@sorms.org" className="text-[#7c3aed] hover:underline">privacy@sorms.org</a>
              </p>
            </div>
            
            {/* Last Updated Note */}
            <div className={`mt-8 text-center text-xs text-[#86868b] border-t border-black/5 pt-8 ${getAnimationClass('updates', 600)}`}>
              <p>© {new Date().getFullYear()} God's Kingdom Citizens Global Assembly (GKCGA) & Sound of Revival – Manifesting Sons (SORMS). All rights reserved.</p>
              <p className="mt-2">Last updated: {lastUpdated}</p>
              <p className="mt-2">
                <Link to="/terms" className="hover:text-[#7c3aed] transition-colors">Terms & Conditions</Link>
                <span className="mx-2">•</span>
                <Link to="/contact" className="hover:text-[#7c3aed] transition-colors">Contact Us</Link>
              </p>
            </div>
          </main>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#0c0c0e] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="font-serif text-2xl font-normal text-white mb-3">Have Questions About Your Privacy?</h3>
          <p className="text-sm text-[#a1a1a6] mb-6">Our privacy team is here to help with any questions or concerns.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/contact" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/contact');
              }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all"
            >
              Contact Privacy Team
              <span>→</span>
            </Link>
            <a 
              href="mailto:privacy@sorms.org" 
              className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all"
            >
              privacy@sorms.org
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

export default PrivacyPolicy;