'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BoardSquare } from '@/types';
import { QueenPiece } from './QueenPiece';

interface SquareProps {
  row: number;
  col: number;
  isLight: boolean;
  unlockConfig?: BoardSquare;
  hasQueen: boolean;
  isValidMove: boolean;
  isUnlocked: boolean;
  onClick: () => void;
}

export function Square({
  row,
  col,
  isLight,
  unlockConfig,
  hasQueen,
  isValidMove,
  isUnlocked,
  onClick,
}: SquareProps) {
  const isUnlockable = !!unlockConfig;
  const staggerDelay = (row + col) * 0.015;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: staggerDelay, duration: 0.4 }}
      className={cn(
        'relative aspect-square flex items-center justify-center select-none transition-all duration-300',
        isLight ? 'bg-[#E8E8E8]' : 'bg-[#141414]',
        (isValidMove || isUnlockable) && 'cursor-pointer',
        isValidMove && !hasQueen && !isUnlockable && 'hover:bg-white/[0.08]',
      )}
      onClick={onClick}
      whileHover={isValidMove && !hasQueen ? { scale: 1.08, zIndex: 5 } : undefined}
      whileTap={isValidMove ? { scale: 0.94 } : undefined}
    >
      {/* Valid move indicator - gold dot */}
      {isValidMove && !hasQueen && !isUnlockable && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'w-2 h-2 rounded-full',
            isLight ? 'bg-[rgba(160,120,20,0.4)]' : 'bg-[rgba(212,175,55,0.35)]'
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

          {/* Persistent gold border on unlockable squares */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: isUnlocked
                ? '1px solid rgba(212,175,55,0.25)'
                : '1.5px solid rgba(212,175,55,0.4)',
              boxShadow: isUnlocked
                ? 'inset 0 0 10px rgba(212,175,55,0.06)'
                : 'inset 0 0 15px rgba(212,175,55,0.1)',
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
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(212,175,55,0.5)' }} />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(212,175,55,0.5)' }} />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(212,175,55,0.5)' }} />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(212,175,55,0.5)' }} />
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
              className={cn(
                'text-2xl sm:text-3xl transition-all duration-300',
                isLight ? 'text-black/90' : 'text-white'
              )}
              style={!isUnlocked ? {
                filter: `drop-shadow(0 0 8px rgba(212,175,55,0.6))`,
              } : {
                filter: `drop-shadow(0 0 3px rgba(212,175,55,0.2))`,
              }}
            >
              {unlockConfig.icon}
            </motion.span>

            {/* Label — always visible on unlockable squares, not just hover */}
            <span
              className={cn(
                'text-[6px] sm:text-[8px] font-mono font-semibold tracking-[0.05em] uppercase whitespace-nowrap pointer-events-none leading-none mt-0.5',
                isUnlocked
                  ? 'opacity-40'
                  : 'opacity-70',
                isLight ? 'text-black/70' : 'text-white/80'
              )}
              style={{
                color: isUnlocked ? undefined : 'rgba(212,175,55,0.85)',
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
                  backgroundColor: 'rgba(212,175,55,0.6)',
                }}
              >
                <span className="text-[7px] sm:text-[8px] text-black font-bold leading-none">✓</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Queen */}
      {hasQueen && <QueenPiece />}
    </motion.div>
  );
}
