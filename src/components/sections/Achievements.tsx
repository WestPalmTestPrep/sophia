'use client';

import { motion } from 'framer-motion';
import { achievements } from '@/data/achievements';
import { cn } from '@/lib/utils';

const RARITY_BORDER = {
  common: 'border-white/[0.08]',
  rare: 'border-white/15',
  epic: 'border-white/25',
  legendary: 'border-white/40',
};

export function Achievements() {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-12">
      {/* Unlocked */}
      <div className="space-y-1">
        {unlocked.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={cn(
              'flex items-center gap-4 sm:gap-6 py-3 sm:py-4 px-4 sm:px-6 border-b',
              RARITY_BORDER[badge.rarity],
              badge.rarity === 'legendary' && 'bg-white/[0.01]'
            )}
          >
            {/* Icon */}
            <span className={cn(
              'text-xl sm:text-2xl flex-shrink-0 w-8 text-center',
              badge.rarity === 'legendary' ? 'opacity-80' : 'opacity-40'
            )}>
              {badge.icon}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3">
                <h3 className="font-serif text-sm sm:text-base text-white/70 tracking-wider truncate">
                  {badge.title}
                </h3>
                <span className="font-mono text-[8px] text-white/15 tracking-widest uppercase flex-shrink-0">
                  {badge.rarity}
                </span>
              </div>
              <p className="font-sans text-[10px] sm:text-[11px] text-white/25 mt-0.5 truncate">
                {badge.description}
              </p>
            </div>

            {/* Category */}
            <span className="font-mono text-[8px] text-white/10 tracking-wider uppercase hidden sm:block">
              {badge.category}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Locked */}
      {locked.length > 0 && (
        <div className="space-y-1">
          <p className="font-mono text-[9px] text-white/10 tracking-[0.3em] uppercase mb-3 px-4">
            Locked
          </p>
          {locked.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: unlocked.length * 0.05 + i * 0.1 }}
              className="flex items-center gap-4 sm:gap-6 py-3 px-4 sm:px-6 border-b border-white/[0.03] opacity-30"
            >
              <span className="text-xl sm:text-2xl flex-shrink-0 w-8 text-center opacity-30">
                {badge.icon}
              </span>
              <div className="flex-1">
                <h3 className="font-serif text-sm text-white/30 tracking-wider">
                  {badge.title}
                </h3>
                <p className="font-sans text-[10px] text-white/10 mt-0.5">
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
