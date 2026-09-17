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
  { name: 'Home Repairs', subtitle: 'Fix it fast', icon: Wrench, color: 'text-cyan-300', bg: 'bg-cyan-400/10' },
  { name: 'Electrical', subtitle: 'Power your home', icon: Zap, color: 'text-amber-300', bg: 'bg-amber-400/10' },
  { name: 'Home Care', subtitle: 'Fresh & spotless', icon: Sparkles, color: 'text-pink-300', bg: 'bg-pink-400/10' },
];

const FEATURED_SERVICES = [
  {
    name: 'Plumbing Service',
    desc: 'Leak repair, pipe fitting, drain cleaning and more.',
    price: 'Starts ₹199',
    icon: Droplets,
    time: '30 mins',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'Plumbing',
  },
  {
    name: 'Electrical Repair',
    desc: 'Wiring, switchboard fixing, short circuit repair & MCB replacement.',
    price: 'Starts ₹249',
    icon: Zap,
    time: '20 mins',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'Electrical',
  },
  {
    name: 'RO Water Maintenance',
    desc: 'Filter replacement, membrane check & complete purification service.',
    price: 'Starts ₹299',
    icon: Wrench,
    time: '45 mins',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'RO',
  },
  {
    name: 'Home Painting',
    desc: 'Interior wall painting, texture finish & waterproof coating.',
    price: 'Starts ₹499',
    icon: Paintbrush,
    time: 'Same Day',
    badge: 'Verified Pro',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
    searchQuery: 'Painting',
  },
  {
    name: 'Carpentry Work',
    desc: 'Furniture repair, door fittings, lock installation & custom woodwork.',
    price: 'Starts ₹349',
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

  // Keep the feature area useful without relying on an attention-grabbing 3D animation.
  React.useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_SERVICES.length);
    }, 3000);
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
    <div className={cn('bg-[#F5F3FF] min-h-[calc(100vh-4rem)] flex flex-col justify-between pb-4 text-gray-900', className)}>

      {/* Mobile-style location header */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 pt-6 lg:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-purple-600 fill-purple-100" />
          <div>
            <p className="text-base font-bold leading-none text-gray-900">Beherasahi</p>
            <p className="text-xs text-gray-500 mt-1">Nilakantha Nagar, Nayapalli, Bhubaneswar</p>
          </div>
        </div>
      </div>

      {/* ── Hero Row ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-8 pt-4 pb-2 w-full flex-1 flex flex-col justify-center">
        <div className="mb-8 lg:hidden">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Explore</h2>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
            {EXPLORE_CATEGORIES.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/services?search=${encodeURIComponent(category.name)}`}
                  className="min-w-[145px] snap-start rounded-2xl border border-purple-100 bg-white px-3 py-4 text-center shadow-xs"
                >
                  <div className={`mx-auto mb-3 w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center`}>
                    <CategoryIcon className={`w-7 h-7 ${category.color}`} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{category.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{category.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch my-auto">

          {/* Left Column — Content */}
          <div className="hidden lg:flex flex-col justify-between items-start gap-3.5 py-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200 bg-white shadow-xs">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600">
                Your Trusted Local Service Platform
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] font-black text-gray-900 leading-[1.08] tracking-tight">
                Professional Local Experts
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] font-black text-purple-600 leading-[1.08] tracking-tight mt-1">
                Right At Your Doorstep
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-600 max-w-md font-medium">
              Verified local experts. Fast dispatch & upfront pricing.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Book a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-7 py-3 rounded-full bg-white border border-gray-300 text-gray-900 font-extrabold text-sm hover:bg-gray-50 transition-all shadow-xs hover:border-gray-400 cursor-pointer"
              >
                Become a Provider
              </Link>
            </div>

            {/* Helpline */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 pt-0.5">
              <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="font-medium">Need Immediate Help?</span>
              <strong className="text-gray-900 font-bold text-xs sm:text-sm">+91 98765 43210</strong>
              <span className="text-purple-600 font-bold">(24/7 Helpline)</span>
            </div>

          </div>

          {/* Right Column — Spotlight Carousel */}
          <div className="w-full flex flex-col items-center lg:items-end justify-between py-0 select-none">
            <div className="w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center justify-between h-full lg:ml-auto">

              {/* Spotlight Title */}
              <div className="w-full mb-1 text-left">
                <h2 className="text-2xl sm:text-xl font-black text-gray-900 tracking-tight">
                  In the spotlight
                </h2>
              </div>

              {/* 3D Carousel Stage */}
              <div
                className="relative w-[calc(100vw-2.5rem)] sm:w-full h-[290px] sm:h-[380px] flex items-center justify-center my-auto touch-pan-y cursor-grab active:cursor-grabbing select-none overflow-visible"
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
                        isActive ? 'z-20 opacity-100' : 'z-10 opacity-100 pointer-events-none'
                      )}
                      style={{ transform: `translateX(${offset * 140}px) scale(1)` }}
                      onClick={() => {
                        if (didSwipe) {
                          setDidSwipe(false);
                          return;
                        }
                        navigate(`/services?search=${encodeURIComponent(item.searchQuery)}`);
                      }}
                    >
                      <div className="relative w-[190px] sm:w-[260px] h-[255px] sm:h-[350px] rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.45)] border border-white/20 bg-slate-900 group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full rounded-3xl object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                            {item.badge}
                          </span>
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-purple-600 backdrop-blur-md text-[11px] font-black text-white shadow-md border border-purple-400/30">
                            {item.price}
                          </span>
                        </div>

                        <div className="absolute bottom-3 inset-x-3 z-20">
                          <h3 className="text-base font-black tracking-tight text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center gap-1.5 mt-1">
                {FEATURED_SERVICES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={cn(
                            'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                      dotIdx === currentIndex
                        ? 'w-5 bg-purple-600'
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

      {/* ── Trust Badges & Popular Services Categories Bar (Inserted in Blank Space) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">

        {/* 4 Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 mb-6 border-y border-purple-200/50">
          {TRUST_BADGES.map((badge, idx) => {
            const BadgeIcon = badge.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/50">
                  <BadgeIcon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{badge.title}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">{badge.sub}</p>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {POPULAR_CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={cat.name === 'More' ? '/services' : `/services?search=${encodeURIComponent(cat.name)}`}
                  className="min-h-[102px] bg-white hover:bg-purple-50/80 border border-purple-100/70 hover:border-purple-300 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 shadow-2xs group hover:-translate-y-0.5"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden ${cat.iconClass} transition-colors duration-200`}>
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
                  <span className="text-[11px] font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
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
