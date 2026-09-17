import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function BookingTimeline({ currentStep = 2, steps = [], className }) {
  const defaultSteps = [
    { title: 'Requested', description: 'Provider notified', icon: Clock },
    { title: 'Accepted', description: 'Provider confirmed', icon: CheckCircle2 },
    { title: 'In Progress', description: 'Working on it', icon: Circle },
    { title: 'Completed', description: 'Job finished', icon: CheckCircle2 },
  ];

  const timelineSteps = steps.length ? steps : defaultSteps;

  return (
    <div className={cn("p-6 rounded-2xl bg-white border border-purple-100 shadow-sm", className)}>
      <h3 className="text-xl font-bold text-gray-900 mb-8">Booking Progress</h3>
      <div className="relative">
        <div className="absolute left-6 top-4 bottom-4 w-1 bg-purple-100 rounded-full" />
        
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          const isLineGreen = index < currentStep;
          const Icon = step.icon;

          return (
            <div key={index} className="relative flex items-start mb-8 last:mb-0 group">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className={cn(
                  "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200" :
                  isCurrent ? "bg-emerald-500 border-emerald-500 text-white ring-4 ring-emerald-100" :
                  "bg-purple-50 border-purple-100 text-gray-400"
                )}
              >
                <Icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
              </motion.div>
              
              <div className="ml-6 pt-2">
                <motion.h4 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + 0.1 }}
                  className={cn(
                    "text-lg font-bold transition-colors",
                    isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.title}
                </motion.h4>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + 0.2 }}
                  className="text-sm text-gray-500 mt-1 font-medium"
                >
                  {step.description}
                </motion.p>
              </div>

              {isLineGreen && index < timelineSteps.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="absolute left-[23px] top-12 w-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full"
                  style={{ height: 'calc(100% + 2rem)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
