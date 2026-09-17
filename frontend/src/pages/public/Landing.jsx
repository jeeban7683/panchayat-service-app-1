import React, { useEffect, useState } from 'react';
import {
  ShieldCheck, Zap, CheckCircle2, Loader2,
  Wrench, Briefcase, Droplets, Paintbrush,
  Truck, Camera, HeartPulse, ArrowRight, Users,
  Star, TrendingUp, MapPin, Clock, Quote,
  DollarSign, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import GradientHeroSection from '../../components/ui/GradientHeroSection';
import HowItWorksSection from '../../components/ui/HowItWorksSection';
import { Link } from 'react-router-dom';
import { getServiceImage } from '../../utils/serviceImages';

const ICON_MAP = {
  Droplets, Zap, Briefcase, Wrench, Paintbrush, Truck, Camera, HeartPulse,
};

const getIcon = (iconName) => ICON_MAP[iconName] || Briefcase;

// Color palette for service cards (cycles through)
const CARD_COLORS = [
  { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
  { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
  { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
  { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
];

const STATS = [
  {
    label: 'Verified Professionals',
    sub: 'Background checked & identity verified',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Quick & Easy Booking',
    sub: 'Book in minutes & get instant confirmation',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Secure & Reliable',
    sub: 'Safe payments & 100% secure platform',
    icon: ShieldCheck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: '24/7 Support',
    sub: 'We are here to help anytime you need',
    icon: Clock,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];



const WHY_ITEMS = [
  { icon: ShieldCheck, title: 'Identity & Police Verified Pros', desc: 'Every provider undergoes identity check and background screening before onboarding.', color: 'text-purple-600' },
  { icon: DollarSign, title: 'Transparent Upfront Pricing', desc: 'No hidden charges or unexpected costs. See fixed quotes before making a booking.', color: 'text-emerald-600' },
  { icon: Zap, title: 'Fast Emergency Dispatch', desc: 'Facing an urgent leak or outage? Nearby technicians are dispatched immediately.', color: 'text-blue-600' },
  { icon: RefreshCw, title: '100% Satisfaction Warranty', desc: 'Not satisfied with the job? Enjoy free re-service or quick money-back refund.', color: 'text-rose-600' },
];

const TESTIMONIALS = [
  {
    quote: "Panchayat matched us with a certified plumber within 15 minutes! Very polite and fixed the leak quickly.",
    name: "Sunita Mohanty",
    initials: "SM",
    role: "Resident, Ward 4",
    rating: 5,
    service: "Plumbing Repair",
    avatarColor: 'bg-purple-100 text-purple-700',
  },
  {
    quote: "I registered as an electrician 6 months ago. The platform gives me direct local clients daily. Fantastic!",
    name: "Ramesh Chandra Behera",
    initials: "RC",
    role: "Verified Provider",
    rating: 5,
    service: "Electrical Maintenance",
    avatarColor: 'bg-blue-100 text-blue-700',
  },
  {
    quote: "Transparent pricing and verified technicians. Booking home maintenance is super easy now.",
    name: "Priyanka Sahoo",
    initials: "PS",
    role: "Homeowner",
    rating: 5,
    service: "Home Painting",
    avatarColor: 'bg-emerald-100 text-emerald-700',
  },
];

export default function Landing() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

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

  const filteredServices = services.filter(service => {
    if (activeTab === 'All') return true;
    const name = (service.name || '').toLowerCase();
    if (activeTab === 'Repairs') return name.includes('repair') || name.includes('electric') || name.includes('plumb');
    if (activeTab === 'Maintenance') return name.includes('clean') || name.includes('paint') || name.includes('ro');
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-purple-500 selection:text-white">

      {/* Hero Section */}
      <GradientHeroSection />


      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Featured Services */}
      <section className="py-16 bg-slate-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Popular Services</h2>
            <p className="text-gray-500 text-sm mt-2">Select a service, view verified technicians, and book instantly.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center items-center gap-2 mb-10">
            {['All', 'Repairs', 'Maintenance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
              >
                {tab === 'All' ? 'All Services' : tab}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 rounded-2xl bg-white border border-gray-200">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-purple-600" />
              <p className="text-xs font-medium">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="py-12 text-center text-gray-400 rounded-2xl bg-white border border-gray-200 text-xs font-medium">
              No services found for the selected category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredServices.slice(0, 4).map((service, i) => {
                const Icon = getIcon(service.icon);
                const providerCount = service.providerCount || 4;
                const encodedName = encodeURIComponent(service.name);
                const palette = CARD_COLORS[i % CARD_COLORS.length];

                return (
                  <Link
                    key={service.id || i}
                    to={`/services/${encodedName}/providers`}
                    className="group block"
                  >
                    <div className="h-full rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">

                      {/* Service Image Header */}
                      <div className="h-32 w-full overflow-hidden relative">
                        <img
                          src={getServiceImage(service.name)}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent" />
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                            <Icon className={`w-3.5 h-3.5 ${palette.icon}`} />
                          </div>
                          <span className="text-white text-[10px] font-bold drop-shadow">{service.name}</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          Starts ₹199
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 flex flex-col flex-grow gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-xs font-bold text-gray-900 group-hover:${palette.icon} transition-colors`}>
                            {service.name}
                          </h3>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                          {service.description || 'Verified local specialists available for instant online booking.'}
                        </p>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-semibold">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {providerCount} Active Pros
                          </span>
                          <span className="text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Book <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!isLoading && services.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all"
              >
                Browse All Services ({services.length}) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Why Choose Panchayat</h2>
            <p className="text-gray-500 text-sm mt-2">Security, transparency, and top-rated workmanship for your peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col gap-3"
                >
                  <Icon className={`w-7 h-7 ${item.color}`} />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials — initials avatars, no photos */}
      <section className="py-16 bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">What Users Say</h2>
            <p className="text-gray-500 text-sm mt-2">Real feedback from community residents and verified technicians.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-gray-200" />
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  {/* Initials avatar — no image */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${t.avatarColor}`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                    <p className="text-[11px] text-purple-600 font-semibold">{t.role} · {t.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-purple-600 p-10 sm:p-14 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Need Reliable Home Services Right Now?
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm font-normal leading-relaxed max-w-xl mx-auto mb-6">
            Book verified local technicians in seconds or register to start offering your services on Panchayat.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <Link
              to="/services"
              className="px-7 py-3 text-xs font-bold bg-white text-purple-700 hover:bg-purple-50 rounded-full transition-all"
            >
              Book a Service
            </Link>
            <Link
              to="/register"
              className="px-7 py-3 text-xs font-bold bg-white/10 text-white border border-white/30 hover:bg-white/20 rounded-full transition-all"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
