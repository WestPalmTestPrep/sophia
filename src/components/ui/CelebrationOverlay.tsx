'use client';

import { motion } from 'framer-motion';

interface CelebrationOverlayProps {
  onDismiss: () => void;
}

export function CelebrationOverlay({ onDismiss }: CelebrationOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 cursor-pointer"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        className="text-center space-y-6 max-w-md px-8"
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl"
        >
          ♛
        </motion.p>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-serif text-3xl sm:text-4xl text-white tracking-wider"
        >
          You found everything!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-sans text-white/50 text-sm leading-relaxed"
        >
          Every square explored. Every memory unlocked.
          <br />
          Happy Birthday, Sophia.
          <br />
          <span className="text-white/30 italic">Naturally Unexpected, always.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xs text-white/20 tracking-widest uppercase pt-4"
        >
          Click to close
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
