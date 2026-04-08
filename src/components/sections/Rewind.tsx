'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scene {
  id: string;
  year: string;
  title: string;
  description: string;
  timestamp: string;
}

const SCENES: Scene[] = [
  {
    id: '9',
    year: '2025',
    title: 'The Full Resume',
    description:
      'Photographer. Creative Director. Fine Artist. Three businesses. A decade in. The rest of us are still updating our LinkedIn bios.',
    timestamp: '01:42:37',
  },
  {
    id: '8',
    year: '2024',
    title: 'Vogue Called',
    description:
      '"It\'s almost curated to be so uncurated looking." Vogue literally quoted her. I can\'t even get a text back.',
    timestamp: '01:28:15',
  },
  {
    id: '7',
    year: '2023',
    title: 'PAV Weddings',
    description:
      'Fine art editorial wedding photography. Making couples cry with how good their photos are. Honestly kind of a flex.',
    timestamp: '01:15:44',
  },
  {
    id: '6',
    year: '2022',
    title: 'West Palm Empire',
    description:
      'Built the brand in South Florida. While the rest of us were arguing about where to get lunch, she was building an empire.',
    timestamp: '00:58:22',
  },
  {
    id: '5',
    year: '2021',
    title: 'The Bold Move',
    description:
      'NYC → West Palm Beach. No safety net. No plan B. Everyone said "are you sure?" She was sure.',
    timestamp: '00:44:08',
  },
  {
    id: '4',
    year: '2020',
    title: 'PAV Photography',
    description:
      '"Most photography is a luxury. Mine is an investment." Imagine being 20-something and saying that with a straight face. And being right.',
    timestamp: '00:31:55',
  },
  {
    id: '3',
    year: '2019',
    title: 'AS IF Magazine',
    description:
      'Interned at a high-end fashion magazine in Brooklyn. Most people intern and get coffee. She interned and got a career.',
    timestamp: '00:22:10',
  },
  {
    id: '2',
    year: '2018',
    title: 'Fashion Institute',
    description:
      'FIT NYC. Where fashion meets photography meets art. She showed up already knowing what she wanted. Must be nice.',
    timestamp: '00:11:33',
  },
  {
    id: '1',
    year: '2016',
    title: 'Where It Started',
    description:
      'Nassau CC. A camera. A dream. Absolutely zero chill about either of them. And honestly? Good for her.',
    timestamp: '00:03:47',
  },
];

function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-30"
      style={{
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        mixBlendMode: 'multiply',
      }}
    />
  );
}

function TrackingBar() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[3px] z-20 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
        boxShadow: '0 0 10px rgba(255,255,255,0.1)',
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function StaticNoise({ intensity }: { intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || intensity === 0) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 200;
    canvas.height = 150;

    let raf: number;
    const draw = () => {
      const imageData = ctx.createImageData(200, 150);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [intensity]);

  if (intensity === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      style={{
        opacity: intensity,
        mixBlendMode: 'screen',
        imageRendering: 'pixelated',
      }}
    />
  );
}

export function Rewind() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRewinding, setIsRewinding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [staticIntensity, setStaticIntensity] = useState(0);
  const [glitchOffset, setGlitchOffset] = useState(0);
  const [counter, setCounter] = useState(SCENES[0].timestamp);
  const rewindIntervalRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const scene = SCENES[currentIndex];

  // VHS click sound
  const playClick = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 150;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }, []);

  // Glitch effect during transitions
  const triggerGlitch = useCallback(() => {
    setStaticIntensity(0.3);
    let count = 0;
    const interval = setInterval(() => {
      setGlitchOffset(Math.random() * 10 - 5);
      count++;
      if (count > 6) {
        clearInterval(interval);
        setGlitchOffset(0);
        setStaticIntensity(0);
      }
    }, 50);
  }, []);

  const goToScene = useCallback(
    (index: number) => {
      if (index < 0 || index >= SCENES.length) return;
      playClick();
      triggerGlitch();
      setCurrentIndex(index);
      setCounter(SCENES[index].timestamp);
    },
    [playClick, triggerGlitch]
  );

  // Rewind mode — auto-advance backwards
  const startRewind = useCallback(() => {
    if (currentIndex >= SCENES.length - 1) return;
    setIsRewinding(true);
    setIsPlaying(false);
    playClick();
  }, [currentIndex, playClick]);

  const startPlay = useCallback(() => {
    if (currentIndex <= 0) return;
    setIsPlaying(true);
    setIsRewinding(false);
    playClick();
  }, [currentIndex, playClick]);

  const stop = useCallback(() => {
    setIsRewinding(false);
    setIsPlaying(false);
    playClick();
  }, [playClick]);

  // Auto-advance during rewind/play
  useEffect(() => {
    if (!isRewinding && !isPlaying) return;

    rewindIntervalRef.current = setTimeout(
      () => {
        if (isRewinding && currentIndex < SCENES.length - 1) {
          goToScene(currentIndex + 1);
        } else if (isPlaying && currentIndex > 0) {
          goToScene(currentIndex - 1);
        } else {
          setIsRewinding(false);
          setIsPlaying(false);
        }
      },
      isRewinding ? 1800 : 2500
    );

    return () => clearTimeout(rewindIntervalRef.current);
  }, [isRewinding, isPlaying, currentIndex, goToScene]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* CRT Screen */}
      <div
        className="relative w-full overflow-hidden rounded-lg aspect-[3/4] sm:aspect-[16/10]"
        style={{
          background: '#0a0a0a',
          border: '3px solid #1a1a1a',
          boxShadow:
            'inset 0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5), inset 0 0 2px rgba(255,255,255,0.05)',
        }}
      >
        <ScanLines />
        <TrackingBar />
        <StaticNoise intensity={staticIntensity} />

        {/* CRT curvature vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Scene content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: glitchOffset }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 sm:px-16 z-10"
          >
            {/* Year — big */}
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="font-mono text-5xl sm:text-7xl font-bold leading-none mb-4"
              style={{
                color: 'rgba(200,220,255,0.9)',
                textShadow:
                  '0 0 30px rgba(100,150,255,0.3), 2px 0 0 rgba(255,50,50,0.15), -2px 0 0 rgba(50,255,50,0.15)',
              }}
            >
              {scene.year}
            </motion.p>

            {/* Title */}
            <motion.h3
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-xl sm:text-2xl tracking-wider mb-3"
              style={{
                color: 'rgba(212,175,55,0.9)',
                textShadow: '0 0 20px rgba(212,175,55,0.3)',
              }}
            >
              {scene.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-xs sm:text-sm text-white/60 max-w-md leading-relaxed"
            >
              {scene.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* VHS HUD */}
        <div className="absolute top-3 left-4 z-30 pointer-events-none">
          <div className="flex items-center gap-2">
            {isRewinding && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="font-mono text-[10px] text-cyan-400/80"
              >
                ◀◀ REW
              </motion.span>
            )}
            {isPlaying && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="font-mono text-[10px] text-green-400/80"
              >
                ▶ PLAY
              </motion.span>
            )}
            {!isRewinding && !isPlaying && (
              <span className="font-mono text-[10px] text-yellow-400/60">
                ⏸ PAUSE
              </span>
            )}
          </div>
        </div>

        <div className="absolute top-3 right-4 z-30 pointer-events-none">
          <span
            className="font-mono text-[11px] tabular-nums"
            style={{
              color: 'rgba(200,220,255,0.7)',
              textShadow: '0 0 8px rgba(100,150,255,0.3)',
            }}
          >
            {counter}
          </span>
        </div>

        <div className="absolute bottom-3 left-4 z-30 pointer-events-none">
          <span className="font-mono text-[9px] text-white/30">SP</span>
          <span className="font-mono text-[9px] text-white/15 ml-2">
            ♛ PAV HOME VIDEO
          </span>
        </div>

        <div className="absolute bottom-3 right-4 z-30 pointer-events-none">
          <span className="font-mono text-[9px] text-white/30">
            {currentIndex + 1}/{SCENES.length}
          </span>
        </div>

        {/* Chromatic aberration edge */}
        <div
          className="absolute inset-0 pointer-events-none z-25"
          style={{
            boxShadow:
              'inset 3px 0 8px rgba(255,0,0,0.03), inset -3px 0 8px rgba(0,0,255,0.03)',
          }}
        />
      </div>

      {/* VCR Controls */}
      <div
        className="flex items-center justify-center gap-1 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2"
        style={{
          background: 'rgba(20,20,20,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Play forward (earlier years) */}
        <button
          onClick={isPlaying ? stop : startPlay}
          disabled={currentIndex <= 0 && !isPlaying}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-sm sm:text-[10px] tracking-wider uppercase transition-colors disabled:opacity-20"
          style={{ color: isPlaying ? '#4ade80' : 'rgba(255,255,255,0.5)' }}
        >
          ▶
        </button>

        {/* Pause */}
        <button
          onClick={stop}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-sm sm:text-[10px] tracking-wider uppercase transition-colors"
          style={{
            color:
              !isRewinding && !isPlaying
                ? '#facc15'
                : 'rgba(255,255,255,0.5)',
          }}
        >
          ⏸
        </button>

        {/* Rewind (later years going backward) */}
        <button
          onClick={isRewinding ? stop : startRewind}
          disabled={currentIndex >= SCENES.length - 1 && !isRewinding}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-sm sm:text-[10px] tracking-wider uppercase transition-colors disabled:opacity-20"
          style={{
            color: isRewinding ? '#22d3ee' : 'rgba(255,255,255,0.5)',
          }}
        >
          ◀◀
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1 sm:mx-2" />

        {/* Manual prev/next */}
        <button
          onClick={() => goToScene(currentIndex - 1)}
          disabled={currentIndex <= 0}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-sm sm:text-[10px] text-white/40 hover:text-white/70 transition-colors disabled:opacity-20"
        >
          ◀
        </button>
        <button
          onClick={() => goToScene(currentIndex + 1)}
          disabled={currentIndex >= SCENES.length - 1}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-sm sm:text-[10px] text-white/40 hover:text-white/70 transition-colors disabled:opacity-20"
        >
          ▶
        </button>
      </div>

      {/* Timeline scrubber */}
      <div className="w-full max-w-md flex items-center gap-2 px-4">
        <span className="font-mono text-[8px] text-white/30">{SCENES[SCENES.length - 1].year}</span>
        <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'rgba(212,175,55,0.5)' }}
            animate={{
              width: `${((SCENES.length - 1 - currentIndex) / (SCENES.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="font-mono text-[8px] text-white/30">{SCENES[0].year}</span>
      </div>

      <p className="font-mono text-[9px] text-white/35 tracking-widest uppercase">
        Rewind through the years
      </p>
    </div>
  );
}
