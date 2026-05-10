import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AnimatedStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  className 
}) {
  const isPositive = trend === 'up';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-accent-blue/10 transition-shadow",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-32 bg-accent-blue/5 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-accent-blue/10 transition-colors" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-dark-300">{title}</p>
          <h4 className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <Icon className="w-6 h-6 text-accent-blue" />
          </div>
        )}
      </div>

      {trendValue && (
        <div className="relative z-10 mt-4 flex items-center text-sm">
          <span
            className={cn(
              "flex items-center font-medium",
              isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {trendValue}
          </span>
          <span className="ml-2 text-dark-400">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
