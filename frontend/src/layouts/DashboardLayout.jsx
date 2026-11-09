import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import { Menu, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/api';

const DashboardLayout = ({ role = 'USER' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const roleStyles = {
    USER: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    PROVIDER: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    ADMIN: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  };
  const roleStyle = roleStyles[role] || roleStyles.USER;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F3FF]">
      {/* Mobile Sticky Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-extrabold text-gray-900 tracking-tight">
              Panchayat<span className="text-[#8B5CF6]">.</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            {role}
          </span>
          {user?.profileImage ? (
            <img
              src={getImageUrl(user.profileImage)}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-purple-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#8B5CF6] flex items-center justify-center text-xs font-bold border border-purple-200">
              {(user?.name?.[0] || role[0]).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* Responsive Sidebar */}
      <Sidebar
        role={role}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

