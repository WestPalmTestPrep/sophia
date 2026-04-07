'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { viewfinderMoments } from '@/data/viewfinder';

export function Viewfinder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    const nearby = viewfinderMoments.find((m) => {
      const dist = Math.sqrt((m.x - x) ** 2 + (m.y - y) ** 2);
      return dist < 15;
    });

    if (nearby) {
      setFocusedId(nearby.id);
      setRevealed((prev) => new Set(prev).add(nearby.id));
    } else {
      setFocusedId(null);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    updatePosition(e.touches[0].clientX, e.touches[0].clientY);
  }, [updatePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX, e.touches[0].clientY);
  }, [updatePosition]);

  const allFound = revealed.size === viewfinderMoments.length;

  return (
    <div className="space-y-4">
      <p className="text-center font-sans text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
        <span className="hidden sm:inline">Move your cursor to discover hidden moments</span>
        <span className="sm:hidden">Drag your finger to discover hidden moments</span>
      </p>

      {/* Viewfinder frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[3/4] sm:aspect-[16/10] overflow-hidden cursor-crosshair rounded-sm touch-none"
        style={{
          background: '#050505',
          border: '1px solid rgba(212,175,55,0.1)',
        }}
      >
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />

        {/* Grid lines - rule of thirds */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/[0.08]" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/[0.08]" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/[0.08]" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/[0.08]" />
        </div>

        {/* Focus ring - gold themed */}
        <motion.div
          className="absolute z-20 pointer-events-none"
          animate={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <motion.div
            animate={{
              scale: focusedId ? 1 : 1.2,
              opacity: focusedId ? 0.8 : 0.3,
            }}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full"
            style={{
              border: focusedId
                ? '1.5px solid rgba(212,175,55,0.6)'
                : '1px solid rgba(255,255,255,0.3)',
              boxShadow: focusedId ? '0 0 20px rgba(212,175,55,0.15)' : 'none',
            }}
          />
          <motion.div
            animate={{
              scale: focusedId ? 1 : 0.8,
              opacity: focusedId ? 0.9 : 0.2,
            }}
            className="absolute inset-3 sm:inset-4 rounded-full"
            style={{
              border: focusedId
                ? '1px solid rgba(212,175,55,0.5)'
                : '1px solid rgba(255,255,255,0.2)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: focusedId ? 'rgba(212,175,55,0.8)' : 'rgba(255,255,255,0.4)' }}
          />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/15" />
        </motion.div>

        {/* Moments */}
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
              {/* Discovery pulse */}
              {!isRevealed && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: '50%', top: '50%',
                    backgroundColor: 'rgba(212,175,55,0.3)',
                  }}
                />
              )}

              <AnimatePresence>
                {(isFocused || isRevealed) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isFocused ? 1 : 0.4,
                      scale: isFocused ? 1 : 0.9,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="text-center whitespace-nowrap"
                  >
                    <p
                      className="font-serif text-sm sm:text-base tracking-wider"
                      style={{
                        color: isFocused ? '#d4af37' : 'rgba(212,175,55,0.6)',
                        textShadow: isFocused ? '0 0 20px rgba(212,175,55,0.3)' : 'none',
                      }}
                    >
                      {moment.text}
                    </p>
                    <p className="font-sans text-[10px] sm:text-[11px] text-white/65 tracking-wider mt-1">
                      {moment.subtext}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Camera HUD */}
        <div className="absolute top-3 left-4 z-20 pointer-events-none space-y-0.5">
          <p className="font-mono text-[10px] text-white/55">ISO 400</p>
          <p className="font-mono text-[10px] text-white/55">f/1.8</p>
        </div>
        <div className="absolute top-3 right-4 z-20 pointer-events-none text-right space-y-0.5">
          <p className="font-mono text-[10px] text-white/55">1/125</p>
          <p className="font-mono text-[10px] font-bold" style={{ color: 'rgba(212,175,55,0.6)' }}>PAV</p>
        </div>
        <div className="absolute bottom-3 left-4 z-20 pointer-events-none">
          <motion.p
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[10px]"
            style={{ color: 'rgba(255,80,80,0.7)' }}
          >
            ● REC
          </motion.p>
        </div>
        <div className="absolute bottom-3 right-4 z-20 pointer-events-none">
          <span className="font-mono text-[10px] font-bold" style={{ color: allFound ? '#d4af37' : 'rgba(255,255,255,0.5)' }}>
            {revealed.size}/{viewfinderMoments.length}
          </span>
          <span className="font-mono text-[9px] text-white/50 ml-1">found</span>
        </div>

        {/* Corner brackets - gold */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t border-l pointer-events-none z-20" style={{ borderColor: 'rgba(212,175,55,0.25)' }} />
        <div className="absolute top-4 right-4 w-5 h-5 border-t border-r pointer-events-none z-20" style={{ borderColor: 'rgba(212,175,55,0.25)' }} />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l pointer-events-none z-20" style={{ borderColor: 'rgba(212,175,55,0.25)' }} />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r pointer-events-none z-20" style={{ borderColor: 'rgba(212,175,55,0.25)' }} />
      </div>

      <p
        className="text-center text-xs font-mono tracking-wider"
        style={{ color: allFound ? '#d4af37' : 'rgba(255,255,255,0.55)' }}
      >
        {allFound
          ? '✦ Every moment found. Every frame matters. ✦'
          : `${viewfinderMoments.length - revealed.size} moments hidden in the frame`}
      </p>
    </div>
  );
}
