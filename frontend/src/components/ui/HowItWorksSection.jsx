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
    <section className="w-full bg-[#F6F4FF] py-10 sm:py-14 lg:py-16 border-y border-purple-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-2 text-center sm:text-left">
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
              Process
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Simple steps to get your work done quickly & reliably
            </p>
          </div>
        </div>

        {/* Body Content Layout: Steps Flow + 3D Sofa Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

          {/* Steps Workflow (Compact 2x2 grid on mobile, horizontal flow on md+) */}
          <div className="lg:col-span-8 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 relative w-full">
              {STEPS.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isLast = index === STEPS.length - 1;

                return (
                  <div
                    key={stepItem.step}
                    className="flex flex-col items-center text-center relative group w-full bg-white/70 sm:bg-transparent rounded-2xl p-3 sm:p-2 border border-purple-100/50 sm:border-0 shadow-2xs sm:shadow-none"
                  >
                    {/* Step Header Node (Number Badge + Icon Circle + Connecting Line) */}
                    <div className="flex items-center justify-center gap-2 relative w-full">
                      {/* Number Circle */}
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#7C3AED] text-white font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform z-10">
                        {stepItem.step}
                      </div>

                      {/* Icon Circle */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-200/60 shadow-xs group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300 z-10">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                      </div>

                      {/* Horizontal Connecting Line (on md/lg screens, cleanly connecting steps) */}
                      {!isLast && (
                        <div className="hidden md:block absolute top-1/2 left-[65%] w-[80%] h-0 border-t-2 border-dashed border-purple-200/80 -translate-y-1/2 z-0 pointer-events-none" />
                      )}
                    </div>

                    {/* Step Text Info */}
                    <div className="mt-2.5 sm:mt-3 text-center w-full">
                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-[#7C3AED] transition-colors truncate sm:whitespace-normal">
                        {stepItem.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-snug line-clamp-2 max-w-[150px] mx-auto">
                        {stepItem.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Illustration: Relaxing on Sofa */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end items-center mt-2 sm:mt-4 lg:mt-0">
            <div className="relative w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[320px]">
              <img
                src={relaxIllustration}
                alt="Sit back and relax character on purple sofa"
                className="w-full h-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Bottom Trust & Statistics Bar */}
        <div className="mt-8 sm:mt-12 bg-white border border-purple-100/80 rounded-2xl p-3.5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 items-center">
            {STATS_ITEMS.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5 group p-1">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-100 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors duration-300">
                    <StatIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-lg font-black text-[#7C3AED] leading-none mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-600">
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
