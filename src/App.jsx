import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ContentGenerator from './pages/ContentGenerator';
import CalendarView from './pages/CalendarView';
import Integrations from './pages/Integrations';
import SettingsPage from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('socialpulse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Create demo user for testing
      const demoUser = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@socialpulse.ai',
        avatar: null,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('socialpulse_user', JSON.stringify(demoUser));
      setUser(demoUser);
    }

    // Load notifications
    const storedNotifications = localStorage.getItem('socialpulse_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/generator', icon: Sparkles, label: 'Content Generator' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/integrations', icon: Link2, label: 'Integrations' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-20'
          } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-xl text-gray-900">SocialPulse</span>
              )}
            </div>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar footer */}
          {sidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">Need help?</p>
                <p className="text-xs text-gray-600 mt-1">Check our documentation</p>
                <button className="btn-primary w-full mt-3 text-sm">
                  View Docs
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={toggleSidebar}
                >
                  {sidebarOpen ? (
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-500" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                </div>

                {/* User menu */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-500">Pro Plan</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/generator" element={<ContentGenerator />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
