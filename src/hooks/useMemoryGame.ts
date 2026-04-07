'use client';

import { useState, useCallback, useMemo } from 'react';
import { MemoryCard } from '@/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useMemoryGame(cards: MemoryCard[]) {
  const [shuffledCards, setShuffledCards] = useState(() => shuffle(cards));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const isComplete = useMemo(
    () => matchedPairIds.size === cards.length / 2,
    [matchedPairIds, cards.length]
  );

  const flipCard = useCallback(
    (id: string) => {
      if (isChecking) return;
      if (flippedIds.includes(id)) return;
      if (matchedPairIds.has(shuffledCards.find((c) => c.id === id)?.pairId ?? '')) return;

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setIsChecking(true);

        const [first, second] = newFlipped.map((fid) => shuffledCards.find((c) => c.id === fid)!);
        if (first.pairId === second.pairId) {
          setMatchedPairIds((prev) => new Set(prev).add(first.pairId));
          setFlippedIds([]);
          setIsChecking(false);
        } else {
          setTimeout(() => {
            setFlippedIds([]);
            setIsChecking(false);
          }, 800);
        }
      }
    },
    [isChecking, flippedIds, matchedPairIds, shuffledCards]
  );

  const resetGame = useCallback(() => {
    setShuffledCards(shuffle(cards));
    setFlippedIds([]);
    setMatchedPairIds(new Set());
    setMoves(0);
    setIsChecking(false);
  }, [cards]);

  return {
    cards: shuffledCards,
    flippedIds,
    matchedPairIds,
    moves,
    isComplete,
    flipCard,
    resetGame,
  };
}
