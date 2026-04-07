'use client';

import { motion } from 'framer-motion';
import { timelineEvents } from '@/data/timeline';

const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  education:   { color: 'rgba(100,150,255,0.8)', icon: '◭' },
  career:      { color: 'rgba(212,175,55,0.9)',  icon: '⊙' },
  personal:    { color: 'rgba(255,120,200,0.7)', icon: '✦' },
  achievement: { color: '#d4af37',               icon: '♕' },
};

export function Timeline() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="relative">
        {/* Center line with gold gradient */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-8 sm:left-12 top-0 bottom-0 w-px origin-top"
          style={{
            background: 'linear-gradient(to bottom, rgba(212,175,55,0.3), rgba(212,175,55,0.05))',
          }}
        />

        <div className="space-y-10 sm:space-y-14">
          {timelineEvents.map((event, i) => {
            const config = CATEGORY_CONFIG[event.category];
            const isAchievement = event.category === 'achievement';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="relative flex gap-6 sm:gap-10 items-start"
              >
                {/* Year */}
                <div className="flex-shrink-0 w-8 sm:w-12 text-right">
                  <p
                    className="font-mono text-xs sm:text-sm font-bold"
                    style={{ color: isAchievement ? '#d4af37' : 'rgba(255,255,255,0.65)' }}
                  >
                    {event.year}
                  </p>
                </div>

                {/* Node */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 300 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{
                      background: isAchievement
                        ? 'rgba(212,175,55,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${config.color}`,
                      boxShadow: isAchievement
                        ? '0 0 15px rgba(212,175,55,0.2)'
                        : 'none',
                    }}
                  >
                    <span className="text-xs" style={{ color: config.color }}>{config.icon}</span>
                  </motion.div>
                  {isAchievement && (
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ border: '1px solid rgba(212,175,55,0.3)' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2 pt-1">
                  <h3
                    className="font-serif text-base sm:text-lg tracking-wider"
                    style={{
                      color: isAchievement ? '#d4af37' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {event.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-white/65 mt-1.5 leading-relaxed">
                    {event.description}
                  </p>
                  <span
                    className="inline-block mt-2 font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded"
                    style={{
                      color: config.color,
                      background: `${config.color}15`,
                      border: `1px solid ${config.color}30`,
                    }}
                  >
                    {event.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
