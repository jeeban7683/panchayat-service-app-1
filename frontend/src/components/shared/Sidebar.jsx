import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';
import {
  Home, Calendar, Star, Settings,
  Briefcase, DollarSign, Bell, User,
  Users, CheckSquare, BarChart, Menu, X, MapPin, LogOut, MessageSquare
} from 'lucide-react';

const Sidebar = ({ role = 'USER' }) => {
  const [isOpen, setIsOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  });
  const location = useLocation();
  const { logout, user } = useAuth();

  useEffect(() => {
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
    USER: { bg: '#F3F0FF', text: '#8B5CF6', border: '#DDD6FE' },
    PROVIDER: { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC' },
    ADMIN: { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  };
  const roleStyle = roleColors[role] || roleColors.USER;

  return (
    <>
      {/* Toggle button — only shown when closed */}
      {!isOpen && (
        <div className="fixed top-4 left-4 z-50 flex flex-col items-start gap-2">
          <button
            id="sidebar-open-btn"
            onClick={() => setIsOpen(true)}
            className="p-2.5 rounded-2xl transition-all shadow-md bg-white border border-purple-100 text-gray-700 hover:text-purple-600"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop spacer */}
      <div className={`${isOpen ? 'w-64' : 'w-0'} shrink-0 transition-all duration-300 hidden md:block`} />

      {/* Sidebar panel */}
      <div
        className={`fixed top-4 left-4 h-[calc(100vh-2rem)] w-64 flex flex-col z-40 transition-transform duration-300 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(99,102,241,0.08)] ${isOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'
          }`}
        style={{
          background: '#FFFFFF',
          border: 'none',
        }}
      >
        {/* Header */}
        <div
          className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-purple-50"
        >
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
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-1.5 px-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 py-3 px-4 rounded-[18px] transition-all text-sm font-semibold ${isActive
                      ? 'bg-[#F3F0FF] text-[#8B5CF6] shadow-[0_4px_14px_rgba(139,92,246,0.1)]'
                      : 'text-gray-500 hover:bg-[#FAFAFF] hover:text-[#8B5CF6]'
                    }`
                  }
                >
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span className="truncate">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div
          className="p-4 shrink-0 border-t border-purple-50 bg-[#FAFAFF]"
        >
          <div className="flex items-center gap-3 mb-3">
            {user?.profileImage ? (
              <img
                src={getImageUrl(user.profileImage)}
                alt={user?.name || 'User'}
                className="h-10 w-10 shrink-0 rounded-full object-cover border-2"
                style={{ borderColor: roleStyle.border }}
              />
            ) : (
              <div
                className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold border-2"
                style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, borderColor: roleStyle.border }}
              >
                {(user?.name?.[0] || role[0]).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || role}</p>
              <p className="text-xs font-semibold truncate" style={{ color: roleStyle.text }}>{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-50 border border-red-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(17,24,39,0.4)' }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
