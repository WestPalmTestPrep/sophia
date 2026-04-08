'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TarotCard {
  id: string;
  title: string;
  reading: string;
  symbol: string;
  label: string;
  color: string;
}

const CARDS: TarotCard[] = [
  {
    id: 'past',
    title: 'The Dreamer',
    reading:
      'Camp Saint-Paul. Nassau CC. FIT. A camera that was basically an extension of her arm. She had the whole plan mapped out while everyone else was still picking a major. Annoying but impressive.',
    symbol: '☽',
    label: 'Your Past',
    color: '#8b5cf6',
  },
  {
    id: 'present',
    title: 'The Overachiever',
    reading:
      'Three brands. A Vogue feature. A move to Florida that turned out to be genius. She turned "photography is a luxury" into "photography is an investment" and somehow nobody argued. Running laps around the rest of us.',
    symbol: '♛',
    label: 'Your Present',
    color: '#d4af37',
  },
  {
    id: 'future',
    title: 'The In-Law',
    reading:
      'A destination that starts with G and ends with reece. A Stamatakis by July. International features. Probably a gallery showing. At this rate she\'ll have a Wikipedia page before I have a 401k.',
    symbol: '✦',
    label: 'Your Future',
    color: '#3b82f6',
  },
];

function CardBack({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
        border: `1px solid ${color}40`,
        boxShadow: `0 0 30px ${color}15, inset 0 0 60px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Ornamental border pattern */}
      <div
        className="absolute inset-3 rounded-xl pointer-events-none"
        style={{ border: `1px solid ${color}20` }}
      />
      <div
        className="absolute inset-5 rounded-lg pointer-events-none"
        style={{ border: `1px solid ${color}10` }}
      />

      {/* Center sigil */}
      <div className="relative flex flex-col items-center gap-3">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="text-4xl sm:text-5xl"
          style={{
            color: `${color}80`,
            filter: `drop-shadow(0 0 15px ${color}40)`,
          }}
        >
          ✧
        </motion.div>
        <span
          className="font-mono text-[9px] tracking-[0.4em] uppercase"
          style={{ color: `${color}60` }}
        >
          Reveal
        </span>
      </div>

      {/* Corner ornaments */}
      {['top-3 left-3', 'top-3 right-3 rotate-90', 'bottom-3 left-3 -rotate-90', 'bottom-3 right-3 rotate-180'].map(
        (pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-4 h-4`}
            style={{ color: `${color}30` }}
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 0 L6 0 L6 1 L1 1 L1 6 L0 6 Z" />
            </svg>
          </div>
        )
      )}
    </div>
  );
}

function CardFront({ card }: { card: TarotCard }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center overflow-hidden px-5 sm:px-8 py-6"
      style={{
        background: `linear-gradient(160deg, ${card.color}08 0%, #0a0a0a 40%, ${card.color}05 100%)`,
        border: `1px solid ${card.color}50`,
        boxShadow: `0 0 40px ${card.color}15, inset 0 0 40px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-10 blur-[60px]"
        style={{ backgroundColor: card.color }}
      />

      <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        className="text-4xl sm:text-5xl mb-3"
        style={{
          filter: `drop-shadow(0 0 20px ${card.color}60)`,
          color: card.color,
        }}
      >
        {card.symbol}
      </motion.span>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-mono text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mb-1"
        style={{ color: `${card.color}90` }}
      >
        {card.label}
      </motion.p>

      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-serif text-xl sm:text-2xl tracking-wider mb-4"
        style={{ color: card.color }}
      >
        {card.title}
      </motion.h3>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-12 h-px mb-4 origin-center"
        style={{ backgroundColor: `${card.color}40` }}
      />

      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="font-serif text-xs sm:text-sm text-white/75 leading-relaxed text-center italic"
      >
        {card.reading}
      </motion.p>
    </div>
  );
}

function TarotCardComponent({
  card,
  index,
  flipped,
  onFlip,
}: {
  card: TarotCard;
  index: number;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: 10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
      className="relative cursor-pointer"
      style={{
        width: 'min(260px, 80vw)',
        height: 'min(380px, 45vh)',
        perspective: '1000px',
      }}
      onClick={onFlip}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <CardBack color={card.color} />
        </div>

        {/* Front */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <CardFront card={card} />
        </div>
      </motion.div>

      {/* Card label underneath */}
      {!flipped && (
        <motion.p
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mt-3 font-mono text-[9px] tracking-[0.3em] uppercase"
          style={{ color: `${card.color}70` }}
        >
          Tap to reveal
        </motion.p>
      )}
    </motion.div>
  );
}

export function TarotReading() {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  const handleFlip = useCallback(
    (id: string) => {
      if (flipped.has(id)) return;
      const next = new Set(flipped);
      next.add(id);
      setFlipped(next);
      if (next.size === CARDS.length) {
        setTimeout(() => setAllRevealed(true), 500);
      }
    },
    [flipped]
  );

  return (
    <div className="flex flex-col items-center gap-8 py-4 min-h-[60vh]">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-3xl mb-2"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))',
            color: '#d4af37',
          }}
        >
          ✧
        </motion.div>
        <p
          className="font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{ color: 'rgba(212,175,55,0.65)' }}
        >
          The cards don't lie (unfortunately for you)
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {CARDS.map((card, i) => (
          <TarotCardComponent
            key={card.id}
            card={card}
            index={i}
            flipped={flipped.has(card.id)}
            onFlip={() => handleFlip(card.id)}
          />
        ))}
      </div>

      {/* All revealed message */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <p
              className="font-serif text-lg sm:text-xl italic tracking-wider"
              style={{ color: 'rgba(212,175,55,0.8)' }}
            >
              Yeah yeah, your future looks great. We get it.
            </p>
            <p className="font-mono text-[9px] text-white/50 tracking-widest uppercase">
              Past, present, future — all annoyingly impressive.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <p className="font-mono text-[9px] text-white/40 tracking-wider">
        {flipped.size} / {CARDS.length} revealed
      </p>
    </div>
  );
}
