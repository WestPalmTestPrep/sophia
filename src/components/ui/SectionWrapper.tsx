'use client';

import { motion } from 'framer-motion';

interface SectionWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function SectionWrapper({ title, onClose, children }: SectionWrapperProps) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0 0 0 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-black overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-black/90 backdrop-blur-md border-b border-white/[0.03]">
        <button
          onClick={onClose}
          className="font-mono text-[10px] text-white/25 hover:text-white/60 active:text-white/40 transition-colors tracking-[0.2em] uppercase min-h-[44px] flex items-center gap-2"
        >
          <span className="text-white/15">&#8592;</span> Back
        </button>

        <motion.h2
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-xs sm:text-sm tracking-[0.3em] text-white/40 uppercase"
        >
          {title}
        </motion.h2>

        <div className="w-16 sm:w-20" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="px-4 sm:px-8 py-6 sm:py-10 max-w-5xl mx-auto"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
