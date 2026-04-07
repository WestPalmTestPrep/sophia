'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface LandingScreenProps {
  onComplete: () => void;
}

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>{}[]';
const TARGET = 'Sophia';

function useTextScramble(target: string, startDelay: number) {
  const [text, setText] = useState(target.replace(/./g, '\u00A0'));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      let result = '';
      for (let i = 0; i < target.length; i++) {
        const charProgress = (progress - i * 0.08);
        if (charProgress > 0.6) {
          result += target[i];
        } else if (charProgress > 0) {
          result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        } else {
          result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      }
      setText(result);
      if (frame >= totalFrames + 10) {
        setText(target);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [started, target]);

  return text;
}

export function LandingScreen({ onComplete }: LandingScreenProps) {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; vx: number; vy: number; size: number; char: string;
  }>>([]);
  const [exiting, setExiting] = useState(false);
  const scrambledText = useTextScramble(TARGET, 1200);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (exiting) return;
    setExiting(true);

    // Spawn burst particles from click point
    const burst = Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 8;
      return {
        id: i,
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 12,
        char: ['♛', '♚', '♝', '♞', '♜', '✦', '✧', '◆'][Math.floor(Math.random() * 8)],
      };
    });
    setParticles(burst);

    setTimeout(onComplete, 800);
  }, [exiting, onComplete]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.15,
          size: p.size * 0.97,
        })).filter(p => p.size > 0.5)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <motion.div
      ref={containerRef}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden bg-black"
      onClick={handleClick}
    >
      {/* Animated grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`h-${i}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.02 }}
          transition={{ duration: 2, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 h-px bg-white origin-left"
          style={{ top: `${12.5 * (i + 1)}%` }}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`v-${i}`}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.015 }}
          transition={{ duration: 2, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 bottom-0 w-px bg-white origin-top"
          style={{ left: `${12.5 * (i + 1)}%` }}
        />
      ))}

      {/* Radial glow pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.08, 0.03, 0.06, 0.03], scale: [0.5, 1.2, 1, 1.1, 1] }}
        transition={{ duration: 4, delay: 1, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Happy Birthday */}
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.2em' }}
        animate={{ opacity: 0.7, letterSpacing: '0.6em' }}
        transition={{ duration: 2, delay: 0.8 }}
        className="font-mono text-[10px] sm:text-[11px] uppercase text-white/70 mb-8"
      >
        Happy Birthday
      </motion.p>

      {/* SOPHIA — scramble reveal */}
      <div className="overflow-hidden relative">
        <motion.h1
          initial={{ y: '130%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[18vw] sm:text-[14vw] md:text-[11vw] text-white tracking-[0.05em] leading-none relative"
          style={{
            textShadow: '0 0 80px rgba(212,175,55,0.15), 0 0 160px rgba(212,175,55,0.05)',
          }}
        >
          {scrambledText}
        </motion.h1>

        {/* Glitch line effect */}
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: ['110%', '110%'] }}
          transition={{ duration: 0.3, delay: 2.2 }}
          className="absolute top-0 bottom-0 w-[2px] bg-white/30 blur-[1px]"
        />
      </div>

      {/* Tagline with gold accent */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1.5, delay: 2.8 }}
        className="font-serif text-xs sm:text-sm tracking-[0.5em] mt-8 italic"
        style={{ color: 'rgba(212, 175, 55, 0.8)' }}
      >
        naturally unexpected
      </motion.p>

      {/* Queen with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 3.5, type: 'spring', stiffness: 200 }}
        className="mt-14 relative"
      >
        <motion.span
          animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-3xl block relative z-10"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))',
            color: '#d4af37',
          }}
        >
          ♛
        </motion.span>
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
            filter: 'blur(10px)',
            transform: 'scale(3)',
          }}
        />
      </motion.div>

      {/* Enter instruction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5 }}
        className="mt-10 flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 0.3, 0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-px bg-white"
        />
        <motion.p
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono text-[9px] tracking-[0.5em] uppercase text-white"
        >
          Click anywhere
        </motion.p>
      </motion.div>

      {/* Burst particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: p.x,
            top: p.y,
            fontSize: p.size,
            color: '#d4af37',
            filter: `drop-shadow(0 0 4px rgba(212,175,55,0.6))`,
            opacity: p.size / 16,
            transform: `translate(-50%, -50%)`,
          }}
        >
          {p.char}
        </div>
      ))}
    </motion.div>
  );
}
