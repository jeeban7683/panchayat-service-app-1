import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, CheckCircle2, Star, Zap, Shield } from 'lucide-react';
import GlowButton from './GlowButton';
import heroImage from '../../assets/hero.png';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import Threads from './Threads';

export default function GradientHeroSection({ className }) {
  return (
    <section
      className={cn('relative overflow-hidden', className)}
      style={{ background: 'linear-gradient(135deg, #000000 0%, #080808 50%, #000000 100%)' }}
    >
      {/* Interactive WebGL Threads Animation Background with CSS Masking to prevent full bottom spread */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          height: '100%',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)',
          opacity: 0.8
        }}
      >
        <Threads
          color={[0.96, 0.71, 0.0]}
          amplitude={1.2}
          distance={0.3}
          enableMouseInteraction={true}
        />
      </div>

      {/* Gold decorative glows */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,180,0,0.06) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,180,0,0.04) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text content ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: 'rgba(244,180,0,0.1)',
                border: '1px solid rgba(244,180,0,0.25)',
                color: '#F4B400',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#F4B400] animate-pulse" />
              The Digital Panchayat
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Trusted Services
              <br />
              <span
                className="relative inline-block"
                style={{ color: '#F4B400' }}
              >
                At Your Doorstep
                <span
                  className="absolute bottom-0 left-0 w-full h-1 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #F4B400, #FFC928)', bottom: '-4px' }}
                />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-[#9099A8] mb-8 max-w-lg leading-relaxed">
              Connecting you with trusted local professionals for every service need. Reliable, fast, and verified at your doorstep.
            </p>

            {/* Feature bullets */}
            <div className="flex flex-col gap-2.5 mb-8">
              {[
                'Background-checked & verified professionals',
                'Instant booking, live tracking',
                'Rated by your community',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-[#C9CED6]">
                  <CheckCircle2 className="w-4 h-4 text-[#F4B400] shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <GlowButton variant="primary" href="/services" className="px-8 py-3.5 text-base">
                Book a Service <ArrowRight className="w-4 h-4 ml-1" />
              </GlowButton>
              <GlowButton variant="outline" href="/register" className="px-8 py-3.5 text-base">
                Become a Provider
              </GlowButton>
            </div>

            {/* Call badge */}
            <div
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
              >
                <Phone className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-xs text-[#9099A8] font-medium">Call us 24/7</p>
                <p className="text-sm font-bold text-white">+91 98765 43210</p>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="relative hidden lg:flex justify-center"
          >
            {/* Experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-6 bottom-12 z-10 rounded-2xl shadow-2xl px-5 py-4"
              style={{
                background: '#14181F',
                border: '1px solid rgba(244,180,0,0.2)',
                boxShadow: '0 8px 32px rgba(244,180,0,0.1)',
              }}
            >
              <p className="text-3xl font-black leading-none" style={{ color: '#F4B400' }}>5+</p>
              <p className="text-xs text-[#9099A8] font-medium mt-0.5">Years of<br />Experience</p>
            </motion.div>

            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -right-4 top-16 z-10 rounded-2xl shadow-2xl px-4 py-3"
              style={{
                background: '#14181F',
                border: '1px solid rgba(244,180,0,0.2)',
                boxShadow: '0 8px 32px rgba(244,180,0,0.1)',
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 text-[#F4B400] fill-[#F4B400]" />
                ))}
              </div>
              <p className="text-xs text-[#9099A8] font-medium">10k+ Happy Clients</p>
            </motion.div>

            {/* Main image container */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl transform rotate-3"
                style={{ background: 'rgba(244,180,0,0.06)' }}
              />
              <div
                className="relative rounded-3xl overflow-hidden p-3 shadow-2xl"
                style={{
                  background: '#14181F',
                  border: '1px solid rgba(244,180,0,0.15)',
                  boxShadow: '0 20px 60px rgba(244,180,0,0.08), 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                <img
                  src={heroImage}
                  alt="Panchayat Platform — Community Services"
                  className="rounded-2xl w-full h-auto object-cover max-h-[480px]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
