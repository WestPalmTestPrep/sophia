'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { memoryCards } from '@/data/memory';
import { cn } from '@/lib/utils';

export function MemoryMatch() {
  const { cards, flippedIds, matchedPairIds, moves, isComplete, flipCard, resetGame } =
    useMemoryGame(memoryCards);
  const { flipSound, matchSound, celebrationSound } = useSoundEffects();

  const handleFlip = useCallback((id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card || matchedPairIds.has(card.pairId) || flippedIds.includes(id)) return;

    flipSound();
    flipCard(id);

    // Check if this flip creates a match (when we already have 1 flipped)
    if (flippedIds.length === 1) {
      const firstCard = cards.find((c) => c.id === flippedIds[0]);
      if (firstCard && firstCard.pairId === card.pairId) {
        setTimeout(() => matchSound(), 100);
      }
    }
  }, [cards, flippedIds, matchedPairIds, flipCard, flipSound, matchSound]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-white/40 font-sans text-sm">
          Moves: <span className="text-white/70">{moves}</span>
        </p>
        <button
          onClick={resetGame}
          className="text-xs text-white/30 font-sans tracking-wider uppercase hover:text-white/60 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, i) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedPairIds.has(card.pairId);
          const showFace = isFlipped || isMatched;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleFlip(card.id)}
              className={cn(
                'aspect-square rounded cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl sm:text-3xl select-none',
                showFace
                  ? isMatched
                    ? 'bg-white/10 border border-white/20'
                    : 'bg-white/5 border border-white/15'
                  : 'bg-board-dark border border-white/5 hover:border-white/15'
              )}
              style={{
                perspective: '600px',
              }}
            >
              {showFace ? (
                <motion.span
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.content}
                </motion.span>
              ) : (
                <span className="text-white/10 text-lg">♛</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 pt-4"
        >
          <p className="font-serif text-xl text-white/80">Memory Master!</p>
          <p className="text-white/40 font-sans text-sm">
            Completed in {moves} moves
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2 border border-white/20 text-white/70 font-sans text-sm tracking-wider hover:bg-white/5 transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
