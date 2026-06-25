import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BedDouble, CalendarDays, Users,
  Settings, UserCircle, LogOut, Hotel
} from 'lucide-react';
import clsx from 'clsx';

const ALL_NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiredPermission: null }, // Always visible
  { name: 'Rooms', path: '/rooms', icon: BedDouble, requiredPermission: 'Rooms' },
  { name: 'Bookings', path: '/bookings', icon: CalendarDays, requiredPermission: 'Bookings' },
  { name: 'Guests', path: '/guests', icon: Users, requiredPermission: 'Guests' },
  { name: 'Hotel Info', path: '/hotel-info', icon: Hotel, requiredPermission: 'Hotel Information' },
  { name: 'Settings', path: '/settings', icon: Settings, requiredPermission: 'Settings' },
  { name: 'Profile', path: '/profile', icon: UserCircle, requiredPermission: null }, // Always visible
];

export default function Sidebar() {
  const navigate = useNavigate();
  const savedData = localStorage.getItem('helloStay_hotelData');
  
  // Read from session object
  const sessionData = localStorage.getItem('helloStay_session');
  const session = sessionData ? JSON.parse(sessionData) : null;
  const userRole = session?.role?.toLowerCase() || 'employee';
  const permissions = session?.permissions || [];
  const hasFullAccess = session?.role === 'Owner' || permissions.includes('Full Access');

  let hasRestaurant = true;
  if (savedData) {
    const data = JSON.parse(savedData);
    hasRestaurant = data.facilities?.includes('In-house Restaurant') ?? true;
  }

  const activeNavItems = ALL_NAV_ITEMS.filter(item => {
    // 1. Check module-specific permissions
    if (item.requiredPermission) {
      if (!hasFullAccess && !permissions.includes(item.requiredPermission)) {
        return false;
      }
    }
    
    // 2. Check facility configurations (e.g., if restaurant module is ever added back)
    if (item.facility && item.facility === 'In-house Restaurant' && !hasRestaurant) return false;
    
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('helloStay_session');
    localStorage.removeItem('helloStay_keepLoggedIn');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">HelloStay</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            {userRole}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
