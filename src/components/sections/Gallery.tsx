'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { galleryImages } from '@/data/gallery';

const GRADIENTS = [
  'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), linear-gradient(135deg, #080808 0%, #1a1a1a 50%, #080808 100%)',
  'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.06) 0%, transparent 40%), linear-gradient(45deg, #0c0c0c 0%, #1e1e1e 30%, #0c0c0c 100%)',
  'conic-gradient(from 180deg at 50% 50%, #0a0a0a, #1a1a1a, #0a0a0a, #151515, #0a0a0a)',
  'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 60%), linear-gradient(180deg, #181818 0%, #0a0a0a 100%)',
  'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.04) 0%, transparent 50%), #0e0e0e',
  'linear-gradient(160deg, #0a0a0a 0%, #191919 50%, #0a0a0a 100%)',
  'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%), linear-gradient(0deg, #0a0a0a, #141414)',
  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%), #0d0d0d',
];

export function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-8 py-4">
      {/* Horizontal scroll gallery */}
      <div ref={scrollRef} className="overflow-x-auto pb-6 -mx-4 sm:-mx-8 px-4 sm:px-8 scrollbar-none">
        <div className="flex gap-3 sm:gap-4 min-w-max items-end">
          {galleryImages.map((image, i) => {
            const isHovered = hoveredId === image.id;
            // Vary heights for visual rhythm
            const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-88', 'h-76', 'h-72'];
            const widths = ['w-44', 'w-52', 'w-48', 'w-56', 'w-44', 'w-52', 'w-44', 'w-48'];

            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex-shrink-0 relative overflow-hidden ${heights[i % 8]} ${widths[i % 8]} sm:w-auto sm:min-w-[200px] group`}
              >
                {/* Image bg */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                />

                {/* Frame number — top left */}
                <div className="absolute top-3 left-3 z-10">
                  <p className="font-mono text-[8px] text-white/[0.08]">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                </div>

                {/* Caption — slides up on hover */}
                <motion.div
                  initial={false}
                  animate={{ y: isHovered ? 0 : '100%' }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10"
                >
                  <p className="font-serif text-xs text-white/70 tracking-wider">
                    {image.caption}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-3 h-px bg-white/15" />
                    <p className="font-mono text-[8px] text-white/20">{image.year}</p>
                  </div>
                </motion.div>

                {/* Subtle top gradient */}
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-5" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center gap-3"
      >
        <div className="w-8 h-px bg-white/[0.06]" />
        <p className="font-mono text-[8px] text-white/10 tracking-[0.3em] uppercase">
          Scroll
        </p>
        <div className="w-8 h-px bg-white/[0.06]" />
      </motion.div>
    </div>
  );
}
