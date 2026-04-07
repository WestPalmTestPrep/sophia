'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WheelSlice {
  label: string;
  color: string;
  results: string[];
}

const SLICES: WheelSlice[] = [
  {
    label: 'Compliment',
    color: '#d4af37',
    results: [
      'You make "naturally unexpected" look effortless.',
      'Your work ethic would make a chess grandmaster jealous.',
      'You turned a camera into an empire. That\'s not talent — that\'s vision.',
      'The way you see the world through a lens? That\'s a superpower.',
    ],
  },
  {
    label: 'Prediction',
    color: '#8b5cf6',
    results: [
      'By next birthday, PAV will have an international feature.',
      'You\'re going to discover a new creative medium this year.',
      'Someone famous is going to DM you for a shoot. Screenshot this.',
      'A trip to Greece will change your perspective on everything.',
    ],
  },
  {
    label: 'Dare',
    color: '#ef4444',
    results: [
      'Text someone "I\'m the queen" with zero context.',
      'Post a selfie with no filter and caption it "Naturally Unexpected."',
      'Call someone right now and just say "checkmate" then hang up.',
      'Do 10 squats right now. @sophitness_ would expect nothing less.',
    ],
  },
  {
    label: 'Memory',
    color: '#3b82f6',
    results: [
      'Remember Camp Saint-Paul? That\'s where the photographer was born.',
      'The day you decided to leave NYC. The scariest and best decision.',
      'Your first FIT assignment. You already knew you were different.',
      'The first time someone called you a "creative director" and it felt real.',
    ],
  },
  {
    label: 'Wish',
    color: '#10b981',
    results: [
      'May every golden hour find you exactly where you need to be.',
      'May your next year have more plot twists than a chess game.',
      'May you never lose the hunger that got you from Nassau to Vogue.',
      'May every frame you capture tell a story worth remembering.',
    ],
  },
  {
    label: 'Truth',
    color: '#f59e0b',
    results: [
      'You secretly love when people underestimate you. More room to surprise.',
      'You\'re harder on yourself than anyone else will ever be.',
      'You didn\'t just follow your dream — you outworked everyone chasing it.',
      'The person reading this is proud of how far you\'ve come.',
    ],
  },
];

const TOTAL_SLICES = SLICES.length;
const SLICE_ANGLE = 360 / TOTAL_SLICES;

export function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ category: string; text: string; color: string } | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Random spin: 3-6 full rotations + random offset
    const extraRotations = 3 + Math.random() * 3;
    const randomOffset = Math.random() * 360;
    const totalRotation = rotation + extraRotations * 360 + randomOffset;

    setRotation(totalRotation);

    // Determine which slice it lands on after spin
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const sliceIndex = Math.floor(normalizedAngle / SLICE_ANGLE) % TOTAL_SLICES;
      const slice = SLICES[sliceIndex];
      const randomResult = slice.results[Math.floor(Math.random() * slice.results.length)];

      setResult({
        category: slice.label,
        text: randomResult,
        color: slice.color,
      });
      setSpinning(false);
      setSpinCount(c => c + 1);
    }, 4000);
  }, [spinning, rotation]);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Wheel */}
      <div className="relative">
        {/* Pointer/arrow at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '18px solid #d4af37',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          />
        </div>

        {/* The wheel */}
        <motion.div
          ref={wheelRef}
          className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden"
          style={{
            border: '3px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 40px rgba(212,175,55,0.1), inset 0 0 30px rgba(0,0,0,0.5)',
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {SLICES.map((slice, i) => {
              const startAngle = i * SLICE_ANGLE;
              const endAngle = (i + 1) * SLICE_ANGLE;
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);

              const x1 = 100 + 100 * Math.cos(startRad);
              const y1 = 100 + 100 * Math.sin(startRad);
              const x2 = 100 + 100 * Math.cos(endRad);
              const y2 = 100 + 100 * Math.sin(endRad);

              const largeArc = SLICE_ANGLE > 180 ? 1 : 0;

              // Label position
              const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
              const labelX = 100 + 60 * Math.cos(midAngle);
              const labelY = 100 + 60 * Math.sin(midAngle);
              const labelRotation = (startAngle + endAngle) / 2;

              return (
                <g key={slice.label}>
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={slice.color}
                    fillOpacity={0.2}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fillOpacity={0.8}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    transform={`rotate(${labelRotation}, ${labelX}, ${labelY})`}
                  >
                    {slice.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx="100" cy="100" r="18" fill="#0a0a0a" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />
            <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="#d4af37" fontSize="14">
              ♛
            </text>
          </svg>
        </motion.div>

        {/* Glow ring */}
        {spinning && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{
              boxShadow: '0 0 40px rgba(212,175,55,0.2)',
            }}
          />
        )}
      </div>

      {/* Spin button */}
      <motion.button
        onClick={spin}
        disabled={spinning}
        whileHover={!spinning ? { scale: 1.05 } : undefined}
        whileTap={!spinning ? { scale: 0.95 } : undefined}
        className="px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all"
        style={{
          background: spinning ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.15)',
          border: '1px solid rgba(212,175,55,0.3)',
          color: spinning ? 'rgba(212,175,55,0.55)' : '#d4af37',
          cursor: spinning ? 'not-allowed' : 'pointer',
        }}
      >
        {spinning ? 'Spinning...' : spinCount === 0 ? 'Spin the wheel' : 'Spin again'}
      </motion.button>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={`${spinCount}`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="max-w-md text-center px-6 py-5 rounded-xl"
            style={{
              background: `${result.color}10`,
              border: `1px solid ${result.color}30`,
            }}
          >
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
              style={{ color: result.color }}
            >
              {result.category}
            </p>
            <p className="font-serif text-lg sm:text-xl text-white/80 leading-relaxed">
              {result.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin counter */}
      {spinCount > 0 && (
        <p className="font-mono text-[9px] text-white/40 tracking-wider">
          Spins: {spinCount}
        </p>
      )}
    </div>
  );
}
