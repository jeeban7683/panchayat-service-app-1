import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';

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
    if (user.role === 'ADMIN') return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    if (user.role === 'PROVIDER') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    return 'bg-purple-50 text-purple-700 border border-purple-200';
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Panchayat<span className="text-purple-600">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-semibold transition-all duration-200 relative py-1 ${isActive(item.href)
                  ? 'text-purple-600 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600 after:rounded-full'
                  : 'text-gray-600 hover:text-gray-900'
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
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-50 border border-gray-200 transition-all"
                >
                  {user.profileImage ? (
                    <img
                      src={getImageUrl(user.profileImage)}
                      alt={user.name || 'User'}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900 leading-none">
                      {user.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${getRoleBadgeStyle()}`}>
                      {user.role || 'USER'}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden z-50 shadow-md bg-white border border-gray-200"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors text-sm font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-600" />
                          My Dashboard
                        </Link>
                        <button
                          onClick={() => { setShowUserMenu(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
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
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-lg transition-all"
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
              className="p-2.5 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-colors"
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
            className="md:hidden overflow-hidden border-t border-purple-50 bg-white"
          >
            <div className="px-4 pt-3 pb-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isActive(item.href)
                    ? 'bg-[#F3F0FF] text-[#8B5CF6]'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="px-4 pt-3 pb-5 border-t border-purple-50 mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${getRoleBadgeStyle()}`}>
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl text-gray-700 hover:bg-[#F3F0FF] hover:text-[#8B5CF6] text-sm font-semibold transition-all border border-purple-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#8B5CF6]" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors border border-red-100"
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
                    className="w-full text-center px-4 py-3 rounded-2xl text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all border border-purple-100"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-3 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-all"
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
