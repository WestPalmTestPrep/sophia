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
  gold: boolean;
}

const CHARS = ['♛', '♚', '♝', '♞', '♜', '♟', '·', '·', '✦', '✧'];

export function ParticleField() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 14,
      duration: 12 + Math.random() * 20,
      delay: Math.random() * 8,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      gold: Math.random() > 0.6,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: p.gold ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.08)',
          }}
          animate={{
            y: [0, -40, 0, 25, 0],
            x: [0, 20, -15, 8, 0],
            opacity: p.gold
              ? [0.1, 0.2, 0.1, 0.15, 0.1]
              : [0.06, 0.12, 0.06, 0.08, 0.06],
            rotate: [0, 15, -8, 12, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
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
