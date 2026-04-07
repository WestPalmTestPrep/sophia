'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { viewfinderMoments } from '@/data/viewfinder';

export function Viewfinder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    // Check proximity to moments
    const nearby = viewfinderMoments.find((m) => {
      const dist = Math.sqrt((m.x - x) ** 2 + (m.y - y) ** 2);
      return dist < 12;
    });

    if (nearby) {
      setFocusedId(nearby.id);
      setRevealed((prev) => new Set(prev).add(nearby.id));
    } else {
      setFocusedId(null);
    }
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-center text-white/30 font-sans text-[10px] tracking-[0.4em] uppercase">
        Move your cursor to focus
      </p>

      {/* Viewfinder frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full aspect-[16/10] bg-black border border-white/5 overflow-hidden cursor-crosshair"
      >
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Rule of thirds */}
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/[0.06]" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/[0.06]" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/[0.06]" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/[0.06]" />
        </div>

        {/* Focus ring that follows cursor */}
        <motion.div
          className="absolute z-20 pointer-events-none"
          animate={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {/* Outer ring */}
          <motion.div
            animate={{
              scale: focusedId ? 1 : 1.2,
              opacity: focusedId ? 0.6 : 0.2,
            }}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-white/30"
          />
          {/* Inner ring */}
          <motion.div
            animate={{
              scale: focusedId ? 1 : 0.8,
              opacity: focusedId ? 0.8 : 0.15,
            }}
            className="absolute inset-3 sm:inset-4 rounded-full border border-white/40"
          />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white/40 -translate-x-1/2 -translate-y-1/2" />
          {/* Crosshair lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
        </motion.div>

        {/* Moments scattered across the viewfinder */}
        {viewfinderMoments.map((moment) => {
          const isFocused = focusedId === moment.id;
          const isRevealed = revealed.has(moment.id);

          return (
            <motion.div
              key={moment.id}
              className="absolute z-15 pointer-events-none"
              style={{
                left: `${moment.x}%`,
                top: `${moment.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AnimatePresence>
                {(isFocused || isRevealed) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isFocused ? 1 : 0.25,
                      scale: isFocused ? 1 : 0.9,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="text-center whitespace-nowrap"
                  >
                    <p className="font-serif text-sm sm:text-base text-white/90 tracking-wider">
                      {moment.text}
                    </p>
                    <p className="font-sans text-[9px] sm:text-[10px] text-white/40 tracking-widest uppercase mt-0.5">
                      {moment.subtext}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Camera HUD elements */}
        <div className="absolute top-3 left-4 text-[9px] font-mono text-white/15 z-20 pointer-events-none">
          <p>ISO 400</p>
          <p>f/1.8</p>
        </div>
        <div className="absolute top-3 right-4 text-[9px] font-mono text-white/15 z-20 pointer-events-none text-right">
          <p>1/125</p>
          <p>PAV</p>
        </div>
        <div className="absolute bottom-3 left-4 text-[9px] font-mono text-white/15 z-20 pointer-events-none">
          <motion.p
            animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ● REC
          </motion.p>
        </div>
        <div className="absolute bottom-3 right-4 text-[9px] font-mono text-white/15 z-20 pointer-events-none">
          {revealed.size}/{viewfinderMoments.length} found
        </div>

        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 pointer-events-none z-20" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10 pointer-events-none z-20" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10 pointer-events-none z-20" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10 pointer-events-none z-20" />
      </div>

      <p className="text-center text-white/15 text-[10px] font-mono tracking-wider">
        {revealed.size === viewfinderMoments.length
          ? 'Every moment found. Every frame matters.'
          : `${viewfinderMoments.length - revealed.size} moments hidden in the frame`}
      </p>
    </div>
  );
}
