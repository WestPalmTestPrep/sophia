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

      {/* Unlockable square */}
      {isUnlockable && (
        <div className="absolute inset-0 flex items-center justify-center group overflow-visible">
          {/* Gold glow ring for unlockable */}
          {!isUnlocked && (
            <motion.div
              animate={{
                boxShadow: [
                  'inset 0 0 8px rgba(212,175,55,0.05)',
                  'inset 0 0 24px rgba(212,175,55,0.15)',
                  'inset 0 0 8px rgba(212,175,55,0.05)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0"
            />
          )}

          {/* Unlocked gold border */}
          {isUnlocked && (
            <div
              className="absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 12px rgba(212,175,55,0.1)',
              }}
            />
          )}

          <div className="flex flex-col items-center gap-0.5 relative">
            <motion.span
              animate={!isUnlocked
                ? { opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }
                : { opacity: 0.5 }
              }
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'text-base sm:text-xl transition-all duration-300',
                isLight ? 'text-black/80' : 'text-white/90'
              )}
              style={!isUnlocked ? {
                filter: `drop-shadow(0 0 6px rgba(212,175,55,0.4))`,
              } : undefined}
            >
              {unlockConfig.icon}
            </motion.span>

            {/* Label on hover — positioned absolutely so it doesn't get clipped */}
            <span className={cn(
              'absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[7px] sm:text-[9px] font-sans font-semibold tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 pointer-events-none px-2 py-1 rounded shadow-lg',
              isLight ? 'text-black bg-[#E8E8E8]' : 'text-white bg-[#1a1a1a]'
            )}
            style={{
              border: '1px solid rgba(212,175,55,0.2)',
            }}
            >
              {unlockConfig.label}
            </span>
          </div>

          {/* Visited indicator - gold dot */}
          {isUnlocked && (
            <div className="absolute top-1.5 right-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[rgba(212,175,55,0.5)]" />
            </div>
          )}
        </div>
      )}

      {/* Queen */}
      {hasQueen && <QueenPiece />}
    </motion.div>
  );
}
