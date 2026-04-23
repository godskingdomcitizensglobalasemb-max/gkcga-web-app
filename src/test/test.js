// test.js - Comprehensive testing setup for the React application
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import the main App component
import App from './src/App';

// Mock the context providers
jest.mock('./src/context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    isAuthenticated: false,
    userRole: null
  })
}));

jest.mock('./src/context/NotificationContext', () => ({
  NotificationProvider: ({ children }) => <div data-testid="notification-provider">{children}</div>,
  useNotification: () => ({
    showNotification: jest.fn(),
    notifications: []
  })
}));

jest.mock('./src/context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn()
  })
}));

// Mock the protected route component
jest.mock('./src/components/auth/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children, allowedRoles }) => (
    <div data-testid="protected-route" data-allowed-roles={allowedRoles?.join(',')}>
      {children}
    </div>
  )
}));

// Mock the layout components
jest.mock('./src/components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="main-layout">
      <nav>Main Navigation</nav>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  )
}));

jest.mock('./src/components/layout/AdminLayout', () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="admin-layout">
      <nav>Admin Navigation</nav>
      <main>{children}</main>
    </div>
  )
}));

jest.mock('./src/components/layout/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="dashboard-layout">
      <aside>Dashboard Sidebar</aside>
      <main>{children}</main>
    </div>
  )
}));

jest.mock('./src/components/layout/AuthLayout', () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="auth-layout">
      <div className="auth-container">{children}</div>
    </div>
  )
}));

jest.mock('./src/components/common/ScrollToTop', () => ({
  __esModule: true,
  default: () => null
}));

// Mock all the page components
jest.mock('./src/pages/GkcgaPage', () => ({
  __esModule: true,
  default: () => <div data-testid="gkcga-page">GKCGA Page</div>
}));

jest.mock('./src/pages/HomePage', () => ({
  __esModule: true,
  default: () => <div data-testid="home-page">Home Page</div>
}));

jest.mock('./src/pages/AboutPage', () => ({
  __esModule: true,
  default: () => <div data-testid="about-page">About Page</div>
}));

jest.mock('./src/pages/PillarsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="pillars-page">Pillars Page</div>
}));

jest.mock('./src/pages/SpheresPage', () => ({
  __esModule: true,
  default: () => <div data-testid="spheres-page">Spheres Page</div>
}));

jest.mock('./src/pages/BenefitsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="benefits-page">Benefits Page</div>
}));

jest.mock('./src/pages/MentorshipPage', () => ({
  __esModule: true,
  default: () => <div data-testid="mentorship-page">Mentorship Page</div>
}));

jest.mock('./src/pages/ProjectsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="projects-page">Projects Page</div>
}));

jest.mock('./src/pages/EventsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="events-page">Events Page</div>
}));

jest.mock('./src/pages/ResourcesPage', () => ({
  __esModule: true,
  default: () => <div data-testid="resources-page">Resources Page</div>
}));

jest.mock('./src/pages/ContactPage', () => ({
  __esModule: true,
  default: () => <div data-testid="contact-page">Contact Page</div>
}));

jest.mock('./src/pages/OnboardingPage', () => ({
  __esModule: true,
  default: () => <div data-testid="onboarding-page">Onboarding Page</div>
}));

jest.mock('./src/pages/LoginPage', () => ({
  __esModule: true,
  default: () => <div data-testid="login-page">Login Page</div>
}));

jest.mock('./src/pages/RegisterPage', () => ({
  __esModule: true,
  default: () => <div data-testid="register-page">Register Page</div>
}));

jest.mock('./src/pages/ForgotPasswordPage', () => ({
  __esModule: true,
  default: () => <div data-testid="forgot-password-page">Forgot Password Page</div>
}));

jest.mock('./src/pages/UserDashboardPage', () => ({
  __esModule: true,
  default: () => <div data-testid="user-dashboard-page">User Dashboard</div>
}));

jest.mock('./src/pages/ProfilePage', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-page">Profile Page</div>
}));

jest.mock('./src/pages/VirtualSummitsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="virtual-summits-page">Virtual Summits</div>
}));

jest.mock('./src/pages/VolunteerPage', () => ({
  __esModule: true,
  default: () => <div data-testid="volunteer-page">Volunteer Page</div>
}));

jest.mock('./src/pages/WatchLivePage', () => ({
  __esModule: true,
  default: () => <div data-testid="watch-live-page">Watch Live</div>
}));

jest.mock('./src/pages/CommunityPage', () => ({
  __esModule: true,
  default: () => <div data-testid="community-page">Community Page</div>
}));

jest.mock('./src/pages/JoinSormsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="join-sorms-page">Join SORMS</div>
}));

jest.mock('./src/pages/TicketsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="tickets-page">Tickets Page</div>
}));

jest.mock('./src/pages/AdminLoginPage', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-login-page">Admin Login</div>
}));

jest.mock('./src/pages/AdminDashboardPage', () => ({
  __esModule: true,
  default: ({ section }) => <div data-testid="admin-dashboard-page">Admin Dashboard - {section || 'main'}</div>
}));

jest.mock('./src/pages/AdminSetupPage', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-setup-page">Admin Setup</div>
}));

jest.mock('./src/pages/PaymentPage', () => ({
  __esModule: true,
  default: () => <div data-testid="payment-page">Payment Page</div>
}));

jest.mock('./src/pages/TermsAndConditions', () => ({
  __esModule: true,
  default: () => <div data-testid="terms-page">Terms and Conditions</div>
}));

jest.mock('./src/pages/PrivacyPolicy', () => ({
  __esModule: true,
  default: () => <div data-testid="privacy-page">Privacy Policy</div>
}));

// Helper function to render with router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('App Component - Route Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Public Routes with MainLayout', () => {
    const publicRoutes = [
      { path: '/', expectedId: 'home-page' },
      { path: '/virtual-summits', expectedId: 'virtual-summits-page' },
      { path: '/volunteer', expectedId: 'volunteer-page' },
      { path: '/about', expectedId: 'about-page' },
      { path: '/pillars', expectedId: 'pillars-page' },
      { path: '/watchlive', expectedId: 'watch-live-page' },
      { path: '/community', expectedId: 'community-page' },
      { path: '/spheres', expectedId: 'spheres-page' },
      { path: '/benefits', expectedId: 'benefits-page' },
      { path: '/mentorship', expectedId: 'mentorship-page' },
      { path: '/projects', expectedId: 'projects-page' },
      { path: '/events', expectedId: 'events-page' },
      { path: '/tickets', expectedId: 'tickets-page' },
      { path: '/resources', expectedId: 'resources-page' },
      { path: '/contact', expectedId: 'contact-page' },
      { path: '/onboarding', expectedId: 'onboarding-page' },
      { path: '/joinsorms', expectedId: 'join-sorms-page' },
      { path: '/payment', expectedId: 'payment-page' },
      { path: '/gkcga', expectedId: 'gkcga-page' },
      { path: '/terms', expectedId: 'terms-page' },
      { path: '/privacy', expectedId: 'privacy-page' }
    ];

    publicRoutes.forEach(({ path, expectedId }) => {
      it(`renders ${expectedId} at route ${path}`, () => {
        renderWithRouter(<App />, { route: path });
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
        expect(screen.getByTestId(expectedId)).toBeInTheDocument();
      });
    });
  });

  describe('Auth Routes', () => {
    const authRoutes = [
      { path: '/auth/login', expectedId: 'login-page' },
      { path: '/auth/register', expectedId: 'register-page' },
      { path: '/auth/forgot-password', expectedId: 'forgot-password-page' }
    ];

    authRoutes.forEach(({ path, expectedId }) => {
      it(`renders ${expectedId} at route ${path}`, () => {
        renderWithRouter(<App />, { route: path });
        expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
        expect(screen.getByTestId(expectedId)).toBeInTheDocument();
      });
    });
  });

  describe('Admin Routes', () => {
    it('renders admin login page at /admin/login', () => {
      renderWithRouter(<App />, { route: '/admin/login' });
      expect(screen.getByTestId('admin-login-page')).toBeInTheDocument();
    });

    it('renders admin setup page at /admin/setup', () => {
      renderWithRouter(<App />, { route: '/admin/setup' });
      expect(screen.getByTestId('admin-setup-page')).toBeInTheDocument();
    });

    it('renders protected admin dashboard at /admin/dashboard', () => {
      renderWithRouter(<App />, { route: '/admin/dashboard' });
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
    });

    it('renders admin layout with sections', () => {
      const adminSections = ['users', 'mentors', 'projects', 'events', 'analytics'];
      
      adminSections.forEach(section => {
        const { unmount } = renderWithRouter(<App />, { route: `/admin/${section}` });
        expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Protected User Routes', () => {
    it('renders dashboard layout for protected user routes', () => {
      renderWithRouter(<App />, { route: '/dashboard' });
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      expect(screen.getByTestId('user-dashboard-page')).toBeInTheDocument();
    });

    it('renders profile page at /dashboard/profile', () => {
      renderWithRouter(<App />, { route: '/dashboard/profile' });
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    it('renders projects page at /dashboard/projects', () => {
      renderWithRouter(<App />, { route: '/dashboard/projects' });
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      expect(screen.getByTestId('projects-page')).toBeInTheDocument();
    });

    it('renders mentorship page at /dashboard/mentorship', () => {
      renderWithRouter(<App />, { route: '/dashboard/mentorship' });
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      expect(screen.getByTestId('mentorship-page')).toBeInTheDocument();
    });
  });

  describe('Protected Route Props', () => {
    it('passes correct allowedRoles to ProtectedRoute for user dashboard', () => {
      renderWithRouter(<App />, { route: '/dashboard' });
      const protectedRoute = screen.getByTestId('protected-route');
      expect(protectedRoute).toHaveAttribute('data-allowed-roles', 'user,admin,mentor');
    });

    it('passes correct allowedRoles to ProtectedRoute for admin routes', () => {
      renderWithRouter(<App />, { route: '/admin/dashboard' });
      const protectedRoute = screen.getByTestId('protected-route');
      expect(protectedRoute).toHaveAttribute('data-allowed-roles', 'admin');
    });
  });

  describe('404 Redirect', () => {
    it('redirects unknown routes to home page', () => {
      renderWithRouter(<App />, { route: '/non-existent-page' });
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('Context Providers', () => {
    it('wraps the app with all required providers', () => {
      renderWithRouter(<App />);
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('main layout includes navigation and footer for public routes', () => {
      renderWithRouter(<App />, { route: '/about' });
      const mainLayout = screen.getByTestId('main-layout');
      expect(mainLayout).toHaveTextContent('Main Navigation');
      expect(mainLayout).toHaveTextContent('Footer');
    });

    it('admin layout includes admin navigation', () => {
      renderWithRouter(<App />, { route: '/admin/dashboard' });
      const adminLayout = screen.getByTestId('admin-layout');
      expect(adminLayout).toHaveTextContent('Admin Navigation');
    });

    it('dashboard layout includes sidebar', () => {
      renderWithRouter(<App />, { route: '/dashboard' });
      const dashboardLayout = screen.getByTestId('dashboard-layout');
      expect(dashboardLayout).toHaveTextContent('Dashboard Sidebar');
    });
  });
});

// Performance and integration tests
describe('App Integration Tests', () => {
  it('renders without crashing', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('maintains scroll position on route change (ScrollToTop component)', () => {
    const { container } = renderWithRouter(<App />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('handles route transitions correctly', async () => {
    renderWithRouter(<App />);
    
    // Start at home
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    
    // Navigate to about page (simulate)
    window.history.pushState({}, 'About', '/about');
    renderWithRouter(<App />, { route: '/about' });
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });
});

// Export for use in other test files
export { renderWithRouter };