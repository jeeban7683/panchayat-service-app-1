import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

/**
 * GlowButton — Soft UI Dashboard Lavender Button Component.
 * Variants: primary (lavender gradient), secondary (soft white/lavender), outline, green, glass, danger
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
    'relative inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 px-6 py-2.5 text-[0.9375rem] leading-none min-h-[46px]';

  const variants = {
    primary:
      'bg-[#7C3AED] text-white shadow-sm hover:bg-[#6D28D9]',
    outline:
      'bg-white text-[#8B5CF6] border-1.5 border-[#DDD6FE] hover:bg-[#F3F0FF] hover:border-[#8B5CF6] shadow-[0_4px_14px_rgba(99,102,241,0.05)]',
    glass:
      'bg-white/80 text-[#8B5CF6] border border-[#DDD6FE] hover:bg-white backdrop-blur-sm shadow-[0_4px_14px_rgba(99,102,241,0.05)]',
    green:
      'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
    secondary:
      'bg-white text-[#8B5CF6] border border-[#DDD6FE] hover:bg-[#F3F0FF] hover:text-[#7C3AED] shadow-[0_4px_14px_rgba(99,102,241,0.05)]',
    danger:
      'bg-[#FEE2E2] text-[#EF4444] border border-red-200 hover:bg-[#EF4444] hover:text-white',
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
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </motion.button>
  );
}
