import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const location = useLocation();
  const pathName = location.pathname.split('/').pop();
  const title = pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1) : 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-0 shadow-sm">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
          {title.replace('-', ' ')}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search everywhere..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center border-l border-gray-200 pl-4 ml-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="ml-3 hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
