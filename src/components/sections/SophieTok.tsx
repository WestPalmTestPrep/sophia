'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TokCard {
  id: string;
  type: 'stat' | 'milestone' | 'quote' | 'vibe';
  headline: string;
  subtext: string;
  stat?: string;
  statLabel?: string;
  icon?: string;
  color?: string;
}

const CARDS: TokCard[] = [
  {
    id: '1',
    type: 'milestone',
    headline: 'The Accounts',
    subtext: '@sophie.pav for the vibes. @pavweddings for the art. @sophitness_ for the grind. Three sides of the same queen.',
    icon: '♛',
  },
  {
    id: '2',
    type: 'vibe',
    headline: '@sophitness_',
    subtext: 'The fitness era. Because building an empire takes discipline — and she never skips leg day.',
    icon: '⬡',
  },
  {
    id: '3',
    type: 'milestone',
    headline: 'Vogue Called',
    subtext: '"It\'s almost curated to be so uncurated looking." — Sophia to Vogue on Gen Z wedding trends',
    icon: '♕',
  },
  {
    id: '4',
    type: 'quote',
    headline: 'The Philosophy',
    subtext: '"Most photography is a luxury. Mine is an investment."',
    icon: '⊙',
  },
  {
    id: '5',
    type: 'vibe',
    headline: 'NYC → WPB',
    subtext: 'Left the concrete jungle for the sunshine state. No safety net. No looking back. Built an empire in South Florida.',
    icon: '⌘',
  },
  {
    id: '6',
    type: 'stat',
    headline: 'A Decade',
    subtext: 'From first camera click to creative empire — photographer, creative director, fine artist',
    stat: '10+',
    statLabel: 'years behind the lens',
    icon: '✦',
    color: '#d4af37',
  },
  {
    id: '7',
    type: 'milestone',
    headline: 'PAV Weddings',
    subtext: 'Fine art editorial wedding photography. Every couple\'s story told through an artistic lens. West Palm Beach, Miami, and beyond.',
    icon: '○',
  },
  {
    id: '8',
    type: 'quote',
    headline: 'The Identity',
    subtext: '"Photographer. Creative Director. Fine Artist. Creator of content. Memory maker."',
    icon: '♛',
  },
  {
    id: '9',
    type: 'vibe',
    headline: 'Camp Saint-Paul',
    subtext: 'Where it started — camp photographer at Greek Orthodox summer camp in Litchfield, CT. Capturing joy before she had a brand name.',
    icon: '⛺',
  },
  {
    id: '10',
    type: 'milestone',
    headline: 'AS IF Magazine',
    subtext: 'Interned at the high-end fashion publication in Brooklyn. Learned the game from the inside.',
    icon: '▣',
  },
  {
    id: '11',
    type: 'vibe',
    headline: 'FIT Graduate',
    subtext: 'Fashion Institute of Technology, NYC. Where fashion meets photography meets art meets hustle.',
    icon: '◭',
  },
  {
    id: '12',
    type: 'vibe',
    headline: 'Three Platforms, One Vision',
    subtext: 'Lifestyle on @sophie.pav. Weddings on @pavweddings. Fitness on @sophitness_. She doesn\'t just create content — she builds worlds.',
    icon: '◎',
  },
];

function StatCard({ card }: { card: TokCard }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
        style={{ backgroundColor: card.color || '#d4af37' }}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-5xl mb-6"
      >
        {card.icon}
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <p
          className="font-mono text-6xl sm:text-7xl font-bold leading-none"
          style={{ color: card.color || '#d4af37' }}
        >
          {card.stat}
        </p>
        <p className="text-white/60 text-sm font-sans tracking-wider uppercase">
          {card.statLabel}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 space-y-1"
      >
        <p className="text-white/60 font-serif text-lg">{card.headline}</p>
        <p className="text-white/45 text-xs max-w-xs">{card.subtext}</p>
      </motion.div>
    </div>
  );
}

function MilestoneCard({ card }: { card: TokCard }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="text-5xl mb-8"
      >
        {card.icon}
      </motion.div>

      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-serif text-3xl sm:text-4xl tracking-wider mb-4"
        style={{ color: 'rgba(212,175,55,0.7)' }}
      >
        {card.headline}
      </motion.h3>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/60 text-sm sm:text-base max-w-sm leading-relaxed font-serif italic"
      >
        {card.subtext}
      </motion.p>
    </div>
  );
}

function QuoteCard({ card }: { card: TokCard }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
      {/* Large quotation mark */}
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute text-[200px] font-serif text-white leading-none -top-10"
      >
        &ldquo;
      </motion.span>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-4xl mb-8"
      >
        {card.icon}
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/65 font-serif text-lg sm:text-xl italic max-w-md leading-relaxed"
      >
        {card.subtext}
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-12 h-px mt-6 origin-left"
        style={{ backgroundColor: 'rgba(212,175,55,0.3)' }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/60 text-[10px] font-mono tracking-widest uppercase mt-3"
      >
        {card.headline}
      </motion.p>
    </div>
  );
}

function VibeCard({ card }: { card: TokCard }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl mb-6"
      >
        {card.icon}
      </motion.div>

      <motion.h3
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-serif text-3xl sm:text-4xl tracking-wider mb-6"
        style={{ color: 'rgba(212,175,55,0.6)' }}
      >
        {card.headline}
      </motion.h3>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/55 text-sm max-w-sm leading-relaxed"
      >
        {card.subtext}
      </motion.p>
    </div>
  );
}

const CARD_RENDERERS = {
  stat: StatCard,
  milestone: MilestoneCard,
  quote: QuoteCard,
  vibe: VibeCard,
};

export function SophieTok() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);
  const [direction, setDirection] = useState(0);

  const goTo = (index: number) => {
    if (index < 0 || index >= CARDS.length) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) {
      goTo(currentIndex + (delta > 0 ? 1 : -1));
    }
  };

  // Scroll/wheel navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cooldown = false;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown) return;
      cooldown = true;
      setTimeout(() => { cooldown = false; }, 600);

      if (e.deltaY > 30) goTo(currentIndex + 1);
      else if (e.deltaY < -30) goTo(currentIndex - 1);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const card = CARDS[currentIndex];
  const CardRenderer = CARD_RENDERERS[card.type];

  return (
    <div
      ref={containerRef}
      className="h-[70vh] sm:h-[75vh] relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* TikTok-style UI frame */}
      <div className="absolute top-2 left-0 right-0 flex items-center justify-center z-20 px-2">
        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-center">
          <div className="w-6 h-6 rounded-full border border-[rgba(212,175,55,0.3)] flex items-center justify-center">
            <span className="text-[10px]" style={{ color: 'rgba(212,175,55,0.6)' }}>♛</span>
          </div>
          <span className="text-[8px] sm:text-[10px] font-mono tracking-wider text-white/65">
            @sophie.pav
          </span>
          <span className="text-white/25 text-[8px] hidden sm:inline">·</span>
          <span className="text-[8px] sm:text-[10px] font-mono tracking-wider text-white/65 hidden sm:inline">
            @pavweddings
          </span>
          <span className="text-white/25 text-[8px] hidden sm:inline">·</span>
          <span className="text-[8px] sm:text-[10px] font-mono tracking-wider text-white/65 hidden sm:inline">
            @sophitness_
          </span>
        </div>
      </div>

      {/* Card content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={card.id}
          custom={direction}
          initial={{ y: direction >= 0 ? 100 : -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction >= 0 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <CardRenderer card={card} />
        </motion.div>
      </AnimatePresence>

      {/* Right side dots (TikTok-style) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === currentIndex
                ? 'rgba(212,175,55,0.6)'
                : 'rgba(255,255,255,0.1)',
              transform: i === currentIndex ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Bottom navigation hint */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[8px] font-mono text-white/65 tracking-widest uppercase">
            {currentIndex < CARDS.length - 1 ? 'Scroll or swipe' : 'Back to top'}
          </span>
          <span className="text-white/60 text-xs">
            {currentIndex < CARDS.length - 1 ? '↓' : '↑'}
          </span>
        </motion.div>
      </div>

      {/* Progress */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 z-20">
        <motion.div
          className="h-full"
          style={{ backgroundColor: 'rgba(212,175,55,0.4)' }}
          animate={{ width: `${((currentIndex + 1) / CARDS.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
