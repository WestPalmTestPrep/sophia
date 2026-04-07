'use client';

import { motion } from 'framer-motion';

interface LandingScreenProps {
  onComplete: () => void;
}

export function LandingScreen({ onComplete }: LandingScreenProps) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden bg-black"
      onClick={onComplete}
    >
      {/* Horizontal lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-[35%] left-[5%] right-[5%] h-px bg-white/[0.03] origin-left"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-[65%] left-[5%] right-[5%] h-px bg-white/[0.03] origin-right"
      />

      {/* Happy Birthday — small, quiet */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="font-mono text-[9px] sm:text-[10px] tracking-[0.6em] uppercase text-white mb-6"
      >
        Happy Birthday
      </motion.p>

      {/* Sophia — massive, cinematic reveal */}
      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: '130%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[15vw] sm:text-[12vw] md:text-[10vw] text-white tracking-[0.05em] leading-none"
        >
          Sophia
        </motion.h1>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, delay: 2.5 }}
        className="font-serif text-[10px] sm:text-xs tracking-[0.5em] text-white mt-6 italic"
      >
        naturally unexpected
      </motion.p>

      {/* Minimal queen icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5, delay: 3.5 }}
        className="mt-12"
      >
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-2xl text-white block"
        >
          ♛
        </motion.span>
      </motion.div>

      {/* Enter instruction — barely visible, pulsing */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.12, 0.06, 0.12] }}
        transition={{ duration: 4, delay: 4.5, repeat: Infinity }}
        className="mt-8 font-mono text-[8px] tracking-[0.4em] uppercase text-white"
      >
        Enter
      </motion.p>
    </motion.div>
  );
}
