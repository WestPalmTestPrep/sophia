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
      whileHover={isValidMove && !hasQueen ? { scale: 1.06, zIndex: 5 } : undefined}
      whileTap={isValidMove ? { scale: 0.94 } : undefined}
    >
      {/* Valid move indicator */}
      {isValidMove && !hasQueen && !isUnlockable && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            isLight ? 'bg-black/10' : 'bg-white/10'
          )}
        />
      )}

      {/* Unlockable square */}
      {isUnlockable && (
        <div className="absolute inset-0 flex items-center justify-center group">
          {/* Glow ring */}
          {!isUnlocked && (
            <motion.div
              animate={{
                boxShadow: [
                  'inset 0 0 8px rgba(255,255,255,0.02)',
                  'inset 0 0 20px rgba(255,255,255,0.08)',
                  'inset 0 0 8px rgba(255,255,255,0.02)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0"
            />
          )}

          <div className="flex flex-col items-center gap-0.5">
            <motion.span
              animate={!isUnlocked ? { opacity: [0.3, 0.7, 0.3] } : { opacity: 0.2 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'text-sm sm:text-lg transition-all duration-300',
                isLight ? 'text-black/60' : 'text-white/60'
              )}
            >
              {unlockConfig.icon}
            </motion.span>

            {/* Label on hover */}
            <span className={cn(
              'text-[6px] sm:text-[8px] font-sans font-medium tracking-[0.15em] uppercase opacity-0 group-hover:opacity-50 transition-opacity duration-300 whitespace-nowrap',
              isLight ? 'text-black' : 'text-white'
            )}>
              {unlockConfig.label}
            </span>
          </div>

          {/* Visited indicator */}
          {isUnlocked && (
            <div className="absolute top-1 right-1">
              <div className="w-1 h-1 rounded-full bg-white/20" />
            </div>
          )}
        </div>
      )}

      {/* Queen */}
      {hasQueen && <QueenPiece />}
    </motion.div>
  );
}
