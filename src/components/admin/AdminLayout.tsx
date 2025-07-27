import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { User } from '../../types';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../LoadingSpinner';
import { 
  Menu, 
  X, 
  Calendar, 
  Bell, 
  MessageCircle, 
  Building2, 
  LogOut, 
  Users, 
  Settings,
  LayoutDashboard,
  ChevronRight,
  ChevronUp,
  Clock,
  MessageSquare
} from 'lucide-react';
import { checkReceptionistAccess } from '../../lib/auth';

// Custom scrollbar styles
const scrollbarStyles = `
  /* Hide scrollbar by default but reserve the space */
  .custom-scrollbar {
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: transparent transparent; /* For Firefox */
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 20px;
    transition: background-color 0.3s;
  }

  /* Hide scrollbar arrows */
  .custom-scrollbar::-webkit-scrollbar-button {
    display: none;
  }

  /* Show scrollbar on hover and when scrolling (active) */
  .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background-color: rgba(107, 114, 128, 0.5);
  }

  /* For Firefox */
  .custom-scrollbar:hover {
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  }

  .custom-scrollbar:active {
    scrollbar-color: rgba(107, 114, 128, 0.5) transparent;
  }
`;

interface NavigationGroup {
  name: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['General', 'Appointments', 'MR Management', 'Communication', 'System']);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Check route access for current user
    const { isAuthorized, error, redirectTo } = checkReceptionistAccess(location.pathname);
    if (!isAuthorized && redirectTo) {
      // Only show error message if there's an error message (not for silent redirects)
      if (error) {
        toast.error(error);
      }
      navigate(redirectTo);
    }
  }, [location.pathname, navigate]);

  const checkAuth = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Please login to access admin panel');
      }

      const user = JSON.parse(userStr) as User;
      if (!['superadmin', 'receptionist'].includes(user.role)) {
        throw new Error('Unauthorized access');
      }

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Authentication error occurred');
      }
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) as User : null;
  const isReceptionist = currentUser?.role === 'receptionist';

  const navigationGroups: NavigationGroup[] = [
    ...(isReceptionist ? [] : [
      {
        name: 'General',
        items: [
          { name: 'Dashboard', href: '/admin', icon: LayoutDashboard }
        ]
      }
    ]),
    {
      name: 'Appointments',
      items: [
        { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
        { name: 'Patients', href: '/admin/patients', icon: Users },
        ...(currentUser?.role === 'superadmin' ? [
          { name: 'Appointment Settings', href: '/admin/appointment-settings', icon: Settings }
        ] : [])
      ]
    },
    {
      name: 'MR Management',
      items: [
        { name: 'MR Appointments', href: '/admin/mr-appointments', icon: Building2 },
        ...(currentUser?.role === 'superadmin' ? [
          { name: 'MR Settings', href: '/admin/mr-settings', icon: Settings }
        ] : [])
      ]
    },
    ...(isReceptionist ? [] : [
      {
        name: 'Communication',
        items: [
          { name: 'Announcements', href: '/admin/notices', icon: Bell },
          { name: 'Flash Message', href: '/admin/messages', icon: MessageCircle },
          { name: 'Contact Messages', href: '/admin/contact-messages', icon: MessageSquare }
        ]
      },
      {
        name: 'System',
        items: [
          { name: 'Users', href: '/admin/users', icon: Users },
          ...(currentUser?.role === 'superadmin' ? [
            { name: 'Clinic Closure', href: '/admin/clinic-closure', icon: Clock }
          ] : [])
        ]
      }
    ])
  ].filter(group => group.items.length > 0);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Inject custom scrollbar styles */}
      <style>{scrollbarStyles}</style>
      
      {/* Desktop sidebar */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        }`}
      >
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          {/* Sidebar Header - Fixed at top */}
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 flex-shrink-0">
            <h1 className={`font-bold text-[#2B5C4B] transition-all duration-300 ${
              isSidebarCollapsed ? 'text-lg' : 'text-xl'
            }`}>
              {isSidebarCollapsed ? 'AP' : 'Admin Panel'}
            </h1>
            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-[#2B5C4B]/5 transition-colors text-gray-500"
            >
              <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${
                isSidebarCollapsed ? 'rotate-0' : 'rotate-180'
              }`} />
            </button>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
            <nav className="space-y-1">
              {navigationGroups.map((group) => (
                <div key={group.name} className="mb-2">
                  {!isSidebarCollapsed && (
                    <div 
                      className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-gray-600"
                      onClick={() => toggleGroup(group.name)}
                    >
                      <span>{group.name}</span>
                      <ChevronUp className={`h-4 w-4 transition-transform duration-200 ${
                        expandedGroups.includes(group.name) ? 'rotate-0' : 'rotate-180'
                      }`} />
                    </div>
                  )}
                  <div className={`space-y-1 ${
                    !isSidebarCollapsed && !expandedGroups.includes(group.name) ? 'hidden' : ''
                  }`}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${
                            active
                              ? 'bg-[#2B5C4B]/10 text-[#2B5C4B]'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`flex-shrink-0 transition-all duration-300 ${
                            isSidebarCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'
                          } ${active ? 'text-[#2B5C4B]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                          <span className={`transition-all duration-300 relative z-10 ${
                            isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                          }`}>
                            {item.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* User Profile - Fixed at bottom */}
          <div className="border-t border-gray-100 p-4 bg-white flex-shrink-0">
            <div className={`transition-all duration-300 ${
              isSidebarCollapsed ? 'text-center' : ''
            }`}>
              <div className="flex items-center group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-medium text-white">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className={`ml-3 transition-all duration-300 ${
                  isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                }`}>
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role}</p>
                </div>
              </div>
              <a
                onClick={handleLogout}
                className="flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="flex-shrink-0 h-5 w-5 mr-3 text-gray-400 group-hover:text-red-500" />
                {!isSidebarCollapsed && <span>Logout</span>}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="fixed z-40 top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center justify-between lg:hidden border-b border-gray-200">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3 ml-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-xl font-bold text-[#2B5C4B]">Admin Panel</h1>
        <div className="relative mr-4">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-[#2B5C4B]/10 text-[#2B5C4B] hover:bg-[#2B5C4B]/20 transition-colors ring-2 ring-white"
          >
            {currentUser?.name?.charAt(0) || 'U'}
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden z-50 border border-gray-100 animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.role}</p>
              </div>
              <a
                onClick={handleLogout}
                className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                <span>Logout</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-hidden="true">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition duration-300 ease-in-out">
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                <h1 className="font-bold text-xl text-[#2B5C4B]">Admin Panel</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="overflow-y-auto py-4 px-3 flex-1 custom-scrollbar">
                <nav className="space-y-6">
                  {navigationGroups.map((group) => (
                    <div key={group.name} className="space-y-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                        {group.name}
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl ${
                                active
                                  ? 'bg-[#2B5C4B]/10 text-[#2B5C4B]'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <Icon className={`h-5 w-5 mr-3 ${
                                active ? 'text-[#2B5C4B]' : 'text-gray-400'
                              }`} />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-72 transition-all duration-300 ease-in-out" style={{ 
        ...(isSidebarCollapsed && { paddingLeft: '5rem' }) 
      }}>
        <div className="px-4 py-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-purple-50 to-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
}