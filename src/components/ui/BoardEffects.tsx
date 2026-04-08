'use client';

import { useEffect, useRef, useCallback } from 'react';

interface BoardEffectsProps {
  progress: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  color: string;
}

interface Firework {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

const GOLD_SHADES = ['#d4af37', '#f5d76e', '#c9a82c', '#e6c84a', '#fff4c1', '#b8962e'];

export function BoardEffects({ progress }: BoardEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);

  const createExplosion = useCallback((x: number, y: number) => {
    const count = 25 + Math.floor(Math.random() * 15);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 1 + Math.random() * 3;
      sparklesRef.current.push({
        x,
        y,
        size: 1 + Math.random() * 2.5,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: GOLD_SHADES[Math.floor(Math.random() * GOLD_SHADES.length)],
      });
    }
  }, []);

  // Expose launch function via a custom event
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleLaunch = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail;
      const rect = canvas.getBoundingClientRect();
      const cx = x - rect.left;
      const cy = y - rect.top;
      const targetY = cy * 0.3 + Math.random() * cy * 0.3;

      fireworksRef.current.push({
        x: cx,
        y: rect.height,
        vy: -(4 + Math.random() * 3),
        targetY,
        color: GOLD_SHADES[Math.floor(Math.random() * GOLD_SHADES.length)],
        exploded: false,
      });
    };

    canvas.addEventListener('board-firework', handleLaunch);
    return () => canvas.removeEventListener('board-firework', handleLaunch);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (Math.random() > 0.7) {
        trailRef.current.push({
          x: e.clientX - rect.left + (Math.random() - 0.5) * 8,
          y: e.clientY - rect.top + (Math.random() - 0.5) * 8,
          life: 1,
        });
        if (trailRef.current.length > 30) trailRef.current.shift();
      }
    };

    const parent = canvas.parentElement;
    parent?.addEventListener('mousemove', handleMove);

    const draw = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Board glow
      if (progress > 0) {
        const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
        gradient.addColorStop(0, `rgba(212,175,55,${progress * 0.06})`);
        gradient.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Trail
      trailRef.current = trailRef.current.filter((p) => {
        p.life -= 0.03;
        if (p.life <= 0) return false;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.life * 0.3 * progress})`;
        ctx.fill();
        return true;
      });

      // Fireworks
      fireworksRef.current = fireworksRef.current.filter((fw) => {
        if (fw.exploded) return false;

        fw.y += fw.vy;
        fw.vy += 0.06;

        // Draw trail
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = fw.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (fw.y <= fw.targetY || fw.vy >= 0) {
          fw.exploded = true;
          createExplosion(fw.x, fw.y);
          return false;
        }
        return true;
      });

      // Sparkles
      sparklesRef.current = sparklesRef.current.filter((s) => {
        s.life -= (1 / 60) / s.maxLife;
        if (s.life <= 0) return false;

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04;
        s.vx *= 0.98;

        const alpha = Math.max(0, s.life);
        const size = s.size * alpha;

        ctx.beginPath();
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fillStyle = s.color + Math.round(alpha * 200).toString(16).padStart(2, '0');
        ctx.shadowBlur = size * 2;
        ctx.shadowColor = s.color + '80';
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      parent?.removeEventListener('mousemove', handleMove);
    };
  }, [progress, createExplosion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
      data-board-effects
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
