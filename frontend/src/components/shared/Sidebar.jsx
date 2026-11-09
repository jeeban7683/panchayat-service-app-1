import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';
import {
  Home, Calendar, Star, Settings,
  Briefcase, DollarSign, Bell, User,
  Users, CheckSquare, BarChart, X, MapPin, LogOut, MessageSquare
} from 'lucide-react';

const Sidebar = ({ role = 'USER', isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });

  const isControlled = externalIsOpen !== undefined && externalSetIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  const setIsOpen = isControlled ? externalSetIsOpen : setInternalIsOpen;

  const location = useLocation();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location, setIsOpen]);

  const getLinks = () => {
    switch (role) {
      case 'USER':
        return [
          { name: 'Dashboard', path: '/user/dashboard', icon: Home },
          { name: 'My Bookings', path: '/user/bookings', icon: Calendar },
          { name: 'Messages', path: '/user/chat', icon: MessageSquare },
          { name: 'Reviews', path: '/user/reviews', icon: Star },
          { name: 'Settings', path: '/user/settings', icon: Settings },
        ];
      case 'PROVIDER':
        return [
          { name: 'Requests', path: '/provider/dashboard', icon: Bell },
          { name: 'Completed Jobs', path: '/provider/jobs', icon: CheckSquare },
          { name: 'Messages', path: '/provider/chat', icon: MessageSquare },
          { name: 'Earnings', path: '/provider/earnings', icon: DollarSign },
          { name: 'Reviews', path: '/provider/reviews', icon: Star },
          { name: 'Profile', path: '/provider/profile', icon: User },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart },
          { name: 'Messages', path: '/admin/chat', icon: MessageSquare },
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

  const roleColors = {
    USER: { bg: '#F3F0FF', text: '#8B5CF6', border: '#DDD6FE', badge: 'bg-purple-50 text-purple-700' },
    PROVIDER: { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC', badge: 'bg-emerald-50 text-emerald-700' },
    ADMIN: { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE', badge: 'bg-indigo-50 text-indigo-700' },
  };
  const roleStyle = roleColors[role] || roleColors.USER;

  return (
    <>
      {/* Desktop spacer */}
      <div className={`${isOpen ? 'w-64' : 'w-0'} shrink-0 transition-all duration-300 hidden lg:block`} />

      {/* Sidebar panel */}
      <aside
        aria-label="Sidebar navigation"
        className={`fixed z-50 transition-all duration-300 ease-in-out flex flex-col bg-white shadow-2xl lg:shadow-[0_12px_40px_rgba(99,102,241,0.08)]
          top-0 left-0 h-full w-72 rounded-r-3xl border-r border-purple-100/80
          lg:top-4 lg:left-4 lg:h-[calc(100vh-2rem)] lg:w-64 lg:rounded-3xl lg:border-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-purple-50">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Panchayat<span className="text-[#8B5CF6]">.</span>
            </span>
          </Link>
          <button
            id="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-purple-50 rounded-xl transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User preview banner on mobile */}
        <div className="px-5 py-3 bg-[#FAFAFF] border-b border-purple-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.profileImage ? (
              <img
                src={getImageUrl(user.profileImage)}
                alt={user?.name || 'User'}
                className="h-8 w-8 shrink-0 rounded-full object-cover border"
                style={{ borderColor: roleStyle.border }}
              />
            ) : (
              <div
                className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border"
                style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, borderColor: roleStyle.border }}
              >
                {(user?.name?.[0] || role[0]).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.name || role}</p>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.2 rounded-full inline-block ${roleStyle.badge}`}>
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 py-3 px-4 rounded-2xl transition-all text-sm font-semibold ${isActive
                      ? 'bg-[#F3F0FF] text-[#8B5CF6] shadow-[0_4px_14px_rgba(139,92,246,0.1)]'
                      : 'text-gray-500 hover:bg-[#FAFAFF] hover:text-[#8B5CF6]'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 shrink-0 border-t border-purple-50 bg-[#FAFAFF]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-50 border border-red-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
