import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import GlowButton from './GlowButton';
import heroImage from '../../assets/hero.png';
import { cn } from '../../lib/utils';

export default function GradientHeroSection({ className }) {
  return (
    <div className={cn("relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-3xl z-[-1]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold text-sm mb-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>The Digital Panchayat</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Empowering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Communities
              </span>
              <br />
              With Local Experts
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-lg leading-relaxed font-medium">
              Connecting you with trusted local professionals. Experience 
              reliable services and community growth at your doorstep.
            </p>

            <div className="flex sm:flex-row flex-col gap-4 w-full sm:w-auto">
              <GlowButton variant="primary" className="text-lg px-8 py-4">
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </GlowButton>
              <GlowButton variant="glass" className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" /> Watch Demo
              </GlowButton>
            </div>
          </motion.div>

          {/* Right Side - Hero Image/Mockup with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15, rotateX: 5 }}
            animate={{ opacity: 1, x: 0, rotateY: -10, rotateX: 5 }}
            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
            transition={{ 
              duration: 1, 
              delay: 0.3,
              rotateY: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              rotateX: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
            style={{ perspective: 1200, transformStyle: "preserve-3d" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 glass-panel rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 backdrop-blur-xl">
              <img 
                src={heroImage} 
                alt="Panchayat Platform" 
                className="rounded-[1.5rem] w-full h-auto object-cover shadow-[0_0_50px_rgba(59,130,246,0.3)]"
              />
            </div>
            
            {/* Background Glows for Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-500/20 blur-[120px] z-[-1] rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
