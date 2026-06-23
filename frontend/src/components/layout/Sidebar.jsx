import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BedDouble, CalendarDays, Users, Contact,
  Briefcase, Wallet, Package, UtensilsCrossed, BarChart3,
  Settings, UserCircle, LogOut, Sparkles
} from 'lucide-react';
import clsx from 'clsx';

const ALL_NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['owner', 'manager', 'employee'] },
  { name: 'Rooms', path: '/rooms', icon: BedDouble, roles: ['owner', 'manager', 'employee'] },
  { name: 'Bookings', path: '/bookings', icon: CalendarDays, roles: ['owner'] },
  { name: 'Guests', path: '/guests', icon: Users, roles: ['owner'] },
  { name: 'Employees', path: '/employees', icon: Contact, roles: ['owner'] },
  { name: 'HR & Payroll', path: '/hr-payroll', icon: Briefcase, roles: ['owner'] },
  { name: 'Expenses', path: '/expenses', icon: Wallet, roles: ['owner', 'manager'] },
  { name: 'Inventory', path: '/inventory', icon: Package, roles: ['owner', 'manager', 'employee'] },
  { name: 'Facilities', path: '/facilities', icon: Sparkles, roles: ['owner', 'manager'] },
  { name: 'Restaurant', path: '/restaurant', icon: UtensilsCrossed, roles: ['owner', 'manager'], facility: 'In-house Restaurant' },
  { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['owner'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['owner'] },
  { name: 'Profile', path: '/profile', icon: UserCircle, roles: ['owner', 'manager', 'employee'] },
];

export default function Sidebar() {
  const savedData = localStorage.getItem('helloStay_hotelData');
  const userRole = localStorage.getItem('helloStay_userRole') || 'owner';

  let hasRestaurant = true;
  if (savedData) {
    const data = JSON.parse(savedData);
    hasRestaurant = data.facilities?.includes('In-house Restaurant') ?? true;
  }

  const activeNavItems = ALL_NAV_ITEMS.filter(item => {
    if (!item.roles.includes(userRole)) return false;
    if (item.facility && item.facility === 'In-house Restaurant' && !hasRestaurant) return false;
    return true;
  });

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

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
        <NavLink
          to="/login"
          className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
