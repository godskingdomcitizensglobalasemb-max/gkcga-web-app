// src/pages/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';
import {
  User,
  Users,
  Target,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Circle,
  Star,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Heart,
  Briefcase,
  ChevronRight,
  Download,
  Video,
  FileText,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Plus,
  MoreHorizontal,
  PlayCircle,
  Bookmark,
  Share2,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

const UserDashboardPage = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      const response = await new Promise(resolve => setTimeout(() => resolve({
        progress: {
          level: 2,
          totalLevels: 4,
          percentage: 35,
          completedBenefits: 5,
          totalBenefits: 15,
          currentTrack: 'Development'
        },
        track: [
          { id: 1, name: 'Foundation', benefits: '1-5', status: 'completed', progress: 100 },
          { id: 2, name: 'Development', benefits: '6-9', status: 'in-progress', progress: 50 },
          { id: 3, name: 'Influence', benefits: '10-13', status: 'locked', progress: 0 },
          { id: 4, name: 'Leadership', benefits: '14-15', status: 'locked', progress: 0 }
        ],
        network: [
          { 
            id: 1, 
            name: 'John Mentor', 
            role: 'Mentor', 
            expertise: 'Software Development',
            avatar: null,
            status: 'online',
            lastActive: '5 min ago'
          },
          { 
            id: 2, 
            name: 'Sarah Builder', 
            role: 'Peer', 
            expertise: 'Digital Marketing',
            avatar: null,
            status: 'offline',
            lastActive: '2 hours ago'
          },
          { 
            id: 3, 
            name: 'Michael Chen', 
            role: 'Mentor', 
            expertise: 'Business Strategy',
            avatar: null,
            status: 'online',
            lastActive: 'Just now'
          }
        ],
        opportunities: [
          {
            id: 1,
            title: 'Tech Project - Looking for developers',
            type: 'project',
            date: '2024-02-15',
            participants: 5,
            deadline: '3 days left'
          },
          {
            id: 2,
            title: 'Mentorship Session with John',
            type: 'session',
            date: '2024-02-10T15:00:00',
            duration: '1 hour'
          },
          {
            id: 3,
            title: 'Leadership Workshop',
            type: 'workshop',
            date: '2024-02-20',
            attendees: 25
          },
          {
            id: 4,
            title: 'Networking Event - Tech Meetup',
            type: 'event',
            date: '2024-02-25',
            attendees: 50
          }
        ],
        resources: [
          { id: 1, title: 'Leadership Manual', type: 'pdf', size: '2.5 MB', downloads: 150 },
          { id: 2, title: 'Sphere Development Guide', type: 'pdf', size: '1.8 MB', downloads: 89 },
          { id: 3, title: 'Training Video Series', type: 'video', duration: '45 min', views: 234 },
          { id: 4, title: 'Goal Setting Worksheet', type: 'template', size: '0.5 MB', downloads: 67 }
        ],
        achievements: [
          { id: 1, name: 'Quick Starter', description: 'Completed first benefit', date: '2024-01-15' },
          { id: 2, name: 'Network Builder', description: 'Connected with 5 members', date: '2024-01-20' },
          { id: 3, name: 'Goal Getter', description: 'Set first quarterly goal', date: '2024-01-25' }
        ],
        upcomingEvents: [
          { id: 1, title: 'Mentor Call with John', date: 'Today, 3:00 PM', type: 'call' },
          { id: 2, title: 'Weekly Group Meeting', date: 'Tomorrow, 10:00 AM', type: 'meeting' },
          { id: 3, title: 'Workshop: Leadership Skills', date: 'Feb 15, 2:00 PM', type: 'workshop' }
        ],
        stats: {
          benefitsCompleted: 5,
          connections: 12,
          hoursLearned: 24,
          certificatesEarned: 2
        }
      })), 1000);
      
      setDashboardData(response);
    } catch (error) {
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Logged out successfully', 'success');
    } catch (error) {
      showNotification('Failed to logout', 'error');
    }
  };

  const handleQuickAction = (action) => {
    showNotification(`${action} feature coming soon!`, 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dominion Builders
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              
              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name || 'User'}
                  </span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Builder'}!
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Here's your progress and opportunities for today
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" onClick={() => handleQuickAction('Share')}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleQuickAction('Quick Update')}>
                <Plus className="h-4 w-4 mr-2" />
                Quick Update
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Benefits Completed</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.benefitsCompleted}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Network Connections</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.connections}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hours Learned</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.hoursLearned}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.certificatesEarned}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Journey</h2>
                  <p className="text-indigo-100">Sphere: {user?.sphere || 'Technology'}</p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-300" />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Level {dashboardData?.progress.level} of {dashboardData?.progress.totalLevels}</span>
                  <span>{dashboardData?.progress.percentage}% Complete</span>
                </div>
                <div className="h-3 bg-indigo-400 bg-opacity-30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${dashboardData?.progress.percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span>{dashboardData?.progress.completedBenefits} of {dashboardData?.progress.totalBenefits} Benefits</span>
                </div>
                <button className="flex items-center space-x-1 text-yellow-300 hover:text-yellow-200">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* My Track Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">My Track</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              
              <div className="space-y-4">
                {dashboardData?.track.map((track) => (
                  <div key={track.id} className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      track.status === 'completed' ? 'bg-green-100' :
                      track.status === 'in-progress' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {track.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : track.status === 'in-progress' ? (
                        <span className="text-sm font-semibold text-blue-600">{track.id}</span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-400">{track.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${
                          track.status === 'locked' ? 'text-gray-400' : 'text-gray-900'
                        }`}>
                          {track.name} (Benefits {track.benefits})
                        </p>
                        {track.status === 'in-progress' && (
                          <span className="text-xs text-blue-600 font-medium">{track.progress}%</span>
                        )}
                      </div>
                      {track.status === 'in-progress' && (
                        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${track.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Opportunities</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">Browse All</button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {dashboardData?.opportunities.map((opp) => (
                  <div key={opp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        opp.type === 'project' ? 'bg-purple-100 text-purple-700' :
                        opp.type === 'session' ? 'bg-green-100 text-green-700' :
                        opp.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{opp.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {opp.deadline || opp.date}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{opp.participants || opp.attendees || 0} participating</span>
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {dashboardData?.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2">
                  View Calendar
                </button>
              </div>
            </div>

            {/* My Network */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">My Network</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              
              <div className="space-y-4">
                {dashboardData?.network.map((person) => (
                  <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {person.name.charAt(0)}
                        </div>
                        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                          person.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                        }`}></span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.role} • {person.expertise}</p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Resources</h3>
              <div className="space-y-3">
                {dashboardData?.resources.slice(0, 3).map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {resource.type === 'pdf' ? (
                        <FileText className="h-5 w-5 text-red-500" />
                      ) : resource.type === 'video' ? (
                        <Video className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                        <p className="text-xs text-gray-500">
                          {resource.type === 'video' ? resource.duration : resource.size}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-4">
                Browse Resource Library
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {dashboardData?.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;