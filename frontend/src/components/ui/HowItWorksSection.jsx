import React from 'react';
import { Search, User, Calendar, Check, Users, UserCheck, CalendarCheck, ShieldCheck } from 'lucide-react';
import relaxIllustration from '../../assets/how_it_works_relax.png';

const STEPS = [
  {
    step: 1,
    icon: Search,
    title: 'Search',
    subtitle: 'Find the service you need',
  },
  {
    step: 2,
    icon: User,
    title: 'Choose',
    subtitle: 'Select from verified professionals',
  },
  {
    step: 3,
    icon: Calendar,
    title: 'Book',
    subtitle: 'Pick a time and confirm',
  },
  {
    step: 4,
    icon: Check,
    title: 'Relax',
    subtitle: 'Sit back and get the job done',
  },
];

const STATS_ITEMS = [
  {
    icon: Users,
    value: '10K+',
    label: 'Happy Customers',
  },
  {
    icon: UserCheck,
    value: '500+',
    label: 'Verified Professionals',
  },
  {
    icon: CalendarCheck,
    value: '25K+',
    label: 'Services Completed',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Satisfaction Guaranteed',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-[#F6F4FF] py-14 lg:py-16 border-y border-purple-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 sm:mb-12 gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            How It Works
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Simple steps to get your work done
          </span>
        </div>

        {/* Body Content Layout: Steps Flow + 3D Sofa Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Steps Workflow (Left / Center) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 relative">
              {STEPS.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isLast = index === STEPS.length - 1;

                return (
                  <div key={stepItem.step} className="flex flex-col relative group">

                    {/* Step Header Node (Number Badge + Icon + Dashed Line) */}
                    <div className="flex items-center gap-2 relative">
                      {/* Number Circle */}
                      <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
                        {stepItem.step}
                      </div>

                      {/* Icon Circle */}
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-200/60 shadow-sm group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      {/* Connecting Line (Horizontal on md/lg screens, hidden for last step) */}
                      {!isLast && (
                        <div className="hidden md:block flex-1 h-0 border-t-2 border-dashed border-purple-200/80 mx-1 self-center" />
                      )}
                    </div>

                    {/* Step Text Info */}
                    <div className="mt-4 pr-2">
                      <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-[#7C3AED] transition-colors">
                        {stepItem.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[150px]">
                        {stepItem.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Illustration: Relaxing on Sofa (using mix-blend-multiply so white bg blends completely) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[280px] lg:max-w-[340px]">
              <img
                src={relaxIllustration}
                alt="Sit back and relax character on purple sofa"
                className="w-full h-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Bottom Trust & Statistics Bar */}
        <div className="mt-12 bg-white border border-purple-100/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {STATS_ITEMS.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3.5 group">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-100 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors duration-300">
                    <StatIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-[#7C3AED] leading-none mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
