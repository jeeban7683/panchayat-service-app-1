import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Zap, CheckCircle2, Loader2,
  Wrench, Briefcase, Droplets, Paintbrush,
  Truck, Camera, HeartPulse, ArrowRight, Users,
  Star, TrendingUp, MapPin, Clock
} from 'lucide-react';
import api from '../../services/api';
import GradientHeroSection from '../../components/ui/GradientHeroSection';
import GlowButton from '../../components/ui/GlowButton';
import { Link } from 'react-router-dom';
import { getServiceImage } from '../../utils/serviceImages';

const ICON_MAP = {
  Droplets, Zap, Briefcase, Wrench, Paintbrush, Truck, Camera, HeartPulse,
};

const ICON_BG = [
  { bg: 'rgba(244,180,0,0.12)', color: '#F4B400' },
  { bg: 'rgba(96,165,250,0.12)', color: '#60A5FA' },
  { bg: 'rgba(52,211,153,0.12)', color: '#34D399' },
  { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA' },
  { bg: 'rgba(251,113,133,0.12)', color: '#FB7185' },
  { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  { bg: 'rgba(14,165,233,0.12)', color: '#38BDF8' },
  { bg: 'rgba(74,222,128,0.12)', color: '#4ADE80' },
];

const getIcon = (iconName) => ICON_MAP[iconName] || Briefcase;

const STATS = [
  { label: 'Verified Providers', value: '500+', icon: Users },
  { label: 'Services Completed', value: '10k+', icon: TrendingUp },
  { label: 'Cities Covered', value: '25+', icon: MapPin },
  { label: 'Avg. Response Time', value: '< 30min', icon: Clock },
];

const WHY_ITEMS = [
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Get a professional at your door in under 30 minutes with our smart matching system.',
    bg: 'rgba(244,180,0,0.1)', color: '#F4B400',
  },
  {
    icon: Shield,
    title: 'Verified Pros',
    desc: 'Every provider is background-checked, licensed, and rated by your community.',
    bg: 'rgba(96,165,250,0.1)', color: '#60A5FA',
  },
  {
    icon: CheckCircle2,
    title: 'Satisfaction Guaranteed',
    desc: 'Not happy? We rebook or refund — no questions asked.',
    bg: 'rgba(52,211,153,0.1)', color: '#34D399',
  },
  {
    icon: Star,
    title: 'Top-Rated Experts',
    desc: 'Browse reviews from real customers and pick the best for your job.',
    bg: 'rgba(251,191,36,0.1)', color: '#FBBF24',
  },
];

export default function Landing() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div style={{ background: '#000000' }}>

      {/* ── Hero ── */}
      <GradientHeroSection />

      {/* ── Stats Bar ── */}
      <section style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: 'rgba(244,180,0,0.1)',
                      border: '1px solid rgba(244,180,0,0.2)',
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#F4B400]" />
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-[#9099A8] font-medium mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Our Services ── */}
      <section className="py-20" style={{ background: '#000000' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-primary mb-4 inline-flex">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Find the Right Expert{' '}
              <span className="text-[#F4B400]">for Every Job</span>
            </h2>
            <p className="text-[#9099A8] text-base max-w-xl mx-auto">
              From plumbing to electrical — browse verified professionals and book instantly.
            </p>
          </motion.div>

          {/* Service Cards */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#9099A8]">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#F4B400]" />
              <p>Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div
              className="py-14 text-center text-[#9099A8] rounded-2xl border"
              style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              No services available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services.slice(0, 3).map((service, i) => {
                const Icon = getIcon(service.icon);
                const style = ICON_BG[i % ICON_BG.length];
                const providerCount = service.providerCount || 0;
                const encodedName = encodeURIComponent(service.name);

                return (
                  <motion.div
                    key={service.id || i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/services/${encodedName}/providers`}
                      className="group block h-full"
                    >
                      <div
                        className="h-full overflow-hidden transition-all duration-300 flex flex-col rounded-2xl"
                        style={{
                          background: '#14181F',
                          border: '1px solid rgba(255,255,255,0.08)',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(244,180,0,0.3)';
                          e.currentTarget.style.boxShadow = '0 8px 40px rgba(244,180,0,0.1)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Image */}
                        <div className="h-44 w-full overflow-hidden relative">
                          <img
                            src={getServiceImage(service.name)}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,15,20,0.8), transparent)' }} />
                          {/* Icon badge */}
                          <div
                            className="absolute bottom-3 left-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: style.bg, border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <Icon className="w-5 h-5" style={{ color: style.color }} />
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#F4B400] transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-[#9099A8] leading-relaxed mb-4 flex-grow">
                            {service.description}
                          </p>
                          <div
                            className="flex items-center justify-between pt-3 border-t"
                            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                          >
                            <div className="flex items-center gap-1.5 text-[#9099A8] text-xs">
                              <Users className="w-3.5 h-3.5" />
                              <span className="font-bold text-white">{providerCount}</span>
                              <span>Providers</span>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-[#F4B400] group-hover:gap-2 transition-all">
                              Explore <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          {!isLoading && services.length > 0 && (
            <div className="text-center mt-10">
              <GlowButton variant="outline" href="/services" className="px-8 py-3">
                Browse All Services →
              </GlowButton>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-green mb-4 inline-flex">Why Panchayat</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              We Provide Services <span className="text-[#F4B400]">For You</span>
            </h2>
            <p className="text-[#9099A8] text-base max-w-xl mx-auto">
              Designed around your community's needs — transparent, trusted, and always available.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl hover-lift cursor-default"
                  style={{
                    background: '#14181F',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: item.bg, border: `1px solid ${item.color}25` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-[#9099A8] leading-relaxed">{item.desc}</p>
                  <button className="mt-4 text-xs font-bold text-[#F4B400] hover:underline flex items-center gap-1">
                    More <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: '#000000' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(244,180,0,0.06) 0%, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(244,180,0,0.1)', color: '#F4B400', border: '1px solid rgba(244,180,0,0.2)' }}
            >
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Experience the Future<br />of Local Services?
            </h2>
            <p className="text-[#9099A8] mb-8 max-w-lg mx-auto">
              Join thousands of happy customers and verified professionals on Panchayat.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <GlowButton variant="primary" href="/register" className="px-8 py-3.5 text-base">
                Join for Free
              </GlowButton>
              <GlowButton variant="glass" href="/services" className="px-8 py-3.5 text-base">
                Browse Services
              </GlowButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
