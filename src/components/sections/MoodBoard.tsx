'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardItem {
  id: string;
  type: 'color' | 'word' | 'texture' | 'icon';
  content: string;
  color?: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  placed: boolean;
}

const PALETTE_ITEMS: Omit<BoardItem, 'x' | 'y' | 'placed'>[] = [
  // Colors
  { id: 'c1', type: 'color', content: '', color: '#d4af37', rotation: -3, scale: 1 },
  { id: 'c2', type: 'color', content: '', color: '#1a1a1a', rotation: 2, scale: 1 },
  { id: 'c3', type: 'color', content: '', color: '#f5f0e8', rotation: -1, scale: 1 },
  { id: 'c4', type: 'color', content: '', color: '#8B7355', rotation: 4, scale: 1 },
  { id: 'c5', type: 'color', content: '', color: '#D4C5A9', rotation: -2, scale: 1 },
  { id: 'c6', type: 'color', content: '', color: '#2C2C2C', rotation: 1, scale: 1 },
  // Words
  { id: 'w1', type: 'word', content: 'Naturally Unexpected', rotation: -5, scale: 1 },
  { id: 'w2', type: 'word', content: 'golden hour', rotation: 3, scale: 0.8 },
  { id: 'w3', type: 'word', content: 'whimsical', rotation: -2, scale: 0.9 },
  { id: 'w4', type: 'word', content: 'editorial', rotation: 4, scale: 0.85 },
  { id: 'w5', type: 'word', content: 'raw + real', rotation: -3, scale: 0.9 },
  { id: 'w6', type: 'word', content: 'memory maker', rotation: 2, scale: 0.85 },
  { id: 'w7', type: 'word', content: 'PAV', rotation: -1, scale: 1.2 },
  { id: 'w8', type: 'word', content: 'fine art', rotation: 5, scale: 0.8 },
  // Textures
  { id: 't1', type: 'texture', content: 'film grain', rotation: -4, scale: 1 },
  { id: 't2', type: 'texture', content: 'soft focus', rotation: 2, scale: 1 },
  { id: 't3', type: 'texture', content: 'warm tones', rotation: -1, scale: 1 },
  { id: 't4', type: 'texture', content: 'high contrast', rotation: 3, scale: 1 },
  // Icons
  { id: 'i1', type: 'icon', content: '♛', rotation: 0, scale: 1.3 },
  { id: 'i2', type: 'icon', content: '⊙', rotation: -5, scale: 1.2 },
  { id: 'i3', type: 'icon', content: '✦', rotation: 10, scale: 1 },
  { id: 'i4', type: 'icon', content: '⌘', rotation: -3, scale: 1.1 },
  { id: 'i5', type: 'icon', content: '♛', rotation: 8, scale: 0.9 },
];

const TEXTURE_PATTERNS: Record<string, string> = {
  'film grain': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
  'soft focus': 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.02) 70%)',
  'warm tones': 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(255,140,50,0.08), rgba(212,175,55,0.05))',
  'high contrast': 'linear-gradient(135deg, #1a1a1a 50%, #f5f0e8 50%)',
};

export function MoodBoard() {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardTitle, setBoardTitle] = useState('Untitled Board');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleDragStart = useCallback((id: string) => {
    setDragging(id);
  }, []);

  const handleBoardDrop = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const paletteItem = PALETTE_ITEMS.find(p => p.id === dragging);
    if (!paletteItem) return;

    // Check if already placed, update position
    setItems(prev => {
      const existing = prev.find(i => i.id === dragging);
      if (existing) {
        return prev.map(i => i.id === dragging ? { ...i, x, y } : i);
      }
      return [...prev, {
        ...paletteItem,
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
        placed: true,
      }];
    });

    setDragging(null);
  }, [dragging]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const placedIds = new Set(items.map(i => i.id));

  return (
    <div className="min-h-[80vh] flex flex-col gap-6">
      {/* Header */}
      <div className="text-center space-y-2">
        {isEditingTitle ? (
          <input
            autoFocus
            value={boardTitle}
            onChange={e => setBoardTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
            className="bg-transparent text-center font-serif text-2xl sm:text-3xl tracking-wider text-white/60 border-b border-white/10 outline-none w-full max-w-md"
          />
        ) : (
          <h3
            onClick={() => setIsEditingTitle(true)}
            className="font-serif text-2xl sm:text-3xl tracking-wider text-white/60 cursor-text hover:text-white/80 transition-colors"
          >
            {boardTitle}
          </h3>
        )}
        <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">
          Click palette items, then click the board to place them
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        {/* Palette */}
        <div className="lg:w-48 shrink-0">
          <p className="text-[9px] text-white/30 font-mono tracking-widest uppercase mb-3">
            Palette
          </p>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {PALETTE_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDragStart(item.id)}
                className={`cursor-pointer select-none transition-all ${
                  dragging === item.id
                    ? 'ring-1 ring-[rgba(212,175,55,0.5)] rounded'
                    : placedIds.has(item.id)
                    ? 'opacity-30'
                    : ''
                }`}
              >
                {item.type === 'color' && (
                  <div
                    className="w-8 h-8 rounded border border-white/10"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {item.type === 'word' && (
                  <div className="px-2 py-1 border border-white/10 rounded">
                    <span className="text-[10px] text-white/50 font-serif italic">
                      {item.content}
                    </span>
                  </div>
                )}
                {item.type === 'texture' && (
                  <div
                    className="w-8 h-8 rounded border border-white/10"
                    style={{ background: TEXTURE_PATTERNS[item.content] }}
                  />
                )}
                {item.type === 'icon' && (
                  <div className="w-8 h-8 flex items-center justify-center border border-white/10 rounded">
                    <span className="text-sm">{item.content}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Board canvas */}
        <div
          ref={boardRef}
          onClick={handleBoardDrop}
          className="flex-1 relative min-h-[400px] lg:min-h-[500px] rounded border border-white/[0.06] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(30,28,24,1) 100%)',
            cursor: dragging ? 'copy' : 'default',
          }}
        >
          {/* Grid guides */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-white" style={{ top: `${(i + 1) * 16.66}%` }} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${(i + 1) * 16.66}%` }} />
            ))}
          </div>

          {/* Placed items */}
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                }}
                onDoubleClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
              >
                {item.type === 'color' && (
                  <div
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded shadow-lg group-hover:ring-1 group-hover:ring-white/20 transition-all"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {item.type === 'word' && (
                  <div className="px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded group-hover:border-[rgba(212,175,55,0.3)] transition-all">
                    <span className="text-xs sm:text-sm text-white/70 font-serif italic whitespace-nowrap">
                      {item.content}
                    </span>
                  </div>
                )}
                {item.type === 'texture' && (
                  <div
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded shadow-lg group-hover:ring-1 group-hover:ring-white/20 transition-all"
                    style={{ background: TEXTURE_PATTERNS[item.content] }}
                  />
                )}
                {item.type === 'icon' && (
                  <span
                    className="text-2xl sm:text-4xl drop-shadow-lg group-hover:scale-110 transition-transform block"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.3))' }}
                  >
                    {item.content}
                  </span>
                )}
                {/* Remove hint */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] text-white/30 font-mono whitespace-nowrap">double-click to remove</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {items.length === 0 && !dragging && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2">
                <p className="text-white/10 text-4xl">◬</p>
                <p className="text-white/15 text-xs font-serif italic">
                  Select from the palette and click to place
                </p>
              </div>
            </div>
          )}

          {/* Drop zone indicator */}
          {dragging && (
            <div className="absolute inset-0 border-2 border-dashed border-[rgba(212,175,55,0.15)] rounded pointer-events-none" />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[9px] text-white/15 font-mono tracking-widest uppercase">
        <span>Items placed: {items.length}</span>
        <span>Creative Director Mode</span>
        {items.length > 0 && (
          <button
            onClick={() => setItems([])}
            className="text-white/20 hover:text-white/40 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
