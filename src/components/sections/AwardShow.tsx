'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Award {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'gold' | 'platinum' | 'diamond';
}

const AWARDS: Award[] = [
  {
    id: '1',
    category: 'Boldest Move',
    title: 'NYC → West Palm Beach',
    description:
      'Left the concrete jungle with nothing but a camera and a vision. Everyone said wait. She said watch.',
    icon: '⌘',
    rarity: 'diamond',
  },
  {
    id: '2',
    category: 'Career Moment of the Year',
    title: 'Vogue Feature',
    description:
      '"It\'s almost curated to be so uncurated looking." The moment the industry confirmed what we already knew.',
    icon: '♕',
    rarity: 'diamond',
  },
  {
    id: '3',
    category: 'Best Brand Universe',
    title: 'The Triple Crown',
    description:
      '@sophie.pav for lifestyle. @pavweddings for art. @sophitness_ for the grind. Three worlds. One queen.',
    icon: '♛',
    rarity: 'platinum',
  },
  {
    id: '4',
    category: 'Most Iconic Tagline',
    title: 'Naturally Unexpected',
    description:
      'Two words that captured an entire philosophy. Not manufactured. Not forced. Just... her.',
    icon: '✦',
    rarity: 'gold',
  },
  {
    id: '5',
    category: 'Origin Story Award',
    title: 'Camp Saint-Paul → FIT → Empire',
    description:
      'From summer camp photographer to Fashion Institute graduate to Vogue-featured creative director. The arc of a queen.',
    icon: '◎',
    rarity: 'platinum',
  },
  {
    id: '6',
    category: 'Best Philosophy',
    title: '"Mine is an investment."',
    description:
      '"Most photography is a luxury." Five words that changed how every client saw her work.',
    icon: '⊙',
    rarity: 'gold',
  },
  {
    id: '7',
    category: 'Lifetime Achievement',
    title: 'A Decade of Vision',
    description:
      '10+ years behind the lens. Photographer. Creative Director. Fine Artist. Memory Maker. The full evolution.',
    icon: '♛',
    rarity: 'diamond',
  },
];

const RARITY_STYLES = {
  gold: {
    gradient: 'linear-gradient(135deg, #d4af37 0%, #f5d76e 50%, #d4af37 100%)',
    glow: 'rgba(212,175,55,0.3)',
    text: '#d4af37',
    bg: 'rgba(212,175,55,0.05)',
  },
  platinum: {
    gradient: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)',
    glow: 'rgba(200,200,200,0.25)',
    text: '#d0d0d0',
    bg: 'rgba(200,200,200,0.04)',
  },
  diamond: {
    gradient: 'linear-gradient(135deg, #b9f2ff 0%, #ffffff 50%, #b9f2ff 100%)',
    glow: 'rgba(185,242,255,0.25)',
    text: '#b9f2ff',
    bg: 'rgba(185,242,255,0.04)',
  },
};

function Envelope({
  award,
  onOpen,
  index,
}: {
  award: Award;
  onOpen: () => void;
  index: number;
}) {
  const style = RARITY_STYLES[award.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onOpen}
      className="relative cursor-pointer group"
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="rounded-xl px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-4 transition-all duration-300"
        style={{
          background: style.bg,
          border: `1px solid ${style.text}25`,
          boxShadow: `0 0 0 0 ${style.glow}`,
        }}
      >
        {/* Envelope icon */}
        <motion.div
          className="w-12 h-10 sm:w-14 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden"
          style={{
            background: `${style.text}10`,
            border: `1px solid ${style.text}20`,
          }}
        >
          {/* Seal */}
          <motion.div
            animate={{
              boxShadow: [
                `0 0 8px ${style.glow}`,
                `0 0 16px ${style.glow}`,
                `0 0 8px ${style.glow}`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: style.gradient,
            }}
          >
            <span className="text-[10px] text-black font-bold">♛</span>
          </motion.div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <p
            className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase"
            style={{ color: `${style.text}90` }}
          >
            {award.category}
          </p>
          <p className="font-serif text-sm sm:text-base text-white/50 tracking-wider mt-0.5 truncate group-hover:text-white/70 transition-colors">
            Tap to open the envelope
          </p>
        </div>

        {/* Rarity badge */}
        <span
          className="font-mono text-[8px] tracking-wider sm:tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline"
          style={{
            color: style.text,
            border: `1px solid ${style.text}30`,
            background: `${style.text}08`,
          }}
        >
          {award.rarity}
        </span>
      </div>
    </motion.div>
  );
}

function AwardReveal({
  award,
  onClose,
}: {
  award: Award;
  onClose: () => void;
}) {
  const style = RARITY_STYLES[award.rarity];
  const [showContent, setShowContent] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Dramatic reveal sound
  useEffect(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Ascending fanfare
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch {
      // Audio not available
    }

    const timer = setTimeout(() => setShowContent(true), 600);
    return () => {
      clearTimeout(timer);
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 cursor-pointer px-5 sm:px-4"
      onClick={onClose}
    >
      {/* Spotlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.15, scale: 1.5 }}
        transition={{ duration: 1 }}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${style.glow} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Particle burst */}
      {showContent &&
        Array.from({ length: 20 }, (_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const distance = 100 + Math.random() * 150;
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{ backgroundColor: style.text }}
              initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          );
        })}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        className="relative max-w-md w-full text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category */}
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase"
          style={{ color: `${style.text}80` }}
        >
          And the award for
        </motion.p>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-serif text-lg sm:text-xl tracking-wider"
          style={{ color: style.text }}
        >
          {award.category}
        </motion.p>

        {/* Dramatic pause then reveal */}
        <AnimatePresence>
          {showContent && (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0 }}
                className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40"
              >
                goes to...
              </motion.p>

              {/* Trophy / Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="text-5xl sm:text-6xl mx-auto"
                style={{
                  filter: `drop-shadow(0 0 30px ${style.glow})`,
                  color: style.text,
                }}
              >
                {award.icon}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-2xl sm:text-3xl tracking-wider"
                style={{
                  color: style.text,
                  textShadow: `0 0 30px ${style.glow}`,
                }}
              >
                {award.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-serif text-sm sm:text-base text-white/65 leading-relaxed italic max-w-sm mx-auto"
              >
                {award.description}
              </motion.p>

              {/* Rarity badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="inline-block px-4 py-1.5 rounded-full"
                style={{
                  background: style.gradient,
                }}
              >
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase font-bold text-black">
                  {award.rarity} Award
                </span>
              </motion.div>

              {/* Close hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="font-mono text-[9px] text-white/30 tracking-widest uppercase pt-4 cursor-pointer"
                onClick={onClose}
              >
                Tap anywhere to continue
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function AwardShow() {
  const [openedAwards, setOpenedAwards] = useState<Set<string>>(new Set());
  const [revealingAward, setRevealingAward] = useState<Award | null>(null);

  const openAward = useCallback(
    (award: Award) => {
      if (openedAwards.has(award.id)) {
        // Re-open to view again
        setRevealingAward(award);
        return;
      }
      setRevealingAward(award);
      setOpenedAwards((prev) => new Set(prev).add(award.id));
    },
    [openedAwards]
  );

  const allOpened = openedAwards.size === AWARDS.length;

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-4xl"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))',
            color: '#d4af37',
          }}
        >
          ♛
        </motion.div>
        <p
          className="font-serif text-lg sm:text-xl tracking-wider italic"
          style={{ color: 'rgba(212,175,55,0.7)' }}
        >
          The Sophia Awards
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
          Open each envelope to reveal the winner
        </p>
      </div>

      {/* Award stats */}
      <div className="flex justify-center gap-6 sm:gap-8">
        {(['diamond', 'platinum', 'gold'] as const).map((rarity) => {
          const style = RARITY_STYLES[rarity];
          const count = AWARDS.filter((a) => a.rarity === rarity).length;
          return (
            <div key={rarity} className="text-center">
              <p className="font-mono text-xl font-bold" style={{ color: style.text }}>
                {count}
              </p>
              <p
                className="font-mono text-[8px] tracking-widest uppercase mt-0.5"
                style={{ color: `${style.text}70` }}
              >
                {rarity}
              </p>
            </div>
          );
        })}
      </div>

      {/* Envelopes */}
      <div className="space-y-3 max-w-xl mx-auto">
        {AWARDS.map((award, i) => (
          <div key={award.id} className="relative">
            {openedAwards.has(award.id) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
              >
                <span className="text-xs" style={{ color: RARITY_STYLES[award.rarity].text }}>
                  ✓
                </span>
              </motion.div>
            )}
            <Envelope award={award} onOpen={() => openAward(award)} index={i} />
          </div>
        ))}
      </div>

      {/* All opened */}
      <AnimatePresence>
        {allOpened && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-1 pt-4"
          >
            <p
              className="font-serif text-lg italic tracking-wider"
              style={{ color: 'rgba(212,175,55,0.8)' }}
            >
              Standing ovation.
            </p>
            <p className="font-mono text-[9px] text-white/45 tracking-widest uppercase">
              Every award deserved. Every moment earned.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal overlay */}
      <AnimatePresence>
        {revealingAward && (
          <AwardReveal
            key={revealingAward.id}
            award={revealingAward}
            onClose={() => setRevealingAward(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
