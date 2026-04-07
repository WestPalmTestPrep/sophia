'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  number: string;
  title: string;
  duration: string;
  linerNote: string;
  bpm: number;
}

const TRACKS: Track[] = [
  {
    id: '1',
    number: 'A1',
    title: 'Origin Story',
    duration: '3:47',
    linerNote:
      'Nassau Community College, 2016. A photography student who saw the world differently. This is the opening track — quiet, determined, full of possibility.',
    bpm: 72,
  },
  {
    id: '2',
    number: 'A2',
    title: 'Fashion Forward',
    duration: '4:12',
    linerNote:
      'FIT NYC, 2018. The Fashion Institute sharpened the vision. Brooklyn internships. AS IF Magazine. The beat picks up here — she\'s learning to move fast.',
    bpm: 95,
  },
  {
    id: '3',
    number: 'A3',
    title: 'The Bold Move',
    duration: '5:01',
    linerNote:
      'NYC → West Palm Beach, 2021. The most courageous track on the album. Everyone in the room went quiet when she announced it. Then she pressed play.',
    bpm: 110,
  },
  {
    id: '4',
    number: 'B1',
    title: 'Golden Hour',
    duration: '4:33',
    linerNote:
      'PAV Photography launches. "Most photography is a luxury. Mine is an investment." The hook that changed everything. This one goes platinum.',
    bpm: 88,
  },
  {
    id: '5',
    number: 'B2',
    title: 'Vogue Interlude',
    duration: '2:18',
    linerNote:
      '"It\'s almost curated to be so uncurated looking." A brief, devastating track. Just Sophia and a Vogue feature. No filler. All substance.',
    bpm: 75,
  },
  {
    id: '6',
    number: 'B3',
    title: 'Triple Crown',
    duration: '4:45',
    linerNote:
      '@sophie.pav. @pavweddings. @sophitness_. Three brands. Three movements. One artist. The tempo shifts three times in this track — once for each empire.',
    bpm: 120,
  },
  {
    id: '7',
    number: 'B4',
    title: 'Naturally Unexpected',
    duration: '6:22',
    linerNote:
      'The closing track. The magnum opus. Everything she built, everyone she inspired, every frame she captured — it all leads here. Press play and let it wash over you.',
    bpm: 68,
  },
];

function VisualizerBars({ bpm, isPlaying }: { bpm: number; isPlaying: boolean }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        maxHeight: 15 + Math.random() * 35,
        delay: i * 0.05,
      })),
    []
  );

  return (
    <div className="flex items-end justify-center gap-[2px] h-12">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: 'rgba(212,175,55,0.6)' }}
          animate={
            isPlaying
              ? {
                  height: [4, bar.maxHeight, 8, bar.maxHeight * 0.6, 4],
                }
              : { height: 4 }
          }
          transition={
            isPlaying
              ? {
                  duration: 60 / bpm,
                  repeat: Infinity,
                  delay: bar.delay,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

function RecordDisc({ isSpinning, speed }: { isSpinning: boolean; speed: number }) {
  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64">
      {/* Record shadow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}
      />

      {/* The vinyl record */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background:
            'radial-gradient(circle, #1a1a1a 18%, #0a0a0a 19%, #111 20%, #0a0a0a 22%, #111 24%, #0a0a0a 28%, #111 30%, #0a0a0a 34%, #111 36%, #0a0a0a 40%, #111 42%, #0a0a0a 46%, #111 48%, #0a0a0a 52%, #111 54%, #0a0a0a 60%, #111 65%, #0a0a0a 70%, #111 75%, #0a0a0a 80%, #111 85%, #0a0a0a 90%, #0d0d0d 100%)',
          border: '2px solid rgba(30,30,30,1)',
        }}
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={
          isSpinning
            ? { duration: speed, repeat: Infinity, ease: 'linear' }
            : { duration: 0 }
        }
      >
        {/* Vinyl sheen */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.03) 45%, transparent 55%)',
          }}
        />

        {/* Center label */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36%] h-[36%] rounded-full flex flex-col items-center justify-center"
          style={{
            background:
              'radial-gradient(circle, #2a2218 0%, #1a1510 60%, #0f0c08 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
          }}
        >
          <span
            className="text-lg sm:text-xl"
            style={{
              color: '#d4af37',
              filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.3))',
            }}
          >
            ♛
          </span>
          <span
            className="font-mono text-[6px] sm:text-[7px] tracking-[0.2em] uppercase mt-0.5"
            style={{ color: 'rgba(212,175,55,0.6)' }}
          >
            PAV Records
          </span>
        </div>

        {/* Center hole */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4%] h-[4%] rounded-full bg-black" />
      </motion.div>
    </div>
  );
}

function Tonearm({ isPlaying }: { isPlaying: boolean }) {
  return (
    <motion.div
      className="absolute -top-2 -right-4 sm:-right-6 origin-top-right z-10"
      animate={{ rotate: isPlaying ? 22 : 5 }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Arm pivot */}
      <div
        className="w-4 h-4 rounded-full absolute top-0 right-0"
        style={{
          background: 'radial-gradient(circle, #444 0%, #222 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
      />

      {/* Arm body */}
      <div
        className="absolute top-3 right-1.5 w-[3px] h-28 sm:h-36 origin-top"
        style={{
          background: 'linear-gradient(180deg, #555, #333)',
          borderRadius: '2px',
          transform: 'rotate(0deg)',
          boxShadow: '1px 1px 4px rgba(0,0,0,0.4)',
        }}
      />

      {/* Headshell */}
      <div
        className="absolute top-[120px] sm:top-[152px] right-0 w-3 h-4"
        style={{
          background: 'linear-gradient(180deg, #444, #222)',
          borderRadius: '1px 1px 0 0',
          transform: 'translateX(-0.5px)',
        }}
      />

      {/* Stylus */}
      <div
        className="absolute top-[136px] sm:top-[168px] right-0.5 w-[2px] h-2"
        style={{
          background: '#d4af37',
          borderRadius: '0 0 1px 1px',
          boxShadow: '0 0 4px rgba(212,175,55,0.4)',
        }}
      />
    </motion.div>
  );
}

export function Vinyl() {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const track = currentTrack ? TRACKS.find((t) => t.id === currentTrack) : null;

  const playClick = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }, []);

  const selectTrack = useCallback(
    (id: string) => {
      playClick();
      if (currentTrack === id) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentTrack(id);
        setIsPlaying(true);
      }
    },
    [currentTrack, isPlaying, playClick]
  );

  // Vinyl crackle ambient sound
  useEffect(() => {
    if (!isPlaying) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.003;
        // Add occasional pops
        if (Math.random() < 0.0005) data[i] = (Math.random() - 0.5) * 0.08;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();

      return () => source.stop();
    } catch {}
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Album header */}
      <div className="text-center space-y-1">
        <p
          className="font-mono text-[9px] tracking-[0.4em] uppercase"
          style={{ color: 'rgba(212,175,55,0.6)' }}
        >
          Now Playing
        </p>
        <h3
          className="font-serif text-xl sm:text-2xl tracking-wider"
          style={{ color: 'rgba(212,175,55,0.85)' }}
        >
          Sophia: The Collection
        </h3>
        <p className="font-mono text-[9px] text-white/40 tracking-wider">
          PAV Records · 2025 · 7 Tracks
        </p>
      </div>

      {/* Player */}
      <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-8 w-full max-w-3xl">
        {/* Record player */}
        <div
          className="relative flex-shrink-0 p-6 sm:p-8 rounded-xl"
          style={{
            background:
              'linear-gradient(145deg, #1a1816 0%, #12100e 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <RecordDisc isSpinning={isPlaying} speed={track ? 60 / track.bpm * 4 : 3} />
          <Tonearm isPlaying={isPlaying} />
        </div>

        {/* Track listing + now playing info */}
        <div className="flex-1 w-full space-y-4">
          {/* Visualizer */}
          <VisualizerBars bpm={track?.bpm ?? 80} isPlaying={isPlaying} />

          {/* Track list */}
          <div className="space-y-1">
            {TRACKS.map((t) => {
              const isActive = currentTrack === t.id;
              return (
                <motion.button
                  key={t.id}
                  onClick={() => selectTrack(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all group"
                  style={{
                    background: isActive
                      ? 'rgba(212,175,55,0.08)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(212,175,55,0.15)'
                      : '1px solid transparent',
                  }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Track number or play indicator */}
                  <span
                    className="font-mono text-[10px] w-6 text-center flex-shrink-0"
                    style={{
                      color: isActive
                        ? '#d4af37'
                        : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {isActive && isPlaying ? '▶' : t.number}
                  </span>

                  <span
                    className="font-serif text-sm tracking-wider flex-1 truncate"
                    style={{
                      color: isActive
                        ? 'rgba(212,175,55,0.9)'
                        : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {t.title}
                  </span>

                  <span className="font-mono text-[10px] text-white/25 flex-shrink-0">
                    {t.duration}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Liner notes for current track */}
          <AnimatePresence mode="wait">
            {track && (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="px-4 py-3 rounded-lg"
                style={{
                  background: 'rgba(212,175,55,0.04)',
                  border: '1px solid rgba(212,175,55,0.1)',
                }}
              >
                <p
                  className="font-mono text-[8px] tracking-[0.3em] uppercase mb-2"
                  style={{ color: 'rgba(212,175,55,0.5)' }}
                >
                  Liner Notes
                </p>
                <p className="font-serif text-xs sm:text-sm text-white/60 leading-relaxed italic">
                  {track.linerNote}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
        {isPlaying ? '♛ Playing' : 'Select a track to begin'}
      </p>
    </div>
  );
}
