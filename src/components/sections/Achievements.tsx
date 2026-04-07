'use client';

import { motion } from 'framer-motion';
import { achievements } from '@/data/achievements';

const RARITY_STYLES: Record<string, { border: string; bg: string; glow: string; text: string }> = {
  common: {
    border: 'rgba(255,255,255,0.1)',
    bg: 'transparent',
    glow: 'none',
    text: 'rgba(255,255,255,0.3)',
  },
  rare: {
    border: 'rgba(100,150,255,0.25)',
    bg: 'rgba(100,150,255,0.02)',
    glow: '0 0 15px rgba(100,150,255,0.05)',
    text: 'rgba(100,150,255,0.6)',
  },
  epic: {
    border: 'rgba(180,100,255,0.25)',
    bg: 'rgba(180,100,255,0.02)',
    glow: '0 0 15px rgba(180,100,255,0.05)',
    text: 'rgba(180,100,255,0.6)',
  },
  legendary: {
    border: 'rgba(212,175,55,0.35)',
    bg: 'rgba(212,175,55,0.03)',
    glow: '0 0 20px rgba(212,175,55,0.08)',
    text: '#d4af37',
  },
};

export function Achievements() {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-10">
      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {[
          { label: 'Unlocked', value: unlocked.length },
          { label: 'Legendary', value: unlocked.filter(a => a.rarity === 'legendary').length },
          { label: 'Locked', value: locked.length },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-mono text-2xl font-bold" style={{ color: '#d4af37' }}>
              {value}
            </p>
            <p className="font-mono text-[9px] text-white/55 tracking-widest uppercase mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Unlocked */}
      <div className="space-y-2">
        {unlocked.map((badge, i) => {
          const style = RARITY_STYLES[badge.rarity];
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="relative flex items-center gap-4 sm:gap-6 py-3.5 sm:py-4 px-4 sm:px-6 rounded-lg overflow-hidden group"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                boxShadow: style.glow,
              }}
            >
              {/* Shine effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, ${style.border} 45%, transparent 50%)`,
                }}
              />

              {/* Icon */}
              <span className="text-2xl sm:text-3xl flex-shrink-0 w-10 text-center relative z-10">
                {badge.icon}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-serif text-sm sm:text-base text-white/90 tracking-wider truncate">
                    {badge.title}
                  </h3>
                  <span
                    className="font-mono text-[9px] tracking-widest uppercase flex-shrink-0 px-1.5 py-0.5 rounded"
                    style={{
                      color: style.text,
                      background: `${style.border}20`,
                    }}
                  >
                    {badge.rarity}
                  </span>
                </div>
                <p className="font-sans text-[11px] sm:text-xs text-white/60 mt-1 truncate">
                  {badge.description}
                </p>
              </div>

              {/* Category */}
              <span
                className="font-mono text-[9px] tracking-wider uppercase hidden sm:block flex-shrink-0 relative z-10"
                style={{ color: style.text }}
              >
                {badge.category}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Locked */}
      {locked.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono text-[10px] text-white/45 tracking-[0.3em] uppercase mb-3 px-4">
            Locked
          </p>
          {locked.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: unlocked.length * 0.04 + i * 0.1 }}
              className="flex items-center gap-4 sm:gap-6 py-3 px-4 sm:px-6 rounded-lg border border-white/[0.05] opacity-40"
            >
              <span className="text-2xl flex-shrink-0 w-10 text-center opacity-40">
                {badge.icon}
              </span>
              <div className="flex-1">
                <h3 className="font-serif text-sm text-white/55 tracking-wider">
                  {badge.title}
                </h3>
                <p className="font-sans text-[10px] text-white/40 mt-0.5">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
