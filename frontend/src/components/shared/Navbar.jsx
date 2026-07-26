import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'PROVIDER') return '/provider/dashboard';
    return '/user/dashboard';
  };

  const navigation = user
    ? [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Providers', href: '/providers' },
      { name: 'Dashboard', href: getDashboardPath() },
    ]
    : [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
    ];

  const isActive = (path) => location.pathname === path;

  const getRoleBadgeStyle = () => {
    if (!user) return '';
    if (user.role === 'ADMIN') return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    if (user.role === 'PROVIDER') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    return 'bg-[#F4B400]/15 text-[#F4B400] border border-[#F4B400]/30';
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(17, 21, 27, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottomColor: 'rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
            >
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Panchayat<span className="text-[#F4B400]">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive(item.href)
                    ? 'text-[#F4B400] bg-[#F4B400]/10 border border-[#F4B400]/20'
                    : 'text-[#9099A8] hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
                  >
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white leading-none">
                      {user.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 inline-block ${getRoleBadgeStyle()}`}>
                      {user.role || 'USER'}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#9099A8] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden z-50 shadow-2xl"
                      style={{
                        background: '#14181F',
                        border: '1px solid rgba(255,255,255,0.09)',
                      }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: '#11151B' }}>
                        <p className="text-xs text-[#9099A8] font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#C9CED6] hover:bg-[#F4B400]/10 hover:text-[#F4B400] transition-colors text-sm font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#F4B400]" />
                          My Dashboard
                        </Link>
                        <button
                          onClick={() => { setShowUserMenu(false); logout(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#C9CED6] hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-semibold"
                        >
                          <LogOut className="w-4 h-4 text-[#9099A8]" />
                          Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-[#9099A8] hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-black px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-[0_6px_24px_rgba(244,180,0,0.35)] hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
                >
                  Book Service
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#9099A8] hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t"
            style={{ background: '#11151B', borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="px-4 pt-3 pb-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive(item.href)
                      ? 'bg-[#F4B400]/10 text-[#F4B400] border border-[#F4B400]/20'
                      : 'text-[#9099A8] hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="px-4 pt-2 pb-4 border-t mt-1" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
                    >
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider px-1.5 rounded inline-block ${getRoleBadgeStyle()}`}>
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#C9CED6] hover:bg-[#F4B400]/10 hover:text-[#F4B400] text-sm font-semibold transition-all border border-white/08"
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#F4B400]" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors border border-red-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-xl text-[#C9CED6] text-sm font-bold hover:bg-white/5 transition-all border"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-xl text-black text-sm font-bold transition-all shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
                  >
                    Book Service
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
