// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getAllContacts,
  getAllVolunteerApplications,
  getAllCommunityApplications,
  getAllRegistrations,
  getAllSubscribers,
  getAllUsers,
  getEmailLogs,
  getRecentLoginActivity,
  updateContact,
  updateVolunteerApplication,
  updateCommunityApplication,
  deleteContact,
  deleteVolunteerApplication,
  deleteCommunityApplication,
  sendYouTubeReminder,
  exportToCSV,
  downloadCSV,
  isUserAdmin,
  logoutUser
} from '../firebase';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});
  const [dashboardStats, setDashboardStats] = useState({
    totalContacts: 0,
    totalVolunteers: 0,
    totalCommunity: 0,
    totalSubscribers: 0,
    recentActivity: []
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    contacts: 0,
    volunteers: 0,
    community: 0,
    subscribers: 0
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    youtubeLink: 'https://youtube.com/@soundofrmsons/live',
    date: '',
    time: '8:00 PM WAT',
    speaker: 'Joshua Nwaeze',
    description: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'purple', mobileIcon: '🏠' },
    { id: 'contacts', label: 'Contacts', icon: '📧', color: 'blue', mobileIcon: '✉️' },
    { id: 'volunteers', label: 'Volunteers', icon: '🤝', color: 'green', mobileIcon: '🙋' },
    { id: 'community', label: 'Community Apps', icon: '👥', color: 'purple', mobileIcon: '👥' },
    { id: 'summits', label: 'Summit Regs', icon: '🎯', color: 'orange', mobileIcon: '🎯' },
    { id: 'subscribers', label: 'Subscribers', icon: '📬', color: 'cyan', mobileIcon: '📬' },
    { id: 'users', label: 'Users', icon: '👤', color: 'gray', mobileIcon: '👤' },
    { id: 'email_logs', label: 'Email Logs', icon: '📨', color: 'red', mobileIcon: '📨' },
    { id: 'login_history', label: 'Login History', icon: '🔐', color: 'yellow', mobileIcon: '🔐' }
  ];

  // Hide footer and other site elements when admin page loads
  useEffect(() => {
    const footer = document.querySelector('footer');
    const announceBar = document.querySelector('.announce-strip');
    const mainNav = document.querySelector('nav:not(.admin-nav)');
    const heroSection = document.querySelector('#hero');
    const pageHome = document.querySelector('#page-home');
    
    if (footer) footer.style.display = 'none';
    if (announceBar) announceBar.style.display = 'none';
    if (mainNav) mainNav.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';
    if (pageHome) pageHome.style.display = 'none';
    
    document.body.classList.add('admin-active');
    document.body.style.overflow = 'auto';
    
    return () => {
      if (footer) footer.style.display = '';
      if (announceBar) announceBar.style.display = '';
      if (mainNav) mainNav.style.display = '';
      if (heroSection) heroSection.style.display = '';
      if (pageHome) pageHome.style.display = '';
      document.body.classList.remove('admin-active');
    };
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Animate numbers on dashboard load
  useEffect(() => {
    if (dashboardStats.totalContacts > 0) {
      const duration = 1000;
      const step = 16;
      const steps = duration / step;
      
      const animateValue = (start, end, setter) => {
        let current = start;
        const increment = (end - start) / steps;
        const interval = setInterval(() => {
          current += increment;
          if (current >= end) {
            setter(end);
            clearInterval(interval);
          } else {
            setter(Math.floor(current));
          }
        }, step);
        return interval;
      };
      
      const intervals = [
        animateValue(0, dashboardStats.totalContacts, (val) => setAnimatedStats(prev => ({ ...prev, contacts: val }))),
        animateValue(0, dashboardStats.totalVolunteers, (val) => setAnimatedStats(prev => ({ ...prev, volunteers: val }))),
        animateValue(0, dashboardStats.totalCommunity, (val) => setAnimatedStats(prev => ({ ...prev, community: val }))),
        animateValue(0, dashboardStats.totalSubscribers, (val) => setAnimatedStats(prev => ({ ...prev, subscribers: val })))
      ];
      
      return () => intervals.forEach(interval => clearInterval(interval));
    }
  }, [dashboardStats]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/admin/login');
        setCheckingAuth(false);
        return;
      }
      
      const isAdmin = await isUserAdmin(user.uid);
      if (!isAdmin) {
        await logoutUser();
        navigate('/admin/login');
        showNotificationMessage('Access denied. Admin privileges required.', 'error');
      } else {
        loadDashboardStats();
        if (activeTab !== 'dashboard') {
          loadData(activeTab);
        }
      }
      setCheckingAuth(false);
    };
    
    checkAdmin();
  }, [user, navigate]);

  useEffect(() => {
    if (user && activeTab === 'dashboard') {
      loadDashboardStats();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab !== 'dashboard') {
      loadData(activeTab);
    }
  }, [activeTab]);

  const showNotificationMessage = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const [contacts, volunteers, community, subscribers, users, registrations, loginHistory] = await Promise.all([
        getAllContacts(100),
        getAllVolunteerApplications(),
        getAllCommunityApplications(100),
        getAllSubscribers(),
        getAllUsers(),
        getAllRegistrations(),
        getRecentLoginActivity(10)
      ]);

      setDashboardStats({
        totalContacts: contacts.length,
        totalVolunteers: volunteers.length,
        totalCommunity: community.length,
        totalSubscribers: subscribers.length,
        totalUsers: users.length,
        totalSummits: registrations.length,
        recentActivity: loginHistory.slice(0, 5)
      });

      setStats({
        contacts: { total: contacts.length, new: contacts.filter(c => c.status === 'new').length },
        volunteers: { total: volunteers.length, pending: volunteers.filter(v => v.status === 'pending').length },
        community: { total: community.length, pending: community.filter(c => c.status === 'pending').length },
        subscribers: { total: subscribers.length },
        users: { total: users.length, admin: users.filter(u => u.role === 'admin').length },
        summits: { total: registrations.length },
        emailLogs: { total: 0 },
        loginHistory: { total: loginHistory.length }
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (tab) => {
    setLoading(true);
    try {
      let result = [];
      let statsData = {};
      
      switch (tab) {
        case 'contacts':
          result = await getAllContacts(500);
          statsData = {
            total: result.length,
            new: result.filter(i => i.status === 'new').length,
            read: result.filter(i => i.status === 'read').length,
            responded: result.filter(i => i.status === 'responded').length
          };
          break;
        case 'volunteers':
          result = await getAllVolunteerApplications();
          statsData = {
            total: result.length,
            pending: result.filter(i => i.status === 'pending').length,
            approved: result.filter(i => i.status === 'approved').length,
            rejected: result.filter(i => i.status === 'rejected').length
          };
          break;
        case 'community':
          result = await getAllCommunityApplications(500);
          statsData = {
            total: result.length,
            pending: result.filter(i => i.status === 'pending').length,
            approved: result.filter(i => i.status === 'approved').length,
            rejected: result.filter(i => i.status === 'rejected').length
          };
          break;
        case 'summits':
          result = await getAllRegistrations();
          statsData = { total: result.length };
          break;
        case 'subscribers':
          result = await getAllSubscribers();
          statsData = { total: result.length, active: result.filter(i => i.status === 'active').length };
          break;
        case 'users':
          result = await getAllUsers();
          statsData = { total: result.length, admin: result.filter(u => u.role === 'admin').length };
          break;
        case 'email_logs':
          result = await getEmailLogs(200);
          statsData = { total: result.length, sent: result.filter(i => i.status === 'sent').length };
          break;
        case 'login_history':
          result = await getRecentLoginActivity(200);
          statsData = { total: result.length, successful: result.filter(i => i.success === true).length };
          break;
        default:
          result = [];
      }
      
      setData(result);
      setStats(prev => ({ ...prev, [tab]: statsData }));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotificationMessage(`Error loading ${tab} data`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return Object.values(item).some(value => {
      if (typeof value === 'string') return value.toLowerCase().includes(search);
      if (typeof value === 'number') return value.toString().includes(search);
      if (Array.isArray(value)) return value.some(v => String(v).toLowerCase().includes(search));
      return false;
    });
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      switch (activeTab) {
        case 'contacts': await updateContact(id, { status: newStatus }); break;
        case 'volunteers': await updateVolunteerApplication(id, { status: newStatus }); break;
        case 'community': await updateCommunityApplication(id, { status: newStatus }); break;
        default: return;
      }
      await loadData(activeTab);
      showNotificationMessage(`Status updated to ${newStatus}`, 'success');
    } catch (error) {
      showNotificationMessage('Error updating status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this item? This action cannot be undone.')) return;
    try {
      switch (activeTab) {
        case 'contacts': await deleteContact(id); break;
        case 'volunteers': await deleteVolunteerApplication(id); break;
        case 'community': await deleteCommunityApplication(id); break;
        default: return;
      }
      await loadData(activeTab);
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      showNotificationMessage('Item deleted successfully', 'success');
    } catch (error) {
      showNotificationMessage('Error deleting item', 'error');
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) setSelectedItems([]);
    else setSelectedItems(filteredData.map(item => item.id));
  };

  const handleSelect = (id) => {
    if (selectedItems.includes(id)) setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    else setSelectedItems([...selectedItems, id]);
  };

  const getSelectedEmails = () => {
    const selected = data.filter(item => selectedItems.includes(item.id));
    return selected.map(item => item.email).filter(email => email);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const selectedEmails = getSelectedEmails();
    if (selectedEmails.length === 0) {
      showNotificationMessage('Please select at least one recipient', 'error');
      return;
    }
    if (!emailData.subject || !emailData.date) {
      showNotificationMessage('Please fill in all required fields', 'error');
      return;
    }
    
    setSendingEmail(true);
    try {
      await sendYouTubeReminder(selectedEmails, {
        title: emailData.subject,
        date: emailData.date,
        time: emailData.time,
        speaker: emailData.speaker,
        description: emailData.description,
        youtubeLink: emailData.youtubeLink
      });
      showNotificationMessage(`Email sent to ${selectedEmails.length} recipients`, 'success');
      setShowEmailModal(false);
      setEmailData({ subject: '', youtubeLink: 'https://youtube.com/@soundofrmsons/live', date: '', time: '8:00 PM WAT', speaker: 'Joshua Nwaeze', description: '' });
    } catch (error) {
      showNotificationMessage('Error sending emails', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleExport = () => {
    const csv = exportToCSV(filteredData);
    downloadCSV(csv, `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    showNotificationMessage(`Exported ${filteredData.length} records`, 'success');
  };

  const renderTableHeaders = () => {
    const headers = {
      contacts: ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date', 'Actions'],
      volunteers: ['Name', 'Email', 'Phone', 'Team', 'Status', 'Date', 'Actions'],
      community: ['Name', 'Email', 'Phone', 'Location', 'Interests', 'Status', 'Date', 'Actions'],
      subscribers: ['Email', 'Source', 'Status', 'Date', 'Actions'],
      users: ['Email', 'Role', 'Created', 'Last Login'],
      email_logs: ['Subject', 'Recipients', 'Status', 'Sent By', 'Date'],
      login_history: ['User ID', 'Status', 'Method', 'Date']
    };
    return headers[activeTab]?.map((header, idx) => (
      <th key={idx} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#6e6e73] whitespace-nowrap">
        {header}
      </th>
    ));
  };

  const renderRowContent = (item) => {
    switch (activeTab) {
      case 'contacts':
        return (
          <>
            <td className="px-4 py-3 text-sm text-[#1d1d1f] font-medium whitespace-nowrap">{item.name || 'N/A'}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] whitespace-nowrap">{item.email}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] max-w-[150px] truncate">{item.subject || 'N/A'}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] max-w-[200px] truncate">{item.message?.substring(0, 50)}</td>
            <td className="px-4 py-3">
              <select 
                value={item.status || 'new'} 
                onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  item.status === 'responded' ? 'bg-green-100 text-green-700 border-green-200' :
                  item.status === 'read' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                } border focus:outline-none`}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
            </td>
            <td className="px-4 py-3 text-sm text-[#86868b] whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewDetails(item)} 
                  className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                  title="View Details"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </>
        );
      case 'volunteers':
        return (
          <>
            <td className="px-4 py-3 text-sm text-[#1d1d1f] font-medium whitespace-nowrap">{item.fullName || `${item.firstName} ${item.lastName}`}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] whitespace-nowrap">{item.email}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] whitespace-nowrap">{item.phone}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] max-w-[120px] truncate">{item.team || item.departmentPreferences?.join(', ')}</td>
            <td className="px-4 py-3">
              <select 
                value={item.status || 'pending'} 
                onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  item.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                  item.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                } border focus:outline-none`}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </td>
            <td className="px-4 py-3 text-sm text-[#86868b] whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all hover:scale-110" title="View Details">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all hover:scale-110" title="Delete">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </>
        );
      case 'community':
        return (
          <>
            <td className="px-4 py-3 text-sm text-[#1d1d1f] font-medium whitespace-nowrap">{`${item.firstName || ''} ${item.lastName || ''}`.trim()}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] whitespace-nowrap">{item.email}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] whitespace-nowrap">{item.phone}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] whitespace-nowrap">{`${item.city || ''}, ${item.country || ''}`}</td>
            <td className="px-4 py-3 text-sm text-[#48484a] max-w-[120px] truncate">{(item.interests || []).slice(0, 2).join(', ')}</td>
            <td className="px-4 py-3">
              <select 
                value={item.status || 'pending'} 
                onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  item.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                  item.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                } border focus:outline-none`}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </td>
            <td className="px-4 py-3 text-sm text-[#86868b] whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all hover:scale-110" title="View Details">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all hover:scale-110" title="Delete">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </>
        );
      case 'subscribers':
        return (
          <>
            <td className="px-4 py-3 text-sm text-[#1d1d1f]">{item.email}</td>
            <td className="px-4 py-3 text-sm text-[#48484a]">{item.source || 'Website'}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {item.status || 'active'}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-[#86868b] whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td className="px-4 py-3">
              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </>
        );
      default:
        return null;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c0c0e] to-[#1a1a1f] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-4 animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] to-[#f1f3f8]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-black/5 z-40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <svg className="w-6 h-6 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="font-semibold text-[#1d1d1f]">GKCGA Admin</span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-[#1d1d1f]">GKCGA Portal</h2>
                  <p className="text-xs text-[#86868b]">Administrator</p>
                </div>
              </div>
            </div>
            <div className="py-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-[#7c3aed]/10 to-transparent border-l-3 border-[#7c3aed] text-[#7c3aed]'
                      : 'text-[#48484a] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.mobileIcon || item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                  {stats[item.id]?.total > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {stats[item.id]?.total}
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-black/5 mt-4 pt-4 px-6">
                <button 
                  onClick={() => logoutUser()} 
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:block fixed left-0 top-0 h-full transition-all duration-500 ease-in-out z-30 flex flex-col ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0c0c0e] to-[#0f0f12]"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124,58,237,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Logo Area */}
        <div className={`relative h-20 flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-6'} border-b border-white/10`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-xl blur-md opacity-40 animate-pulse-slow"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-white font-serif text-lg font-semibold tracking-tight">GKCGA</h1>
                <p className="text-[#a78bfa] text-[10px] uppercase tracking-wider">Administrative Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 py-8 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#7c3aed]/20 to-transparent border-l-3 border-[#7c3aed] text-white'
                  : 'text-[#a1a1a6] hover:bg-white/5 hover:text-white'
              } ${sidebarCollapsed ? 'justify-center' : 'px-6'}`}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7c3aed] to-[#a78bfa] rounded-full animate-slide-down"></div>
              )}
              <div className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? 'text-[#a78bfa]' : ''}`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {stats[item.id]?.total > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/70">
                      {stats[item.id]?.total}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="relative p-4 border-t border-white/10">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-3 transition-all duration-300 hover:bg-white/5 rounded-xl p-2 w-full ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg">
                <span className="text-white font-medium text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c0c0e] animate-pulse"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <p className="text-xs text-[#a78bfa]">Super Administrator</p>
              </div>
            )}
          </button>
          
          {showUserMenu && !sidebarCollapsed && (
            <div className="absolute bottom-16 left-4 right-4 bg-[#161618] rounded-xl border border-white/10 shadow-xl overflow-hidden animate-slide-up">
              <button 
                onClick={() => logoutUser()} 
                className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-28 w-6 h-6 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
        >
          <svg className={`w-3 h-3 text-[#1d1d1f] transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-500 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'} pt-16 lg:pt-0`}>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-20 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-serif font-semibold text-[#1d1d1f]">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-[#86868b] mt-0.5 hidden sm:block">
                  {activeTab === 'dashboard' ? 'Overview and statistics' : `Manage ${menuItems.find(item => item.id === activeTab)?.label?.toLowerCase()}`}
                </p>
              </div>
            </div>
            
            <div className="text-left sm:text-right">
              <p className="text-xs text-[#86868b]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <p className="text-xs font-medium text-[#7c3aed]">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' ? (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa] p-6 sm:p-8 text-white shadow-xl animate-slide-in-up">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-xl sm:text-2xl">👋</span>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-normal">Welcome back, {user?.email?.split('@')[0]}</h2>
                      <p className="text-white/80 text-xs sm:text-sm mt-1">Here's what's happening with your kingdom community today</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: 'Total Contacts', value: animatedStats.contacts, total: dashboardStats.totalContacts, icon: '📧', color: 'from-blue-500 to-blue-600', change: '+12%' },
                  { label: 'Volunteers', value: animatedStats.volunteers, total: dashboardStats.totalVolunteers, icon: '🤝', color: 'from-emerald-500 to-emerald-600', change: '+8%' },
                  { label: 'Community Apps', value: animatedStats.community, total: dashboardStats.totalCommunity, icon: '👥', color: 'from-purple-500 to-purple-600', change: '+23%' },
                  { label: 'Subscribers', value: animatedStats.subscribers, total: dashboardStats.totalSubscribers, icon: '📬', color: 'from-cyan-500 to-cyan-600', change: '+5%' }
                ].map((stat, idx) => (
                  <div key={idx} className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in-up">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <span className="text-white text-lg sm:text-xl">{stat.icon}</span>
                      </div>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">{stat.change}</span>
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1d1d1f] mb-1 font-serif">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-[#86868b]">{stat.label}</div>
                    <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`} style={{ width: `${(stat.value / (stat.total || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-black/5 shadow-sm hover:shadow-md transition-all animate-slide-in-up">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <span className="text-lg sm:text-xl">📊</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg">Quick Statistics</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: 'Summit Registrations', value: dashboardStats.totalSummits, icon: '🎯' },
                      { label: 'Total Users', value: dashboardStats.totalUsers, icon: '👤' },
                      { label: 'Pending Contacts', value: stats.contacts?.new || 0, icon: '⏳' },
                      { label: 'Pending Volunteers', value: stats.volunteers?.pending || 0, icon: '⏳' }
                    ].map((stat, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 sm:py-3 border-b border-black/5 last:border-0 group hover:translate-x-1 transition-all">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl">{stat.icon}</span>
                          <span className="text-xs sm:text-sm text-[#48484a]">{stat.label}</span>
                        </div>
                        <span className="text-base sm:text-lg font-semibold text-[#1d1d1f] group-hover:text-[#7c3aed] transition-colors">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-black/5 shadow-sm hover:shadow-md transition-all animate-slide-in-up">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <span className="text-lg sm:text-xl">🔄</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg">Recent Activity</h3>
                  </div>
                  <div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
                    {dashboardStats.recentActivity.length > 0 ? (
                      dashboardStats.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-3 py-2 border-b border-black/5 last:border-0 animate-fade-in">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${activity.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {activity.success ? '✓' : '✗'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#48484a] font-mono truncate">User {activity.userId?.substring(0, 8)}...</p>
                            <p className="text-[0.6rem] sm:text-[0.7rem] text-[#86868b] truncate">{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}</p>
                          </div>
                          <div className={`text-[0.6rem] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${activity.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {activity.success ? 'Success' : 'Failed'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-[#86868b] py-6 sm:py-8 text-sm">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              {/* Stats Cards - Responsive */}
              {stats[activeTab] && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {Object.entries(stats[activeTab]).map(([key, value], idx) => (
                    key !== 'total' && (
                      <div key={key} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 border border-black/5 shadow-sm hover:shadow-md transition-all animate-slide-in-up">
                        <div className="text-2xl sm:text-3xl mb-2">
                          {key === 'new' && '🆕'}
                          {key === 'read' && '👁️'}
                          {key === 'responded' && '✅'}
                          {key === 'pending' && '⏳'}
                          {key === 'approved' && '✓'}
                          {key === 'rejected' && '❌'}
                          {key === 'active' && '🟢'}
                          {key === 'admin' && '👑'}
                          {key === 'sent' && '📤'}
                          {key === 'successful' && '✅'}
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">{value}</div>
                        <div className="text-[0.65rem] sm:text-xs text-[#86868b] capitalize mt-1">{key}</div>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Toolbar - Responsive */}
              <div className="bg-white rounded-xl border border-black/5 shadow-sm p-3 sm:p-4 animate-slide-in-up">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Search records..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all" 
                    />
                    <svg className="absolute left-3 top-3 w-4 h-4 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExport} 
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 bg-[#f8f8fa] border border-black/10 rounded-xl text-sm font-medium hover:bg-[#e5e5e5] transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Export CSV</span>
                      <span className="sm:hidden">Export</span>
                    </button>
                    {activeTab !== 'users' && activeTab !== 'email_logs' && activeTab !== 'login_history' && activeTab !== 'subscribers' && (
                      <button 
                        onClick={() => setShowEmailModal(true)} 
                        disabled={selectedItems.length === 0}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">Send Invite ({selectedItems.length})</span>
                        <span className="sm:hidden">Send ({selectedItems.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Table - Responsive with horizontal scroll */}
              <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden animate-slide-in-up">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-[#f8f8fa] border-b border-black/5">
                      <tr>
                        <th className="px-4 py-3 text-left w-10">
                          <input 
                            type="checkbox" 
                            checked={selectedItems.length === filteredData.length && filteredData.length > 0} 
                            onChange={handleSelectAll} 
                            className="w-4 h-4 accent-[#7c3aed] cursor-pointer" 
                          />
                        </th>
                        {renderTableHeaders()}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {loading ? (
                        <tr>
                          <td colSpan="10" className="px-4 py-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c3aed]"></div>
                          </td>
                        </tr>
                      ) : filteredData.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="px-4 py-12 text-center text-[#86868b]">
                            No records found
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-[#f8f8fa] transition-colors group animate-fade-in">
                            <td className="px-4 py-3">
                              <input 
                                type="checkbox" 
                                checked={selectedItems.includes(item.id)} 
                                onChange={() => handleSelect(item.id)} 
                                className="w-4 h-4 accent-[#7c3aed] cursor-pointer" 
                              />
                            </td>
                            {renderRowContent(item)}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-sm text-[#86868b] text-center animate-fade-in">
                Showing {filteredData.length} of {data.length} records
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Notification Toast - Responsive */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 sm:top-6 sm:right-6 z-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium animate-slide-in-right ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <span>✓</span>}
            {notification.type === 'error' && <span>⚠️</span>}
            {notification.type === 'info' && <span>ℹ️</span>}
            {notification.message}
          </div>
        </div>
      )}

      {/* View Details Modal - Responsive */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-[95%] sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in-up">
            <div className="sticky top-0 p-4 sm:p-6 border-b border-black/5 flex justify-between items-center bg-white rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl">Record Details</h2>
                  <p className="text-[0.65rem] sm:text-xs text-[#86868b]">Detailed information about this record</p>
                </div>
              </div>
              <button 
                onClick={() => setShowViewModal(false)} 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(selectedItem).map(([key, value]) => (
                  key !== 'id' && key !== '_init' && (
                    <div key={key} className="border-b border-black/5 pb-2">
                      <label className="text-[0.6rem] sm:text-xs uppercase tracking-wider text-[#7c3aed] font-medium block mb-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <p className="text-xs sm:text-sm text-[#1d1d1f] break-words">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : (value || 'N/A')}
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-black/5 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button 
                onClick={() => setShowViewModal(false)} 
                className="px-4 py-2 border border-black/10 rounded-xl text-sm font-medium hover:bg-[#f8f8fa] transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  handleDelete(selectedItem.id);
                }} 
                className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal - Responsive */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-[95%] sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in-up">
            <div className="sticky top-0 p-4 sm:p-6 border-b border-black/5 flex justify-between items-center bg-white rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl">Send YouTube Live Invitation</h2>
                  <p className="text-[0.65rem] sm:text-xs text-[#86868b]">Broadcast to {selectedItems.length} selected recipients</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmailModal(false)} 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[#86868b] font-medium block mb-2">YouTube Live Title *</label>
                <input 
                  type="text" 
                  value={emailData.subject} 
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} 
                  placeholder="e.g., Global Bible Study with Joshua Nwaeze" 
                  className="w-full border border-black/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all" 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[#86868b] font-medium block mb-2">Date *</label>
                  <input 
                    type="date" 
                    value={emailData.date} 
                    onChange={(e) => setEmailData({ ...emailData, date: e.target.value })} 
                    className="w-full border border-black/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#7c3aed]" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[#86868b] font-medium block mb-2">Time</label>
                  <input 
                    type="text" 
                    value={emailData.time} 
                    onChange={(e) => setEmailData({ ...emailData, time: e.target.value })} 
                    placeholder="8:00 PM WAT" 
                    className="w-full border border-black/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#7c3aed]" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[#86868b] font-medium block mb-2">Speaker</label>
                <input 
                  type="text" 
                  value={emailData.speaker} 
                  onChange={(e) => setEmailData({ ...emailData, speaker: e.target.value })} 
                  placeholder="Joshua Nwaeze" 
                  className="w-full border border-black/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#7c3aed]" 
                />
              </div>
              <div>
                <label className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[#86868b] font-medium block mb-2">YouTube Link</label>
                <input 
                  type="url" 
                  value={emailData.youtubeLink} 
                  onChange={(e) => setEmailData({ ...emailData, youtubeLink: e.target.value })} 
                  placeholder="https://youtube.com/@soundofrmsons/live" 
                  className="w-full border border-black/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#7c3aed]" 
                />
              </div>
              <div>
                <label className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[#86868b] font-medium block mb-2">Description</label>
                <textarea 
                  value={emailData.description} 
                  onChange={(e) => setEmailData({ ...emailData, description: e.target.value })} 
                  rows="3" 
                  placeholder="Join us for a powerful time of worship, teaching, and prayer..." 
                  className="w-full border border-black/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#7c3aed] resize-none" 
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEmailModal(false)} 
                  className="order-2 sm:order-1 px-4 py-3 border border-black/10 text-[#48484a] rounded-xl text-sm font-medium hover:bg-[#f8f8fa] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={sendingEmail} 
                  className="order-1 sm:order-2 px-4 py-3 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {sendingEmail ? 'Sending...' : 'Send Invitations'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        .animate-slide-in-up { animation: slide-in-up 0.5s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.2s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        .border-l-3 { border-left-width: 3px; }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;