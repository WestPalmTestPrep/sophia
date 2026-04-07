'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Position } from '@/types';

interface MoveLogProps {
  moves: Position[];
}

const COLS = 'abcdefgh';

function toNotation(pos: Position): string {
  return `Q${COLS[pos.col]}${8 - pos.row}`;
}

export function MoveLog({ moves }: MoveLogProps) {
  if (moves.length === 0) return null;

  // Show last 5 moves
  const recentMoves = moves.slice(-5);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:block"
    >
      <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2 backdrop-blur-sm">
        <p className="text-[9px] text-white/20 font-sans tracking-widest uppercase mb-2">
          Moves
        </p>
        <AnimatePresence mode="popLayout">
          {recentMoves.map((move, i) => {
            const moveNumber = moves.length - recentMoves.length + i + 1;
            return (
              <motion.div
                key={`${moveNumber}-${move.row}-${move.col}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-[11px] font-mono text-white/25 leading-relaxed"
              >
                <span className="text-white/15">{moveNumber}.</span>{' '}
                {toNotation(move)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
