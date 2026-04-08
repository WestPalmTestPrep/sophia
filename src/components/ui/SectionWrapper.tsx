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
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-black overflow-y-auto overscroll-contain"
    >
      {/* Subtle gold accent line at top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)' }}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-black/90 backdrop-blur-md border-b border-white/[0.03]" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <button
          onClick={onClose}
          className="font-mono text-[10px] text-white/50 hover:text-[rgba(212,175,55,0.8)] active:text-white/60 transition-colors tracking-[0.2em] uppercase min-h-[44px] flex items-center gap-2"
        >
          <span className="text-white/40">&#8592;</span> Back
        </button>

        <motion.h2
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-xs sm:text-sm tracking-[0.3em] uppercase"
          style={{ color: 'rgba(212, 175, 55, 0.75)' }}
        >
          {title}
        </motion.h2>

        <div className="w-12 sm:w-20" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 sm:px-8 py-6 sm:py-10 max-w-5xl mx-auto"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
