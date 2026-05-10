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
    <div className={cn("glass-panel p-6 rounded-2xl", className)}>
      <h3 className="text-xl font-semibold text-white mb-8">Booking Progress</h3>
      <div className="relative">
        <div className="absolute left-6 top-4 bottom-4 w-px bg-dark-700" />
        
        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;

          return (
            <div key={index} className="relative flex items-start mb-8 last:mb-0 group">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className={cn(
                  "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500",
                  isCompleted ? "bg-accent-blue/20 border-accent-blue text-accent-blue neon-glow" :
                  isCurrent ? "bg-dark-800 border-white text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" :
                  "bg-dark-900 border-dark-600 text-dark-500"
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
                    "text-lg font-medium transition-colors",
                    isCompleted || isCurrent ? "text-white neon-text-glow" : "text-dark-400"
                  )}
                >
                  {step.title}
                </motion.h4>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + 0.2 }}
                  className="text-sm text-dark-300 mt-1"
                >
                  {step.description}
                </motion.p>
              </div>

              {isCompleted && index < timelineSteps.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="absolute left-6 top-12 w-px bg-accent-blue shadow-[0_0_10px_rgba(6,182,212,0.8)]"
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
