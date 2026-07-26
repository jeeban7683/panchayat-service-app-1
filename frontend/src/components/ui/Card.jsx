import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseStyle = {
    background: '#14181F',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
  };

  return (
    <motion.div
      className={className}
      style={baseStyle}
      whileHover={hover ? { y: -4, borderColor: 'rgba(244,180,0,0.25)' } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
