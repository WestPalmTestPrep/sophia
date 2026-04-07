'use client';

import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; age: number }[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (points.current.length > 50) points.current.shift();
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trail
      for (let i = 0; i < points.current.length; i++) {
        const p = points.current[i];
        p.age += 0.02;
        const alpha = Math.max(0, 0.15 - p.age * 0.15);
        const radius = Math.max(0, 30 - p.age * 20);
        if (alpha <= 0 || radius <= 0) continue;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(212, 175, 55, ${alpha})`);
        grad.addColorStop(0.5, `rgba(212, 175, 55, ${alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);
      }

      // Main glow
      const g = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, 120
      );
      g.addColorStop(0, 'rgba(212, 175, 55, 0.06)');
      g.addColorStop(0.4, 'rgba(212, 175, 55, 0.02)');
      g.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(
        mouse.current.x - 120, mouse.current.y - 120, 240, 240
      );

      // Clean old points
      points.current = points.current.filter(p => p.age < 1);

      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
    />
  );
}
