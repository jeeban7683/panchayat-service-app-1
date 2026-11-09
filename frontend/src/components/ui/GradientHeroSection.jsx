import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Phone, Tag, Shield,
  Wrench, Droplets, Zap, Paintbrush, Hammer,
  Sparkles, Bug, LayoutGrid, MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';
import plumbingLogo from '../../assets/service-icons/plumbing.png';

const TRUST_BADGES = [
  { icon: ShieldCheck, title: 'Verified', sub: 'Background Checked' },
  { icon: Tag, title: 'Affordable', sub: 'Transparent Pricing' },
  { icon: Zap, title: 'Fast', sub: 'Quick Response' },
  { icon: Shield, title: 'Safe', sub: 'Your Safety First' },
];

const POPULAR_CATEGORIES = [
  { name: 'Plumbing', icon: Droplets, image: plumbingLogo, iconClass: 'bg-blue-50 text-blue-600' },
  { name: 'Electrical', icon: Zap, iconClass: 'bg-amber-50 text-amber-500' },
  { name: 'Carpentry', icon: Hammer, iconClass: 'bg-orange-50 text-orange-600' },
  { name: 'Appliance Repair', icon: Wrench, iconClass: 'bg-slate-100 text-slate-600' },
  { name: 'Cleaning', icon: Sparkles, iconClass: 'bg-cyan-50 text-cyan-600' },
  { name: 'Painting', icon: Paintbrush, iconClass: 'bg-pink-50 text-pink-600' },
  { name: 'Pest Control', icon: Bug, iconClass: 'bg-lime-50 text-lime-600' },
  { name: 'More', icon: LayoutGrid, iconClass: 'bg-purple-50 text-purple-600' },
];

const EXPLORE_CATEGORIES = [
  { name: 'Home Repairs', subtitle: 'Fix it fast', icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { name: 'Electrical', subtitle: 'Power your home', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'Home Care', subtitle: 'Fresh & spotless', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
];

const FEATURED_SERVICES = [
  {
    name: 'Plumbing Service',
    desc: 'Leak repair, pipe fitting, drain cleaning and more.',
    price: 'Starts â‚¹199',
    icon: Droplets,
    time: '30 mins',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'Plumbing',
  },
  {
    name: 'Electrical Repair',
    desc: 'Wiring, switchboard fixing, short circuit repair & MCB replacement.',
    price: 'Starts â‚¹249',
    icon: Zap,
    time: '20 mins',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'Electrical',
  },
  {
    name: 'RO Water Maintenance',
    desc: 'Filter replacement, membrane check & complete purification service.',
    price: 'Starts â‚¹299',
    icon: Wrench,
    time: '45 mins',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'RO',
  },
  {
    name: 'Home Painting',
    desc: 'Interior wall painting, texture finish & waterproof coating.',
    price: 'Starts â‚¹499',
    icon: Paintbrush,
    time: 'Same Day',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'Painting',
  },
  {
    name: 'Carpentry Work',
    desc: 'Furniture repair, door fittings, lock installation & custom woodwork.',
    price: 'Starts â‚¹349',
    icon: Hammer,
    time: '40 mins',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'Carpentry',
  },
];

export default function GradientHeroSection({ className }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [didSwipe, setDidSwipe] = useState(false);

  React.useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_SERVICES.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? FEATURED_SERVICES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % FEATURED_SERVICES.length);
  };

  const handleTouchStart = (e) => {
    setIsPaused(true);
    setDidSwipe(false);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setTouchStartX(x);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = touchStartX - x;

    if (Math.abs(diff) > 35 && !didSwipe) {
      if (diff > 0) handleNext();
      else handlePrev();
      setDidSwipe(true);
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setTouchStartX(null);
  };

  return (
    <div className={cn('bg-[#F5F3FF] min-h-[calc(100vh-4rem)] flex flex-col justify-between pb-6 text-gray-900 overflow-x-hidden', className)}>

      {/* Location header */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-purple-100 shadow-xs">
          <MapPin className="w-5 h-5 text-purple-600 fill-purple-100 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold leading-none text-gray-900 truncate">Beherasahi</p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">Nilakantha Nagar, Nayapalli, Bhubaneswar</p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Hero Row â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 w-full flex-1 flex flex-col justify-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center my-auto">

          {/* Left Column â€” Content (Fully visible & responsive on mobile + desktop) */}
          <div className="flex flex-col justify-between items-start gap-4 sm:gap-5 py-2">

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200 bg-white shadow-xs">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-600">
                Your Trusted Local Service Platform
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-black text-gray-900 leading-[1.12] tracking-tight">
                Professional Local Experts
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-black text-purple-600 leading-[1.12] tracking-tight mt-1">
                Right At Your Doorstep
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-lg font-medium leading-relaxed">
              Find verified local professionals for plumbing, electrical, carpentry, repairs, and home maintenance. Instant booking & transparent pricing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto pt-1">
              <Link
                to="/services"
                className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Book a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="flex-1 sm:flex-initial inline-flex justify-center items-center px-6 sm:px-7 py-3 rounded-full bg-white border border-purple-200 text-gray-900 font-extrabold text-xs sm:text-sm hover:bg-purple-50 transition-all shadow-xs cursor-pointer"
              >
                Become a Provider
              </Link>
            </div>

            {/* Helpline */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 pt-1 flex-wrap">
              <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="font-medium">Need Immediate Help?</span>
              <strong className="text-gray-900 font-bold">+91 98765 43210</strong>
              <span className="text-purple-600 font-bold">(24/7 Helpline)</span>
            </div>

            {/* Mobile Explore categories preview */}
            <div className="w-full pt-2 lg:hidden">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Quick Explore</p>
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none snap-x">
                {EXPLORE_CATEGORIES.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <Link
                      key={category.name}
                      to={`/services?search=${encodeURIComponent(category.name)}`}
                      className="min-w-[130px] flex-1 snap-start rounded-2xl border border-purple-100 bg-white px-3 py-3 text-center shadow-xs hover:border-purple-300 transition-all"
                    >
                      <div className={`mx-auto mb-2 w-10 h-10 rounded-xl ${category.bg} flex items-center justify-center`}>
                        <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <p className="text-xs font-bold text-gray-900">{category.name}</p>
                      <p className="text-[10px] text-gray-500">{category.subtitle}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column â€” Spotlight Carousel */}
          <div className="w-full flex flex-col items-center lg:items-end justify-center py-2 select-none overflow-hidden">
            <div className="w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center justify-between h-full lg:ml-auto">

              {/* Spotlight Title */}
              <div className="w-full mb-2 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  In the spotlight
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                  Top Rated
                </span>
              </div>

              {/* 3D Carousel Stage */}
              <div
                className="relative w-full h-[290px] sm:h-[360px] flex items-center justify-center my-auto touch-pan-y cursor-grab active:cursor-grabbing select-none overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                  setIsPaused(false);
                  handleTouchEnd();
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
              >
                {FEATURED_SERVICES.map((item, idx) => {
                  let offset = idx - currentIndex;
                  if (offset > FEATURED_SERVICES.length / 2) offset -= FEATURED_SERVICES.length;
                  if (offset < -FEATURED_SERVICES.length / 2) offset += FEATURED_SERVICES.length;
                  if (Math.abs(offset) > 1) return null;
                  const isActive = offset === 0;

                  return (
                    <div
                      key={item.name}
                      className={cn(
                        'absolute transition-all duration-500 ease-out flex items-center justify-center',
                        isActive ? 'z-20 opacity-100 scale-100' : 'z-10 opacity-70 scale-90 pointer-events-none'
                      )}
                      style={{
                        transform: `translateX(${offset * 125}px) scale(${isActive ? 1 : 0.88})`,
                      }}
                      onClick={() => {
                        if (didSwipe) {
                          setDidSwipe(false);
                          return;
                        }
                        navigate(`/services?search=${encodeURIComponent(item.searchQuery)}`);
                      }}
                    >
                      <div className="relative w-[190px] sm:w-[240px] h-[260px] sm:h-[330px] rounded-3xl overflow-hidden shadow-xl border border-white/20 bg-slate-900 group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full rounded-3xl object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white border border-white/10">
                            {item.badge}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-600 backdrop-blur-md text-[10px] font-black text-white shadow-md border border-purple-400/30">
                            {item.price}
                          </span>
                        </div>

                        <div className="absolute bottom-3 inset-x-3 z-20">
                          <h3 className="text-sm sm:text-base font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center gap-1.5 mt-2">
                {FEATURED_SERVICES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                      dotIdx === currentIndex
                        ? 'w-6 bg-purple-600'
                        : 'w-1.5 bg-purple-200 hover:bg-purple-300'
                    )}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* â”€â”€ Trust Badges & Popular Services Categories Bar â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">

        {/* 4 Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 py-3 mb-6 border-y border-purple-200/50">
          {TRUST_BADGES.map((badge, idx) => {
            const BadgeIcon = badge.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 sm:gap-3 p-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/50">
                  <BadgeIcon className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{badge.title}</h4>
                  <p className="text-[10px] text-gray-500 font-medium truncate">{badge.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Services Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Popular Services
            </h2>
            <Link
              to="/services"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
            >
              View all services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 8 Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {POPULAR_CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={cat.name === 'More' ? '/services' : `/services?search=${encodeURIComponent(cat.name)}`}
                  className="min-h-[96px] bg-white hover:bg-purple-50/80 border border-purple-100/70 hover:border-purple-300 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 shadow-2xs group hover:-translate-y-0.5"
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center overflow-hidden ${cat.iconClass} transition-colors duration-200`}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={`${cat.name} logo`}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <CatIcon className="w-5 h-5 stroke-[1.8]" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate w-full">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

      </section>

    </div>
  );
}
