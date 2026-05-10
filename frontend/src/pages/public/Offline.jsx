import React from 'react';
import { WifiOff, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import GlowButton from '../../components/ui/GlowButton';

const Offline = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-12 rounded-3xl max-w-md w-full text-center relative z-10"
      >
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <WifiOff className="w-12 h-12 text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">You're Offline</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          It looks like you've lost your connection. Please check your internet settings and try again.
        </p>
        
        <GlowButton 
          onClick={handleRefresh}
          className="w-full py-4 flex items-center justify-center gap-2 group"
        >
          <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Retry Connection
        </GlowButton>
      </motion.div>
      
      <p className="mt-8 text-slate-500 text-sm font-medium tracking-widest uppercase">
        Panchayat © 2026
      </p>
    </div>
  );
};

export default Offline;
