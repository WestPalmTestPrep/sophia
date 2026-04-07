'use client';

import { motion } from 'framer-motion';

export function QueenPiece() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      layoutId="queen"
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
    >
      {/* Glow ring under queen */}
      <motion.div
        className="absolute w-[80%] h-[80%] rounded-full"
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      <svg
        viewBox="0 0 45 45"
        className="w-[70%] h-[70%] relative z-10"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.5)) drop-shadow(0 0 4px rgba(212,175,55,0.3))',
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#d4af37" stroke="#8a7020" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" />
          <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" />
          <path d="M 11,38.5 A 35,35 1 0 0 34,38.5" fill="none" stroke="#8a7020" />
          <path d="M 11,29 A 35,35 1 0 1 34,29" fill="none" stroke="#e6c84a" />
          <path d="M 12.5,31.5 L 32.5,31.5" fill="none" stroke="#e6c84a" />
          <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5" fill="none" stroke="#e6c84a" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="14" cy="9" r="2.5" />
          <circle cx="22.5" cy="8" r="2.5" />
          <circle cx="31" cy="9" r="2.5" />
          <circle cx="39" cy="12" r="2.5" />
        </g>
      </svg>
    </motion.div>
  );
}
