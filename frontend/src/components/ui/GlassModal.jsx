import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlowButton from './GlowButton';

export default function GlassModal({ isOpen, onClose, title, children, className }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 py-16 pointer-events-none md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "w-full max-w-lg glass-panel rounded-2xl pointer-events-auto border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]",
                className
              )}
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 sticky top-0 glass-panel z-10 rounded-t-2xl">
                <h3 className="text-xl font-semibold text-white truncate max-w-[85%]">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full text-dark-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 relative" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto w-full">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
