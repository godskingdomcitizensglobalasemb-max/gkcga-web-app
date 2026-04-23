// src/pages/ContactPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNotification } from '../context/NotificationContext';
import { saveContact, getTimestamp } from '../firebase';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker for SORMS location
const sormsIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to center map on event location
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ContactPage = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // Event location coordinates for Anetta Event Place, Festac Town, Lagos
  const eventLocation = {
    name: 'SORMS Lagos 2026',
    venue: 'Anetta Event Place',
    coordinates: [6.4683, 3.2824], // Festac Town, Lagos coordinates
    address: 'Plot 2016 Festac Link Road, beside Mobil Filling Station, Festac Town, Lagos 102102, Lagos, Nigeria',
    description: 'The premier gathering of kingdom citizens two days of worship, formation, leadership training, and commissioning.'
  };

  // Refs for animation sections
  const sectionRefs = {
    hero: useRef(null),
    form: useRef(null),
    info: useRef(null),
    hours: useRef(null),
    map: useRef(null)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (!formData.email.includes('@')) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);

    try {
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        source: 'contact_page',
        status: 'pending',
        createdAt: getTimestamp(),
        userAgent: navigator.userAgent,
        ipAddress: '',
        responded: false,
        responseDate: null
      };

      console.log('Saving contact form to Firebase:', contactData);
      
      const recordId = await saveContact(contactData);
      
      console.log('Contact form saved successfully with ID:', recordId);
      
      showNotification('Message sent successfully! We\'ll respond within 48 hours.', 'success');
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error saving contact form:', error);
      showNotification('There was an error sending your message. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Contact info items with WhatsApp Font Awesome icon
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Event Venue",
      content: eventLocation.venue,
      detail: eventLocation.address
    },
    {
      icon: (
        <i className="fab fa-whatsapp text-2xl text-[#25D366]"></i>
      ),
      title: "Contact Phone",
      content: "+234 703 679 0440, +447555684741",
      detail: "Mon-Fri, 9am-6pm WAT"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      content: "soundofrmsons@gmail.com",
      detail: "Response within 48h"
    }
  ];

  // Social media links (No Twitter, No Telegram) - Using Font Awesome
  const socialLinks = [
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/soundofrmsons', color: 'from-pink-500 to-purple-500' },
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/soundofrmsons', color: 'from-blue-600 to-blue-700' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/@soundofrmsons', color: 'from-red-500 to-red-600' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', url: 'https://wa.me/+2347036790440', color: 'from-green-500 to-green-600' }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "How do I get to the event venue?",
      answer: "The venue is located at Anetta Event Place, Plot 2016 Festac Link Road, beside Mobil Filling Station, Festac Town, Lagos. You can access it via public transportation (BRS buses) or private car. Parking is available on-site. We recommend using ride-hailing services like Uber or Bolt for convenience."
    },
    {
      question: "What are the event dates and times?",
      answer: "SORMS Lagos 2026 takes place on Friday 24 Saturday 25 July, 2026. Doors open at 8:00 AM WAT daily. The program runs from 9:00 AM to 6:00 PM."
    },
    {
      question: "Is accommodation available nearby?",
      answer: "Yes, there are several hotels and lodges within 5-10 minutes of the venue. We recommend booking early as accommodations fill up quickly during event season. Contact our team for partner hotel recommendations."
    },
    {
      question: "How quickly will I receive a response to my inquiry?",
      answer: "We aim to respond to all inquiries within 48 hours during business days (Monday-Friday). For urgent matters, please call our contact number."
    },
    {
      question: "Can I volunteer at the event?",
      answer: "Absolutely! We're always looking for dedicated volunteers. Visit our Volunteer page to submit an application. Opportunities are available in media, ushering, hospitality, logistics, and more."
    },
    {
      question: "Do you offer prayer request support?",
      answer: "Yes, our prayer team meets regularly and would be honored to pray with you. You can submit prayer requests through our contact form or Join our WhatsApp prayer group."
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Hero Section - Premium Dark */}
      <section ref={sectionRefs.hero} className="relative py-24 md:py-32 bg-[#0c0c0e] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.15),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent opacity-30"></div>
        </div>

        {/* Animated orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#a78bfa]/10 rounded-full blur-3xl animate-float-slow animation-delay-2000"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <div className={`flex items-center justify-center gap-2 text-xs text-[#6e6e73] mb-6 ${visibleSections.hero ? 'animate-reveal visible' : 'animate-reveal'}`}>
            <Link to="/" className="hover:text-[#a78bfa] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#a78bfa]">Contact</span>
          </div>

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 text-[#a78bfa] text-xs uppercase tracking-wider font-semibold mb-5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-4 py-2 rounded-full ${visibleSections.hero ? 'animate-reveal visible animation-delay-200' : 'animate-reveal'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse"></span>
            Get in Touch
          </div>

          {/* Headline */}
          <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight ${visibleSections.hero ? 'animate-reveal visible animation-delay-400' : 'animate-reveal'}`} 
              style={{ fontFamily: "'DM Serif Display', serif" }}>
            Let's <em className="italic text-[#a78bfa] not-italic">Connect</em>
          </h1>

          {/* Description */}
          <p className={`text-lg text-[#a1a1a6] mb-8 leading-relaxed max-w-2xl mx-auto ${visibleSections.hero ? 'animate-reveal visible animation-delay-600' : 'animate-reveal'}`}>
            Have questions about SORMS Lagos 2026, our events, or how to get involved? We'd love to hear from you. Reach out and our team will respond within 48 hours.
          </p>

          {/* Quick stats */}
          <div className={`grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12 pt-8 border-t border-white/10 ${visibleSections.hero ? 'animate-reveal visible animation-delay-800' : 'animate-reveal'}`}>
            <div className="text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="font-serif text-lg text-white">48h</div>
              <div className="text-xs text-[#6e6e73] uppercase tracking-wider mt-1">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🤝</div>
              <div className="font-serif text-lg text-white">24/7</div>
              <div className="text-xs text-[#6e6e73] uppercase tracking-wider mt-1">Prayer Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📍</div>
              <div className="font-serif text-lg text-white">Anetta</div>
              <div className="text-xs text-[#6e6e73] uppercase tracking-wider mt-1">Event Venue</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-[#f8f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left Column - Contact Form */}
            <div ref={sectionRefs.form} className={`bg-white rounded-2xl border border-black/5 shadow-xl relative overflow-hidden ${getAnimationClass('form', 200)}`}>
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-transparent"></div>
              
              <div className="p-8 md:p-10">
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#1d1d1f] mb-2">
                  Send us a Message
                </h2>
                <p className="text-sm text-[#86868b] mb-8">
                  Fill out the form below and we'll get back to you within 48 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Your Name <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                        Email Address <span className="text-[#7c3aed]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                      Subject <span className="text-[#7c3aed]">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Question about SORMS Lagos 2026"
                      className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[0.6rem] uppercase tracking-wider text-[#86868b] font-medium block mb-2">
                      Message <span className="text-[#7c3aed]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Your message here..."
                      className="w-full bg-[#f8f8fa] border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>

                {/* Quick response note */}
                <p className="text-xs text-[#86868b] mt-4 text-center">
                  We typically respond within 48 hours. For urgent matters, please call us.
                </p>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-6">
              {/* Contact Info Cards */}
              <div ref={sectionRefs.info} className={`grid gap-4 ${getAnimationClass('info', 400)}`}>
                {contactInfo.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1d1d1f] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#48484a]">{item.content}</p>
                      <p className="text-xs text-[#86868b] mt-1">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Office Hours Card */}
              <div ref={sectionRefs.hours} className={`bg-white rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all ${getAnimationClass('hours', 600)}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg font-normal text-[#1d1d1f]">Event Schedule</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-black/5">
                    <span className="text-sm font-medium text-[#1d1d1f]">Friday, July 24, 2026</span>
                    <span className="text-sm text-[#48484a]">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-black/5">
                    <span className="text-sm font-medium text-[#1d1d1f]">Saturday, July 25, 2026</span>
                    <span className="text-sm text-[#48484a]">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-[#1d1d1f]">Registration Opens</span>
                    <span className="text-sm text-[#48484a]">24/7 Daily</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-black/5">
                  <p className="text-xs text-[#86868b]">
                    * All times are West African Time (WAT, UTC+1)
                  </p>
                </div>
              </div>

              {/* Social Media Links - Updated with Font Awesome */}
              <div className={`bg-white rounded-xl p-6 border border-black/5 shadow-sm ${getAnimationClass('info', 800)}`}>
                <h3 className="font-serif text-lg font-normal text-[#1d1d1f] mb-4">Connect With Us</h3>
                <div className="grid grid-cols-4 gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg bg-[#f8f8fa] hover:bg-gradient-to-br hover:from-[#7c3aed]/5 hover:to-[#a78bfa]/5 transition-all group"
                    >
                      <i className={`${social.icon} text-2xl mb-1 group-hover:scale-110 transition-transform`} aria-hidden="true"></i>
                      <span className="text-xs text-[#86868b] group-hover:text-[#7c3aed]">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Map Section with Event Location */}
      <section ref={sectionRefs.map} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className={`text-center max-w-2xl mx-auto mb-16 ${getAnimationClass('map', 200)}`}>
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              Event Location
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              SORMS Lagos <em className="italic text-[#7c3aed] not-italic">2026 Venue</em>
            </h2>
            
          </div>

          {/* Map Card with Interactive Map */}
          <div className={`bg-white rounded-2xl border border-black/5 shadow-xl overflow-hidden ${getAnimationClass('map', 400)}`}>
            <div className="relative h-[500px] w-full">
              <MapContainer
                center={eventLocation.coordinates}
                zoom={15}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                scrollWheelZoom={true}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={eventLocation.coordinates} zoom={15} />
                <Marker position={eventLocation.coordinates} icon={sormsIcon}>
                  <Popup>
                    <div className="text-center p-2">
                      <strong className="text-[#7c3aed] block mb-1">{eventLocation.name}</strong>
                      <span className="text-sm block mb-1">{eventLocation.venue}</span>
                      <span className="text-xs text-gray-500 block">{eventLocation.address}</span>
                      <hr className="my-2" />
                      <p className="text-xs text-gray-600 max-w-[200px]">{eventLocation.description}</p>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${eventLocation.coordinates[0]},${eventLocation.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs text-[#7c3aed] hover:underline"
                      >
                        Get Directions →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            
            {/* Map Footer with Directions and Transport Info */}
            <div className="p-6 bg-[#f8f8fa] border-t border-black/5">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#86868b]">Parking Available</p>
                    <p className="text-sm font-medium text-[#1d1d1f]">On-site parking for 500+ vehicles</p>
                    <p className="text-xs text-[#86868b] mt-1">VIP and general parking sections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#86868b]">Ride-Hailing Services</p>
                    <p className="text-sm font-medium text-[#1d1d1f]">Uber, Bolt, and Taxify available</p>
                    <p className="text-xs text-[#86868b] mt-1">Designated pickup/drop-off zone</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-xs font-bold text-[#7c3aed]">🚌</div>
                    <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-xs font-bold text-[#7c3aed]">🚗</div>
                    <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-xs font-bold text-[#7c3aed]">🚕</div>
                  </div>
                  <p className="text-xs text-[#86868b]">Multiple transportation options available</p>
                </div>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${eventLocation.coordinates[0]},${eventLocation.coordinates[1]}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#7c3aed] hover:text-[#6d28d9] transition-colors inline-flex items-center gap-1 font-medium"
                >
                  Get Directions
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Nearby Hotels/Amenities */}
          <div className={`mt-8 grid md:grid-cols-3 gap-4 ${getAnimationClass('map', 600)}`}>
            <div className="bg-[#f8f8fa] rounded-xl p-4 border border-black/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏨</span>
                <h4 className="font-medium text-sm text-[#1d1d1f]">Nearby Hotels</h4>
              </div>
            </div>
            <div className="bg-[#f8f8fa] rounded-xl p-4 border border-black/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🍽️</span>
                <h4 className="font-medium text-sm text-[#1d1d1f]">Dining Options</h4>
              </div>
              <p className="text-xs text-[#86868b]">Multiple restaurants and cafes within walking distance</p>
            </div>
            <div className="bg-[#f8f8fa] rounded-xl p-4 border border-black/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🛡️</span>
                <h4 className="font-medium text-sm text-[#1d1d1f]">Security & Safety</h4>
              </div>
              <p className="text-xs text-[#86868b]">24/7 security, CCTV surveillance, medical team on-site</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#f8f8fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5">
              FAQ
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#1d1d1f] mb-4" 
                style={{ fontFamily: "'DM Serif Display', serif" }}>
              Frequently Asked <em className="italic text-[#7c3aed] not-italic">Questions</em>
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-[#1d1d1f] mb-2 flex items-start gap-3">
                  <span className="text-[#7c3aed] text-lg">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-sm text-[#48484a] pl-7">
                  <span className="text-[#7c3aed] font-medium mr-2">A:</span>
                  {faq.answer}
                </p>
              </div>
            ))}
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
          <h3 className="font-serif text-2xl font-normal text-white mb-3">Can't wait to connect?</h3>
          <p className="text-sm text-[#a1a1a6] mb-6">Join our community channels for instant updates and support.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://wa.me/+2347036790440"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-[#25D366] text-white rounded-full text-sm font-semibold hover:bg-[#20b859] transition-all inline-flex items-center gap-2"
            >
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
            <a 
              href="https://instagram.com/soundofrmsons"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-white/20 text-white rounded-full text-sm font-medium hover:border-white/40 transition-all inline-flex items-center gap-2"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
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
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-100 { transition-delay: 0.1s; }
        .animation-delay-200 { transition-delay: 0.2s; }
        .animation-delay-300 { transition-delay: 0.3s; }
        .animation-delay-400 { transition-delay: 0.4s; }
        .animation-delay-500 { transition-delay: 0.5s; }
        .animation-delay-600 { transition-delay: 0.6s; }
        .animation-delay-700 { transition-delay: 0.7s; }
        .animation-delay-800 { transition-delay: 0.8s; }
        
        /* Leaflet map styles */
        .leaflet-container {
          z-index: 10;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        
        .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;