'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { galleryImages } from '@/data/gallery';

const GRADIENTS = [
  'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.06) 0%, transparent 50%), linear-gradient(135deg, #080808 0%, #1a1a1a 50%, #080808 100%)',
  'radial-gradient(circle at 70% 80%, rgba(212,175,55,0.04) 0%, transparent 40%), linear-gradient(45deg, #0c0c0c 0%, #1e1e1e 30%, #0c0c0c 100%)',
  'conic-gradient(from 180deg at 50% 50%, #0a0a0a, #1a1a1a, #0a0a0a, #151515, #0a0a0a)',
  'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.05) 0%, transparent 60%), linear-gradient(180deg, #181818 0%, #0a0a0a 100%)',
  'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(212,175,55,0.04) 0%, transparent 50%), #0e0e0e',
  'linear-gradient(160deg, #0a0a0a 0%, #191919 50%, #0a0a0a 100%)',
  'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 50%), linear-gradient(0deg, #0a0a0a, #141414)',
  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%), #0d0d0d',
];

const CAMERA_SETTINGS = [
  { aperture: 'f/1.4', shutter: '1/200', iso: '100' },
  { aperture: 'f/1.8', shutter: '1/125', iso: '200' },
  { aperture: 'f/2.0', shutter: '1/160', iso: '100' },
  { aperture: 'f/1.4', shutter: '1/250', iso: '400' },
  { aperture: 'f/2.8', shutter: '1/100', iso: '200' },
  { aperture: 'f/1.8', shutter: '1/320', iso: '100' },
  { aperture: 'f/1.4', shutter: '1/200', iso: '200' },
  { aperture: 'f/2.0', shutter: '1/125', iso: '100' },
];

export function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6 py-4">
      {/* Film strip header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <span className="font-mono text-[10px] text-white/55 tracking-wider">PAV PHOTOGRAPHY</span>
        </div>
        <span className="font-mono text-[10px] tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>
          {galleryImages.length} FRAMES
        </span>
      </div>

      {/* Film strip sprocket holes */}
      <div className="flex gap-4 px-2 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="w-3 h-2 rounded-sm bg-white/[0.04] flex-shrink-0" />
        ))}
      </div>

      {/* Horizontal scroll gallery */}
      <div ref={scrollRef} className="overflow-x-auto pb-6 -mx-4 sm:-mx-8 px-4 sm:px-8 scrollbar-none">
        <div className="flex gap-4 sm:gap-5 min-w-max items-end">
          {galleryImages.map((image, i) => {
            const isHovered = hoveredId === image.id;
            const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-88', 'h-76', 'h-72'];
            const widths = ['w-48', 'w-56', 'w-52', 'w-60', 'w-48', 'w-56', 'w-48', 'w-52'];
            const settings = CAMERA_SETTINGS[i % CAMERA_SETTINGS.length];

            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex-shrink-0 relative overflow-hidden ${heights[i % 8]} ${widths[i % 8]} sm:w-auto sm:min-w-[220px] group rounded-sm`}
                style={{
                  border: isHovered ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.05)',
                  transition: 'border-color 0.3s',
                }}
              >
                {/* Image bg */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                />

                {/* Frame number — top left with gold accent */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: 'rgba(212,175,55,0.7)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Camera settings — top right */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    {[settings.aperture, settings.shutter, `ISO ${settings.iso}`].map((s) => (
                      <span key={s} className="font-mono text-[8px] text-white/60 bg-black/50 px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Caption — slides up on hover */}
                <motion.div
                  initial={false}
                  animate={{ y: isHovered ? 0 : '100%' }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10"
                >
                  <p className="font-serif text-sm text-white/80 tracking-wider">
                    {image.caption}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-px" style={{ backgroundColor: 'rgba(212,175,55,0.3)' }} />
                    <p className="font-mono text-[9px]" style={{ color: 'rgba(212,175,55,0.7)' }}>{image.year}</p>
                    <span className="font-mono text-[8px] text-white/35">·</span>
                    <p className="font-mono text-[8px] text-white/50">{settings.aperture}</p>
                  </div>
                </motion.div>

                {/* Focus bracket corners on hover */}
                {isHovered && (
                  <>
                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l pointer-events-none z-10" style={{ borderColor: 'rgba(212,175,55,0.4)' }} />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r pointer-events-none z-10" style={{ borderColor: 'rgba(212,175,55,0.4)' }} />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l pointer-events-none z-10" style={{ borderColor: 'rgba(212,175,55,0.4)' }} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r pointer-events-none z-10" style={{ borderColor: 'rgba(212,175,55,0.4)' }} />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom sprocket holes */}
      <div className="flex gap-4 px-2 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="w-3 h-2 rounded-sm bg-white/[0.04] flex-shrink-0" />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center gap-3"
      >
        <div className="w-10 h-px" style={{ backgroundColor: 'rgba(212,175,55,0.15)' }} />
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.6)' }}>
          Scroll to explore
        </p>
        <div className="w-10 h-px" style={{ backgroundColor: 'rgba(212,175,55,0.15)' }} />
      </motion.div>
    </div>
  );
}
