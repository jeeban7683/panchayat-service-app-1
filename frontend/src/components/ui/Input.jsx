import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', leftIcon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9099A8]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${leftIcon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl text-white placeholder-[#4B5563] outline-none transition-all text-sm font-medium ${error ? 'ring-2 ring-red-500/30' : ''} ${className}`}
          style={{
            background: '#1A1F28',
            border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#F4B400';
            e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
