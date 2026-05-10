import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function GlowButton({
  children,
  onClick,
  className,
  variant = 'primary',
  href,
  icon: Icon,
  type = 'button',
  fullWidth = false,
  ...props
}) {

  const baseClasses = "relative group flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden";

  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-500",
    secondary: "bg-dark-800 text-dark-50 border border-dark-700 hover:border-accent-blue/50 hover:bg-dark-700",
    glass: "glass-card text-white hover:border-accent-blue/50",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
  };

  const glowColors = {
    primary: "from-primary-400 to-accent-blue",
    secondary: "from-dark-400 to-dark-300",
    glass: "from-accent-purple to-accent-blue",
    danger: "from-red-400 to-red-600"
  };

  const Content = (
    <>
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r",
        glowColors[variant]
      )} />
      {Icon && <Icon className="w-5 h-5 relative z-10" />}
      <span className="relative z-10">{children}</span>
    </>
  );

  const finalClassName = cn(
    baseClasses,
    variants[variant],
    fullWidth ? "w-full" : "",
    variant === 'primary' || variant === 'glass' ? 'hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]' : '',
    className
  );

  if (href) {
    return (
      <Link to={href} className={finalClassName} {...props}>
        {Content}
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={finalClassName}
      {...props}
    >
      {Content}
    </motion.button>
  );
}
