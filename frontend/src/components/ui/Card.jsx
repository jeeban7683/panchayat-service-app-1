import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  const baseStyle = {
    background: '#FFFFFF',
    borderRadius: '1rem',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(17,24,39,0.06)',
  };

  return (
    <motion.div
      className={className}
      style={baseStyle}
      whileHover={hover ? { y: -2, boxShadow: '0 4px 10px rgba(17,24,39,0.08)' } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
