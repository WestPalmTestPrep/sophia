'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BoardSquare } from '@/types';

interface SquareProps {
  row: number;
  col: number;
  isLight: boolean;
  unlockConfig?: BoardSquare;
  isValidMove: boolean;
  isUnlocked: boolean;
  onClick: () => void;
}

export function Square({
  row,
  col,
  isLight,
  unlockConfig,
  isValidMove,
  isUnlocked,
  onClick,
}: SquareProps) {
  const isUnlockable = !!unlockConfig;
  const staggerDelay = (row + col) * 0.008;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: staggerDelay, duration: 0.4 }}
      className={cn(
        'relative aspect-square flex items-center justify-center select-none transition-colors duration-150',
        isLight ? 'bg-[#E8E8E8]' : 'bg-[#141414]',
        (isValidMove || isUnlockable) && 'cursor-pointer',
        isValidMove && !isUnlockable && 'hover:bg-white/[0.08]',
      )}
      onPointerUp={(e) => {
        e.stopPropagation();
        onClick();
        // Launch a firework from empty non-move squares
        if (!isValidMove && !isUnlockable) {
          const canvas = document.querySelector('[data-board-effects]');
          if (canvas) {
            canvas.dispatchEvent(new CustomEvent('board-firework', {
              detail: { x: e.clientX, y: e.clientY },
            }));
          }
        }
      }}
      whileHover={isValidMove ? { scale: 1.05, zIndex: 5 } : undefined}
    >
      {/* Valid move indicator - gold dot */}
      {isValidMove && !isUnlockable && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'w-2 h-2 rounded-full',
            isLight ? 'bg-[rgba(100,75,15,0.5)]' : 'bg-[rgba(212,175,55,0.4)]'
          )}
        />
      )}

      {/* Unlockable square — made very obvious */}
      {isUnlockable && (
        <div className="absolute inset-0 flex items-center justify-center group overflow-visible">
          {/* Background tint to distinguish from regular squares */}
          <div
            className="absolute inset-0"
            style={{
              background: isUnlocked
                ? isLight
                  ? 'rgba(212,175,55,0.08)'
                  : 'rgba(212,175,55,0.06)'
                : isLight
                ? 'rgba(212,175,55,0.12)'
                : 'rgba(212,175,55,0.08)',
            }}
          />

          {/* Persistent border on unlockable squares — adapts to square color */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: isUnlocked
                ? `1px solid ${isLight ? 'rgba(107,82,16,0.3)' : 'rgba(212,175,55,0.25)'}`
                : `1.5px solid ${isLight ? 'rgba(107,82,16,0.5)' : 'rgba(212,175,55,0.4)'}`,
              boxShadow: isUnlocked
                ? `inset 0 0 10px ${isLight ? 'rgba(107,82,16,0.08)' : 'rgba(212,175,55,0.06)'}`
                : `inset 0 0 15px ${isLight ? 'rgba(107,82,16,0.12)' : 'rgba(212,175,55,0.1)'}`,
            }}
          />

          {/* Pulsing beacon ring for unvisited squares */}
          {!isUnlocked && (
            <motion.div
              className="absolute inset-1 sm:inset-1.5 rounded-sm pointer-events-none"
              animate={{
                boxShadow: [
                  'inset 0 0 6px rgba(212,175,55,0.1), 0 0 6px rgba(212,175,55,0.05)',
                  'inset 0 0 16px rgba(212,175,55,0.25), 0 0 12px rgba(212,175,55,0.1)',
                  'inset 0 0 6px rgba(212,175,55,0.1), 0 0 6px rgba(212,175,55,0.05)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Corner accents for unvisited */}
          {!isUnlocked && (
            <>
              {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-2 h-2 pointer-events-none`}
                  style={{ borderColor: isLight ? 'rgba(107,82,16,0.6)' : 'rgba(212,175,55,0.5)' }}
                />
              ))}
            </>
          )}

          <div className="flex flex-col items-center gap-0 relative z-10">
            {/* Icon — bigger and brighter */}
            <motion.span
              animate={!isUnlocked
                ? { opacity: [0.7, 1, 0.7], scale: [1, 1.1, 1] }
                : { opacity: 0.45, scale: 1 }
              }
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-2xl sm:text-3xl transition-all duration-300"
              style={{
                color: isLight
                  ? (isUnlocked ? '#6b5210' : '#8a6914')
                  : (isUnlocked ? 'rgba(212,175,55,0.5)' : '#d4af37'),
                filter: !isUnlocked
                  ? (isLight
                    ? 'drop-shadow(0 0 6px rgba(139,105,20,0.4))'
                    : 'drop-shadow(0 0 8px rgba(212,175,55,0.6))')
                  : 'none',
              }}
            >
              {unlockConfig.icon}
            </motion.span>

            {/* Label — always visible on unlockable squares, not just hover */}
            <span
              className={cn(
                'text-[6px] sm:text-[8px] font-mono font-bold tracking-[0.05em] uppercase whitespace-nowrap pointer-events-none leading-none mt-0.5',
                isUnlocked
                  ? 'opacity-50'
                  : 'opacity-90',
              )}
              style={{
                color: isUnlocked
                  ? (isLight ? 'rgba(80,60,10,0.7)' : 'rgba(212,175,55,0.5)')
                  : (isLight ? '#6b5210' : 'rgba(212,175,55,0.9)'),
              }}
            >
              {unlockConfig.label}
            </span>
          </div>

          {/* Visited checkmark */}
          {isUnlocked && (
            <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isLight ? 'rgba(107,82,16,0.7)' : 'rgba(212,175,55,0.6)',
                }}
              >
                <span
                  className="text-[7px] sm:text-[8px] font-bold leading-none"
                  style={{ color: isLight ? '#E8E8E8' : '#000' }}
                >✓</span>
              </div>
            </div>
          )}
        </div>
      )}

    </motion.div>
  );
}
