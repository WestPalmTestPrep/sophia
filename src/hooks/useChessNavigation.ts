'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Position, SectionId } from '@/types';
import { UNLOCKABLE_SQUARES, QUEEN_START } from '@/data/board-config';

export function useChessNavigation() {
  const [queenPosition, setQueenPosition] = useState<Position>(QUEEN_START);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [unlockedSections, setUnlockedSections] = useState<Set<SectionId>>(new Set());
  const [isMoving, setIsMoving] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Position[]>([QUEEN_START]);

  const isValidQueenMove = useCallback(
    (row: number, col: number): boolean => {
      if (row === queenPosition.row && col === queenPosition.col) return false;
      const dr = Math.abs(row - queenPosition.row);
      const dc = Math.abs(col - queenPosition.col);
      // Queen: same row, same col, or diagonal
      return dr === 0 || dc === 0 || dr === dc;
    },
    [queenPosition]
  );

  const getSquareSection = useCallback((row: number, col: number): SectionId | undefined => {
    const square = UNLOCKABLE_SQUARES.find((s) => s.row === row && s.col === col);
    return square?.section;
  }, []);

  const moveQueen = useCallback(
    (row: number, col: number) => {
      if (isMoving || !isValidQueenMove(row, col)) return;

      setIsMoving(true);
      setQueenPosition({ row, col });
      setMoveHistory((prev) => [...prev, { row, col }]);

      const section = getSquareSection(row, col);
      if (section) {
        setTimeout(() => {
          setActiveSection(section);
          setUnlockedSections((prev) => new Set(prev).add(section));
          setIsMoving(false);
        }, 500);
      } else {
        setTimeout(() => setIsMoving(false), 400);
      }
    },
    [isMoving, isValidQueenMove, getSquareSection]
  );

  const closeSection = useCallback(() => {
    setActiveSection(null);
  }, []);

  // Escape key to close sections
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && activeSection) {
        closeSection();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, closeSection]);

  const allUnlocked = useMemo(() => unlockedSections.size === 6, [unlockedSections]);

  return {
    queenPosition,
    activeSection,
    unlockedSections,
    isMoving,
    allUnlocked,
    moveHistory,
    moveQueen,
    closeSection,
    isValidQueenMove,
    getSquareSection,
  };
}
