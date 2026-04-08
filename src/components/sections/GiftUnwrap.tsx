'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Gift {
  id: string;
  color: string;
  ribbonColor: string;
  pattern: string;
  message: string;
  subtitle: string;
  emoji: string;
}

const GIFTS: Gift[] = [
  {
    id: '1',
    color: '#1a1a2e',
    ribbonColor: '#d4af37',
    pattern: 'none',
    message: 'May your next chapter be even more naturally unexpected than the last.',
    subtitle: 'The Queen\'s Wish',
    emoji: '♛',
  },
  {
    id: '2',
    color: '#2d1b4e',
    ribbonColor: '#c084fc',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 16px)',
    message: 'A destination wedding in Greece is in your future. The Pavlatos homecoming.',
    subtitle: 'The Oracle Speaks',
    emoji: '🔮',
  },
  {
    id: '3',
    color: '#1e3a2f',
    ribbonColor: '#4ade80',
    pattern: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)',
    message: 'You turned "I\'m moving to Florida" from a punchline into an empire-building move.',
    subtitle: 'Certified Legend',
    emoji: '👑',
  },
  {
    id: '4',
    color: '#3b1c1c',
    ribbonColor: '#f87171',
    pattern: 'none',
    message: 'Post a story right now saying "I just unwrapped a golden gift on my birthday website."',
    subtitle: 'Do It. Right Now.',
    emoji: '⚡',
  },
  {
    id: '5',
    color: '#1a2940',
    ribbonColor: '#60a5fa',
    pattern: 'repeating-linear-gradient(135deg, transparent, transparent 6px, rgba(255,255,255,0.02) 6px, rgba(255,255,255,0.02) 12px)',
    message: 'The person who made this website thinks you\'re pretty incredible. Happy Birthday, Sophia.',
    subtitle: 'From the Heart',
    emoji: '♥',
  },
  {
    id: '6',
    color: '#2a2210',
    ribbonColor: '#d4af37',
    pattern: 'none',
    message: 'May Vogue call again. And again. Until they just give you a column.',
    subtitle: 'Front Page Energy',
    emoji: '✦',
  },
];

function GiftBox({
  gift,
  isOpened,
  onOpen,
  index,
}: {
  gift: Gift;
  isOpened: boolean;
  onOpen: () => void;
  index: number;
}) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playUnwrap = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;

      // Paper tear sound
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3)) * 0.1;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();

      // Chime
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }, 300);
    } catch {}
  }, []);

  const handleOpen = useCallback(() => {
    if (isOpened) return;
    playUnwrap();
    onOpen();
  }, [isOpened, onOpen, playUnwrap]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative cursor-pointer"
      onClick={handleOpen}
    >
      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* Wrapped gift */
          <motion.div
            key="wrapped"
            exit={{ scale: 0.8, opacity: 0, rotateZ: 5 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden rounded-xl"
            style={{
              background: gift.color,
              border: `1px solid ${gift.ribbonColor}30`,
              height: '160px',
            }}
          >
            {/* Pattern overlay */}
            {gift.pattern !== 'none' && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: gift.pattern }}
              />
            )}

            {/* Horizontal ribbon */}
            <div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3"
              style={{
                background: `linear-gradient(180deg, ${gift.ribbonColor}40, ${gift.ribbonColor}80, ${gift.ribbonColor}40)`,
                boxShadow: `0 0 10px ${gift.ribbonColor}20`,
              }}
            />

            {/* Vertical ribbon */}
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3"
              style={{
                background: `linear-gradient(90deg, ${gift.ribbonColor}40, ${gift.ribbonColor}80, ${gift.ribbonColor}40)`,
                boxShadow: `0 0 10px ${gift.ribbonColor}20`,
              }}
            />

            {/* Bow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-2xl"
                style={{
                  filter: `drop-shadow(0 0 8px ${gift.ribbonColor}60)`,
                  color: gift.ribbonColor,
                }}
              >
                🎀
              </motion.div>
            </div>

            {/* Tap hint */}
            <motion.div
              className="absolute bottom-3 left-0 right-0 text-center"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="font-mono text-[8px] tracking-widest uppercase text-white/40">
                Tap to unwrap
              </span>
            </motion.div>

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0) 45%, transparent 50%)',
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, transparent 50%)',
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0) 45%, transparent 50%)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        ) : (
          /* Revealed content */
          <motion.div
            key="opened"
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative overflow-hidden rounded-xl p-5 sm:p-6"
            style={{
              background: `linear-gradient(135deg, ${gift.color} 0%, ${gift.color}dd 100%)`,
              border: `1px solid ${gift.ribbonColor}40`,
              boxShadow: `0 0 30px ${gift.ribbonColor}10`,
              minHeight: '160px',
            }}
          >
            {/* Confetti burst particles */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: gift.ribbonColor,
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / 8) * Math.PI * 2) * 80,
                  y: Math.sin((i / 8) * Math.PI * 2) * 60,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}

            <div className="flex flex-col items-center text-center gap-3">
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-3xl"
              >
                {gift.emoji}
              </motion.span>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-sm sm:text-base text-white/85 leading-relaxed"
              >
                {gift.message}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-[9px] tracking-wider uppercase"
                style={{ color: `${gift.ribbonColor}90` }}
              >
                {gift.subtitle}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function GiftUnwrap() {
  const [opened, setOpened] = useState<Set<string>>(new Set());

  const openGift = useCallback((id: string) => {
    setOpened((prev) => new Set(prev).add(id));
  }, []);

  const allOpened = opened.size === GIFTS.length;

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-3xl"
        >
          🎁
        </motion.div>
        <p
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(212,175,55,0.65)' }}
        >
          {allOpened ? 'All gifts unwrapped!' : 'Tap each gift to unwrap it'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GIFTS.map((gift, i) => (
          <GiftBox
            key={gift.id}
            gift={gift}
            isOpened={opened.has(gift.id)}
            onOpen={() => openGift(gift.id)}
            index={i}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="font-mono text-[9px] text-white/40 tracking-wider">
          {opened.size} / {GIFTS.length} unwrapped
        </p>
      </div>
    </div>
  );
}
