'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: string;
  x: number;
  y: number;
  label: string;
  group: number;
  size: number;
}

// Stars that form a queen chess piece shape when connected
const STARS: Star[] = [
  // Crown points (top)
  { id: 's1', x: 35, y: 12, label: 'Nassau CC', group: 1, size: 3 },
  { id: 's2', x: 43, y: 8, label: 'FIT NYC', group: 1, size: 3.5 },
  { id: 's3', x: 50, y: 5, label: 'The Dream', group: 1, size: 4 },
  { id: 's4', x: 57, y: 8, label: 'AS IF Magazine', group: 1, size: 3.5 },
  { id: 's5', x: 65, y: 12, label: 'First Camera', group: 1, size: 3 },

  // Crown base
  { id: 's6', x: 37, y: 22, label: 'Camp Saint-Paul', group: 2, size: 2.5 },
  { id: 's7', x: 63, y: 22, label: 'Brooklyn Days', group: 2, size: 2.5 },

  // Head / top body
  { id: 's8', x: 40, y: 30, label: 'NYC → Florida', group: 3, size: 3 },
  { id: 's9', x: 50, y: 28, label: 'PAV Photography', group: 3, size: 4 },
  { id: 's10', x: 60, y: 30, label: 'West Palm Beach', group: 3, size: 3 },

  // Waist
  { id: 's11', x: 42, y: 45, label: '@sophie.pav', group: 4, size: 2.5 },
  { id: 's12', x: 50, y: 42, label: 'Vogue Feature', group: 4, size: 4.5 },
  { id: 's13', x: 58, y: 45, label: '@pavweddings', group: 4, size: 2.5 },

  // Body
  { id: 's14', x: 40, y: 58, label: 'Fine Art', group: 5, size: 2.5 },
  { id: 's15', x: 50, y: 55, label: 'Naturally Unexpected', group: 5, size: 4 },
  { id: 's16', x: 60, y: 58, label: '@sophitness_', group: 5, size: 2.5 },

  // Base / pedestal
  { id: 's17', x: 35, y: 72, label: 'Memory Maker', group: 6, size: 3 },
  { id: 's18', x: 50, y: 68, label: '♛ The Queen', group: 6, size: 5 },
  { id: 's19', x: 65, y: 72, label: 'Creative Director', group: 6, size: 3 },

  // Bottom base
  { id: 's20', x: 30, y: 80, label: 'Past', group: 7, size: 2 },
  { id: 's21', x: 50, y: 78, label: 'Happy Birthday', group: 7, size: 3.5 },
  { id: 's22', x: 70, y: 80, label: 'Future', group: 7, size: 2 },
];

// Lines that connect stars to form the queen shape
const CONNECTIONS: [string, string][] = [
  // Crown
  ['s1', 's2'], ['s2', 's3'], ['s3', 's4'], ['s4', 's5'],
  ['s1', 's6'], ['s5', 's7'], ['s6', 's7'],
  // Crown to head
  ['s6', 's8'], ['s7', 's10'],
  // Head
  ['s8', 's9'], ['s9', 's10'],
  // Head to waist
  ['s8', 's11'], ['s10', 's13'],
  // Waist
  ['s11', 's12'], ['s12', 's13'],
  // Waist to body
  ['s11', 's14'], ['s13', 's16'],
  // Body
  ['s14', 's15'], ['s15', 's16'],
  // Body to base
  ['s14', 's17'], ['s16', 's19'],
  // Base
  ['s17', 's18'], ['s18', 's19'],
  // Bottom
  ['s17', 's20'], ['s19', 's22'],
  ['s20', 's21'], ['s21', 's22'],
];

function BackgroundStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

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
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

export function Constellation() {
  const [activated, setActivated] = useState<Set<string>>(new Set());
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const activateStar = useCallback(
    (id: string) => {
      if (activated.has(id)) return;
      const next = new Set(activated);
      next.add(id);
      setActivated(next);
      if (next.size === STARS.length) {
        setTimeout(() => setComplete(true), 400);
      }
    },
    [activated]
  );

  // Auto-reveal nearby stars when one is tapped (cascade effect)
  useEffect(() => {
    if (activated.size === 0 || complete) return;
    const lastActivated = Array.from(activated);
    const last = lastActivated[lastActivated.length - 1];
    const star = STARS.find((s) => s.id === last);
    if (!star) return;

    // Find connected unactivated stars
    const connected = CONNECTIONS.filter(
      ([a, b]) => (a === last || b === last) && (!activated.has(a) || !activated.has(b))
    );

    if (connected.length > 0) {
      // Randomly activate one connected star after a delay
      const timer = setTimeout(() => {
        const [a, b] = connected[Math.floor(Math.random() * connected.length)];
        const target = a === last ? b : a;
        if (!activated.has(target)) {
          setActivated((prev) => {
            const next = new Set(prev);
            next.add(target);
            if (next.size === STARS.length) {
              setTimeout(() => setComplete(true), 400);
            }
            return next;
          });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activated, complete]);

  const starMap = useMemo(() => {
    const map = new Map<string, Star>();
    STARS.forEach((s) => map.set(s.id, s));
    return map;
  }, []);

  const visibleConnections = CONNECTIONS.filter(
    ([a, b]) => activated.has(a) && activated.has(b)
  );

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="text-center space-y-2">
        <p
          className="font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{ color: 'rgba(212,175,55,0.65)' }}
        >
          Tap the stars to reveal the constellation
        </p>
      </div>

      {/* Sky */}
      <div
        className="relative w-full overflow-hidden rounded-lg aspect-[3/4] sm:aspect-[16/10]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, #0c0c1a 0%, #050510 50%, #020208 100%)',
          border: '1px solid rgba(212,175,55,0.1)',
        }}
      >
        <BackgroundStars />

        {/* Nebula glow when complete */}
        <AnimatePresence>
          {complete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 60%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Connection lines */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {visibleConnections.map(([aId, bId]) => {
            const a = starMap.get(aId)!;
            const b = starMap.get(bId)!;
            return (
              <motion.line
                key={`${aId}-${bId}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(212,175,55,0.35)"
                strokeWidth="0.2"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            );
          })}
        </svg>

        {/* Stars */}
        {STARS.map((star) => {
          const isActive = activated.has(star.id);
          const isHovered = hoveredStar === star.id;

          return (
            <div key={star.id}>
              {/* Clickable area */}
              <motion.button
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: 44,
                  height: 44,
                }}
                onClick={() => activateStar(star.id)}
                onMouseEnter={() => setHoveredStar(star.id)}
                onMouseLeave={() => setHoveredStar(null)}
              />

              {/* Star visual */}
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: isActive ? star.size * 2.5 : star.size * 1.5,
                  height: isActive ? star.size * 2.5 : star.size * 1.5,
                  backgroundColor: isActive ? '#d4af37' : 'rgba(255,255,255,0.5)',
                  boxShadow: isActive
                    ? `0 0 ${star.size * 4}px rgba(212,175,55,0.6), 0 0 ${star.size * 8}px rgba(212,175,55,0.2)`
                    : 'none',
                  transition: 'all 0.4s ease',
                }}
                animate={
                  !isActive
                    ? { opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }
                    : { opacity: 1, scale: 1 }
                }
                transition={
                  !isActive
                    ? {
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                    : { duration: 0.3 }
                }
              />

              {/* Pulse ring on inactive stars */}
              {!isActive && (
                <motion.div
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: 12,
                    height: 12,
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                  animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              )}

              {/* Label on hover or active */}
              <AnimatePresence>
                {(isHovered || isActive) && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap"
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y + 3}%`,
                    }}
                  >
                    <span
                      className="font-serif text-[9px] sm:text-[11px] tracking-wider"
                      style={{
                        color: isActive
                          ? 'rgba(212,175,55,0.85)'
                          : 'rgba(255,255,255,0.6)',
                        textShadow: isActive
                          ? '0 0 10px rgba(212,175,55,0.3)'
                          : 'none',
                      }}
                    >
                      {star.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Corner markers */}
        <div
          className="absolute top-3 left-3 w-4 h-4 border-t border-l pointer-events-none"
          style={{ borderColor: 'rgba(212,175,55,0.2)' }}
        />
        <div
          className="absolute top-3 right-3 w-4 h-4 border-t border-r pointer-events-none"
          style={{ borderColor: 'rgba(212,175,55,0.2)' }}
        />
        <div
          className="absolute bottom-3 left-3 w-4 h-4 border-b border-l pointer-events-none"
          style={{ borderColor: 'rgba(212,175,55,0.2)' }}
        />
        <div
          className="absolute bottom-3 right-3 w-4 h-4 border-b border-r pointer-events-none"
          style={{ borderColor: 'rgba(212,175,55,0.2)' }}
        />
      </div>

      {/* Status */}
      <AnimatePresence mode="wait">
        {complete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-1"
          >
            <p
              className="font-serif text-lg sm:text-xl italic tracking-wider"
              style={{ color: 'rgba(212,175,55,0.85)' }}
            >
              The Queen&apos;s Constellation
            </p>
            <p className="font-mono text-[9px] text-white/50 tracking-widest uppercase">
              Every star in its place. Every chapter connected.
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="progress"
            className="font-mono text-[9px] text-white/45 tracking-wider"
          >
            {activated.size} / {STARS.length} stars discovered
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
