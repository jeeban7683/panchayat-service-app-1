import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Calendar, Star, Settings,
  Briefcase, DollarSign, Bell, User,
  Users, CheckSquare, BarChart, Menu, X
} from 'lucide-react';

const Sidebar = ({ role = 'USER' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on route change on mobile
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location]);

  const getLinks = () => {
    switch (role) {
      case 'USER':
        return [
          { name: 'Home', path: '/user/dashboard', icon: Home },
          { name: 'My Bookings', path: '/user/bookings', icon: Calendar },
          { name: 'Reviews', path: '/user/reviews', icon: Star },
          { name: 'Settings', path: '/user/settings', icon: Settings },
        ];
      case 'PROVIDER':
        return [
          { name: 'Requests', path: '/provider/dashboard', icon: Bell },
          { name: 'Completed Jobs', path: '/provider/jobs', icon: CheckSquare },
          { name: 'Earnings', path: '/provider/earnings', icon: DollarSign },
          { name: 'Reviews', path: '/provider/reviews', icon: Star },
          { name: 'Profile', path: '/provider/profile', icon: User },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Providers', path: '/admin/providers', icon: Briefcase },
          { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
          { name: 'Reviews', path: '/admin/reviews', icon: Star },
          { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {!isOpen && (
        <div className="fixed top-4 left-4 z-50 flex flex-col items-start gap-2">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-slate-800">
            Panchayat
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="p-1.5 bg-slate-800 border border-slate-700 text-white rounded-lg shadow-sm hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Spacer div to push main content when sidebar is open */}
      <div className={`${isOpen ? 'w-64' : 'w-0'} shrink-0 transition-all duration-300 hidden md:block`} />

      {/* The Sidebar itself */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center justify-end px-4 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 focus:outline-none bg-slate-800 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white flex shrink-0 items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-2 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center py-2.5 px-3 rounded-lg transition-colors ${isActive
                      ? 'bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium border border-transparent'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900">
          <div className="flex items-center">
            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/30">
              {role[0]}
            </div>
            <div className="ml-3 overflow-hidden flex-1">
              <p className="text-sm font-bold text-white truncate">{role}</p>
              <p className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer mt-0.5 truncate">Log out</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay background when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
