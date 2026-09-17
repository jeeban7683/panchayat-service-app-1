import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', leftIcon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${leftIcon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none transition-all text-sm font-medium bg-white ${error ? 'ring-2 ring-red-500/20' : ''} ${className}`}
          style={{
            border: error ? '1px solid rgba(239,68,68,0.5)' : '1.5px solid rgba(139,92,246,0.12)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.04)',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#8B5CF6';
            e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(139,92,246,0.12)';
            e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)';
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
