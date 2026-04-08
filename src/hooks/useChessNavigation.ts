'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Position, SectionId } from '@/types';
import { UNLOCKABLE_SQUARES, QUEEN_START } from '@/data/board-config';

export function useChessNavigation() {
  const [queenPosition, setQueenPosition] = useState<Position>(QUEEN_START);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [unlockedSections, setUnlockedSections] = useState<Set<SectionId>>(new Set());
  const [moveHistory, setMoveHistory] = useState<Position[]>([QUEEN_START]);
  const sectionTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Use a ref so moveQueen always sees the latest position, not a stale closure
  const queenPosRef = useRef<Position>(QUEEN_START);

  const isValidQueenMove = useCallback(
    (row: number, col: number): boolean => {
      if (row === queenPosRef.current.row && col === queenPosRef.current.col) return false;
      const dr = Math.abs(row - queenPosRef.current.row);
      const dc = Math.abs(col - queenPosRef.current.col);
      return dr === 0 || dc === 0 || dr === dc;
    },
    [] // no deps — reads from ref
  );

  // Also expose a render-time version for UI display (valid move dots)
  const isValidQueenMoveForRender = useCallback(
    (row: number, col: number): boolean => {
      if (row === queenPosition.row && col === queenPosition.col) return false;
      const dr = Math.abs(row - queenPosition.row);
      const dc = Math.abs(col - queenPosition.col);
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
      if (!isValidQueenMove(row, col)) return;

      if (sectionTimerRef.current) {
        clearTimeout(sectionTimerRef.current);
      }

      // Update ref immediately so the next click validates correctly
      queenPosRef.current = { row, col };
      setQueenPosition({ row, col });
      setMoveHistory((prev) => [...prev, { row, col }]);

      const section = getSquareSection(row, col);
      if (section) {
        sectionTimerRef.current = setTimeout(() => {
          setActiveSection(section);
          setUnlockedSections((prev) => new Set(prev).add(section));
        }, 180);
      }
    },
    [isValidQueenMove, getSquareSection]
  );

  const closeSection = useCallback(() => {
    setActiveSection(null);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && activeSection) {
        closeSection();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, closeSection]);

  const allUnlocked = useMemo(() => unlockedSections.size === UNLOCKABLE_SQUARES.length, [unlockedSections]);

  return {
    queenPosition,
    activeSection,
    unlockedSections,
    allUnlocked,
    moveHistory,
    moveQueen,
    closeSection,
    isValidQueenMove: isValidQueenMoveForRender, // for UI rendering (dots, highlights)
    getSquareSection,
  };
}
