// Updated src/App.js with CacheProvider
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { CacheProvider } from './context/CacheContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import GkcgaPage from './pages/GkcgaPage';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PillarsPage from './pages/PillarsPage';
import SpheresPage from './pages/SpheresPage';
import BenefitsPage from './pages/BenefitsPage';
import MentorshipPage from './pages/MentorshipPage';
import ProjectsPage from './pages/ProjectsPage';
import EventsPage from './pages/EventsPage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import OnboardingPage from './pages/OnboardingPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Dashboard Pages
import UserDashboardPage from './pages/UserDashboardPage';
import ProfilePage from './pages/ProfilePage';
import VirtualSummitsPage from './pages/VirtualSummitsPage';
import VolunteerPage from './pages/VolunteerPage';
import WatchLivePage from './pages/WatchLivePage';
import CommunityPage from './pages/CommunityPage';
import JoinSormsPage from './pages/JoinSormsPage';
import TicketsPage from './pages/TicketsPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminSetupPage from './pages/AdminSetupPage';
import PaymentPage from './pages/PaymentPage';

// Legal Pages
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CacheProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Admin Auth Routes - NO LAYOUT (standalone pages) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/setup" element={<AdminSetupPage />} />
                
                {/* Admin Dashboard Routes - Protected */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />

                {/* Public Routes with MainLayout */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="virtual-summits" element={<VirtualSummitsPage />} />
                  <Route path="volunteer" element={<VolunteerPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="pillars" element={<PillarsPage />} />
                  <Route path="watchlive" element={<WatchLivePage />} />
                  <Route path="community" element={<CommunityPage />} />
                  <Route path="spheres" element={<SpheresPage />} />
                  <Route path="benefits" element={<BenefitsPage />} />
                  <Route path="mentorship" element={<MentorshipPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="tickets" element={<TicketsPage />} />
                  <Route path="resources" element={<ResourcesPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="onboarding" element={<OnboardingPage />} />
                  <Route path="joinsorms" element={<JoinSormsPage />} />
                  <Route path="payment" element={<PaymentPage />} />
                  <Route path="gkcga" element={<GkcgaPage />} />
                  <Route path="terms" element={<TermsAndConditions />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['user', 'admin', 'mentor']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<UserDashboardPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="mentorship" element={<MentorshipPage />} />
                </Route>

                {/* Protected Admin Routes with AdminLayout */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route path="users" element={<AdminDashboardPage section="users" />} />
                  <Route path="mentors" element={<AdminDashboardPage section="mentors" />} />
                  <Route path="projects" element={<AdminDashboardPage section="projects" />} />
                  <Route path="events" element={<AdminDashboardPage section="events" />} />
                  <Route path="analytics" element={<AdminDashboardPage section="analytics" />} />
                </Route>

                {/* Redirect unmatched routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </CacheProvider>
    </Router>
  );
}

export default App;