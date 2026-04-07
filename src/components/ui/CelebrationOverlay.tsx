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
      {/* Radial gold burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2.5, opacity: [0, 0.15, 0.05] }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        className="text-center space-y-6 max-w-md px-8 relative z-10"
      >
        <motion.p
          initial={{ y: 20, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="text-6xl"
          style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.5))' }}
        >
          ♛
        </motion.p>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-serif text-3xl sm:text-4xl tracking-wider"
          style={{
            color: '#d4af37',
            textShadow: '0 0 40px rgba(212,175,55,0.2)',
          }}
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
          <span style={{ color: 'rgba(212,175,55,0.4)' }} className="italic">
            Naturally Unexpected, always.
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0.15, 0.3] }}
          transition={{ delay: 1.5, duration: 3, repeat: Infinity }}
          className="text-xs tracking-widest uppercase pt-4"
          style={{ color: 'rgba(212,175,55,0.3)' }}
        >
          Click to close
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
