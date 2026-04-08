'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Moment {
  year: string;
  headline: string;
  quote: string;
  accent: string;
}

const MOMENTS: Moment[] = [
  {
    year: '2016',
    headline: 'She picked up\na camera.',
    quote: 'Nassau Community College. Nobody knew yet. She barely knew. But the lens knew.',
    accent: '#4a6fa5',
  },
  {
    year: '2018',
    headline: 'She sharpened\nthe vision.',
    quote: 'Fashion Institute of Technology, NYC. Art school didn\'t teach her how to see — it taught everyone else that she already could.',
    accent: '#7c5cbf',
  },
  {
    year: '2019',
    headline: 'She learned\nthe game.',
    quote: 'AS IF Magazine, Brooklyn. High fashion. High stakes. She watched, absorbed, and filed it all away for later.',
    accent: '#bf5c8a',
  },
  {
    year: '2020',
    headline: 'She named\nthe empire.',
    quote: '"Most photography is a luxury. Mine is an investment." PAV Photography wasn\'t a business. It was a declaration.',
    accent: '#d4af37',
  },
  {
    year: '2021',
    headline: 'She burned\nthe map.',
    quote: 'NYC → West Palm Beach. No safety net. No plan B. Everyone whispered. She didn\'t hear them over the sound of her own courage.',
    accent: '#e07040',
  },
  {
    year: '2023',
    headline: 'She made them\ncry at weddings.',
    quote: 'PAV Weddings. Fine art editorial. Every couple\'s love story, told through a lens that understood beauty wasn\'t posed — it was felt.',
    accent: '#d4af37',
  },
  {
    year: '2024',
    headline: 'Vogue\ncalled.',
    quote: '"It\'s almost curated to be so uncurated looking." The biggest name in fashion quoted a girl from Long Island. Let that sit.',
    accent: '#c0c0c0',
  },
  {
    year: '2025',
    headline: 'The queen\narrived.',
    quote: 'A decade behind the lens. Three brands. One vision. Photographer. Creative Director. Fine Artist. Memory Maker. The full evolution.',
    accent: '#d4af37',
  },
];

function FlashBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-30"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'white' }}
    />
  );
}

export function RedCarpet() {
  const [current, setCurrent] = useState(-1); // -1 = intro
  const [direction, setDirection] = useState(1);
  const [flash, setFlash] = useState(false);
  const touchStart = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cooldownRef = useRef(false);

  const playShutter = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      // Mechanical shutter
      const t = ctx.currentTime;
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.1)) * 0.12;
      }
      noise.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 3000;
      noise.connect(hp);
      hp.connect(ctx.destination);
      noise.start(t);
      // Second click
      const noise2 = ctx.createBufferSource();
      noise2.buffer = buf;
      const hp2 = ctx.createBiquadFilter();
      hp2.type = 'highpass';
      hp2.frequency.value = 4000;
      const g2 = ctx.createGain();
      g2.gain.value = 0.6;
      noise2.connect(hp2);
      hp2.connect(g2);
      g2.connect(ctx.destination);
      noise2.start(t + 0.05);
    } catch {}
  }, []);

  const goTo = useCallback((index: number) => {
    if (cooldownRef.current) return;
    if (index < -1 || index >= MOMENTS.length) return;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 400);

    setDirection(index > current ? 1 : -1);
    if (index >= 0 && index !== current) {
      setFlash(true);
      playShutter();
      setTimeout(() => setFlash(false), 200);
    }
    setCurrent(index);
  }, [current, playShutter]);

  // Wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  });

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 40) {
      goTo(current + (delta > 0 ? 1 : -1));
    }
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo(current - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const moment = current >= 0 ? MOMENTS[current] : null;

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden"
      style={{ height: 'min(75vh, 600px)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background — deep cinematic red-black */}
      <div
        className="absolute inset-0"
        style={{
          background: moment
            ? `radial-gradient(ellipse at 50% 60%, ${moment.accent}08 0%, transparent 60%), linear-gradient(180deg, #0a0404 0%, #150808 50%, #0a0404 100%)`
            : 'linear-gradient(180deg, #0a0404 0%, #0f0606 50%, #0a0404 100%)',
          transition: 'background 0.8s ease',
        }}
      />

      {/* Carpet strip — left side accent */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: moment
            ? `linear-gradient(180deg, transparent, ${moment.accent}40, transparent)`
            : 'linear-gradient(180deg, transparent, rgba(212,175,55,0.15), transparent)',
          transition: 'background 0.6s',
        }}
      />

      {/* Flash */}
      <FlashBurst active={flash} />

      {/* Ambient camera flashes in background */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 3,
            height: 3,
            background: 'white',
            right: `${5 + Math.random() * 20}%`,
            top: `${10 + (i * 14)}%`,
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 2, 0] }}
          transition={{
            duration: 0.12,
            delay: 1 + i * 1.3 + Math.random() * 2,
            repeat: Infinity,
            repeatDelay: 3 + Math.random() * 5,
          }}
        />
      ))}

      {/* Content */}
      <AnimatePresence mode="wait" custom={direction}>
        {current === -1 ? (
          /* Intro */
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-16 h-px mb-8 origin-center"
              style={{ background: 'rgba(212,175,55,0.4)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4"
              style={{ color: 'rgba(212,175,55,0.6)' }}
            >
              Presenting
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="font-serif text-3xl sm:text-5xl tracking-wider leading-tight"
              style={{ color: 'rgba(212,175,55,0.9)' }}
            >
              Sophia Pavlatos
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="font-serif text-sm italic mt-4"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              A decade in the making
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-12"
            >
              <motion.button
                onClick={() => goTo(0)}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-mono text-[9px] tracking-[0.4em] uppercase"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Scroll down ↓
              </motion.button>
            </motion.div>
          </motion.div>
        ) : moment ? (
          /* Moment */
          <motion.div
            key={moment.year}
            custom={direction}
            initial={{ opacity: 0, y: direction * 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20"
          >
            {/* Year — huge, faded background element */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.06, x: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="absolute right-4 sm:right-10 top-6 sm:top-10 font-mono text-[80px] sm:text-[120px] md:text-[160px] font-bold leading-none select-none pointer-events-none"
              style={{ color: moment.accent }}
            >
              {moment.year}
            </motion.p>

            {/* Year label */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-px" style={{ background: moment.accent }} />
              <span
                className="font-mono text-xs tracking-[0.3em] uppercase font-bold"
                style={{ color: moment.accent }}
              >
                {moment.year}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.15] tracking-wide whitespace-pre-line max-w-lg"
              style={{ color: 'rgba(255,255,255,0.92)' }}
            >
              {moment.headline}
            </motion.h2>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-sans text-sm sm:text-base leading-relaxed mt-5 max-w-md"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {moment.quote}
            </motion.p>

            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="w-12 h-px mt-6 origin-left"
              style={{ background: moment.accent }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Progress dots — right side */}
      <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {MOMENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i === current
                ? MOMENTS[Math.max(0, current)]?.accent || '#d4af37'
                : i < current
                ? 'rgba(212,175,55,0.3)'
                : 'rgba(255,255,255,0.1)',
              transform: i === current ? 'scale(1.5)' : 'scale(1)',
              boxShadow: i === current
                ? `0 0 8px ${MOMENTS[Math.max(0, current)]?.accent || '#d4af37'}40`
                : 'none',
            }}
          />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center pointer-events-none">
        {current >= 0 && current < MOMENTS.length - 1 && (
          <motion.p
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[8px] text-white/35 tracking-widest uppercase"
          >
            {current + 1} / {MOMENTS.length}
          </motion.p>
        )}
        {current === MOMENTS.length - 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif text-sm italic"
            style={{ color: 'rgba(212,175,55,0.6)' }}
          >
            ♛ Standing ovation. ♛
          </motion.p>
        )}
      </div>
    </div>
  );
}
