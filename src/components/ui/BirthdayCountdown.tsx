'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BIRTHDAY = new Date('2026-04-11T00:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const now = new Date();
  const diff = BIRTHDAY.getTime() - now.getTime();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function isBirthday(): boolean {
  const now = new Date();
  return now.getMonth() === 3 && now.getDate() === 11;
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative rounded-md overflow-hidden"
        style={{
          background: 'rgba(20,20,20,0.9)',
          border: '1px solid rgba(212,175,55,0.2)',
          boxShadow: '0 0 20px rgba(212,175,55,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={display}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2"
          >
            <span
              className="font-mono text-xl sm:text-2xl font-bold tabular-nums leading-none block"
              style={{ color: '#d4af37' }}
            >
              {display}
            </span>
          </motion.div>
        </AnimatePresence>
        {/* Center divider line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/30 pointer-events-none" />
      </div>
      <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-white/40">
        {label}
      </span>
    </div>
  );
}

export function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isToday, setIsToday] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsToday(isBirthday());
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
      setIsToday(isBirthday());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  if (isToday) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20"
      >
        <div
          className="rounded-lg px-6 py-3 backdrop-blur-md"
          style={{
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 30px rgba(212,175,55,0.1)',
          }}
        >
          <p className="text-sm font-serif tracking-widest" style={{ color: '#d4af37' }}>
            ♛ Today is the day ♛
          </p>
        </div>
      </motion.div>
    );
  }

  if (!timeLeft) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20"
      >
        <div
          className="rounded-lg px-6 py-3 backdrop-blur-md"
          style={{
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 30px rgba(212,175,55,0.1)',
          }}
        >
          <p className="text-sm font-serif tracking-widest" style={{ color: '#d4af37' }}>
            Happy Birthday, Sophia ♛
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20"
    >
      <div
        className="rounded-xl px-4 sm:px-6 py-3 backdrop-blur-md flex items-center gap-3 sm:gap-5"
        style={{
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(212,175,55,0.15)',
          boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.05)',
        }}
      >
        <span
          className="text-[9px] sm:text-[10px] font-serif tracking-[0.2em] uppercase hidden sm:block"
          style={{ color: 'rgba(212,175,55,0.5)' }}
        >
          ♛
        </span>
        <div className="flex gap-2 sm:gap-3 items-center">
          <FlipDigit value={timeLeft.days} label="days" />
          <span className="text-white/20 font-mono text-lg mb-4">:</span>
          <FlipDigit value={timeLeft.hours} label="hrs" />
          <span className="text-white/20 font-mono text-lg mb-4">:</span>
          <FlipDigit value={timeLeft.minutes} label="min" />
          <span className="text-white/20 font-mono text-lg mb-4">:</span>
          <FlipDigit value={timeLeft.seconds} label="sec" />
        </div>
      </div>
    </motion.div>
  );
}
