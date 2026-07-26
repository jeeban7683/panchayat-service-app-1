import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

/**
 * GlowButton — Premium Black & Gold luxury button component.
 * Same API: variant, href, onClick, fullWidth, icon, type, className, ...props
 */
export default function GlowButton({
  children,
  onClick,
  className,
  variant = 'primary',
  href,
  icon: Icon,
  type = 'button',
  fullWidth = false,
  disabled = false,
  ...props
}) {
  const base =
    'relative inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent px-6 py-3 text-[0.9375rem] leading-none min-h-[48px]';

  const variants = {
    primary:
      'bg-[#F4B400] text-black hover:bg-[#FFC928] focus:ring-[#F4B400] shadow-[0_4px_20px_rgba(244,180,0,0.25)] hover:shadow-[0_6px_30px_rgba(244,180,0,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    outline:
      'bg-transparent text-[#F4B400] border-2 border-[#F4B400] hover:bg-[#F4B400] hover:text-black focus:ring-[#F4B400] hover:shadow-[0_6px_24px_rgba(244,180,0,0.3)] hover:-translate-y-0.5 active:translate-y-0',
    glass:
      'bg-white/5 text-white border border-white/15 hover:bg-white/10 hover:border-[#F4B400]/40 focus:ring-[#F4B400]/50 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0',
    green:
      'bg-[#F4B400] text-black hover:bg-[#FFC928] focus:ring-[#F4B400] shadow-[0_4px_20px_rgba(244,180,0,0.25)] hover:shadow-[0_6px_30px_rgba(244,180,0,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    secondary:
      'bg-[#1A1F28] text-[#C9CED6] border border-white/10 hover:bg-[#1E2530] hover:text-white hover:border-white/20 focus:ring-white/20 hover:-translate-y-0.5 active:translate-y-0',
    danger:
      'bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500 hover:text-white hover:border-red-500 focus:ring-red-500 hover:-translate-y-0.5 active:translate-y-0',
  };

  const disabledClasses = 'opacity-40 cursor-not-allowed pointer-events-none';

  const finalClassName = cn(
    base,
    variants[variant] ?? variants.primary,
    fullWidth ? 'w-full' : '',
    disabled ? disabledClasses : '',
    className
  );

  if (href) {
    return (
      <Link to={href} className={finalClassName} {...props}>
        {Icon && <Icon className="w-5 h-5 shrink-0" />}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span>{children}</span>
    </motion.button>
  );
}
