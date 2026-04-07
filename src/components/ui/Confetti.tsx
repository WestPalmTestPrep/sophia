'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  char: string;
}

const CHARS = ['♛', '♚', '♝', '♞', '♜', '♟', '✦', '✧', '⚡'];

export function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const count = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches ? 18 : 40;
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 12 + Math.random() * 16,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: '110vh',
                opacity: [1, 1, 0],
                rotate: Math.random() > 0.5 ? 360 : -360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeIn',
              }}
              className="absolute text-white"
              style={{
                left: `${p.x}%`,
                fontSize: `${p.size}px`,
              }}
            >
              {p.char}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
