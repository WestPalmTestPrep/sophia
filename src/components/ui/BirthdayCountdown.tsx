'use client';

import { motion } from 'framer-motion';

export function BirthdayCountdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="fixed left-1/2 -translate-x-1/2 z-20"
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div
        className="rounded-lg px-5 sm:px-6 py-2.5 sm:py-3 backdrop-blur-md"
        style={{
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.25)',
          boxShadow: '0 0 30px rgba(212,175,55,0.08)',
        }}
      >
        <p
          className="text-xs sm:text-sm font-serif tracking-[0.3em]"
          style={{ color: '#d4af37' }}
        >
          ♛ Happy Birthday, Sophia ♛
        </p>
      </div>
    </motion.div>
  );
}
