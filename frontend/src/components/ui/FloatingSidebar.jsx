import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { LogOut, Home, Settings, Grid, Calendar, Users, DollarSign } from 'lucide-react';

export default function FloatingSidebar({ links, className }) {
  // Default fallback links if none provided
  const sidebarLinks = links || [
    { name: 'Dashboard', href: '/dashboard', icon: Grid },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Earnings', href: '/earnings', icon: DollarSign },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={cn("hidden md:flex flex-col w-64 h-[calc(100vh-8rem)] glass-panel rounded-2xl sticky top-28 p-6 mx-4", className)}>
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center p-0.5">
          <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <p className="text-xs text-dark-400">Navigation</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
              isActive ? "text-white" : "text-dark-300 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-accent-blue/10 border border-accent-blue/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <link.icon className={cn("w-5 h-5 relative z-10 transition-transform group-hover:scale-110", isActive ? "text-accent-blue" : "")} />
                <span className="font-medium relative z-10">{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/10 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
