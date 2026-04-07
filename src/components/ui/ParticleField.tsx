'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  char: string;
}

const CHARS = ['♛', '♚', '♝', '♞', '♜', '♟', '·', '·', '·', '·'];

export function ParticleField() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 10,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-white/[0.03]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.03, 0.06, 0.03, 0.05, 0.03],
            rotate: [0, 10, -5, 8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}
