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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 sm:mb-12 gap-2 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Simple steps to get your work done
            </p>
          </div>
        </div>

        {/* Body Content Layout: Steps Flow + 3D Sofa Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Steps Workflow (Centered on mobile, horizontal flow on desktop) */}
          <div className="lg:col-span-8 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4 relative w-full">
              {STEPS.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isLast = index === STEPS.length - 1;

                return (
                  <div
                    key={stepItem.step}
                    className="flex flex-col items-center text-center sm:items-start sm:text-left relative group w-full"
                  >
                    {/* Step Header Node (Number Badge + Icon Circle + Connecting Line) */}
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 relative w-full sm:w-auto">
                      {/* Number Circle */}
                      <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
                        {stepItem.step}
                      </div>

                      {/* Icon Circle */}
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-200/60 shadow-sm group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      {/* Horizontal Connecting Line (on md/lg screens, hidden for last step) */}
                      {!isLast && (
                        <div className="hidden md:block flex-1 h-0 border-t-2 border-dashed border-purple-200/80 mx-1 self-center" />
                      )}
                    </div>

                    {/* Step Text Info */}
                    <div className="mt-3 text-center sm:text-left w-full sm:w-auto">
                      <h3 className="text-base sm:text-sm font-extrabold text-gray-900 group-hover:text-[#7C3AED] transition-colors">
                        {stepItem.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[200px] sm:max-w-[150px] mx-auto sm:mx-0">
                        {stepItem.subtitle}
                      </p>
                    </div>

                    {/* Vertical connecting line on mobile between steps */}
                    {!isLast && (
                      <div className="md:hidden flex justify-center w-full my-2">
                        <div className="w-0.5 h-6 border-l-2 border-dashed border-purple-300/80" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Illustration: Relaxing on Sofa */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end items-center mt-4 lg:mt-0">
            <div className="relative w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[340px]">
              <img
                src={relaxIllustration}
                alt="Sit back and relax character on purple sofa"
                className="w-full h-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Bottom Trust & Statistics Bar */}
        <div className="mt-12 bg-white border border-purple-100/80 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
            {STATS_ITEMS.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3.5 group p-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-100 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors duration-300">
                    <StatIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-[#7C3AED] leading-none mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-gray-600">
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
