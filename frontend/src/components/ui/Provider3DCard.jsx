import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlowButton from './GlowButton';

export default function Provider3DCard({ provider, className }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useMotionTemplate`calc(${mouseYSpring} * -15deg)`;
  const rotateY = useMotionTemplate`calc(${mouseXSpring} * 15deg)`;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-2xl glass-card w-full h-[400px] border border-white/10 cursor-pointer overflow-hidden",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 opacity-40 hover:opacity-100"
        style={{
          backgroundImage: `url(${provider?.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop'})`,
          transform: isHovered ? 'scale(1.05) translateZ(0)' : 'scale(1) translateZ(0)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />

      {/* 3D Content Container */}
      <div
        className="absolute inset-0 p-6 flex flex-col justify-end"
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="absolute top-4 right-4 bg-dark-900/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10 shadow-lg">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-white">{provider?.rating || "4.9"}</span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{provider?.name || "Professional Service"}</h3>
            <p className="text-accent-blue font-medium">{provider?.category || "Specialist"}</p>
          </div>

          <div className="flex items-center gap-2 text-dark-300 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{provider?.location || "Local Area"}</span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Starting from</p>
              <p className="text-lg font-bold text-white">${provider?.price || "50"}<span className="text-sm font-normal text-dark-400">/hr</span></p>
            </div>
            <GlowButton variant="glass" className="py-2 px-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              Book Now
            </GlowButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
