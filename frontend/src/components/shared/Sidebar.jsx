import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    USER: { bg: 'rgba(244,180,0,0.12)', text: '#F4B400', border: 'rgba(244,180,0,0.25)' },
    PROVIDER: { bg: 'rgba(52,211,153,0.12)', text: '#34D399', border: 'rgba(52,211,153,0.25)' },
    ADMIN: { bg: 'rgba(167,139,250,0.12)', text: '#A78BFA', border: 'rgba(167,139,250,0.25)' },
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
            className="p-2 rounded-xl transition-all shadow-lg border"
            style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)', color: '#C9CED6' }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop spacer */}
      <div className={`${isOpen ? 'w-64' : 'w-0'} shrink-0 transition-all duration-300 hidden md:block`} />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col z-40 transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          background: '#0A0A0A',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Header */}
        <div
          className="h-16 flex items-center justify-between px-5 shrink-0 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
            >
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <span className="text-base font-black text-white">
              Panchayat<span className="text-[#F4B400]">.</span>
            </span>
          </Link>
          <button
            id="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-[#9099A8] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 py-5 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3.5 rounded-xl transition-all text-sm font-semibold ${isActive
                      ? 'bg-[#F4B400] text-black shadow-[0_4px_16px_rgba(244,180,0,0.25)]'
                      : 'text-[#9099A8] hover:bg-white/5 hover:text-white border border-transparent hover:border-white/05'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div
          className="p-4 shrink-0 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)', background: '#000000' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-black border"
              style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, borderColor: roleStyle.border }}
            >
              {(user?.name?.[0] || role[0]).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name || role}</p>
              <p className="text-xs font-semibold truncate" style={{ color: roleStyle.text }}>{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
