'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchCard {
  id: string;
  label: string;
  reveal: string;
  sublabel: string;
  icon: string;
}

const CARDS: ScratchCard[] = [
  {
    id: '1',
    label: 'Birthday Wish #1',
    reveal: 'May your next chapter be even more naturally unexpected than the last.',
    sublabel: '♛ The Queen\'s Wish',
    icon: '✦',
  },
  {
    id: '2',
    label: 'Prediction',
    reveal: 'A destination wedding in Greece is in your future. The Pavlatos homecoming.',
    sublabel: '🔮 The Oracle Speaks',
    icon: '⛩',
  },
  {
    id: '3',
    label: 'Compliment',
    reveal: 'You turned "I\'m moving to Florida" from a punchline into an empire-building move.',
    sublabel: '👑 Certified',
    icon: '⌘',
  },
  {
    id: '4',
    label: 'Birthday Wish #2',
    reveal: 'May Vogue call again. And again. Until they just give you a column.',
    sublabel: '📰 Front Page Energy',
    icon: '⊙',
  },
  {
    id: '5',
    label: 'Secret',
    reveal: 'The person who made this website thinks you\'re pretty incredible. Happy Birthday, Sophia.',
    sublabel: '♛ From the Heart',
    icon: '♥',
  },
  {
    id: '6',
    label: 'Challenge',
    reveal: 'Post a story right now saying "I just scratched a golden ticket on my birthday website."',
    sublabel: '⚡ Do It',
    icon: '◎',
  },
];

function ScratchCardComponent({ card, index }: { card: ScratchCard; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Gold gradient fill
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#c9a82c');
    grad.addColorStop(0.3, '#e6c84a');
    grad.addColorStop(0.5, '#d4af37');
    grad.addColorStop(0.7, '#b8962e');
    grad.addColorStop(1, '#d4af37');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Texture pattern
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
      ctx.fillRect(
        Math.random() * rect.width,
        Math.random() * rect.height,
        Math.random() * 3 + 1,
        Math.random() * 3 + 1
      );
    }
    ctx.globalAlpha = 1;

    // "SCRATCH HERE" text
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.font = `bold ${Math.min(rect.width * 0.08, 14)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', rect.width / 2, rect.height / 2 - 10);
    ctx.font = `${Math.min(rect.width * 0.15, 28)}px serif`;
    ctx.fillText(card.icon, rect.width / 2, rect.height / 2 + 18);
  }, [card.icon]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const scratch = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';

    if (lastPos.current) {
      ctx.beginPath();
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
    lastPos.current = { x, y };

    // Check scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const pct = transparent / (imageData.data.length / 4);
    setScratchPercent(pct);
    if (pct > 0.45 && !revealed) {
      setRevealed(true);
    }
  }, [revealed]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsScratching(true);
    lastPos.current = null;
    scratch(e.clientX, e.clientY);
  }, [scratch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  }, [isScratching, scratch]);

  const handleMouseUp = useCallback(() => {
    setIsScratching(false);
    lastPos.current = null;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsScratching(true);
    lastPos.current = null;
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  }, [scratch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault();
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  }, [isScratching, scratch]);

  const handleTouchEnd = useCallback(() => {
    setIsScratching(false);
    lastPos.current = null;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: 'rgba(15,15,15,1)',
        border: revealed
          ? '1px solid rgba(212,175,55,0.3)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: revealed
          ? '0 0 30px rgba(212,175,55,0.08)'
          : 'none',
      }}
    >
      {/* Label */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
          {card.label}
        </span>
        <span className="font-mono text-[9px] text-white/45">
          {revealed ? '✓ Revealed' : `${Math.round(scratchPercent * 100)}%`}
        </span>
      </div>

      {/* Scratch area */}
      <div className="relative mx-3 mb-3 rounded-lg overflow-hidden" style={{ minHeight: '140px', height: '35vw', maxHeight: '180px' }}>
        {/* Revealed content underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-3 bg-black">
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <p className="font-serif text-sm sm:text-base text-white/85 leading-relaxed">
                  {card.reveal}
                </p>
                <p className="font-mono text-[9px] tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>
                  {card.sublabel}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!revealed && (
            <p className="font-serif text-sm text-white/45 italic">Scratch to reveal...</p>
          )}
        </div>

        {/* Scratch canvas on top */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
          style={{ opacity: revealed ? 0 : 1, transition: 'opacity 0.5s' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </motion.div>
  );
}

export function ScratchCards() {
  const [revealedCount, setRevealedCount] = useState(0);

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
          Scratch each card to reveal what&apos;s inside
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card, i) => (
          <ScratchCardComponent key={card.id} card={card} index={i} />
        ))}
      </div>

      <div className="text-center">
        <p className="font-mono text-[10px] text-white/45 tracking-wider">
          {revealedCount === CARDS.length
            ? '✦ All cards revealed ✦'
            : 'Drag your finger or mouse to scratch'}
        </p>
      </div>
    </div>
  );
}
