'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WrappedSlide {
  id: string;
  bg: string;
  topText?: string;
  mainText: string;
  subText?: string;
  stat?: string;
  statLabel?: string;
  emoji?: string;
}

const SLIDES: WrappedSlide[] = [
  {
    id: 'intro',
    bg: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    topText: 'YOUR YEAR IN REVIEW',
    mainText: 'PAV\nWrapped',
    subText: '2025 — 2026',
    emoji: '♛',
  },
  {
    id: 'bold-move',
    bg: 'linear-gradient(135deg, #0f3443, #34e89e20)',
    topText: 'REMEMBER WHEN YOU',
    mainText: 'Left NYC\nfor Florida',
    subText: 'Everyone thought you were crazy. You proved them all wrong.',
    emoji: '⌘',
  },
  {
    id: 'vogue',
    bg: 'linear-gradient(135deg, #2d1b4e, #8b5cf640)',
    topText: 'AND THEN',
    mainText: 'Vogue\nCalled',
    subText: '"It\'s almost curated to be so uncurated looking."',
    emoji: '♕',
  },
  {
    id: 'brands',
    bg: 'linear-gradient(135deg, #1a1a1a, #d4af3720)',
    topText: 'YOU DIDN\'T BUILD ONE BRAND',
    mainText: 'You built\nthree.',
    subText: '@sophie.pav · @pavweddings · @sophitness_',
    emoji: '⊙',
  },
  {
    id: 'decade',
    bg: 'linear-gradient(135deg, #1e1e1e, #d4af3715)',
    stat: '10+',
    statLabel: 'YEARS BEHIND THE LENS',
    mainText: 'A decade of\nvision.',
    subText: 'From Nassau CC to Vogue. That\'s not luck — that\'s strategy.',
  },
  {
    id: 'fitness',
    bg: 'linear-gradient(135deg, #1a0a2e, #ff6b6b15)',
    topText: 'OH AND',
    mainText: 'She never\nskips\nleg day.',
    subText: '@sophitness_ — because queens are built, not born.',
    emoji: '⬡',
  },
  {
    id: 'philosophy',
    bg: 'linear-gradient(135deg, #1a1a1a, #d4af3720)',
    topText: 'YOUR PHILOSOPHY',
    mainText: '"Most\nphotography\nis a luxury."',
    subText: '"Mine is an investment."',
    emoji: '✦',
  },
  {
    id: 'identity',
    bg: 'linear-gradient(135deg, #0a0a0a, #d4af3710)',
    topText: 'YOU ARE',
    mainText: 'Photographer.\nCreative Director.\nFine Artist.',
    subText: 'Creator of content. Memory maker. Queen.',
  },
  {
    id: 'finale',
    bg: 'linear-gradient(135deg, #1a1a1a, #d4af3730)',
    emoji: '♛',
    mainText: 'Happy\nBirthday\nSophia.',
    subText: 'Naturally Unexpected. Always.',
  },
];

export function PavWrapped() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= SLIDES.length) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setAutoPlay(false);
  }, [current]);

  const next = useCallback(() => {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    } else {
      setAutoPlay(false);
    }
  }, [current]);

  // Auto-advance
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(next, 3500);
    return () => clearTimeout(timer);
  }, [current, autoPlay, next]);

  const slide = SLIDES[current];

  return (
    <div className="relative h-[70vh] sm:h-[75vh] overflow-hidden rounded-xl select-none">
      {/* Progress bars at top */}
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-3">
        {SLIDES.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: i <= current ? '#d4af37' : 'transparent' }}
              initial={false}
              animate={{ width: i < current ? '100%' : i === current ? '100%' : '0%' }}
              transition={{ duration: i === current && autoPlay ? 3.5 : 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -80 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 py-16"
          style={{ background: slide.bg }}
        >
          {slide.emoji && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-5xl sm:text-6xl mb-6"
            >
              {slide.emoji}
            </motion.div>
          )}

          {slide.stat && (
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="font-mono text-7xl sm:text-8xl font-bold mb-2"
              style={{ color: '#d4af37' }}
            >
              {slide.stat}
            </motion.p>
          )}

          {slide.statLabel && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6"
            >
              {slide.statLabel}
            </motion.p>
          )}

          {slide.topText && (
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/40 mb-4"
            >
              {slide.topText}
            </motion.p>
          )}

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight tracking-wide whitespace-pre-line"
            style={{
              color: slide.id === 'finale' ? '#d4af37' : 'rgba(255,255,255,0.9)',
              textShadow: slide.id === 'finale' ? '0 0 60px rgba(212,175,55,0.3)' : 'none',
            }}
          >
            {slide.mainText}
          </motion.h2>

          {slide.subText && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-sm sm:text-base text-white/45 mt-6 max-w-md leading-relaxed"
            >
              {slide.subText}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tap zones */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
        onClick={() => goTo(current - 1)}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
        onClick={() => goTo(current + 1)}
      />

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-0 right-0 z-30 text-center pointer-events-none">
        <motion.p
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-mono text-[9px] text-white/30 tracking-widest uppercase"
        >
          {autoPlay ? 'Tap sides to navigate' : `${current + 1} / ${SLIDES.length}`}
        </motion.p>
      </div>
    </div>
  );
}
