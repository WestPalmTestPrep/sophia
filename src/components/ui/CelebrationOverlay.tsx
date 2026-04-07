'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationOverlayProps {
  onDismiss: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'trail' | 'glow';
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

const GOLD_COLORS = [
  '#d4af37',
  '#f5d76e',
  '#c9a82c',
  '#e6c84a',
  '#b8962e',
  '#fff4c1',
  '#ffdf6c',
  '#ffe599',
];

function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const rafRef = useRef<number>(0);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const createExplosion = useCallback(
    (x: number, y: number, color: string) => {
      const count = isMobile ? 30 + Math.floor(Math.random() * 20) : 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 4;
        const c =
          GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.8,
          color: Math.random() > 0.3 ? c : color,
          size: 1.5 + Math.random() * 2,
          type: Math.random() > 0.7 ? 'glow' : 'spark',
        });
      }
      // Inner ring
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.4 + Math.random() * 0.3,
          color: '#ffffff',
          size: 1,
          type: 'spark',
        });
      }
    },
    []
  );

  const launchFirework = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = canvas.width * 0.15 + Math.random() * canvas.width * 0.7;
    const targetY = canvas.height * 0.1 + Math.random() * canvas.height * 0.35;

    fireworksRef.current.push({
      x,
      y: canvas.height,
      targetY,
      vy: -(6 + Math.random() * 4),
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      exploded: false,
      trail: [],
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const dpr = window.matchMedia('(pointer: coarse)').matches ? 1 : Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Launch fireworks in waves
    let launchCount = 0;
    const launchInterval = setInterval(() => {
      const count = launchCount < 3 ? 1 : launchCount < 8 ? 2 : 3;
      for (let i = 0; i < count; i++) {
        launchFirework();
      }
      launchCount++;
    }, 600);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update fireworks
      fireworksRef.current = fireworksRef.current.filter((fw) => {
        if (!fw.exploded) {
          fw.y += fw.vy;
          fw.vy += 0.08; // gravity deceleration
          fw.trail.push({ x: fw.x, y: fw.y, alpha: 0.8 });
          if (fw.trail.length > 12) fw.trail.shift();

          // Draw trail
          fw.trail.forEach((t, i) => {
            const a = (i / fw.trail.length) * t.alpha * 0.4;
            ctx.beginPath();
            ctx.arc(t.x / 2, t.y / 2, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212,175,55,${a})`;
            ctx.fill();
          });

          // Draw head
          ctx.beginPath();
          ctx.arc(fw.x / 2, fw.y / 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();
          ctx.shadowBlur = 10;
          ctx.shadowColor = fw.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (fw.y <= fw.targetY || fw.vy >= 0) {
            fw.exploded = true;
            createExplosion(fw.x / 2, fw.y / 2, fw.color);
            return false;
          }
        }
        return true;
      });

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 1 / 60 / p.maxLife;
        if (p.life <= 0) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.98; // drag
        p.vy *= 0.98;

        const alpha = Math.max(0, p.life);

        if (p.type === 'glow') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 2
          );
          grad.addColorStop(0, p.color + Math.round(alpha * 80).toString(16).padStart(2, '0'));
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.round(alpha * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.fill();

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(launchInterval);
    };
  }, [createExplosion, launchFirework]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function GoldenRain() {
  const count = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches ? 20 : 50;
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    size: 2 + Math.random() * 4,
    char: ['✦', '✧', '♛', '·', '◆', '◇'][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            fontSize: p.size,
            color: '#d4af37',
            opacity: 0,
          }}
          animate={{
            y: ['0vh', '110vh'],
            opacity: [0, 0.6, 0.4, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: 2 + p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}

export function CelebrationOverlay({ onDismiss }: CelebrationOverlayProps) {
  const [stage, setStage] = useState(0); // 0: fireworks, 1: message, 2: final

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 2500);
    const t2 = setTimeout(() => setStage(2), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 cursor-pointer overflow-hidden"
      onClick={stage >= 1 ? onDismiss : undefined}
    >
      {/* Fireworks */}
      <FireworksCanvas />
      <GoldenRain />

      {/* Content */}
      <div className="relative z-10 text-center max-w-md px-8">
        {/* Crown appears first */}
        <AnimatePresence>
          {stage >= 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
            >
              <motion.p
                className="text-6xl sm:text-7xl mb-6"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(212,175,55,0.5))',
                    'drop-shadow(0 0 40px rgba(212,175,55,0.8))',
                    'drop-shadow(0 0 20px rgba(212,175,55,0.5))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ color: '#d4af37' }}
              >
                ♛
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main message */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <motion.h2
                className="font-serif text-3xl sm:text-4xl tracking-wider"
                style={{
                  color: '#d4af37',
                  textShadow: '0 0 40px rgba(212,175,55,0.3)',
                }}
              >
                Checkmate.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-sans text-white/75 text-sm leading-relaxed"
              >
                Every square explored. Every memory unlocked.
                <br />
                Every chapter of Sophia&apos;s story, revealed.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final flourish */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8 space-y-3"
            >
              <motion.p
                className="font-serif text-lg italic"
                style={{ color: 'rgba(212,175,55,0.8)' }}
              >
                Happy Birthday, Sophia.
              </motion.p>
              <motion.p
                className="font-mono text-[9px] tracking-[0.4em] uppercase"
                style={{ color: 'rgba(212,175,55,0.5)' }}
              >
                Naturally Unexpected. Always.
              </motion.p>
              <motion.p
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-mono text-[9px] text-white/30 tracking-widest uppercase pt-6"
              >
                Tap to close
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
