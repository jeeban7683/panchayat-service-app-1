import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function NeonStatusBadge({ status, className }) {
  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-500/10 text-green-400 border-green-500/20', glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]' },
    pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', glow: 'shadow-[0_0_10px_rgba(234,179,8,0.3)]' },
    completed: { label: 'Completed', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20', glow: 'neon-glow' },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]' },
    default: { label: status || 'Unknown', color: 'bg-dark-700 text-dark-300 border-dark-600', glow: '' }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;

  return (
    <motion.span 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md",
        config.color,
        config.glow,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", config.color.replace('/10', '').replace('text', 'bg'))} />
      {config.label}
    </motion.span>
  );
}
