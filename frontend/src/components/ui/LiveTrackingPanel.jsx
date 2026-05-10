import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlowButton from './GlowButton';

export default function LiveTrackingPanel({ provider, distance = "2.4 km", time = "15 mins", className }) {
  return (
    <div className={cn("glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-accent-blue/5 border border-white/10", className)}>
      {/* Map Illusion Area */}
      <div className="relative h-64 bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
        
        {/* Animated Map Route Ping */}
        <motion.div
          animate={{
            scale: [1, 2, 2.5],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute top-1/2 left-1/2 -mt-4 -ml-4 w-8 h-8 bg-accent-blue rounded-full blur-sm"
        />
        <div className="absolute top-1/2 left-1/2 -mt-2 -ml-2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(6,182,212,1)] z-10" />
        
        {/* Destination Pin */}
        <div className="absolute top-[30%] left-[60%] flex flex-col items-center">
          <div className="bg-accent-purple p-2 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.8)]">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="w-0.5 h-6 bg-gradient-to-b from-accent-purple to-transparent" />
        </div>
      </div>

      <div className="p-6 relative z-10 -mt-6 glass-panel rounded-t-3xl border-t border-white/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white neon-text-glow">Arriving soon</h3>
            <p className="text-accent-blue">{time} • {distance}</p>
          </div>
          <div className="p-3 bg-dark-800 rounded-2xl border border-white/5">
            <Navigation className="w-6 h-6 text-accent-blue" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={provider?.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=150&auto=format&fit=crop"} 
                alt="Provider" 
                className="w-12 h-12 rounded-full border-2 border-accent-blue object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900" />
            </div>
            <div>
              <p className="text-white font-medium">{provider?.name || "Rajesh Kumar"}</p>
              <p className="text-sm text-dark-300">{provider?.vehicle || "Electric Scooter - DL 8C 1234"}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <GlowButton variant="secondary" className="px-3 py-3 rounded-full">
              <MessageSquare className="w-4 h-4" />
            </GlowButton>
            <GlowButton variant="primary" className="px-3 py-3 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Phone className="w-4 h-4" />
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  );
}
