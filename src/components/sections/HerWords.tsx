'use client';

import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { wordEntries } from '@/data/words';
import { cn } from '@/lib/utils';

const SIZE_CLASSES = {
  xl: 'text-4xl sm:text-6xl md:text-7xl',
  lg: 'text-2xl sm:text-3xl md:text-4xl',
  md: 'text-lg sm:text-xl md:text-2xl',
  sm: 'text-sm sm:text-base',
  xs: 'text-xs sm:text-sm',
};

const WEIGHT_CLASSES = {
  light: 'font-light',
  normal: 'font-normal',
  bold: 'font-bold',
};

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
    <div className="space-y-6">
      <p className="text-center text-white/20 font-sans text-[10px] tracking-[0.4em] uppercase">
        Move to shift perspective
      </p>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[70vh] overflow-hidden cursor-default"
      >
        {wordEntries.map((entry, i) => {
          // Distribute words across the space with intentional layout
          const baseX = ((i * 37 + 13) % 80) + 5;
          const baseY = ((i * 53 + 7) % 85) + 5;

          // Parallax offset based on mouse position and word "depth"
          const depth = entry.size === 'xl' ? 0.3 : entry.size === 'lg' ? 0.5 : entry.size === 'md' ? 0.7 : 0.9;
          const offsetX = (mousePos.x - 0.5) * 40 * depth;
          const offsetY = (mousePos.y - 0.5) * 30 * depth;

          const opacity = entry.size === 'xl' ? 0.7 : entry.size === 'lg' ? 0.5 : entry.size === 'md' ? 0.3 : 0.15;

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
                opacity: { duration: 1, delay: i * 0.08 },
                x: { type: 'spring', stiffness: 50, damping: 20 },
                y: { type: 'spring', stiffness: 50, damping: 20 },
              }}
            >
              <span className="text-white/80">{entry.text}</span>
            </motion.div>
          );
        })}

        {/* Gradient edges for depth */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}
