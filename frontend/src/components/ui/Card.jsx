import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = "bg-slate-800 rounded-xl border border-slate-700 shadow-sm overflow-hidden";
  const hoverClasses = hover ? "hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-300" : "";
  
  return (
    <motion.div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
