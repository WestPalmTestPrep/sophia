'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="bg-white/[0.03] border border-white/5 rounded-full px-5 py-2 backdrop-blur-sm">
          <p className="text-xs font-serif text-white/40 tracking-widest">
            ♛ Today is the day ♛
          </p>
        </div>
      </motion.div>
    );
  }

  if (!timeLeft) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="bg-white/[0.03] border border-white/5 rounded-full px-5 py-2 backdrop-blur-sm">
          <p className="text-xs font-serif text-white/40 tracking-widest">
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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="bg-white/[0.03] border border-white/5 rounded-full px-5 py-2 backdrop-blur-sm flex items-center gap-4">
        <span className="text-[9px] text-white/20 font-sans tracking-widest uppercase">
          Countdown
        </span>
        <div className="flex gap-3">
          {[
            { value: timeLeft.days, label: 'D' },
            { value: timeLeft.hours, label: 'H' },
            { value: timeLeft.minutes, label: 'M' },
            { value: timeLeft.seconds, label: 'S' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-sm font-mono text-white/50 tabular-nums leading-none">
                {String(value).padStart(2, '0')}
              </p>
              <p className="text-[8px] text-white/15 font-sans mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
