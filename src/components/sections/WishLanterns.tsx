'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lantern {
  id: number;
  x: number;
  wish: string;
  color: string;
  delay: number;
}

const COLORS = [
  'rgba(212,175,55,0.9)',
  'rgba(255,180,60,0.85)',
  'rgba(240,160,40,0.85)',
  'rgba(255,200,80,0.9)',
  'rgba(220,170,50,0.85)',
];

const PRE_WISHES = [
  'May your invoices always get paid on time.',
  'To another year of making the rest of us look bad.',
  'Happy Birthday from your favorite in-law (don\'t argue).',
  'May your WiFi be strong and your clients be easy.',
  'Wishing you slightly less ambition so I can catch up.',
];

function FloatingLantern({ lantern, containerHeight }: { lantern: Lantern; containerHeight: number }) {
  const duration = 15 + Math.random() * 10;
  const sway = 30 + Math.random() * 40;
  const travelDistance = (containerHeight || 500) * 1.3;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${lantern.x}%`, bottom: '-5%' }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, -travelDistance],
        x: [0, sway, -sway * 0.5, sway * 0.3, 0],
        opacity: [0, 1, 1, 1, 0.6, 0],
      }}
      transition={{
        duration,
        delay: lantern.delay,
        ease: 'easeOut',
        x: { duration: duration, ease: 'easeInOut' },
      }}
    >
      {/* Lantern body */}
      <div className="relative flex flex-col items-center">
        {/* Glow */}
        <div
          className="absolute -inset-6 rounded-full blur-xl"
          style={{ background: lantern.color, opacity: 0.3 }}
        />
        <div
          className="absolute -inset-12 rounded-full blur-2xl"
          style={{ background: lantern.color, opacity: 0.1 }}
        />

        {/* Paper lantern shape */}
        <div
          className="relative w-10 h-14 sm:w-12 sm:h-16 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${lantern.color}, rgba(180,120,20,0.6))`,
            boxShadow: `0 0 20px ${lantern.color}, inset 0 -4px 8px rgba(0,0,0,0.2)`,
          }}
        >
          {/* Inner flame */}
          <motion.div
            className="w-2 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, #fff 0%, #ffe4a0 40%, transparent 70%)',
            }}
            animate={{
              scaleY: [1, 1.3, 0.9, 1.2, 1],
              scaleX: [1, 0.8, 1.1, 0.9, 1],
              opacity: [0.8, 1, 0.7, 1, 0.8],
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Bottom opening */}
        <div
          className="w-5 h-1 sm:w-6 rounded-b-sm -mt-0.5"
          style={{ background: 'rgba(120,80,10,0.6)' }}
        />

        {/* Wish text floating below */}
        <motion.p
          className="absolute -bottom-8 whitespace-nowrap font-serif text-[9px] sm:text-[10px] italic text-center max-w-[120px] truncate"
          style={{ color: 'rgba(255,220,140,0.6)' }}
          animate={{ opacity: [0, 0.6, 0.4, 0.6, 0] }}
          transition={{ duration: 6, delay: 2 }}
        >
          {lantern.wish}
        </motion.p>
      </div>
    </motion.div>
  );
}

function BackgroundStars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.5,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: s.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </>
  );
}

export function WishLanterns() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [wish, setWish] = useState('');
  const [preWishIndex, setPreWishIndex] = useState(0);
  const [skyHeight, setSkyHeight] = useState(500);
  const idRef = useRef(0);
  const skyRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (skyRef.current) {
      setSkyHeight(skyRef.current.clientHeight);
    }
  }, []);

  const playChime = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.2;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.04, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1);
        osc.start(t);
        osc.stop(t + 1);
      });
    } catch {}
  }, []);

  const releaseLantern = useCallback(() => {
    const text = wish.trim() || PRE_WISHES[preWishIndex % PRE_WISHES.length];
    if (!wish.trim()) setPreWishIndex((i) => i + 1);

    const newLantern: Lantern = {
      id: idRef.current++,
      x: 20 + Math.random() * 60,
      wish: text,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: 0,
    };

    setLanterns((prev) => [...prev, newLantern]);
    setWish('');
    playChime();
  }, [wish, preWishIndex, playChime]);

  // Clean up old lanterns
  useEffect(() => {
    const interval = setInterval(() => {
      setLanterns((prev) => prev.slice(-15));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Sky */}
      <div
        ref={skyRef}
        className="relative w-full overflow-hidden rounded-lg"
        style={{
          height: 'min(65vh, 500px)',
          background: 'linear-gradient(180deg, #020210 0%, #0a0820 40%, #1a1030 70%, #2a1525 100%)',
          border: '1px solid rgba(212,175,55,0.1)',
        }}
      >
        <BackgroundStars />

        {/* Moon */}
        <div
          className="absolute top-6 right-8 w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #f5f0d0 0%, #d4c890 50%, #a09060 100%)',
            boxShadow: '0 0 30px rgba(245,240,208,0.2), 0 0 60px rgba(245,240,208,0.1)',
          }}
        />

        {/* Horizon glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(50,20,10,0.4), transparent)',
          }}
        />

        {/* Lanterns */}
        <AnimatePresence>
          {lanterns.map((l) => (
            <FloatingLantern key={l.id} lantern={l} containerHeight={skyHeight} />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {lanterns.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.p
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-serif text-sm italic"
              style={{ color: 'rgba(212,175,55,0.4)' }}
            >
              Write a wish or just release one. I wrote some for you because I&apos;m helpful like that.
            </motion.p>
          </div>
        )}
      </div>

      {/* Wish input */}
      <div className="w-full max-w-md space-y-3">
        <div
          className="flex items-center gap-2 rounded-xl overflow-hidden"
          style={{
            background: 'rgba(20,15,10,0.9)',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <input
            type="text"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && releaseLantern()}
            placeholder="Write a birthday wish..."
            className="flex-1 bg-transparent px-4 py-3 font-serif text-sm text-white/80 placeholder:text-white/25 outline-none min-h-[44px]"
            maxLength={60}
          />
          <motion.button
            onClick={releaseLantern}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-5 py-3 font-mono text-[10px] tracking-widest uppercase flex-shrink-0 min-h-[44px]"
            style={{ color: '#d4af37' }}
          >
            Release ✦
          </motion.button>
        </div>

        <p className="text-center font-mono text-[9px] text-white/35 tracking-wider">
          {lanterns.length === 0
            ? 'Type your own or use one of my pre-loaded bangers'
            : `${lanterns.length} wish${lanterns.length === 1 ? '' : 'es'} released — keep going`}
        </p>
      </div>
    </div>
  );
}
