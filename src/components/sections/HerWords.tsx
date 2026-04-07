'use client';

import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { wordEntries } from '@/data/words';
import { cn } from '@/lib/utils';

const SIZE_CLASSES = {
  xl: 'text-4xl sm:text-6xl md:text-7xl',
  lg: 'text-2xl sm:text-3xl md:text-4xl',
  md: 'text-lg sm:text-xl md:text-2xl',
  sm: 'text-sm sm:text-base md:text-lg',
  xs: 'text-xs sm:text-sm md:text-base',
};

const WEIGHT_CLASSES = {
  light: 'font-light',
  normal: 'font-normal',
  bold: 'font-bold',
};

// Key phrases get gold treatment
const GOLD_WORDS = new Set([
  'Naturally Unexpected', 'the queen', '♛', 'PAV', 'Pavlatos',
  'mine is an investment', '@sophitness_', 'Memory Maker',
]);

export function HerWords() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-center font-sans text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.5)' }}>
        Move to shift perspective
      </p>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[70vh] overflow-hidden cursor-default"
      >
        {wordEntries.map((entry, i) => {
          const baseX = ((i * 37 + 13) % 80) + 5;
          const baseY = ((i * 53 + 7) % 85) + 5;

          const depth = entry.size === 'xl' ? 0.3 : entry.size === 'lg' ? 0.5 : entry.size === 'md' ? 0.7 : 0.9;
          const offsetX = (mousePos.x - 0.5) * 40 * depth;
          const offsetY = (mousePos.y - 0.5) * 30 * depth;

          const isGold = GOLD_WORDS.has(entry.text);
          const opacity = entry.size === 'xl' ? 0.9 : entry.size === 'lg' ? 0.7 : entry.size === 'md' ? 0.55 : 0.4;

          return (
            <motion.div
              key={entry.id}
              className={cn(
                'absolute whitespace-nowrap select-none tracking-wider',
                SIZE_CLASSES[entry.size],
                WEIGHT_CLASSES[entry.weight],
                entry.style === 'serif' ? 'font-serif' : 'font-sans'
              )}
              style={{
                left: `${baseX}%`,
                top: `${baseY}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity,
                x: offsetX,
                y: offsetY,
              }}
              transition={{
                opacity: { duration: 1, delay: i * 0.06 },
                x: { type: 'spring', stiffness: 50, damping: 20 },
                y: { type: 'spring', stiffness: 50, damping: 20 },
              }}
            >
              <span
                style={{
                  color: isGold ? '#d4af37' : 'rgba(255,255,255,0.85)',
                  textShadow: isGold ? '0 0 30px rgba(212,175,55,0.2)' : 'none',
                }}
              >
                {entry.text}
              </span>
            </motion.div>
          );
        })}

        {/* Gradient edges */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}
